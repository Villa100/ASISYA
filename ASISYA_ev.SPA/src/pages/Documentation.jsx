import React from 'react'

export default function Documentation() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="documentation-container" style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la documentación técnica del sistema.</p>
      </div>
    )
  }
  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>📚 Documentación del Sistema ASISYA</h1>
        <p className="subtitle">Sistema de Gestión de Productos y Categorías</p>
      </div>

      <div className="doc-section">
        <h2>🏗️ Arquitectura del Sistema</h2>
        <p>
          Sistema completo con API REST robusta, escalable y segura, más frontend SPA en React 
          para la gestión integral de productos y categorías, desarrollado bajo principios de 
          <strong> Arquitectura Limpia (Hexagonal)</strong> con .NET 9.0 y React 18.
        </p>
      </div>

      <div className="doc-section">
        <h2>✨ Características Principales</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔧 Backend API</h3>
            <ul>
              <li>✅ Arquitectura Limpia en 4 capas</li>
              <li>✅ CQRS + MediatR</li>
              <li>✅ DTOs para transferencia de datos</li>
              <li>✅ Bulk Insert optimizado (100k+ productos)</li>
              <li>✅ Paginación y filtros avanzados</li>
              <li>✅ PostgreSQL / InMemory Database</li>
              <li>✅ Redis / MemoryCache</li>
              <li>✅ Docker para contenedores</li>
              <li>✅ Swagger/OpenAPI</li>
              <li>✅ JWT Authentication</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>🖥️ Frontend SPA</h3>
            <ul>
              <li>✅ React 18 + Vite 5</li>
              <li>✅ React Router para navegación</li>
              <li>✅ CRUD Completo de Productos</li>
              <li>✅ CRUD Completo de Categorías</li>
              <li>✅ Autenticación JWT</li>
              <li>✅ Diseño Moderno y Responsive</li>
              <li>✅ Validaciones de formularios</li>
              <li>✅ Búsqueda en tiempo real</li>
              <li>✅ Paginación dinámica</li>
              <li>✅ Notificaciones de operaciones</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>🚀 Inicio Rápido</h2>
        <div className="code-block">
          <h3>PowerShell (Modo Desarrollo)</h3>
          <pre>
{`# Iniciar aplicación completa (API + Frontend)
.\\start-all.ps1

# Detener todos los servicios
.\\stop-all.ps1

# Cargar datos de prueba
.\\load-categories.ps1  # 10 categorías
.\\load-products.ps1    # 500 productos`}
          </pre>
        </div>

        <div className="info-card">
          <h4>📍 URLs de Acceso:</h4>
          <ul>
            <li><strong>API:</strong> <a href="http://localhost:5195" target="_blank">http://localhost:5195</a></li>
            <li><strong>Swagger:</strong> <a href="http://localhost:5195/swagger" target="_blank">http://localhost:5195/swagger</a></li>
            <li><strong>Frontend:</strong> <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></li>
          </ul>
        </div>

        <div className="info-card">
          <h4>🔐 Credenciales de Prueba:</h4>
          <ul>
            <li><strong>Usuario:</strong> admin</li>
            <li><strong>Contraseña:</strong> admin123</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📦 Funcionalidades del Sistema</h2>
        
        <div className="functionality-card">
          <h3>📦 Gestión de Productos</h3>
          <ul>
            <li>Ver listado completo de productos con paginación</li>
            <li>Búsqueda de productos por nombre</li>
            <li>Crear nuevos productos con validaciones</li>
            <li>Editar información de productos existentes</li>
            <li>Eliminar productos con confirmación</li>
            <li>Ver detalles completos (ID, nombre, categoría, precio, stock)</li>
            <li>Asociación automática con categorías</li>
          </ul>
        </div>

        <div className="functionality-card">
          <h3>🏷️ Gestión de Categorías</h3>
          <ul>
            <li>Listar todas las categorías del sistema</li>
            <li>Crear nuevas categorías (nombre máx. 15 caracteres)</li>
            <li>Editar categorías existentes</li>
            <li>Eliminar categorías con confirmación</li>
            <li>Ver descripción detallada de cada categoría</li>
          </ul>
        </div>

        <div className="functionality-card">
          <h3>🔐 Seguridad y Autenticación</h3>
          <ul>
            <li>Login seguro con JWT tokens</li>
            <li>Interceptor automático para peticiones autenticadas</li>
            <li>Gestión de sesión en localStorage</li>
            <li>Cierre de sesión con limpieza de tokens</li>
            <li>Rutas protegidas con validación de autenticación</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🛠️ Tecnologías Utilizadas</h2>
        
        <div className="tech-grid">
          <div className="tech-card">
            <h4>Backend</h4>
            <ul>
              <li>.NET 9.0</li>
              <li>C# 12.0</li>
              <li>Entity Framework Core 9.0</li>
              <li>PostgreSQL 15</li>
              <li>Redis</li>
              <li>MediatR 12.4.1</li>
              <li>Swagger/OpenAPI</li>
            </ul>
          </div>

          <div className="tech-card">
            <h4>Frontend</h4>
            <ul>
              <li>React 18</li>
              <li>Vite 5.4.21</li>
              <li>React Router</li>
              <li>Axios</li>
              <li>CSS3 (Variables CSS)</li>
              <li>JavaScript ES6+</li>
            </ul>
          </div>

          <div className="tech-card">
            <h4>DevOps</h4>
            <ul>
              <li>Docker & Docker Compose</li>
              <li>PowerShell Scripts</li>
              <li>Git</li>
              <li>Visual Studio Code</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>📂 Estructura del Proyecto</h2>
        <div className="code-block">
          <pre>
{`ASISYA/
├── ASISYA_ev.Api/              # API REST (.NET 9.0)
│   ├── Controllers/            # Controladores HTTP
│   ├── Program.cs              # Configuración principal
│   └── appsettings.json        # Configuración de la aplicación
│
├── ASISYA_ev.Application/      # Capa de aplicación (CQRS)
│   ├── Products/               # Comandos y consultas de productos
│   └── Categories/             # Comandos y consultas de categorías
│
├── ASISYA_ev.Domain/           # Capa de dominio
│   ├── Entidades/              # Entidades del dominio
│   ├── Interfaces/             # Interfaces (Ports)
│   └── DTOs/                   # Data Transfer Objects
│
├── ASISYA_ev.Infrastructure/   # Capa de infraestructura
│   ├── Data/                   # DbContext y configuración
│   └── docker-compose.yml      # Contenedores Docker
│
└── ASISYA_ev.SPA/              # Frontend React
    ├── src/
    │   ├── pages/              # Componentes de páginas
    │   ├── services/           # Servicios API
    │   └── App.jsx             # Componente principal
    └── package.json            # Dependencias NPM`}
          </pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>🎯 Principios de Arquitectura</h2>
        <div className="architecture-info">
          <p>El sistema implementa <strong>Arquitectura Hexagonal (Ports & Adapters)</strong> combinada con:</p>
          <ul>
            <li><strong>DDD (Domain-Driven Design):</strong> El dominio es el centro del sistema</li>
            <li><strong>CQRS (Command Query Responsibility Segregation):</strong> Separación de lecturas y escrituras</li>
            <li><strong>Clean Architecture:</strong> Dependencias apuntando hacia el dominio</li>
            <li><strong>Dependency Injection:</strong> Inversión de control para flexibilidad</li>
            <li><strong>Repository Pattern:</strong> Abstracción del acceso a datos</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📈 Performance y Escalabilidad</h2>
        <div className="performance-info">
          <ul>
            <li><strong>Bulk Insert:</strong> Carga optimizada de hasta 100,000+ productos</li>
            <li><strong>Caché Distribuida:</strong> Redis para reducir carga en base de datos</li>
            <li><strong>Paginación:</strong> Respuestas optimizadas con control de tamaño</li>
            <li><strong>Async/Await:</strong> Operaciones asíncronas para mejor rendimiento</li>
            <li><strong>DTOs:</strong> Transferencia optimizada de datos</li>
            <li><strong>Índices en BD:</strong> Consultas rápidas en PostgreSQL</li>
          </ul>
        </div>
      </div>

      <div className="doc-footer">
        <p>
          Para más información detallada, consulte los archivos README.md en cada carpeta del proyecto 
          o visite la documentación de la API en <a href="http://localhost:5195/swagger" target="_blank">Swagger</a>.
        </p>
        <p className="version-info">
          <strong>Versión:</strong> 1.0.0 | <strong>Fecha:</strong> Noviembre 2025
        </p>
      </div>
    </div>
  )
}
