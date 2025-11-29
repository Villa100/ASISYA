# Seguridad del Proyecto ASISYA

Este documento describe prácticas para mantener la seguridad al publicar el repositorio de forma pública.

## Reporte de Vulnerabilidades
Si encuentras una vulnerabilidad, por favor crea un issue marcado como `security` o envía un correo al mantenedor (reemplazar con email real) antes de divulgarla públicamente.

## Manejo de Secretos
- Nunca committear claves reales ni contraseñas en `appsettings.json`.
- Usar variables de entorno: `Jwt__SecretKey`, `ConnectionStrings__DefaultConnection`, `CacheSettings__RedisHost`.
- Proveer solo archivos plantilla como `appsettings.Template.json`.

## Dependencias
- Actualizaciones automáticas gestionadas por Dependabot (`nuget`, `npm`, `github-actions`).
- Revisar PRs generados y ejecutar pruebas antes de merge.

## Análisis de Código
- CodeQL corre semanalmente y en cada push/PR a ramas principales.
- Se recomienda revisar alertas en la pestaña Security.

## Pipeline CI
- Ejecuta `dotnet test` y cobertura.
- Se sugiere añadir escaneo de contenedores antes de imágenes de producción.

## Buenas Prácticas
- Activar protección de rama: `main` y `develop` (revisiones, status checks). 
- Activar Secret Scanning y Dependabot Alerts en GitHub.
- Usar tokens de acceso personales con permisos mínimos.

## Política de Versionado
- Seguir SemVer (MAJOR.MINOR.PATCH).
- Incluir notas de versión en cada release (CHANGELOG recomendado).

## Ejemplo de Variables de Entorno (PowerShell)
```powershell
$env:Jwt__SecretKey = "<clave-segura>"
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=asisya;Username=postgres;Password=<pwd>"
$env:CacheSettings__RedisHost = "localhost:6379"
```
