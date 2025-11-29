# Script de inicio para ambiente de PRUEBAS (Test)
Write-Host "[TEST] Iniciando aplicación en modo PRUEBAS (InMemory DB + configuración de test)" -ForegroundColor Cyan
$env:VITE_ENVIRONMENT = "PRUEBAS"
.\start-all.ps1 -LocalOnly
