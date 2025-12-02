import React from 'react'

export default function GitGithubGuide() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="documentation-container" style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la guía Git & GitHub.</p>
      </div>
    )
  }

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>🗂️ Git & GitHub del Proyecto</h1>
        <p className="subtitle">Flujos, convenciones y automatizaciones para el repositorio público</p>
      </div>

      <div className="doc-section">
        <h2>📦 Estructura del Repositorio</h2>
        <div className="info-card">
          <ul>
            <li>Solución .NET: <code>ASISYA_ev.sln</code></li>
            <li>Capas: <code>Api</code>, <code>Application</code>, <code>Domain</code>, <code>Infrastructure</code></li>
            <li>SPA: <code>ASISYA_ev.SPA</code> (React + Vite)</li>
            <li>Pruebas: <code>ASISYA_ev.UnitTests</code>, <code>ASISYA_ev.IntegrationTests</code></li>
            <li>Gobernanza: <code>.github/</code> workflows, templates, seguridad</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🔐 Seguridad y Sanitización</h2>
        <div className="functionality-card">
          <ul>
            <li>Secretos reemplazados por placeholders en <code>appsettings.json</code>.</li>
            <li>Archivo plantilla: <code>appsettings.Template.json</code>.</li>
            <li>Usar variables de entorno: <code>Jwt__SecretKey</code>, <code>ConnectionStrings__DefaultConnection</code>, <code>CacheSettings__RedisHost</code>.</li>
            <li>Escaneo CodeQL y Dependabot activados.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🌿 Estrategia de Ramas</h2>
        <div className="feature-card">
          <ul>
            <li><strong>main</strong>: Rama estable y desplegable.</li>
            <li><strong>develop</strong>: Integración de nuevas funcionalidades (si se habilita).</li>
            <li><strong>feature/nombre-corto</strong>: Desarrollo incremental.</li>
            <li><strong>fix/issue-id</strong>: Corrección de errores.</li>
            <li><strong>hotfix/critico</strong>: Corrección urgente en producción.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🧪 Integración Continua (CI)</h2>
        <div className="info-card">
          <ul>
            <li><code>ci.yml</code> y <code>dotnet-ci.yml</code>: build, test y cobertura.</li>
            <li><code>codeql.yml</code>: análisis estático de seguridad.</li>
            <li><code>dependabot.yml</code>: actualización de dependencias.</li>
            <li>Publicar imagen Docker (paso opcional) en <code>dotnet-ci.yml</code>.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>✅ Checklist antes de Push</h2>
        <div className="functionality-card">
          <ul>
            <li>Sin secretos en configuración.</li>
            <li>Pruebas pasan: <code>dotnet test</code>.</li>
            <li>SPA compila: <code>npm install && npm run build</code>.</li>
            <li>Formato consistente y sin archivos temporales.</li>
            <li>Mensajes de commit claros y atómicos.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>✍️ Convenciones de Commit</h2>
        <div className="info-card">
          <ul>
            <li><code>feat:</code> nueva funcionalidad</li>
            <li><code>fix:</code> corrección de bug</li>
            <li><code>chore:</code> tareas varias (config, limpieza)</li>
            <li><code>docs:</code> documentación</li>
            <li><code>test:</code> pruebas (agregar/ajustar)</li>
            <li><code>refactor:</code> mejora interna sin cambio funcional</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🔄 Flujo Básico</h2>
        <div className="code-block">
          <h3>PowerShell</h3>
          <pre>{`# Clonar
git clone https://github.com/usuario/ASISYA.git
cd ASISYA

# Crear rama
git checkout -b feature/mi-cambio

# Cambios y commit
git add .
git commit -m "feat: agregar validación de productos"

# Actualizar desde remoto
git pull origin main --rebase

# Push
git push -u origin feature/mi-cambio`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>📝 Plantillas y Gobernanza</h2>
        <div className="feature-card">
          <ul>
            <li>CODEOWNERS para revisiones automáticas.</li>
            <li>Plantillas de Issues: bug y feature.</li>
            <li>Plantilla de Pull Request.</li>
            <li>SECURITY.md para políticas de reporte.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🏷️ Versionado</h2>
        <div className="info-card">
          <ul>
            <li>Seguir SemVer: <code>MAJOR.MINOR.PATCH</code>.</li>
            <li>Tags: <code>git tag v1.0.0 && git push --tags</code>.</li>
            <li>Opcional: mantener <code>CHANGELOG.md</code>.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🔍 Recuperar Estado</h2>
        <div className="code-block">
          <h3>PowerShell</h3>
          <pre>{`# Ver estado
git status

# Diferencias
git diff

# Últimos commits
git log --oneline --decorate --graph -n 10`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>🛠️ Solución de Conflictos</h2>
        <div className="functionality-card">
          <ul>
            <li>Actualizar rama: <code>git pull --rebase origin main</code>.</li>
            <li>Editar archivos marcados con conflictos.</li>
            <li>Agregar y continuar: <code>git add . && git rebase --continue</code>.</li>
            <li>Abortar si necesario: <code>git rebase --abort</code>.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📚 Recursos</h2>
        <div className="info-card">
          <ul>
            <li><a href="https://git-scm.com/docs" target="_blank" rel="noreferrer">Documentación oficial Git</a></li>
            <li><a href="https://docs.github.com" target="_blank" rel="noreferrer">Docs GitHub</a></li>
            <li>Ver <code>GUIA_GITHUB.md</code> y <code>CHECKLIST_GITHUB.md</code> en el repositorio.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
