# ============================================
# Script para iniciar toda la aplicacion ASISYA
# Backend API + Frontend SPA + Contenedores
# ============================================

param(
    [switch]$WithDocker,
    [switch]$LocalOnly
)

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  INICIANDO APLICACION ASISYA" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Determinar modo de ejecucion
if ($WithDocker) {
    $mode = "Docker"
    Write-Host "MODO: Con contenedores Docker (PostgreSQL + Redis)" -ForegroundColor Yellow
} else {
    $mode = "Local"
    Write-Host "MODO: Local sin Docker (InMemory Database)" -ForegroundColor Yellow
}

Write-Host "`n--------------------------------------------`n" -ForegroundColor Gray

# 1. Detener procesos anteriores
Write-Host "1. Limpiando procesos anteriores..." -ForegroundColor Yellow
Get-Job -ErrorAction SilentlyContinue | Stop-Job -PassThru | Remove-Job -ErrorAction SilentlyContinue

$apiPort = Get-NetTCPConnection -LocalPort 5195 -ErrorAction SilentlyContinue
if ($apiPort) {
    $apiPid = $apiPort | Select-Object -ExpandProperty OwningProcess -Unique
    Stop-Process -Id $apiPid -Force -ErrorAction SilentlyContinue
}

$frontPort = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontPort) {
    $frontPid = $frontPort | Select-Object -ExpandProperty OwningProcess -Unique
    Stop-Process -Id $frontPid -Force -ErrorAction SilentlyContinue
}

Write-Host "   [OK] Puertos liberados" -ForegroundColor Green

# 2. Iniciar contenedores Docker (si se solicita)
if ($WithDocker) {
    Write-Host "`n2. Iniciando contenedores Docker..." -ForegroundColor Yellow
    
    # Verificar que Docker este disponible
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [ERROR] Docker Desktop no esta corriendo" -ForegroundColor Red
        Write-Host "   Inicia Docker Desktop o ejecuta sin -WithDocker" -ForegroundColor Yellow
        exit 1
    }
    
    Set-Location "$PSScriptRoot\ASISYA_ev.Infrastructure"
    
    # Iniciar PostgreSQL y Redis
    docker-compose up -d db cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Contenedores PostgreSQL y Redis iniciados" -ForegroundColor Green
        Write-Host "   Esperando que los servicios esten listos..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    } else {
        Write-Host "   [ERROR] No se pudieron iniciar los contenedores" -ForegroundColor Red
        Set-Location $PSScriptRoot
        exit 1
    }
    
    Set-Location $PSScriptRoot
} else {
    Write-Host "`n2. Modo local (sin contenedores Docker)" -ForegroundColor Yellow
    Write-Host "   [INFO] Se usara InMemory Database y Memory Cache" -ForegroundColor Gray
}

# 3. Iniciar API Backend
Write-Host "`n3. Iniciando API Backend..." -ForegroundColor Yellow

$apiJob = Start-Job -ScriptBlock {
    param($rootPath, $useDocker)
    
    Set-Location "$rootPath\ASISYA_ev.Api"
    
    if ($useDocker) {
        $env:ASPNETCORE_ENVIRONMENT = "Development"
    } else {
        $env:ASPNETCORE_ENVIRONMENT = "Development"
        $env:UseInMemoryForTests = "true"
        $env:ForceInMemory = "true"
    }
    
    dotnet run
} -ArgumentList $PSScriptRoot, $WithDocker

Start-Sleep -Seconds 3

# Verificar que la API inicio
$apiRunning = Get-NetTCPConnection -LocalPort 5195 -ErrorAction SilentlyContinue
if ($apiRunning) {
    Write-Host "   [OK] API Backend iniciada en http://localhost:5195" -ForegroundColor Green
} else {
    Write-Host "   [ADVERTENCIA] API aun esta iniciando..." -ForegroundColor Yellow
    Write-Host "   Verifica en unos segundos con: netstat -ano | findstr :5195" -ForegroundColor Gray
}

# 4. Iniciar Frontend SPA
Write-Host "`n4. Iniciando Frontend SPA..." -ForegroundColor Yellow

Set-Location "$PSScriptRoot\ASISYA_ev.SPA"

# Verificar si existen dependencias
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependencias npm (primera vez)..." -ForegroundColor Gray
    npm install | Out-Null
}

$frontJob = Start-Job -ScriptBlock {
    param($spaPath, $viteEnv)
    Set-Location $spaPath
    $env:VITE_ENVIRONMENT = $viteEnv
    npm run dev
} -ArgumentList "$PSScriptRoot\ASISYA_ev.SPA", $env:VITE_ENVIRONMENT

Start-Sleep -Seconds 3

# Verificar que el frontend inicio
$frontRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontRunning) {
    Write-Host "   [OK] Frontend SPA iniciado en http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "   [ADVERTENCIA] Frontend aun esta iniciando..." -ForegroundColor Yellow
    Write-Host "   Verifica en unos segundos con: netstat -ano | findstr :5173" -ForegroundColor Gray
}

Set-Location $PSScriptRoot

# 5. Resumen final
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  APLICACION INICIADA" -ForegroundColor Cyan
Write-Host "============================================\n" -ForegroundColor Cyan

Write-Host "URLs de la aplicacion:" -ForegroundColor Yellow
Write-Host "  Backend API:  http://localhost:5195" -ForegroundColor Green
Write-Host "  Frontend SPA: http://localhost:5173" -ForegroundColor Green

if ($WithDocker) {
    Write-Host "\nServicios Docker:" -ForegroundColor Yellow
    Write-Host "  PostgreSQL:   localhost:5432" -ForegroundColor Green
    Write-Host "  Redis:        localhost:6379" -ForegroundColor Green
}

Write-Host "\nCredenciales de prueba:" -ForegroundColor Yellow
Write-Host "  Usuario:  admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White

Write-Host "\nJobs en ejecucion:" -ForegroundColor Yellow
Get-Job | Format-Table -Property Id, Name, State

Write-Host "\nComandos utiles:" -ForegroundColor Yellow
Write-Host "  Ver logs API:      Receive-Job -Id $($apiJob.Id) -Keep" -ForegroundColor Gray
Write-Host "  Ver logs Frontend: Receive-Job -Id $($frontJob.Id) -Keep" -ForegroundColor Gray
Write-Host "  Detener todo:      .\stop-all.ps1" -ForegroundColor Gray

Write-Host "\n============================================\n" -ForegroundColor Cyan

# =====================
# Validar y cargar datos demo si no existen
# =====================

Start-Sleep -Seconds 15
Write-Host "\nValidando datos en memoria..." -ForegroundColor Yellow

try {
    $catCount = (Invoke-RestMethod -Uri "http://localhost:5195/api/category" -Method Get -TimeoutSec 10).Count
} catch { $catCount = 0 }
try {
    $prodCount = (Invoke-RestMethod -Uri "http://localhost:5195/api/product" -Method Get -TimeoutSec 10).TotalCount
} catch { $prodCount = 0 }

if ($catCount -eq 0) {
    Write-Host "\n1. Cargando 10 categorías..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -File .\load-categories.ps1
} else {
    Write-Host "[OK] Ya existen $catCount categorías en memoria" -ForegroundColor Green
}

if ($prodCount -eq 0) {
    Write-Host "\n2. Cargando 500 productos..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -File .\load-products.ps1 -Total 500 -BatchSize 100
} else {
    Write-Host "[OK] Ya existen $prodCount productos en memoria" -ForegroundColor Green
}
