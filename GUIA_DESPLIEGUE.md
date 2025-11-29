# Guía de Despliegue - ASISYA

## Estrategia de Ambientes

Este proyecto mantiene una **estrategia híbrida** para adaptarse a diferentes escenarios de desarrollo y despliegue.

---

## 🖥️ Desarrollo Local (Sin Docker)

**Uso:** Para desarrollo en equipos con limitaciones de recursos o sin Docker.

### Características:
- ✅ Base de datos InMemory (datos en RAM)
- ✅ Cache en memoria (DistributedMemoryCache)
- ✅ Inicio rápido sin dependencias externas
- ✅ Ideal para desarrollo y pruebas rápidas

### Comando:
```powershell
.\deploy-dev-no-docker.ps1
```

### URLs:
- API: `https://localhost:5001`
- Swagger: `https://localhost:5001/swagger`

### Credenciales:
- Usuario: `admin`
- Password: `admin123`

---

## 🐳 Desarrollo con Docker

**Uso:** Para desarrollo con infraestructura completa (PostgreSQL + Redis).

### Características:
- ✅ PostgreSQL como base de datos
- ✅ Redis para cache distribuido
- ✅ Entorno similar a producción
- ✅ Persistencia de datos

### Comando:
```powershell
.\deploy-dev.ps1
```

**Requisitos:**
- Docker Desktop instalado y corriendo
- WSL2 habilitado (Windows)

---

## 🧪 Pruebas

**Uso:** Ejecutar suite completa de tests.

### Comando:
```powershell
.\deploy-test.ps1
```

### Características:
- Ejecuta tests unitarios e integración
- Usa InMemory Database automáticamente
- No requiere Docker

---

## 🚀 Producción

**Uso:** Despliegue en ambiente productivo con Docker.

### Comando:
```powershell
.\deploy-prod.ps1
```

### Características:
- Usa `docker-compose.prod.yml`
- Configuración segura y optimizada
- Variables de entorno para credenciales
- Persistencia de volúmenes

---

## 📁 Archivos de Configuración

### Desarrollo Local (Sin Docker)
- `appsettings.Development.json`
- Variables de entorno: `UseInMemoryForTests=true`, `ForceInMemory=true`

### Desarrollo con Docker
- `appsettings.Development.json`
- `docker-compose.yml`

### Producción
- `appsettings.json`
- `docker-compose.prod.yml`
- Variables de entorno para secretos

---

## 🔧 Solución de Problemas

### Docker no está disponible
✅ **Solución:** Usa `deploy-dev-no-docker.ps1` para desarrollo local

### Error de compilación
```powershell
dotnet clean
dotnet restore
dotnet build
```

### Puerto 5001 ocupado
Cambia el puerto en `Properties/launchSettings.json`:
```json
"applicationUrl": "https://localhost:5002;http://localhost:5003"
```

---

## 🎯 Flujo de Trabajo Recomendado

### Durante Desarrollo:
1. **Trabajo diario:** `deploy-dev-no-docker.ps1` (rápido, sin Docker)
2. **Antes de commit:** `deploy-test.ps1` (verificar tests)
3. **Prueba completa:** `deploy-dev.ps1` (con Docker si está disponible)

### Para Despliegue:
1. **Testing:** CI/CD ejecuta tests automáticamente
2. **Staging:** Usa `docker-compose.yml`
3. **Producción:** Usa `docker-compose.prod.yml`

---

## 📝 Notas Importantes

- Los archivos Docker (`Dockerfile`, `docker-compose.yml`) **se mantienen** para despliegues en otros ambientes
- El desarrollo local usa InMemory, pero **los datos se pierden al cerrar la app**
- Para persistencia durante desarrollo, usa `deploy-dev.ps1` con Docker
- La configuración de producción usa variables de entorno para credenciales
- **Por las características de algunos equipos de desarrollo con insuficientes recursos, no se puede desplegar ambientes con contenedores Docker. En estos casos, se recomienda usar el modo local InMemory.**

---

## 🔐 Variables de Entorno

### Desarrollo Local
```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:UseInMemoryForTests = "true"
$env:ForceInMemory = "true"
```

### Producción
```yaml
environment:
  - ASPNETCORE_ENVIRONMENT=Production
  - ConnectionStrings__DefaultConnection=Host=db;...
  - CacheSettings__RedisHost=cache:6379
  - Jwt__SecretKey=<tu-secret-key-seguro>
```

---

## 📚 Más Información

- **Arquitectura:** Ver `README.md`
- **Implementación:** Ver `IMPLEMENTACION_RESUMEN.md`
- **GitHub:** Ver `GUIA_GITHUB_SIMPLE.md`
