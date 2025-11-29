# Script para asignar categorías a productos sin categoría
param(
    [string]$ApiUrl = "http://localhost:5195",
    [string]$Username = "admin",
    [string]$Password = "admin123"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ASIGNACION DE CATEGORIAS A PRODUCTOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Autenticar
Write-Host "1) Autenticando en $ApiUrl ..." -ForegroundColor Yellow
$loginBody = @{
    username = $Username
    password = $Password
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "$ApiUrl/api/Auth/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

$token = $loginResponse.token
$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "   [OK] Token obtenido" -ForegroundColor Green

# 2. Obtener categorías
Write-Host ""
Write-Host "2) Obteniendo categorías disponibles..." -ForegroundColor Yellow
$categories = Invoke-RestMethod `
    -Uri "$ApiUrl/api/Category" `
    -Headers $headers

if ($categories.Count -eq 0) {
    Write-Host "   [ERROR] No hay categorías en el sistema. Ejecuta load-categories.ps1 primero" -ForegroundColor Red
    exit 1
}

Write-Host "   [OK] $($categories.Count) categorías encontradas" -ForegroundColor Green

# 3. Obtener productos sin categoría
Write-Host ""
Write-Host "3) Obteniendo productos sin categoría..." -ForegroundColor Yellow

$page = 1
$pageSize = 100
$productosSinCategoria = @()

do {
    $response = Invoke-RestMethod `
        -Uri "$ApiUrl/api/Product?pageNumber=$page&pageSize=$pageSize" `
        -Headers $headers
    
    $sinCat = $response.items | Where-Object { -not $_.categoryID }
    $productosSinCategoria += $sinCat
    
    $page++
} while ($response.items.Count -eq $pageSize)

Write-Host "   [OK] $($productosSinCategoria.Count) productos sin categoría" -ForegroundColor Green

if ($productosSinCategoria.Count -eq 0) {
    Write-Host ""
    Write-Host "No hay productos sin categoría. Nada que hacer." -ForegroundColor Green
    exit 0
}

# 4. Asignar categorías de forma equitativa
Write-Host ""
Write-Host "4) Asignando categorías de forma equitativa..." -ForegroundColor Yellow

$actualizados = 0
$errores = 0
$categoryIndex = 0

foreach ($producto in $productosSinCategoria) {
    try {
        # Asignar categoría usando distribución circular
        $categoryID = $categories[$categoryIndex % $categories.Count].categoryID
        
        # Obtener detalle completo del producto
        $detalle = Invoke-RestMethod `
            -Uri "$ApiUrl/api/Product/$($producto.productID)" `
            -Headers $headers
        
        # Actualizar producto con la categoría
        $updateBody = @{
            productID = $detalle.productID
            productName = $detalle.productName
            categoryID = $categoryID
            supplierID = $detalle.supplierID
            quantityPerUnit = $detalle.quantityPerUnit
            unitPrice = $detalle.unitPrice
            unitsInStock = $detalle.unitsInStock
            unitsOnOrder = $detalle.unitsOnOrder
            reorderLevel = $detalle.reorderLevel
            discontinued = $detalle.discontinued
        } | ConvertTo-Json
        
        Invoke-RestMethod `
            -Uri "$ApiUrl/api/Product/$($producto.productID)" `
            -Method Put `
            -Body $updateBody `
            -Headers $headers `
            -ContentType "application/json" | Out-Null
        
        $actualizados++
        $categoryIndex++
        
        if ($actualizados % 50 -eq 0) {
            Write-Host "   Procesados: $actualizados/$($productosSinCategoria.Count)" -ForegroundColor Gray
        }
    }
    catch {
        $errores++
        Write-Host "   [ERROR] Producto $($producto.productID): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "   [OK] Procesamiento completado" -ForegroundColor Green

# 5. Resumen
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Actualizados: $actualizados" -ForegroundColor Green
Write-Host "  Errores: $errores" -ForegroundColor $(if($errores -gt 0){"Red"}else{"Green"})
Write-Host "  Productos por categoría: ~$([math]::Ceiling($actualizados / $categories.Count))" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
