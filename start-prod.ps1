# Script de inicio para ambiente de PRODUCCION (Docker)
Write-Host "[PROD] Iniciando aplicacion en modo PRODUCCION (Docker + PostgreSQL + Redis)" -ForegroundColor Cyan
$env:VITE_ENVIRONMENT = "PRODUCCION"
.\start-all.ps1 -WithDocker
