# ============================================
# Carga de categorías para ASISYA
# Crea 10 categorías de productos tecnológicos
# ============================================

param(
    [string]$BaseUrl = "http://localhost:5195",
    [string]$User = "admin",
    [string]$Pass = "admin123"
)

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  CARGA DE CATEGORIAS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

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

# 2) Definir categorías
$categories = @(
    @{ CategoryName = "SERVIDORES"; Description = "Servidores físicos y virtuales" },
    @{ CategoryName = "CLOUD"; Description = "Servicios en la nube (AWS, Azure, GCP)" },
    @{ CategoryName = "NETWORKING"; Description = "Equipos de red: switches, routers, firewalls" },
    @{ CategoryName = "STORAGE"; Description = "Soluciones de almacenamiento: NAS, SAN, discos" },
    @{ CategoryName = "WORKSTATIONS"; Description = "Estaciones de trabajo y PCs de alto rendimiento" },
    @{ CategoryName = "LAPTOPS"; Description = "Computadoras portátiles empresariales" },
    @{ CategoryName = "MONITORES"; Description = "Pantallas y displays profesionales" },
    @{ CategoryName = "PERIFERICOS"; Description = "Teclados, mouse, headsets y accesorios" },
    @{ CategoryName = "SOFTWARE"; Description = "Licencias y suscripciones de software" },
    @{ CategoryName = "SOPORTE"; Description = "Servicios de soporte técnico y mantenimiento" }
)

# 3) Crear categorías
Write-Host "`n2) Creando categorías..." -ForegroundColor Yellow
$created = 0
$skipped = 0

foreach ($cat in $categories) {
    try {
        $body = $cat | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri "$BaseUrl/api/Category" -Method Post -Body $body -Headers $headers
        Write-Host "   [OK] $($cat.CategoryName) creada (ID: $($resp.CategoryID))" -ForegroundColor Green
        $created++
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 400 -or $status -eq 409) {
            Write-Host "   [SKIP] $($cat.CategoryName) ya existe" -ForegroundColor Yellow
            $skipped++
        } else {
            Write-Host "   [ERROR] $($cat.CategoryName): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 4) Verificar categorías creadas
Write-Host "`n3) Verificando categorías en el sistema..." -ForegroundColor Yellow
try {
    $allCategories = Invoke-RestMethod -Uri "$BaseUrl/api/Category" -Headers $headers
    Write-Host "   [OK] Total de categorías en sistema: $($allCategories.Count)" -ForegroundColor Green
    
    if ($allCategories.Count -gt 0) {
        Write-Host "`n   Categorías disponibles:" -ForegroundColor Cyan
        $allCategories | ForEach-Object {
            Write-Host "     - [$($_.categoryID)] $($_.categoryName)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "   [ERROR] No se pudo verificar: $($_.Exception.Message)" -ForegroundColor Red
}

# 5) Resumen
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Creadas: $created" -ForegroundColor Green
Write-Host "  Omitidas (ya existían): $skipped" -ForegroundColor Yellow
Write-Host "  Total en sistema: $($allCategories.Count)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
