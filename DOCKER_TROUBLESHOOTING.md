# 🐳 Troubleshooting Docker Desktop

## Problema: Error 500 del Docker Engine

Si al ejecutar `docker info` o `docker-compose` recibes un error similar a:

```
ERROR: request returned 500 Internal Server Error for API route and version 
http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.52/info
```

Esto indica que el **Docker Desktop Engine** no está funcionando correctamente, aunque el cliente Docker esté instalado.

---

## 🔧 Soluciones Recomendadas

### ✅ Solución 1: Reiniciar WSL2 y Docker Desktop

El error 500 suele ocurrir cuando el backend WSL2 de Docker Desktop no se comunica correctamente con el daemon.

**PowerShell (como Administrador):**

```powershell
# 1. Detener WSL2
wsl --shutdown

# 2. Esperar 5 segundos
Start-Sleep -Seconds 5

# 3. Cerrar Docker Desktop (si está abierto)
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# 4. Esperar 3 segundos
Start-Sleep -Seconds 3

# 5. Iniciar Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# 6. Esperar 30-45 segundos a que Docker Desktop inicie completamente
Start-Sleep -Seconds 40

# 7. Verificar estado
docker info
docker ps
```

Si `docker info` muestra información del servidor sin errores, el problema está resuelto.

---

### ✅ Solución 2: Reset de Docker Desktop (Factory Defaults)

Si el reinicio no funciona, resetea Docker Desktop a valores de fábrica:

**Pasos:**
1. Abre **Docker Desktop**
2. Ve a **Settings** (⚙️)
3. Ve a **Troubleshoot**
4. Haz clic en **"Reset to factory defaults"** o **"Clean / Purge data"**
5. Confirma la acción
6. Reinicia Docker Desktop
7. Espera a que el engine esté listo (ícono verde en la bandeja del sistema)
8. Verifica: `docker info`

**⚠️ ADVERTENCIA**: Esto eliminará:
- Todas las imágenes Docker descargadas
- Todos los contenedores
- Todos los volúmenes persistentes
- Configuraciones personalizadas

---

### ✅ Solución 3: Actualizar WSL2

Un WSL2 desactualizado puede causar problemas de comunicación con Docker Desktop.

**PowerShell (como Administrador):**

```powershell
# Ver versión actual de WSL
wsl --version

# Actualizar WSL2
wsl --update

# Verificar distribuciones instaladas
wsl --list --verbose

# Establecer WSL2 como predeterminado (si no lo está)
wsl --set-default-version 2

# Reiniciar WSL
wsl --shutdown
```

Después, reinicia Docker Desktop y verifica: `docker info`.

---

### ✅ Solución 4: Reinstalar Docker Desktop

Si ninguna de las anteriores funciona, reinstala Docker Desktop.

**Pasos:**
1. **Desinstala Docker Desktop:**
   - Panel de Control → Programas → Desinstalar Docker Desktop
   - O usa: `winget uninstall Docker.DockerDesktop`

2. **Reinicia Windows** (importante para limpiar procesos residuales)

3. **Descarga la última versión:**
   - Visita: https://www.docker.com/products/docker-desktop
   - Descarga Docker Desktop para Windows

4. **Instala Docker Desktop:**
   - Ejecuta el instalador
   - Asegúrate de seleccionar **"Use WSL 2 instead of Hyper-V"**
   - Completa la instalación

5. **Reinicia Windows nuevamente**

6. **Verifica:**
   ```powershell
   docker --version
   docker info
   docker ps
   ```

---

### ✅ Solución 5: Verificar Requisitos de Sistema

Docker Desktop con WSL2 requiere:

- **Windows 10** versión 2004 o superior (Build 19041+) **o Windows 11**
- **WSL 2** habilitado
- **Virtualización** habilitada en BIOS/UEFI
- **Hyper-V** habilitado (opcional, pero recomendado)

**Verificar versión de Windows:**
```powershell
winver
```

**Verificar virtualización (debe decir "Sí"):**
```powershell
Get-ComputerInfo | Select-Object -Property CsName,OsArchitecture,HyperVisorPresent,HyperVRequirementVirtualizationFirmwareEnabled
```

**Habilitar características de Windows necesarias (PowerShell Admin):**
```powershell
# Habilitar WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Habilitar Plataforma de Máquina Virtual
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reiniciar Windows
Restart-Computer
```

---

## 🔄 Solución Temporal: Modo InMemory (Sin Docker)

Mientras resuelves el problema de Docker, puedes ejecutar la aplicación en **modo local (InMemory)**:

```powershell
# Iniciar API y SPA sin Docker
.\start-dev.ps1

# O usando la tarea de VS Code
# Terminal → Run Task → "Start Dev (InMemory)"
```

**Ventajas del modo InMemory:**
- ✅ No requiere Docker Desktop
- ✅ Base de datos en memoria (InMemory)
- ✅ Caché en memoria (MemoryCache)
- ✅ Ideal para desarrollo y pruebas rápidas
- ✅ Funciona en equipos con recursos limitados

**Limitaciones:**
- ❌ Los datos se pierden al cerrar la aplicación
- ❌ No simula el entorno de producción (PostgreSQL + Redis)

**URLs en modo InMemory:**
- API: http://localhost:5195
- Swagger: http://localhost:5195/swagger
- SPA: http://localhost:5173

---

## 📝 Verificación Post-Solución

Después de aplicar cualquiera de las soluciones, verifica que Docker funcione:

```powershell
# 1. Verificar cliente y servidor
docker info

# 2. Verificar que no hay contenedores previos
docker ps -a

# 3. Probar pull de una imagen
docker pull hello-world

# 4. Ejecutar contenedor de prueba
docker run hello-world

# 5. Si todo funciona, iniciar el proyecto con Docker
.\start-dev-docker.ps1
```

---

## 🆘 Si Nada Funciona

Si después de intentar todas las soluciones Docker Desktop sigue sin funcionar:

1. **Revisa los logs de Docker Desktop:**
   - Docker Desktop → Settings → Troubleshoot → Show logs
   - Busca errores relacionados con WSL2, Hyper-V o permisos

2. **Busca en GitHub Issues de Docker Desktop:**
   - https://github.com/docker/for-win/issues
   - Busca tu error específico

3. **Considera alternativas:**
   - **Rancher Desktop**: Alternativa a Docker Desktop
   - **Podman**: Alternativa sin daemon
   - **Modo InMemory**: Continuar desarrollo sin contenedores

4. **Soporte de Docker:**
   - https://docs.docker.com/desktop/troubleshoot/overview/

---

## 🎯 Resumen de Comandos Útiles

```powershell
# Reinicio completo de Docker
wsl --shutdown
Stop-Process -Name "Docker Desktop" -Force
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Sleep -Seconds 40
docker info

# Verificar estado de WSL
wsl --list --verbose
wsl --status

# Actualizar WSL
wsl --update

# Verificar versión de Docker
docker --version
docker-compose --version

# Limpiar todo Docker (CUIDADO: borra todo)
docker system prune -a --volumes

# Ver logs de contenedores
docker-compose logs -f

# Detener todo Docker
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

---

## ✅ Prevención de Problemas Futuros

1. **Mantén Docker Desktop actualizado:**
   - Settings → Check for updates

2. **Mantén WSL2 actualizado:**
   - `wsl --update` (mensualmente)

3. **Reinicia Windows periódicamente:**
   - Evita problemas de memoria y procesos residuales

4. **No fuerces el cierre de Docker Desktop:**
   - Usa "Quit Docker Desktop" desde el menú

5. **Asegura recursos suficientes:**
   - Docker Desktop → Settings → Resources
   - Mínimo: 4GB RAM, 2 CPUs

---

## 📚 Referencias

- [Docker Desktop para Windows - Documentación Oficial](https://docs.docker.com/desktop/install/windows-install/)
- [WSL2 - Documentación de Microsoft](https://learn.microsoft.com/es-es/windows/wsl/install)
- [Troubleshooting Docker Desktop](https://docs.docker.com/desktop/troubleshoot/overview/)
- [Docker Desktop Issues en GitHub](https://github.com/docker/for-win/issues)
