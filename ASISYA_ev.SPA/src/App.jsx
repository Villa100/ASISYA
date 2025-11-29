import React from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import CategoryForm from './pages/CategoryForm'
import AuthTest from './pages/AuthTest'
import Documentation from './pages/Documentation'
import DeployEnvironments from './pages/DeployEnvironments'
import DeployGuide from './pages/DeployGuide'
import ApiTests from './pages/ApiTests'
import Containers from './pages/Containers'
import UnitTestsGuide from './pages/UnitTestsGuide'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function handleLogout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export default function App() {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const environment = import.meta.env.VITE_ENVIRONMENT || 'DESARROLLO'
  
  // Determinar color y emoji según ambiente
  const getEnvBadge = () => {
    switch(environment) {
      case 'PRODUCCION':
      case 'PRODUCTION':
        return { emoji: '🔴', label: 'PRODUCCIÓN', color: '#dc2626' }
      case 'PRUEBAS':
      case 'TEST':
        return { emoji: '🟡', label: 'PRUEBAS', color: '#f59e0b' }
      default:
        return { emoji: '🟢', label: 'DESARROLLO', color: '#10b981' }
    }
  }
  
  const envBadge = getEnvBadge()
  
  return (
    <div className="container">
      {location.pathname !== '/login' && (
        <>
          <div className="environment-badge" style={{
            background: envBadge.color,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0 0 8px 8px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {envBadge.emoji} Ambiente: {envBadge.label}
          </div>
          <nav style={{ marginTop: '3rem' }}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            📦 Productos
          </Link>
          <Link to="/categories" className={location.pathname.startsWith('/categories') ? 'active' : ''}>
            🏷️ Categorías
          </Link>
          {(() => {
            const isDocsActive = ['/documentation','/containers'].includes(location.pathname)
            return (
              <div className={`menu-group ${isDocsActive ? 'active' : ''}`}>
                <span className="menu-button">📚 Documentación ▾</span>
                <div className="menu-dropdown">
                  <Link to="/documentation" className={location.pathname === '/documentation' ? 'active' : ''}>Documentación</Link>
                  <Link to="/containers" className={location.pathname === '/containers' ? 'active' : ''}>Contenedores</Link>
                </div>
              </div>
            )
          })()}
          {(() => {
            const isDeployActive = ['/deploy-environments','/deploy-guide'].includes(location.pathname)
            return (
              <div className={`menu-group ${isDeployActive ? 'active' : ''}`}>
                <span className="menu-button">🚀 Despliegue ▾</span>
                <div className="menu-dropdown">
                  <Link to="/deploy-environments" className={location.pathname === '/deploy-environments' ? 'active' : ''}>Despliegue y Ambientes</Link>
                  <Link to="/deploy-guide" className={location.pathname === '/deploy-guide' ? 'active' : ''}>Guía de Despliegue</Link>
                </div>
              </div>
            )
          })()}
          {(() => {
            const isTestsActive = ['/api-tests','/auth-test','/unit-tests-guide'].includes(location.pathname)
            return (
              <div className={`menu-group ${isTestsActive ? 'active' : ''}`}>
                <span className="menu-button">🧪 Pruebas ▾</span>
                <div className="menu-dropdown">
                  <Link to="/api-tests" className={location.pathname === '/api-tests' ? 'active' : ''}>Pruebas API</Link>
                  <Link to="/auth-test" className={location.pathname === '/auth-test' ? 'active' : ''}>Autenticación Test</Link>
                  <Link to="/unit-tests-guide" className={location.pathname === '/unit-tests-guide' ? 'active' : ''}>Pruebas Unitarias</Link>
                </div>
              </div>
            )
          })()}
          {token && (
            <button onClick={handleLogout} className="btn-ghost" style={{marginLeft: 'auto'}}>
              🚪 Cerrar Sesión
            </button>
          )}
          </nav>
        </>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
        <Route path="/categories/new" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
        <Route path="/categories/edit/:id" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
        <Route path="/documentation" element={<PrivateRoute><Documentation /></PrivateRoute>} />
        <Route path="/containers" element={<PrivateRoute><Containers /></PrivateRoute>} />
        <Route path="/api-tests" element={<PrivateRoute><ApiTests /></PrivateRoute>} />
        <Route path="/auth-test" element={<PrivateRoute><AuthTest /></PrivateRoute>} />
        <Route path="/deploy-environments" element={<PrivateRoute><DeployEnvironments /></PrivateRoute>} />
        <Route path="/deploy-guide" element={<PrivateRoute><DeployGuide /></PrivateRoute>} />
        <Route path="/unit-tests-guide" element={<PrivateRoute><UnitTestsGuide /></PrivateRoute>} />
      </Routes>
    </div>
  )
}
