# Script de despliegue para ambiente de PRODUCCIÓN
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
# Construye y levanta la API y servicios con Docker Compose en modo producción

Write-Host "Construyendo imagen de la API para producción..." -ForegroundColor Cyan
Set-Location ASISYA_ev.Infrastructure
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
Set-Location ..

Write-Host "Despliegue en producción completado. Verifica los logs y el estado de los contenedores."
