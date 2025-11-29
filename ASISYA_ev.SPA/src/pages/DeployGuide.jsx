import React from 'react'

export default function DeployGuide() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="documentation-container" style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la guía de despliegue.</p>
      </div>
    )
  }

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>🚀 Guía de Despliegue</h1>
        <p className="subtitle">Pasos y comprobaciones para ejecutar ASISYA en cada ambiente</p>
      </div>

      <div className="doc-section">
        <h2>🔎 Validación de Componentes Necesarios para VS Code</h2>
        <div className="functionality-card">
          <ul>
            <li><strong>Extensiones recomendadas:</strong>
              <ul>
                <li>Docker (Microsoft)</li>
                <li>C# (OmniSharp)</li>
                <li>PowerShell</li>
                <li>GitHub Actions</li>
              </ul>
            </li>
            <li><strong>Herramientas obligatorias:</strong>
              <ul>
                <li>Docker Desktop</li>
                <li>.NET SDK 9.0</li>
                <li>PowerShell (Windows) o terminal compatible</li>
                <li>Git</li>
              </ul>
            </li>
            <li><strong>Comprobaciones previas:</strong>
              <ul>
                <li style={{fontSize:'1.1rem'}}><strong>Verifica que Docker esté corriendo:</strong> <code style={{fontSize:'1.05rem'}}>docker info</code></li>
                <li style={{fontSize:'1.1rem'}}><strong>Verifica la versión de .NET:</strong> <code style={{fontSize:'1.05rem'}}>dotnet --version</code></li>
                <li style={{fontSize:'1.1rem'}}><strong>Verifica que tienes acceso a PowerShell:</strong> <code style={{fontSize:'1.05rem'}}>$PSVersionTable.PSVersion</code></li>
                <li style={{fontSize:'1.1rem'}}><strong>Verifica que tienes acceso a Git:</strong> <code style={{fontSize:'1.05rem'}}>git --version</code></li>
              </ul>
            </li>
            <li><strong>Antes de ejecutar los scripts de despliegue:</strong>
              <ul>
                <li><strong>Abre el proyecto en VS Code.</strong></li>
                <li><strong>Verifica que las extensiones estén activas:</strong></li>
                <ul>
                  <li>Docker: <code style={{fontSize:'1.05rem'}}>code --list-extensions | Select-String ms-azuretools.vscode-docker</code></li>
                  <li>C#: <code style={{fontSize:'1.05rem'}}>code --list-extensions | Select-String ms-dotnettools.csharp</code></li>
                  <li>PowerShell: <code style={{fontSize:'1.05rem'}}>code --list-extensions | Select-String ms-vscode.powershell</code></li>
                  <li>GitHub PRs: <code style={{fontSize:'1.05rem'}}>code --list-extensions | Select-String GitHub.vscode-pull-request-github</code></li>
                </ul>
                <li>Abre una terminal integrada en VS Code (PowerShell o bash).</li>
                <li>Ejecuta el script correspondiente al ambiente deseado.</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>1. Requisitos Previos</h2>
        <div className="info-card">
          <ul>
            <li>Docker Desktop instalado (para ambientes con Docker)</li>
            <li>.NET SDK 9.0 instalado (para desarrollo local y pruebas)</li>
            <li>PowerShell (Windows) o terminal compatible</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>2. Clonar el Proyecto</h2>
        <div className="code-block">
          <h3>PowerShell</h3>
          <pre>{`git clone https://github.com/tu-usuario/ASISYA.git
cd ASISYA`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>3. Ambientes Disponibles</h2>

        <div className="feature-card">
          <h3>🖥️ Desarrollo Local (Sin Docker)</h3>
          <ul>
            <li>Base de datos y cache en memoria, inicio rápido.</li>
            <li><strong>Acceso:</strong> API: <code>https://localhost:5001</code>, Swagger: <code>https://localhost:5001/swagger</code>, Usuario: <code>admin</code> / Password: <code>admin123</code></li>
            <li><strong>Detención:</strong> Cierra la terminal o detén el proceso manualmente.</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-dev-no-docker.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🐳 Desarrollo con Docker</h3>
          <ul>
            <li>PostgreSQL y Redis en contenedores, persistencia de datos.</li>
            <li><strong>Acceso:</strong> API: <code>http://localhost:8080</code>, Swagger: <code>http://localhost:8080/swagger</code></li>
            <li><strong>Detención:</strong> <code>docker-compose down</code></li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-dev.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🧪 Pruebas</h3>
          <ul>
            <li>Ejecuta tests unitarios e integración, base de datos en memoria.</li>
            <li><strong>Detención:</strong> Cierra la terminal o detén el proceso manualmente.</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-test.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🚀 Producción</h3>
          <ul>
            <li>Despliegue productivo con Docker Compose, configuración segura.</li>
            <li><strong>Detención:</strong> <code>docker-compose -f docker-compose.prod.yml down</code></li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-prod.ps1`}</pre>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>4. Inicialización de Datos en Pruebas</h2>
        <div className="functionality-card">
          <ul>
            <li>Insertar 10 categorías y cargar 100,000 productos vía API usando <code>deploy-test.ps1</code>.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>5. CI/CD con GitHub Actions</h2>
        <div className="info-card">
          <ul>
            <li>Archivos de pipeline en <code>.github/workflows</code> ejecutan build, test y ejemplo de docker build.</li>
            <li>Verifica la ejecución automática desde la pestaña 'Actions' en GitHub.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>6. Archivos Clave</h2>
        <div className="functionality-card">
          <ul>
            <li><code>ASISYA_ev.Api/Dockerfile</code>: Construcción de la API en contenedor.</li>
            <li><code>ASISYA_ev.Infrastructure/docker-compose.yml</code>: Orquestación de servicios.</li>
            <li><code>deploy-*.ps1</code>: Scripts de despliegue para cada ambiente.</li>
            <li><code>.github/workflows/</code>: Pipelines CI/CD.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>7. Recursos y Documentación</h2>
        <div className="info-card">
          <ul>
            <li>Consulta <code>README.md</code>, <code>GUIA_DESPLIEGUE.md</code> y la SPA para documentación técnica y funcional.</li>
            <li>Accede a la documentación interactiva de la API en <a href="http://localhost:5195/swagger" target="_blank">Swagger</a>.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
