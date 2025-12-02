# Wrapper para iniciar ambiente de Pruebas con Docker
# Usa el script generico y fija variables de entorno si aplica

$env:ASPNETCORE_ENVIRONMENT = "Test"
Write-Host "[TEST-DOCKER] Iniciando stack en Docker..." -ForegroundColor Cyan

powershell -ExecutionPolicy Bypass -File .\start-docker.ps1 -Environment Test -TimeoutSeconds 150
