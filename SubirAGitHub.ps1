# Script para subir el proyecto ASISYA a GitHub
# IMPORTANTE: Ejecutar después de instalar Git desde https://git-scm.com/download/win

# Configuración - REEMPLAZA ESTOS VALORES
$GITHUB_USERNAME = "VILLA1OO"
$GITHUB_REPO = "ASISYA-API"
$USER_NAME = "EDGAR VILLAMIL"
$USER_EMAIL = "edgarvillmail1@gmaiL.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ASISYA - Subir Proyecto a GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Git está instalado
Write-Host "Verificando instalación de Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, sigue estos pasos:" -ForegroundColor Yellow
    Write-Host "1. Descarga Git desde: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Instala Git (usa las opciones por defecto)" -ForegroundColor White
    Write-Host "3. Reinicia PowerShell" -ForegroundColor White
    Write-Host "4. Ejecuta este script nuevamente" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "Configurando Git..." -ForegroundColor Yellow
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"
Write-Host "✓ Configuración completada" -ForegroundColor Green

Write-Host ""
Write-Host "Inicializando repositorio..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "⚠ El repositorio ya está inicializado" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✓ Repositorio inicializado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add .
Write-Host "✓ Archivos agregados" -ForegroundColor Green

Write-Host ""
Write-Host "Creando commit inicial..." -ForegroundColor Yellow
try {
    git commit -m "Initial commit: ASISYA API with Clean Architecture, CQRS, Redis cache, JWT auth, and integration tests"
    Write-Host "✓ Commit creado" -ForegroundColor Green
} catch {
    Write-Host "⚠ Ya existe un commit o no hay cambios para commitear" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Paso siguiente: Crear repositorio en GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repositorio: $GITHUB_REPO" -ForegroundColor White
Write-Host "3. Elige Private o Public" -ForegroundColor White
Write-Host "4. NO marques 'Initialize with README'" -ForegroundColor White
Write-Host "5. Click en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "¿Ya creaste el repositorio en GitHub? (S/N)" -ForegroundColor Yellow
$respuesta = Read-Host

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    Write-Host ""
    Write-Host "Conectando con GitHub..." -ForegroundColor Yellow
    
    $repoUrl = "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"
    
    # Verificar si el remoto ya existe
    $remotes = git remote
    if ($remotes -contains "origin") {
        Write-Host "⚠ El remoto 'origin' ya existe. Eliminándolo..." -ForegroundColor Yellow
        git remote remove origin
    }
    
    git remote add origin $repoUrl
    Write-Host "✓ Remoto agregado: $repoUrl" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Preparando rama principal..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "✓ Rama 'main' configurada" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  IMPORTANTE: Autenticación" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Git te pedirá credenciales:" -ForegroundColor Yellow
    Write-Host "- Usuario: $GITHUB_USERNAME" -ForegroundColor White
    Write-Host "- Contraseña: Usa un Personal Access Token (NO tu contraseña)" -ForegroundColor White
    Write-Host ""
    Write-Host "Para crear un token:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Click en 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Marca el scope 'repo'" -ForegroundColor White
    Write-Host "4. Copia el token generado" -ForegroundColor White
    Write-Host "5. Úsalo como contraseña cuando Git lo pida" -ForegroundColor White
    Write-Host ""
    Write-Host "Presiona Enter cuando estés listo para subir el código..." -ForegroundColor Yellow
    Read-Host
    
    Write-Host ""
    Write-Host "Subiendo código a GitHub..." -ForegroundColor Yellow
    try {
        git push -u origin main
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ ¡ÉXITO! Proyecto subido a GitHub" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tu repositorio está disponible en:" -ForegroundColor White
        Write-Host "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "El CI/CD se ejecutará automáticamente en la pestaña 'Actions'" -ForegroundColor White
    } catch {
        Write-Host ""
        Write-Host "✗ Error al subir el código" -ForegroundColor Red
        Write-Host "Verifica:" -ForegroundColor Yellow
        Write-Host "- Que el repositorio existe en GitHub" -ForegroundColor White
        Write-Host "- Que las credenciales son correctas" -ForegroundColor White
        Write-Host "- Que el token tiene permisos 'repo'" -ForegroundColor White
        Write-Host ""
        Write-Host "Puedes intentar manualmente con:" -ForegroundColor Yellow
        Write-Host "git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Crea el repositorio en GitHub y ejecuta este script nuevamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Comandos útiles para el futuro:" -ForegroundColor Cyan
Write-Host "  git status           - Ver estado" -ForegroundColor White
Write-Host "  git add .            - Agregar cambios" -ForegroundColor White
Write-Host "  git commit -m 'msg'  - Crear commit" -ForegroundColor White
Write-Host "  git push             - Subir cambios" -ForegroundColor White
Write-Host "  git pull             - Bajar cambios" -ForegroundColor White
Write-Host ""
Read-Host "Presiona Enter para salir"
