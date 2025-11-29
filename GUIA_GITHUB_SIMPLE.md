# 🚀 Cómo Subir ASISYA a GitHub - Paso a Paso Simplificado

## 📝 Resumen Rápido

Este proyecto ya está listo para subir a GitHub. Solo necesitas:
1. ✅ `.gitignore` configurado
2. ✅ CI/CD workflow creado
3. ✅ README.md actualizado
4. ⏳ Instalar Git
5. ⏳ Crear repositorio en GitHub
6. ⏳ Subir el código

---

## 🔧 PASO 1: Instalar Git (5 minutos)

### Descargar
1. Ve a: **https://git-scm.com/download/win**
2. Descarga la versión de 64-bit para Windows
3. Ejecuta el instalador

### Instalación
- Acepta todas las opciones por defecto
- Click en "Next" hasta finalizar
- **MUY IMPORTANTE**: Cierra y reabre PowerShell después de instalar

### Verificar instalación
Abre PowerShell y ejecuta:
```powershell
git --version
```
Deberías ver algo como: `git version 2.43.0.windows.1`

---

## 👤 PASO 2: Configurar tu Identidad en Git (1 minuto)

Abre PowerShell y ejecuta (reemplaza con tus datos):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

---

## 🌐 PASO 3: Crear Repositorio en GitHub (2 minutos)

1. **Inicia sesión en GitHub**: https://github.com/login

2. **Crea un nuevo repositorio**: https://github.com/new

3. **Configura el repositorio**:
   - **Nombre**: `ASISYA-API` (o el que prefieras)
   - **Descripción**: `API REST con .NET 9, Clean Architecture, CQRS, Redis, JWT`
   - **Visibilidad**: 
     - ✅ **Private** (recomendado para proyectos de trabajo)
     - ⚪ Public (si quieres compartirlo)
   - **⚠️ IMPORTANTE**: NO marques estas opciones:
     - ❌ "Add a README file"
     - ❌ "Add .gitignore"
     - ❌ "Choose a license"

4. **Click en "Create repository"**

5. **GitHub te mostrará una página con comandos** - NO los ejecutes aún, los haremos juntos en el siguiente paso

---

## 💻 PASO 4: Subir tu Código (3 minutos)

### Opción A: Usar el Script Automático (Recomendado)

1. Abre el archivo: `SubirAGitHub.ps1`
2. Edita las primeras líneas:
   ```powershell
   $GITHUB_USERNAME = "tu_usuario"  # Tu usuario de GitHub
   $GITHUB_REPO = "ASISYA-API"      # Nombre del repo que creaste
   $USER_NAME = "Tu Nombre"         # Tu nombre completo
   $USER_EMAIL = "tu@email.com"     # Tu email
   ```
3. Guarda el archivo
4. En PowerShell, navega al proyecto:
   ```powershell
   cd C:\Users\35414642\ASISYA
   ```
5. Ejecuta el script:
   ```powershell
   .\SubirAGitHub.ps1
   ```
6. Sigue las instrucciones en pantalla

### Opción B: Comandos Manuales

En PowerShell, ejecuta estos comandos uno por uno:

```powershell
# 1. Ir a la carpeta del proyecto
cd C:\Users\35414642\ASISYA

# 2. Inicializar Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Crear el primer commit
git commit -m "Initial commit: ASISYA API"

# 5. Conectar con GitHub (REEMPLAZA: tu_usuario y tu_repo)
git remote add origin https://github.com/tu_usuario/tu_repo.git

# 6. Configurar rama principal
git branch -M main

# 7. Subir el código
git push -u origin main
```

---

## 🔐 PASO 5: Autenticación (si te pide credenciales)

Cuando ejecutes `git push`, Git te pedirá credenciales:

### Usuario
Escribe tu nombre de usuario de GitHub

### Contraseña
⚠️ **NO uses tu contraseña de GitHub**. Debes usar un **Personal Access Token**:

#### Crear un Personal Access Token:

1. Ve a: **https://github.com/settings/tokens**
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Configura:
   - **Note**: `ASISYA Project`
   - **Expiration**: `90 days` o `No expiration`
   - **Scope**: ✅ Marca **`repo`** (completo)
4. Click **"Generate token"**
5. **COPIA EL TOKEN** (solo se muestra una vez) ejemplo: `ghp_xxxxxxxxxxxxxxxxxxxx`
6. Pégalo como contraseña cuando Git lo pida

💾 **Guardar el token**: Git te preguntará si quieres guardar las credenciales. Di que SÍ para no tener que ingresarlo cada vez.

---

## ✅ PASO 6: Verificar que Funcionó

1. Ve a tu repositorio en GitHub:
   ```
   https://github.com/tu_usuario/ASISYA-API
   ```

2. Deberías ver:
   - ✅ Todos los archivos del proyecto
   - ✅ El README.md renderizado
   - ✅ La carpeta `.github/workflows/` con el CI

3. Ve a la pestaña **"Actions"**:
   - Deberías ver el workflow de CI ejecutándose o completado

---

## 🎉 ¡LISTO!

Tu proyecto ASISYA ya está en GitHub. Ahora puedes:

### Comandos Diarios

```powershell
# Ver qué archivos cambiaron
git status

# Agregar cambios
git add .

# Guardar cambios con un mensaje
git commit -m "Descripción de lo que hiciste"

# Subir a GitHub
git push

# Bajar cambios de GitHub
git pull
```

### Flujo de Trabajo Típico

```powershell
# 1. Haces cambios en el código
# 2. Guardas los archivos
# 3. Ejecutas:
git add .
git commit -m "Agregué caché para categorías"
git push
```

---

## 🛠️ Solución de Problemas Comunes

### "git is not recognized"
- Reinstala Git
- Reinicia PowerShell
- Verifica que Git se instaló en `C:\Program Files\Git`

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/tu_usuario/tu_repo.git
```

### "failed to push"
```powershell
git pull origin main --rebase
git push origin main
```

### Autenticación falla repetidamente
```powershell
# Limpiar credenciales guardadas
git credential-manager-core erase https://github.com

# Intentar push nuevamente
git push
```

---

## 📚 Recursos Útiles

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Visual Git Guide**: https://marklodato.github.io/visual-git-guide/index-es.html

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Lee el mensaje de error completo
2. Busca el error en Google: "git [mensaje de error]"
3. Revisa la documentación de Git
4. Consulta con el equipo

---

## 🎯 Siguiente Pasos Recomendados

1. ✅ Subir código a GitHub (este documento)
2. 🔒 Configurar protección de rama `main`
3. 📋 Crear issues para futuras mejoras
4. 🤝 Invitar colaboradores al repositorio
5. 📊 Revisar el dashboard de Actions (CI/CD)
6. 📝 Actualizar el README si es necesario

---

**Última actualización**: 28 de noviembre de 2025
