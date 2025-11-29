# Script de despliegue DEV Local (Sin Docker)
# --- Validación e instalación de extensiones VS Code ---
$requiredExtensions = @(
	"ms-vscode.powershell",
	"ms-dotnettools.csharp",
	"ms-azuretools.vscode-docker",
	"GitHub.vscode-pull-request-github"
)
foreach ($ext in $requiredExtensions) {
	$installed = code --list-extensions | Select-String $ext
	if (-not $installed) {
		Write-Host "Instalando extensión VS Code: $ext" -ForegroundColor Yellow
		code --install-extension $ext
	} else {
		Write-Host "Extensión VS Code ya instalada: $ext" -ForegroundColor Green
	}
}
# Ejecuta la API en modo desarrollo local con base de datos InMemory
# NOTA: Los contenedores Docker se mantienen para despliegue en otros ambientes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ASISYA - Desarrollo Local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Modo: Desarrollo Local (Sin Docker)" -ForegroundColor Yellow
Write-Host "Base de datos: InMemory (datos en RAM)" -ForegroundColor Yellow
Write-Host "Cache: DistributedMemoryCache" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nota: Los archivos Docker se mantienen para:" -ForegroundColor Cyan
Write-Host "   - Despliegue en ambientes de prueba" -ForegroundColor White
Write-Host "   - Despliegue en produccion" -ForegroundColor White
Write-Host "   - CI/CD pipelines" -ForegroundColor White
Write-Host ""

Set-Location ASISYA_ev.Api

# Configurar variables de entorno para desarrollo local sin Docker
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:UseInMemoryForTests = "true"
$env:ForceInMemory = "true"

Write-Host "Iniciando API..." -ForegroundColor Green
Write-Host ""
Write-Host "   URL API:    https://localhost:5001" -ForegroundColor Cyan
Write-Host "   Swagger UI: https://localhost:5001/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Credenciales demo:" -ForegroundColor Yellow
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener la API" -ForegroundColor Yellow
Write-Host ""

dotnet run
