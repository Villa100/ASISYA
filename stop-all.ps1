# ============================================
# Script para detener todas las aplicaciones
# y contenedores Docker de ASISYA
# ============================================

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  DETENIENDO APLICACIONES Y CONTENEDORES" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 1. Detener Background Jobs de PowerShell
Write-Host "1. Deteniendo Background Jobs..." -ForegroundColor Yellow
$jobs = Get-Job -ErrorAction SilentlyContinue
if ($jobs) {
    $jobs | Stop-Job -PassThru | Remove-Job
    Write-Host "   [OK] $($jobs.Count) job(s) detenido(s)" -ForegroundColor Green
} else {
    Write-Host "   [INFO] No hay jobs activos" -ForegroundColor Gray
}

# 2. Liberar puerto 5195 (API Backend)
Write-Host "`n2. Liberando puerto 5195 (API)..." -ForegroundColor Yellow
try {
    $apiProcess = Get-NetTCPConnection -LocalPort 5195 -ErrorAction SilentlyContinue | 
                  Select-Object -ExpandProperty OwningProcess -Unique
    if ($apiProcess) {
        Stop-Process -Id $apiProcess -Force -ErrorAction Stop
        Write-Host "   [OK] Puerto 5195 liberado (PID: $apiProcess)" -ForegroundColor Green
    } else {
        Write-Host "   [INFO] Puerto 5195 ya esta libre" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ADVERTENCIA] No se pudo liberar puerto 5195" -ForegroundColor Yellow
}

# 3. Liberar puerto 5173 (Frontend Vite)
Write-Host "`n3. Liberando puerto 5173 (Frontend)..." -ForegroundColor Yellow
try {
    $frontProcess = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess -Unique
    if ($frontProcess) {
        Stop-Process -Id $frontProcess -Force -ErrorAction Stop
        Write-Host "   [OK] Puerto 5173 liberado (PID: $frontProcess)" -ForegroundColor Green
    } else {
        Write-Host "   [INFO] Puerto 5173 ya esta libre" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ADVERTENCIA] No se pudo liberar puerto 5173" -ForegroundColor Yellow
}

# 4. Detener procesos dotnet relacionados con ASISYA
Write-Host "`n4. Deteniendo procesos dotnet de ASISYA..." -ForegroundColor Yellow
$dotnetProcs = Get-Process dotnet -ErrorAction SilentlyContinue | 
               Where-Object { $_.Path -like "*ASISYA*" -or $_.MainWindowTitle -like "*ASISYA*" }
if ($dotnetProcs) {
    $dotnetProcs | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] $($dotnetProcs.Count) proceso(s) dotnet detenido(s)" -ForegroundColor Green
} else {
    Write-Host "   [INFO] No hay procesos dotnet de ASISYA" -ForegroundColor Gray
}

# 5. Detener procesos node relacionados con ASISYA
Write-Host "`n5. Deteniendo procesos node de ASISYA..." -ForegroundColor Yellow
$nodeProcs = Get-Process node -ErrorAction SilentlyContinue | 
             Where-Object { $_.Path -like "*ASISYA*" }
if ($nodeProcs) {
    $nodeProcs | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] $($nodeProcs.Count) proceso(s) node detenido(s)" -ForegroundColor Green
} else {
    Write-Host "   [INFO] No hay procesos node de ASISYA" -ForegroundColor Gray
}

# 6. Detener contenedores Docker
Write-Host "`n6. Deteniendo contenedores Docker..." -ForegroundColor Yellow
try {
    $containers = docker ps -q 2>$null
    if ($LASTEXITCODE -eq 0 -and $containers) {
        docker stop $containers 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] Contenedores Docker detenidos" -ForegroundColor Green
        } else {
            Write-Host "   [ADVERTENCIA] Error al detener contenedores" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   [INFO] No hay contenedores Docker activos" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [INFO] Docker no disponible o sin contenedores" -ForegroundColor Gray
}

# 7. Detener contenedores Docker Compose (si existen)
Write-Host "`n7. Deteniendo servicios Docker Compose..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
if (Test-Path "ASISYA_ev.Infrastructure/docker-compose.yml") {
    try {
        Set-Location "ASISYA_ev.Infrastructure"
        docker-compose down 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] Servicios Docker Compose detenidos" -ForegroundColor Green
        } else {
            Write-Host "   [INFO] No hay servicios Docker Compose activos" -ForegroundColor Gray
        }
        Set-Location $PSScriptRoot
    } catch {
        Write-Host "   [INFO] Docker Compose no disponible" -ForegroundColor Gray
        Set-Location $PSScriptRoot
    }
} else {
    Write-Host "   [INFO] No se encontro docker-compose.yml" -ForegroundColor Gray
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  TODAS LAS APLICACIONES DETENIDAS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
