# Guía para Subir el Proyecto ASISYA a GitHub

## Prerequisitos
1. Tener Git instalado: https://git-scm.com/download/win
2. Tener una cuenta de GitHub: https://github.com
3. Haber creado un repositorio vacío en GitHub (sin README, sin .gitignore)

## Paso 1: Instalar Git (si no está instalado)
Descarga e instala Git desde: https://git-scm.com/download/win
Después de instalar, reinicia PowerShell.

## Paso 2: Configurar Git (primera vez)
```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

## Paso 3: Inicializar el repositorio local
```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\35414642\ASISYA

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: ASISYA API with Clean Architecture, CQRS, Redis cache, JWT auth, and integration tests"
```

## Paso 4: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `ASISYA` o `ASISYA-API`
3. Descripción: "API REST con .NET 9, Clean Architecture, CQRS, Redis, JWT"
4. Elige: Private o Public
5. NO marques "Initialize with README"
6. Click en "Create repository"

## Paso 5: Conectar con GitHub
GitHub te mostrará comandos. Usa estos (reemplaza TU_USUARIO y TU_REPO):

```powershell
# Agregar el remoto
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Renombrar la rama principal a 'main'
git branch -M main

# Subir todo a GitHub
git push -u origin main
```

## Paso 6: Autenticación en GitHub
Cuando Git te pida credenciales:
- **Usuario**: Tu usuario de GitHub
- **Contraseña**: Debes usar un Personal Access Token (no tu contraseña)

### Crear un Personal Access Token:
1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Nombre: "ASISYA Project"
4. Expiration: 90 días o "No expiration"
5. Scope: Marca "repo" (full control of private repositories)
6. Click "Generate token"
7. **COPIA EL TOKEN** (solo se muestra una vez)
8. Úsalo como contraseña cuando Git lo pida

## Paso 7: Verificar que se subió correctamente
Ve a tu repositorio en GitHub:
```
https://github.com/TU_USUARIO/TU_REPO
```

Deberías ver todos los archivos y el workflow de CI en la pestaña "Actions".

## Comandos útiles para el futuro

### Ver estado de archivos
```powershell
git status
```

### Agregar cambios
```powershell
# Agregar todos los cambios
git add .

# Agregar archivo específico
git add ARCHIVO.cs
```

### Hacer commit
```powershell
git commit -m "Descripción de los cambios"
```

### Subir cambios
```powershell
git push
```

### Actualizar desde GitHub
```powershell
git pull
```

### Ver historial
```powershell
git log --oneline
```

### Crear una rama
```powershell
git checkout -b feature/nueva-caracteristica
```

### Cambiar de rama
```powershell
git checkout main
```

## Configuración del CI/CD
El proyecto ya incluye `.github/workflows/ci.yml` que se ejecutará automáticamente en cada push/PR.

## Proteger archivos sensibles
El archivo `.gitignore` ya está configurado para excluir:
- Archivos de compilación (bin/, obj/)
- Configuración de IDE (.vs/, .vscode/, .idea/)
- node_modules/
- Variables de entorno (.env)
- Archivos de usuario (*.user, *.suo)

## ⚠️ IMPORTANTE
- Nunca subas claves secretas o contraseñas reales
- Las credenciales de demo (admin/admin123) son solo para desarrollo
- En producción, usa variables de entorno o Azure Key Vault para secretos

## Problemas comunes

### Error: "git is not recognized"
Solución: Instala Git y reinicia PowerShell

### Error: "remote origin already exists"
Solución: 
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### Error: "failed to push some refs"
Solución:
```powershell
git pull origin main --rebase
git push origin main
```

### Autenticación falla repetidamente
Solución: Usa el Credential Manager de Windows o almacena el token:
```powershell
git config --global credential.helper wincred
```

## Estructura del repositorio en GitHub

```
TU_USUARIO/ASISYA/
├── .github/
│   └── workflows/
│       └── ci.yml          ← CI/CD automático
├── ASISYA_ev.Api/
├── ASISYA_ev.Application/
├── ASISYA_ev.Domain/
├── ASISYA_ev.Infrastructure/
├── ASISYA_ev.UnitTests/
├── ASISYA_ev.IntegrationTests/
├── ASISYA_ev.SPA/
├── .gitignore              ← Exclusiones
├── ASISYA_ev.sln
├── README.md               ← Documentación principal
└── IMPLEMENTACION_RESUMEN.md
```

## Siguiente pasos recomendados

1. ✅ Subir el código a GitHub
2. ⚙️ Configurar GitHub Actions (ya incluido)
3. 🔒 Agregar protección de rama a `main`
4. 📋 Crear issues para nuevas funcionalidades
5. 🎯 Usar Projects para gestión de tareas
6. 📝 Documentar decisiones en el Wiki

---

¿Necesitas ayuda? Consulta:
- Documentación de Git: https://git-scm.com/doc
- Guía de GitHub: https://docs.github.com
