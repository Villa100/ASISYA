import React from 'react'

export default function DeployEnvironments() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="documentation-container" style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la guía de despliegue y ambientes.</p>
      </div>
    )
  }

  const environment = import.meta.env.VITE_ENVIRONMENT || 'DESARROLLO'
  const envDetails = {
    'DESARROLLO': {
      label: 'Desarrollo Local',
      color: '#10b981',
      description: 'Ambiente rápido sin Docker, usando base de datos y cache en memoria. Ideal para desarrollo y pruebas rápidas.'
    },
    'DOCKER': {
      label: 'Desarrollo con Docker',
      color: '#3b82f6',
      description: 'Ambiente de desarrollo completo con PostgreSQL y Redis en contenedores Docker. Similar a producción.'
    },
    'PRUEBAS': {
      label: 'Pruebas',
      color: '#f59e0b',
      description: 'Ejecución de tests unitarios e integración, usando base de datos en memoria.'
    },
    'PRODUCCION': {
      label: 'Producción',
      color: '#dc2626',
      description: 'Despliegue productivo con Docker Compose, configuración segura y persistencia de datos.'
    }
  }
  const env = envDetails[environment.toUpperCase()] || envDetails['DESARROLLO']

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>🚀 Despliegue y Ambientes</h1>
        <p className="subtitle">Guía visual y unificada para ejecutar ASISYA en todos los entornos</p>
      </div>

      <div className="doc-section">
        <h2>📍 Ambiente actual</h2>
        <div className="info-card" style={{background: `linear-gradient(135deg, ${env.color} 0%, ${env.color} 100%)`}}>
          <h4>Estado</h4>
          <ul>
            <li><strong>Ambiente:</strong> {env.label}</li>
            <li><strong>Descripción:</strong> {env.description}</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📋 Instrucciones de Despliegue</h2>
        <div className="feature-card">
          <h3>🖥️ Desarrollo Local (Sin Docker)</h3>
          <ul>
            <li>Base de datos y cache en memoria</li>
            <li>Usuario: <code>admin</code> / Password: <code>admin123</code></li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-dev-no-docker.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🐳 Desarrollo con Docker</h3>
          <ul>
            <li>PostgreSQL y Redis en contenedores</li>
            <li>Requiere Docker Desktop y WSL2</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-dev.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🧪 Pruebas</h3>
          <ul>
            <li>Ejecuta tests unitarios e integración</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-test.ps1`}</pre>
          </div>
        </div>

        <div className="feature-card">
          <h3>🚀 Producción</h3>
          <ul>
            <li>Despliegue productivo con Docker Compose</li>
            <li>Variables de entorno para credenciales y secretos</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`./deploy-prod.ps1`}</pre>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>📁 Archivos de Configuración</h2>
        <div className="functionality-card">
          <ul>
            <li><strong>Desarrollo Local:</strong> <code>appsettings.Development.json</code></li>
            <li><strong>Docker:</strong> <code>docker-compose.yml</code></li>
            <li><strong>Producción:</strong> <code>docker-compose.prod.yml</code>, <code>appsettings.json</code></li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🔐 Variables de Entorno</h2>
        <div className="code-block">
          <h3>Desarrollo Local</h3>
          <pre>{`$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:UseInMemoryForTests = "true"
$env:ForceInMemory = "true"`}</pre>
        </div>
        <div className="code-block">
          <h3>Producción</h3>
          <pre>{`ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=db;...
CacheSettings__RedisHost=cache:6379
Jwt__SecretKey=<tu-secret-key-seguro>`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>🎯 Flujo de Trabajo Recomendado</h2>
        <div className="functionality-card">
          <ol>
            <li>Desarrollo rápido: <code>deploy-dev-no-docker.ps1</code></li>
            <li>Verificar tests: <code>deploy-test.ps1</code></li>
            <li>Prueba completa: <code>deploy-dev.ps1</code></li>
            <li>Despliegue productivo: <code>deploy-prod.ps1</code></li>
          </ol>
        </div>
      </div>

      <div className="doc-section">
        <h2>📝 Notas Importantes</h2>
        <div className="functionality-card">
          <ul>
            <li>El desarrollo local usa InMemory, los datos se pierden al cerrar la app.</li>
            <li>Para persistencia, usa Docker.</li>
            <li>La configuración de producción usa variables de entorno para credenciales.</li>
            <li><strong>Por las características de algunos equipos de desarrollo con insuficientes recursos, no se puede desplegar ambientes con contenedores Docker. En estos casos, se recomienda usar el modo local InMemory.</strong></li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📚 Más Información</h2>
        <div className="info-card">
          <ul>
            <li>Ver <code>README.md</code> y <code>IMPLEMENTACION_RESUMEN.md</code></li>
            <li>Guía completa en <code>GUIA_DESPLIEGUE.md</code></li>
            <li>Documentación de API en <a href="http://localhost:5195/swagger" target="_blank">Swagger</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
