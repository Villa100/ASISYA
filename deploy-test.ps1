# Script de despliegue para ambiente de PRUEBAS
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
# Ejecuta la suite de tests en modo integración y unitario

Write-Host "Ejecutando pruebas unitarias e integración..." -ForegroundColor Cyan
$env:ASPNETCORE_ENVIRONMENT = "Test"
dotnet test ASISYA_ev.sln --nologo --verbosity normal

# --- Inserción de 10 categorías vía API ---
$apiUrlCategory = "http://localhost:8080/api/Category"
$token = "TU_TOKEN_JWT"
$categories = @("SERVIDORES", "CLOUD", "BASES DE DATOS", "REDES", "SEGURIDAD", "BACKUP", "MONITOREO", "DEVOPS", "FRONTEND", "MOBILE")
foreach ($name in $categories) {
	$body = @{ name = $name } | ConvertTo-Json
	Invoke-RestMethod -Uri $apiUrlCategory -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
}

# --- Carga eficiente de 100,000 productos vía API ---
$apiUrlProduct = "http://localhost:8080/api/Product/bulk"
$products = @()
for ($i = 1; $i -le 100000; $i++) {
	$products += @{
		name = "Producto $i"
		price = [math]::Round((Get-Random -Minimum 10 -Maximum 1000), 2)
		categoryId = 1 # Cambia según la categoría deseada
	}
	if ($i % 1000 -eq 0) {
		$body = $products | ConvertTo-Json
		Invoke-RestMethod -Uri $apiUrlProduct -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
		$products = @()
	}
}
if ($products.Count -gt 0) {
	$body = $products | ConvertTo-Json
	Invoke-RestMethod -Uri $apiUrlProduct -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
}
