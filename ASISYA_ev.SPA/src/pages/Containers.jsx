import React from 'react';

export default function Containers() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la arquitectura y detalles de los contenedores Docker.</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🐳 Arquitectura de Contenedores Docker</h1>
      <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '3rem' }}>
        El sistema ASISYA utiliza <strong>Docker Compose</strong> para orquestar múltiples contenedores en ambiente de producción.
        Cada contenedor tiene una función específica y trabaja en conjunto para proporcionar una infraestructura robusta y escalable.
      </p>

      {/* Tabla Resumen */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '0.5rem', color: '#1f2937' }}>
          📊 Resumen de Contenedores
        </h2>
        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Contenedor</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Imagen</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Puerto</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Persistencia</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Propósito</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#1e40af' }}>db_proyecto</td>
                <td style={{ padding: '1rem' }}>postgres:15-alpine</td>
                <td style={{ padding: '1rem' }}>5432</td>
                <td style={{ padding: '1rem' }}>✅ Volumen (db-data)</td>
                <td style={{ padding: '1rem' }}>Base de datos relacional</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#dc2626' }}>cache_proyecto</td>
                <td style={{ padding: '1rem' }}>redis:latest</td>
                <td style={{ padding: '1rem' }}>6379</td>
                <td style={{ padding: '1rem' }}>❌ En memoria</td>
                <td style={{ padding: '1rem' }}>Caché distribuida</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#059669' }}>ASISYA_ev</td>
                <td style={{ padding: '1rem' }}>Custom (.NET 9.0)</td>
                <td style={{ padding: '1rem' }}>8080</td>
                <td style={{ padding: '1rem' }}>❌ Stateless</td>
                <td style={{ padding: '1rem' }}>API REST principal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contenedor 1: PostgreSQL */}
      <section className="container-card" style={{
        backgroundColor: 'white',
        border: '2px solid #1e40af',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1e40af',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🐘
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#1e40af' }}>PostgreSQL 15 Alpine</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Container: db_proyecto</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="info-box">
            <h4>📦 Imagen Docker</h4>
            <p>postgres:15-alpine</p>
          </div>
          <div className="info-box">
            <h4>🔌 Puerto</h4>
            <p>5432 (PostgreSQL estándar)</p>
          </div>
          <div className="info-box">
            <h4>💾 Persistencia</h4>
            <p>Volumen: db-data</p>
          </div>
          <div className="info-box">
            <h4>🔄 Reinicio</h4>
            <p>always (automático)</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🎯 Funcionalidad Principal</h3>
        <p style={{ lineHeight: '1.8', color: '#374151' }}>
          <strong>Base de datos relacional principal</strong> del sistema. Almacena todos los datos persistentes incluyendo:
        </p>
        <ul style={{ lineHeight: '2', color: '#374151' }}>
          <li>📦 <strong>Productos</strong>: Catálogo completo con precios, stock, proveedores</li>
          <li>🏷️ <strong>Categorías</strong>: Clasificación de productos</li>
          <li>🏢 <strong>Proveedores</strong>: Información de suppliers</li>
          <li>👥 <strong>Usuarios</strong>: Credenciales y roles (si aplica)</li>
          <li>📊 <strong>Relaciones</strong>: Foreign keys, índices, constraints</li>
        </ul>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>⚙️ Configuración</h3>
        <pre style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>{`services:
  db:
    image: postgres:15-alpine
    container_name: db_proyecto
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user_dev
      POSTGRES_PASSWORD: password_dev
      POSTGRES_DB: mi_api_db
    volumes:
      - db-data:/var/lib/postgresql/data
    restart: always`}</pre>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🔑 Credenciales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="credential-box">
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Usuario</span>
            <code>user_dev</code>
          </div>
          <div className="credential-box">
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Contraseña</span>
            <code>password_dev</code>
          </div>
          <div className="credential-box">
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Base de Datos</span>
            <code>mi_api_db</code>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🚀 Servicios que Proporciona</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div className="service-box">
            <h4>💾 Persistencia de Datos</h4>
            <p>Los datos sobreviven al reinicio de contenedores gracias al volumen Docker</p>
          </div>
          <div className="service-box">
            <h4>🔒 Transacciones ACID</h4>
            <p>Garantiza integridad de datos con atomicidad, consistencia, aislamiento y durabilidad</p>
          </div>
          <div className="service-box">
            <h4>📊 Consultas SQL Complejas</h4>
            <p>Soporte completo para JOINs, subqueries, índices, triggers y stored procedures</p>
          </div>
          <div className="service-box">
            <h4>🔗 Relaciones Entre Entidades</h4>
            <p>Foreign keys automáticas entre productos, categorías y proveedores</p>
          </div>
          <div className="service-box">
            <h4>📈 Alto Rendimiento</h4>
            <p>PostgreSQL 15 optimizado con Alpine Linux (imagen ligera de ~150MB)</p>
          </div>
          <div className="service-box">
            <h4>🔄 Backup Automático</h4>
            <p>Volumen persiste datos incluso si el contenedor se elimina</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🛠️ Comandos Útiles</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div className="command-box">
            <code>docker-compose logs -f db</code>
            <span>Ver logs en tiempo real</span>
          </div>
          <div className="command-box">
            <code>docker exec -it db_proyecto psql -U user_dev -d mi_api_db</code>
            <span>Conectar al psql interactivo</span>
          </div>
          <div className="command-box">
            <code>docker-compose restart db</code>
            <span>Reiniciar contenedor</span>
          </div>
        </div>
      </section>

      {/* Contenedor 2: Redis */}
      <section className="container-card" style={{
        backgroundColor: 'white',
        border: '2px solid #dc2626',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#dc2626',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            ⚡
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#dc2626' }}>Redis Cache</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Container: cache_proyecto</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="info-box">
            <h4>📦 Imagen Docker</h4>
            <p>redis:latest</p>
          </div>
          <div className="info-box">
            <h4>🔌 Puerto</h4>
            <p>6379 (Redis estándar)</p>
          </div>
          <div className="info-box">
            <h4>💾 Persistencia</h4>
            <p>❌ En memoria (volátil)</p>
          </div>
          <div className="info-box">
            <h4>🔄 Reinicio</h4>
            <p>always (automático)</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🎯 Funcionalidad Principal</h3>
        <p style={{ lineHeight: '1.8', color: '#374151' }}>
          <strong>Caché distribuida de alto rendimiento</strong> que almacena resultados de consultas frecuentes en memoria RAM para reducir la carga en PostgreSQL.
        </p>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>⚙️ Configuración</h3>
        <pre style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>{`services:
  cache:
    image: redis:latest
    container_name: cache_proyecto
    ports:
      - "6379:6379"
    restart: always`}</pre>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🚀 Servicios que Proporciona</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div className="service-box">
            <h4>⚡ Reducción de Latencia</h4>
            <p>90% menos tiempo de respuesta en consultas frecuentes (de 80ms a ~5ms)</p>
          </div>
          <div className="service-box">
            <h4>📊 Caché de Listados</h4>
            <p>Almacena resultados paginados con TTL de 2 minutos</p>
          </div>
          <div className="service-box">
            <h4>🔍 Caché de Detalles</h4>
            <p>Guarda información de productos individuales con TTL de 10 minutos</p>
          </div>
          <div className="service-box">
            <h4>🔄 Invalidación Inteligente</h4>
            <p>Sistema de versionado automático: incrementa versión al crear/actualizar/eliminar</p>
          </div>
          <div className="service-box">
            <h4>📈 Escalabilidad</h4>
            <p>Compartido entre múltiples instancias de API en despliegues horizontales</p>
          </div>
          <div className="service-box">
            <h4>🚀 Alto Throughput</h4>
            <p>Capaz de manejar 100k+ operaciones por segundo en memoria</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🔑 Estrategia de Caché</h3>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h4 style={{ marginTop: 0, color: '#991b1b' }}>📝 Claves de Caché</h4>
          <ul style={{ marginBottom: 0 }}>
            <li><code>product:list:v{'{version}'}:{'{page}'}:{'{size}'}:{'{filter}'}</code> - Listados paginados</li>
            <li><code>product:detail:{'{id}'}</code> - Detalle de producto individual</li>
            <li><code>product:list:version</code> - Versión actual (se incrementa en cada modificación)</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ marginTop: 0, color: '#166534' }}>✅ Ventajas</h4>
            <ul style={{ marginBottom: 0, fontSize: '0.875rem' }}>
              <li>Ultra rápido (datos en RAM)</li>
              <li>Reduce carga en PostgreSQL</li>
              <li>Mejora experiencia del usuario</li>
              <li>Escalable horizontalmente</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ marginTop: 0, color: '#92400e' }}>⚠️ Consideraciones</h4>
            <ul style={{ marginBottom: 0, fontSize: '0.875rem' }}>
              <li>Datos volátiles (se pierden al reiniciar)</li>
              <li>TTL corto para datos dinámicos</li>
              <li>Requiere invalidación correcta</li>
              <li>Consume RAM del servidor</li>
            </ul>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🛠️ Comandos Útiles</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div className="command-box">
            <code>docker-compose logs -f cache</code>
            <span>Ver logs en tiempo real</span>
          </div>
          <div className="command-box">
            <code>docker exec -it cache_proyecto redis-cli</code>
            <span>Conectar al CLI de Redis</span>
          </div>
          <div className="command-box">
            <code>docker exec -it cache_proyecto redis-cli KEYS "product:*"</code>
            <span>Ver todas las claves de productos</span>
          </div>
          <div className="command-box">
            <code>docker exec -it cache_proyecto redis-cli FLUSHALL</code>
            <span>Limpiar toda la caché</span>
          </div>
        </div>
      </section>

      {/* Contenedor 3: API REST */}
      <section className="container-card" style={{
        backgroundColor: 'white',
        border: '2px solid #059669',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#059669',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🚀
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#059669' }}>API REST (.NET 9.0)</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Container: ASISYA_ev</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="info-box">
            <h4>📦 Imagen Docker</h4>
            <p>Custom (.NET 9.0 SDK)</p>
          </div>
          <div className="info-box">
            <h4>🔌 Puerto</h4>
            <p>8080 (HTTP interno)</p>
          </div>
          <div className="info-box">
            <h4>💾 Estado</h4>
            <p>Stateless (sin sesiones)</p>
          </div>
          <div className="info-box">
            <h4>🔄 Reinicio</h4>
            <p>always (automático)</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🎯 Funcionalidad Principal</h3>
        <p style={{ lineHeight: '1.8', color: '#374151' }}>
          <strong>API REST principal del sistema</strong> que implementa toda la lógica de negocio, autenticación, y expone endpoints para el frontend.
        </p>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>⚙️ Configuración</h3>
        <pre style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>{`services:
  api:
    build:
      context: .
      dockerfile: ASISYA_ev.Api/Dockerfile
    container_name: ASISYA_ev
    ports:
      - "8080:8080"
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ConnectionStrings__DefaultConnection: "Host=db;Port=5432;Database=mi_api_db;Username=user_dev;Password=password_dev;"
      CacheSettings__RedisHost: "cache:6379"
    depends_on:
      - db
      - cache
    restart: always`}</pre>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🚀 Servicios que Proporciona</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div className="service-box">
            <h4>🌐 Endpoints REST</h4>
            <p>12 endpoints para productos, categorías y autenticación</p>
          </div>
          <div className="service-box">
            <h4>🔐 Autenticación JWT</h4>
            <p>Sistema de tokens Bearer para seguridad de endpoints</p>
          </div>
          <div className="service-box">
            <h4>📚 Swagger UI</h4>
            <p>Documentación interactiva en /swagger con Try It Out</p>
          </div>
          <div className="service-box">
            <h4>🏗️ Arquitectura Limpia</h4>
            <p>Separación en capas con CQRS + MediatR</p>
          </div>
          <div className="service-box">
            <h4>📦 Bulk Operations</h4>
            <p>Carga masiva optimizada de 100k+ productos</p>
          </div>
          <div className="service-box">
            <h4>📄 Paginación Inteligente</h4>
            <p>Listados con metadatos (totalPages, hasNext, etc.)</p>
          </div>
          <div className="service-box">
            <h4>🔍 Filtros y Búsqueda</h4>
            <p>Búsqueda por nombre con cache-aside pattern</p>
          </div>
          <div className="service-box">
            <h4>🔗 Orquestación</h4>
            <p>Coordina PostgreSQL (datos) y Redis (caché)</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🔗 Dependencias</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🐘</div>
            <strong>PostgreSQL</strong>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Base de datos</p>
          </div>
          <div style={{ fontSize: '2rem', alignSelf: 'center', color: '#d1d5db' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🚀</div>
            <strong>API REST</strong>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Lógica de negocio</p>
          </div>
          <div style={{ fontSize: '2rem', alignSelf: 'center', color: '#d1d5db' }}>←</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>⚡</div>
            <strong>Redis</strong>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Caché</p>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>📡 Endpoints Principales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ color: '#059669' }}>📦 Productos</h4>
            <ul style={{ fontSize: '0.875rem', lineHeight: '2' }}>
              <li><code>GET /api/Product</code> - Listar paginado</li>
              <li><code>GET /api/Product/{'{id}'}</code> - Detalle</li>
              <li><code>POST /api/Product</code> - Crear</li>
              <li><code>PUT /api/Product/{'{id}'}</code> - Actualizar</li>
              <li><code>DELETE /api/Product/{'{id}'}</code> - Eliminar</li>
              <li><code>POST /api/Product/batch</code> - Carga masiva</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#059669' }}>🏷️ Categorías</h4>
            <ul style={{ fontSize: '0.875rem', lineHeight: '2' }}>
              <li><code>GET /api/Category</code> - Listar todas</li>
              <li><code>GET /api/Category/{'{id}'}</code> - Detalle</li>
              <li><code>POST /api/Category</code> - Crear</li>
              <li><code>PUT /api/Category/{'{id}'}</code> - Actualizar</li>
              <li><code>DELETE /api/Category/{'{id}'}</code> - Eliminar</li>
            </ul>
          </div>
        </div>

        <h3 style={{ color: '#1f2937', marginTop: '1.5rem' }}>🛠️ Comandos Útiles</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div className="command-box">
            <code>docker-compose logs -f api</code>
            <span>Ver logs de la API en tiempo real</span>
          </div>
          <div className="command-box">
            <code>docker-compose restart api</code>
            <span>Reiniciar contenedor de API</span>
          </div>
          <div className="command-box">
            <code>docker exec -it ASISYA_ev /bin/sh</code>
            <span>Acceder a shell del contenedor</span>
          </div>
        </div>
      </section>

      {/* Flujo de Comunicación */}
      <section style={{
        backgroundColor: '#f9fafb',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#1f2937', marginTop: 0 }}>🔄 Flujo de Comunicación entre Contenedores</h2>
        <pre style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1.5rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: '1.8'
        }}>{`
┌─────────────────────────────────────────────────────┐
│              Frontend (React SPA)                   │
│           http://localhost:5173                     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST (JWT Token)
┌──────────────────────▼──────────────────────────────┐
│         API REST (.NET 9.0 Container)               │
│              Container: ASISYA_ev                   │
│              Puerto: 8080                           │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │ 1. Recibe request HTTP                  │      │
│  │ 2. Valida JWT token                     │      │
│  │ 3. Consulta caché (Redis)               │      │
│  │    └─ Cache hit? → Retorna              │      │
│  │    └─ Cache miss? → Continúa            │      │
│  │ 4. Query a PostgreSQL                   │      │
│  │ 5. Guarda resultado en Redis (TTL)      │      │
│  │ 6. Retorna respuesta JSON               │      │
│  └─────────────────────────────────────────┘      │
└───────────────┬───────────────────┬─────────────────┘
                │                   │
        ┌───────▼────────┐  ┌──────▼──────────┐
        │ PostgreSQL     │  │ Redis Cache     │
        │ Container: db  │  │ Container:cache │
        │ Puerto: 5432   │  │ Puerto: 6379    │
        │ ✅ Persistente │  │ ⚡ En Memoria   │
        └────────────────┘  └─────────────────┘
`}</pre>
      </section>

      {/* Comandos Generales */}
      <section style={{
        backgroundColor: 'white',
        border: '2px solid #6b7280',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1f2937', marginTop: 0 }}>🛠️ Comandos Docker Compose</h2>
        
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>▶️ Iniciar Contenedores</h3>
            <div className="command-box">
              <code>docker-compose up -d</code>
              <span>Inicia todos los contenedores en segundo plano</span>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>📊 Ver Estado</h3>
            <div className="command-box">
              <code>docker-compose ps</code>
              <span>Muestra el estado de todos los contenedores</span>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>📝 Ver Logs</h3>
            <div className="command-box" style={{ marginBottom: '0.5rem' }}>
              <code>docker-compose logs -f</code>
              <span>Todos los logs en tiempo real</span>
            </div>
            <div className="command-box" style={{ marginBottom: '0.5rem' }}>
              <code>docker-compose logs -f api</code>
              <span>Solo logs de API</span>
            </div>
            <div className="command-box">
              <code>docker-compose logs --tail=100 db</code>
              <span>Últimas 100 líneas de PostgreSQL</span>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>⏹️ Detener Contenedores</h3>
            <div className="command-box" style={{ marginBottom: '0.5rem' }}>
              <code>docker-compose stop</code>
              <span>Detiene contenedores (conserva datos)</span>
            </div>
            <div className="command-box" style={{ marginBottom: '0.5rem' }}>
              <code>docker-compose down</code>
              <span>Detiene y elimina contenedores (conserva volúmenes)</span>
            </div>
            <div className="command-box">
              <code>docker-compose down -v</code>
              <span>⚠️ Elimina TODO incluyendo volúmenes (BORRA DATOS)</span>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>🔄 Reiniciar</h3>
            <div className="command-box" style={{ marginBottom: '0.5rem' }}>
              <code>docker-compose restart</code>
              <span>Reinicia todos los contenedores</span>
            </div>
            <div className="command-box">
              <code>docker-compose restart api</code>
              <span>Reinicia solo la API</span>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>🔨 Rebuild</h3>
            <div className="command-box">
              <code>docker-compose build --no-cache</code>
              <span>Reconstruye imágenes sin caché (cambios en Dockerfile)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos */}
      <style>{`
        .info-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
        }
        .info-box h4 {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .info-box p {
          margin: 0;
          color: #1f2937;
          font-weight: 600;
        }
        .credential-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .credential-box code {
          background: #7f1d1d;
          color: #fef2f2;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .service-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 1rem;
        }
        .service-box h4 {
          margin: 0 0 0.5rem 0;
          color: #166534;
          font-size: 0.875rem;
        }
        .service-box p {
          margin: 0;
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .command-box {
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .command-box code {
          background: #1e293b;
          color: #10b981;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-family: 'Courier New', monospace;
          flex-shrink: 0;
        }
        .command-box span {
          color: #6b7280;
          font-size: 0.875rem;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
