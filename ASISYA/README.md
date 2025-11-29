# ASISYA (Subcarpeta Pública)

Este directorio sirve como punto organizativo adicional para la versión pública del proyecto.

## Contenido Clave del Repositorio
- Solución .NET: `ASISYA_ev.sln`
- API: `ASISYA_ev.Api/`
- Aplicación SPA (Vite + React): `ASISYA_ev.SPA/`
- Capas: `Application`, `Domain`, `Infrastructure`
- Pruebas: `ASISYA_ev.UnitTests/`, `ASISYA_ev.IntegrationTests/`
- Seguridad y gobernanza: `SECURITY.md`, `.github/` (workflows, templates, CodeQL, Dependabot)

## Seguridad y Configuración
- Secretos removidos de `appsettings.json` y plantilla en `appsettings.Template.json`.
- Variables de entorno recomendadas:
  - `Jwt__SecretKey`
  - `ConnectionStrings__DefaultConnection`
  - `CacheSettings__RedisHost`

## Workflows principales
- CI (`.github/workflows/ci.yml` / `dotnet-ci.yml`): build + test + cobertura.
- CodeQL (`codeql.yml`): análisis estático semanal y en PR.
- Dependabot (`dependabot.yml`): actualizaciones automáticas (nuget, npm, actions).

## Próximos Pasos Recomendados
1. Agregar archivo `LICENSE` si el repositorio es público.
2. Añadir `CHANGELOG.md` para versionado semántico.
3. Configurar protecciones de rama (main/develop) en GitHub.
4. Activar Secret Scanning y Dependabot Alerts.

## Ejemplo Variables de Entorno (PowerShell)
```powershell
$env:Jwt__SecretKey = "<clave-segura>"
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=asisya;Username=postgres;Password=<pwd>"
$env:CacheSettings__RedisHost = "localhost:6379"
```

---
**Nota:** Esta subcarpeta no reemplaza la raíz; es una referencia organizativa adicional para la publicación y revisión externa.
