# ============================================
# ASISYA - Inicio con Docker (Dev/Test)
# Verifica Docker Desktop/WSL2, levanta db+cache+api via Compose,
# espera readiness con timeouts y valida endpoints.
# ============================================

param(
    [ValidateSet("Development","Test")]
    [string]$Environment = "Development",
    [int]$TimeoutSeconds = 120
)

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  INICIO CON DOCKER ($Environment)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 1) Verificar Docker Desktop
Write-Host "1. Verificando Docker Desktop..." -ForegroundColor Yellow
$dockerOk = $false
try {
    docker info 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) { $dockerOk = $true }
} catch { $dockerOk = $false }

if (-not $dockerOk) {
    Write-Host "   [ERROR] Docker Desktop no responde (server 500 o no iniciado)" -ForegroundColor Red
    Write-Host "   Abre Docker Desktop y reintenta. Si persiste, prueba 'wsl --shutdown' y reinicia Docker." -ForegroundColor Gray
    exit 1
}
Write-Host "   [OK] Docker Desktop activo" -ForegroundColor Green

# 2) Ubicar compose y levantar servicios
$infraPath = Join-Path $PSScriptRoot "ASISYA_ev.Infrastructure"
$composeFile = Join-Path $infraPath "docker-compose.yml"
if (-not (Test-Path $composeFile)) {
    Write-Host "   [ERROR] No se encontró docker-compose.yml en $infraPath" -ForegroundColor Red
    exit 1
}

Set-Location $infraPath
Write-Host "`n2. Levantando servicios db y cache..." -ForegroundColor Yellow

docker-compose up -d db cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [ERROR] No se pudieron iniciar db/cache (compose)" -ForegroundColor Red
    Set-Location $PSScriptRoot
    exit 1
}
Write-Host "   [OK] db y cache arriba" -ForegroundColor Green

Write-Host "`n3. Levantando API..." -ForegroundColor Yellow
# Pasar variables de entorno mínimas para API container si fuera necesario
# compose ya define ConnectionStrings y CacheSettings; solo iniciamos api

docker-compose up -d api
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [ERROR] No se pudo iniciar la API" -ForegroundColor Red
    Set-Location $PSScriptRoot
    exit 1
}
Write-Host "   [OK] API container arriba" -ForegroundColor Green

# 4) Esperar readiness
Write-Host "`n4. Esperando readiness de servicios (timeout: $TimeoutSeconds s)..." -ForegroundColor Yellow
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$readyApi = $false
$apiUrl = "http://localhost:8080/swagger/index.html"

while ($sw.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    Start-Sleep -Seconds 3
    try {
        $resp = Invoke-WebRequest -UseBasicParsing -Uri $apiUrl -TimeoutSec 5
        if ($resp.StatusCode -eq 200) { $readyApi = $true; break }
    } catch { }
}

if (-not $readyApi) {
    Write-Host "   [ERROR] La API no respondió dentro del timeout" -ForegroundColor Red
    Write-Host "   Revisa logs: docker-compose logs api" -ForegroundColor Gray
    Set-Location $PSScriptRoot
    exit 1
}
Write-Host "   [OK] API responde 200 en Swagger" -ForegroundColor Green

# 5) Resumen
Set-Location $PSScriptRoot
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  DOCKER LISTO ($Environment)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Servicios:" -ForegroundColor Yellow
Write-Host "  PostgreSQL: localhost:5432" -ForegroundColor Green
Write-Host "  Redis:      localhost:6379" -ForegroundColor Green
Write-Host "  API:        http://localhost:8080" -ForegroundColor Green

Write-Host "\nComandos útiles:" -ForegroundColor Yellow
Write-Host "  Logs API:           cd '$infraPath'; docker-compose logs -f api" -ForegroundColor Gray
Write-Host "  Detener servicios:  cd '$infraPath'; docker-compose down" -ForegroundColor Gray

# 6) Health extra: categorias y productos (opcional)
try {
    $cats = (Invoke-RestMethod -Uri "http://localhost:8080/api/category" -Method Get -TimeoutSec 5).Count
    Write-Host "\n[INFO] Categorías: $cats" -ForegroundColor Gray
} catch { Write-Host "\n[INFO] Categorías: no disponible aún" -ForegroundColor Gray }
try {
    $prods = (Invoke-RestMethod -Uri "http://localhost:8080/api/product" -Method Get -TimeoutSec 5).TotalCount
    Write-Host "[INFO] Productos: $prods" -ForegroundColor Gray
} catch { Write-Host "[INFO] Productos: no disponible aún" -ForegroundColor Gray }
