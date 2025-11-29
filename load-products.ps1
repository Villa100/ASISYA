# ============================================
# Carga masiva de productos (hasta 100.000+)
# Usa el endpoint: POST /api/Product (batch)
# Requiere autenticación JWT (admin/admin123)
# ============================================

param(
    [string]$BaseUrl = "http://localhost:5195",
    [int]$Total = 100000,
    [int]$BatchSize = 5000,
    [string]$User = "admin",
    [string]$Pass = "admin123"
)

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  CARGA MASIVA DE PRODUCTOS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 0) Validaciones iniciales
if ($BatchSize -le 0 -or $Total -le 0) {
    throw "Total y BatchSize deben ser mayores que 0"
}
if ($BatchSize -gt $Total) { $BatchSize = $Total }

# 1) Login y token
Write-Host "1) Autenticando en $BaseUrl ..." -ForegroundColor Yellow
try {
    $loginBody = @{ username=$User; password=$Pass } | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$BaseUrl/api/Auth/login" -Method Post -Body $loginBody -ContentType 'application/json'
    $token = $login.token
    if (-not $token) { throw "Token vacío" }
    $headers = @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' }
    Write-Host "   [OK] Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "   [ERROR] No se pudo autenticar: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2) Obtener todas las categorías disponibles
Write-Host "2) Obteniendo categorías disponibles..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$BaseUrl/api/Category" -Headers $headers
    if ($categories.Count -eq 0) {
        throw "No hay categorías en el sistema. Ejecuta primero: .\load-categories.ps1"
    }
    $categoryIds = $categories | ForEach-Object { $_.categoryID }
    Write-Host "   [OK] $($categories.Count) categorías disponibles" -ForegroundColor Green
    $categories | ForEach-Object {
        Write-Host "      - [$($_.categoryID)] $($_.categoryName)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ERROR] En categorías: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3) Carga masiva por lotes
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$iterations = [math]::Ceiling($Total / $BatchSize)
Write-Host "3) Enviando $Total productos en $iterations lotes de $BatchSize..." -ForegroundColor Yellow
Write-Host "   Distribuyendo entre $($categories.Count) categorías" -ForegroundColor Gray

for ($b = 1; $b -le $iterations; $b++) {
    $start = (($b - 1) * $BatchSize) + 1
    $end = [math]::Min($b * $BatchSize, $Total)
    $count = $end - $start + 1

    $products = New-Object System.Collections.Generic.List[Object]
    for ($i = $start; $i -le $end; $i++) {
        # Distribuir productos entre todas las categorías disponibles
        $catIndex = ($i - 1) % $categoryIds.Count
        $catId = $categoryIds[$catIndex]
        
        $products.Add([PSCustomObject]@{
            ProductName   = "Producto $i"
            SupplierID    = 1
            CategoryID    = [int]$catId
            UnitPrice     = [decimal](10 + ($i % 990))
            UnitsInStock  = [int]([math]::Min(32000, 1 + ($i % 500)))
        }) | Out-Null
    }

    $payload = @{ Products = $products } | ConvertTo-Json -Depth 5

    $pct = [int](($b / $iterations) * 100)
    Write-Progress -Activity "Cargando productos" -Status "Lote $b/$iterations ($count items)" -PercentComplete $pct

    try {
        Invoke-RestMethod -Uri "$BaseUrl/api/Product" -Method Post -Body $payload -Headers $headers | Out-Null
        Write-Host ("   Lote {0}/{1} enviado ({2} items)" -f $b, $iterations, $count) -ForegroundColor Green
    } catch {
        Write-Host ("   [ERROR] Lote {0}/{1}: {2}" -f $b, $iterations, $_.Exception.Message) -ForegroundColor Red
        break
    }
}
$sw.Stop()

Write-Progress -Activity "Cargando productos" -Completed
Write-Host "`nTiempo total: $([int]$sw.Elapsed.TotalSeconds)s" -ForegroundColor Cyan

# 4) Verificar distribución por categoría
Write-Host "`n4) Verificando distribución de productos..." -ForegroundColor Yellow
try {
    $allProducts = Invoke-RestMethod -Uri "$BaseUrl/api/Product?page=1&pageSize=1" -Headers $headers
    Write-Host "   Total productos en sistema: $($allProducts.totalCount)" -ForegroundColor Green
    
    Write-Host "`n   Distribución esperada (aproximada):" -ForegroundColor Cyan
    $perCategory = [math]::Floor($Total / $categories.Count)
    foreach ($cat in $categories) {
        Write-Host "      - $($cat.categoryName): ~$perCategory productos" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [WARN] No se pudo verificar distribución" -ForegroundColor Yellow
}

Write-Host "`nFinalizado." -ForegroundColor Cyan
