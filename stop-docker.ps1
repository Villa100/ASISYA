# ============================================
# ASISYA - Detener stack Docker (Dev/Test)
# Detiene servicios via docker-compose y opcionalmente limpia volúmenes.
# ============================================

param(
    [switch]$PruneVolumes
)

Write-Host "\n============================================" -ForegroundColor Cyan
Write-Host "  DETENIENDO STACK DOCKER" -ForegroundColor Cyan
Write-Host "============================================\n" -ForegroundColor Cyan

# Verificar Docker
Write-Host "1. Verificando Docker Desktop..." -ForegroundColor Yellow
$dockerOk = $false
try { docker info 1>$null 2>$null; if ($LASTEXITCODE -eq 0) { $dockerOk = $true } } catch { $dockerOk = false }
if (-not $dockerOk) { Write-Host "   [INFO] Docker no disponible; se intentará igualmente bajar compose." -ForegroundColor Gray }

# Ubicar compose
$infraPath = Join-Path $PSScriptRoot "ASISYA_ev.Infrastructure"
$composeFile = Join-Path $infraPath "docker-compose.yml"
if (-not (Test-Path $composeFile)) {
    Write-Host "   [ERROR] No se encontró docker-compose.yml en $infraPath" -ForegroundColor Red
    exit 1
}

Set-Location $infraPath
Write-Host "\n2. Bajando servicios docker-compose..." -ForegroundColor Yellow

if ($PruneVolumes) {
    docker-compose down -v
} else {
    docker-compose down
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Servicios detenidos" -ForegroundColor Green
    if ($PruneVolumes) { Write-Host "   [OK] Volúmenes eliminados" -ForegroundColor Green }
} else {
    Write-Host "   [ADVERTENCIA] No se pudieron detener servicios (verifica Docker)" -ForegroundColor Yellow
}

Set-Location $PSScriptRoot
Write-Host "\nComandos útiles:" -ForegroundColor Yellow
Write-Host "  Limpiar imágenes huérfanas: docker image prune -f" -ForegroundColor Gray
Write-Host "  Limpiar contenedores parados: docker container prune -f" -ForegroundColor Gray
Write-Host "  Limpiar redes no usadas: docker network prune -f" -ForegroundColor Gray

Write-Host "\n============================================\n" -ForegroundColor Cyan
