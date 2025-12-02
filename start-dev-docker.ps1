# Wrapper para iniciar ambiente de Desarrollo con Docker
# Usa el script generico y fija variables de entorno si aplica

$env:ASPNETCORE_ENVIRONMENT = "Development"
Write-Host "[DEV-DOCKER] Iniciando stack en Docker..." -ForegroundColor Cyan

powershell -ExecutionPolicy Bypass -File .\start-docker.ps1 -Environment Development -TimeoutSeconds 150
