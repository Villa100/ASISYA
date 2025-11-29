# Script de despliegue para ambiente de DESARROLLO
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
# Levanta la infraestructura local con Docker Compose y ejecuta la API en modo desarrollo

Write-Host "Levantar base de datos y cache en modo desarrollo..." -ForegroundColor Cyan
Set-Location ASISYA_ev.Infrastructure
docker-compose up -d db cache
Set-Location ..

Write-Host "Ejecutar la API en modo desarrollo..." -ForegroundColor Cyan
Set-Location ASISYA_ev.Api
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet run
