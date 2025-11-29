# Script de inicio para ambiente de DESARROLLO (InMemory)
Write-Host "[DEV] Iniciando aplicación en modo DESARROLLO (InMemory DB)" -ForegroundColor Cyan
$env:VITE_ENVIRONMENT = "DESARROLLO"
.\start-all.ps1
