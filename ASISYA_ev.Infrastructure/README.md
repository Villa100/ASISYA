# Despliegue con Docker y DevOps
# Prerrequisito: Extensiones recomendadas para VS Code


Para el correcto funcionamiento y despliegue del proyecto desde Visual Studio Code, es necesario contar con las siguientes extensiones instaladas:
## Comprobaciones previas (antes de ejecutar los scripts):

**Verifica que las extensiones estén activas:**

- <strong>Docker</strong>: <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-azuretools.vscode-docker</code></span>
- <strong>C#</strong>: <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-dotnettools.csharp</code></span>
- <strong>PowerShell</strong>: <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-vscode.powershell</code></span>
- <strong>GitHub PRs</strong>: <span style="font-size:1.25em"><code>code --list-extensions | Select-String GitHub.vscode-pull-request-github</code></span>

	```powershell
	docker info
	```
	```powershell
	dotnet --version
	```
	```powershell
	$PSVersionTable.PSVersion
	```
	```powershell
	git --version
	```
 **Verifica que las extensiones estén activas:**
 - **Docker:** <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-azuretools.vscode-docker</code></span>
 - **C#:** <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-dotnettools.csharp</code></span>
 - **PowerShell:** <span style="font-size:1.25em"><code>code --list-extensions | Select-String ms-vscode.powershell</code></span>
 - **GitHub PRs:** <span style="font-size:1.25em"><code>code --list-extensions | Select-String GitHub.vscode-pull-request-github</code></span>
- GitHub Pull Requests and Issues (GitHub.vscode-pull-request-github)

Los scripts de despliegue validan e instalan automáticamente estas extensiones si no están presentes.

## Dockerfile
El archivo `ASISYA_ev.Api/Dockerfile` permite construir la API en un contenedor Docker. Utiliza una imagen base de .NET, compila el proyecto y expone el puerto 8080 para el servicio web.

### Ejemplo para construir la imagen Docker:
```powershell
docker build -t asisya-api:latest -f ASISYA_ev.Api/Dockerfile .
```

### Ejemplo para ejecutar el contenedor manualmente:
```powershell
docker run -d -p 8080:8080 --name asisya-api asisya-api:latest
```

## docker-compose.yml
El archivo `docker-compose.yml` orquesta los siguientes servicios:
- **db (PostgreSQL):** Base de datos persistente para la aplicación.
- **cache (Redis):** Caché distribuida para mejorar el rendimiento.
- **api (ASISYA_ev):** API REST construida en .NET, conectada a los servicios anteriores.

Permite levantar toda la infraestructura con un solo comando:
```powershell
docker-compose up --build
```

### Ejemplo para detener y eliminar los servicios:
```powershell
docker-compose down
```

## Pipeline CI

En la carpeta `.github/workflows/` existen dos workflows:
- `dotnet-ci.yml`: Ejecuta build, test y cobertura de código en GitHub Actions para ramas principales.
- `ci.yml`: Realiza build y test en Windows y contiene ejemplo para construir la imagen Docker de la API.

### Ejemplo de paso para construir imagen Docker en CI:
```yaml
	- name: Build API image
		run: |
			docker build -t asisya-api:ci ./ASISYA_ev.Api
```

Esto asegura integración continua y despliegue automatizado, facilitando la calidad y entrega del software.

---

## 🔧 Troubleshooting Docker

Si experimentas problemas con Docker Desktop (por ejemplo, error 500 del engine), consulta la guía detallada de troubleshooting:

📖 **[../DOCKER_TROUBLESHOOTING.md](../DOCKER_TROUBLESHOOTING.md)**

Esta guía incluye:
- Reiniciar WSL2 y Docker Desktop
- Reset a valores de fábrica
- Actualización de WSL2
- Reinstalación de Docker Desktop
- Verificación de requisitos del sistema
- Modo InMemory como alternativa temporal

---

## Scripts Automatizados de Inicio

El proyecto incluye scripts PowerShell para automatizar el inicio y detención de servicios:

### Desarrollo (InMemory - Sin Docker)
```powershell
# Desde raíz del proyecto
.\start-dev.ps1
.\stop-all.ps1
```

### Desarrollo con Docker
```powershell
.\start-dev-docker.ps1  # Inicia db, cache, api
.\stop-docker.ps1       # Detiene servicios
.\stop-docker.ps1 -PruneVolumes  # Detiene y elimina volúmenes
```

### Pruebas con Docker
```powershell
.\start-test-docker.ps1
.\stop-docker.ps1
```

Estos scripts incluyen:
- ✅ Verificación automática de Docker Desktop
- ✅ Timeout y reintentos para esperar que servicios estén listos
- ✅ Health checks de la API (Swagger)
- ✅ Mensajes informativos de progreso

---

## Ejemplos de Despliegue y Detención por Ambiente

### 🖥️ Desarrollo Local (Sin Docker)
Ejecución:
```powershell
./deploy-dev-no-docker.ps1
```
Detención:
Cerrar la terminal o detener el proceso manualmente.

### 🐳 Desarrollo con Docker
Ejecución:
```powershell
./deploy-dev.ps1
```
Detención:
```powershell
docker-compose down
```

### 🧪 Pruebas
Ejecución:
```powershell
./deploy-test.ps1
```
Detención:
Cerrar la terminal o detener el proceso manualmente.

### 🚀 Producción
Ejecución:
```powershell
./deploy-prod.ps1
```
Detención:
```powershell
docker-compose -f docker-compose.prod.yml down
```

Para más detalles, consulta la guía de despliegue (`GUIA_DESPLIEGUE.md`) y la documentación técnica en la SPA.

## 📝 Notas Importantes

- El desarrollo local usa InMemory, los datos se pierden al cerrar la app.
- Para persistencia, usa Docker.
- La configuración de producción usa variables de entorno para credenciales.
- **Por las características de algunos equipos de desarrollo con insuficientes recursos, no se puede desplegar ambientes con contenedores Docker. En estos casos, se recomienda usar el modo local InMemory.**