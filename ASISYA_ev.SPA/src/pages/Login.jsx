import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</h1>
          <h2>Iniciar Sesión</h2>
          <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>Accede al sistema ASISYA</p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>👤 Usuario</label>
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>🔑 Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Ingresando...' : '✓ Entrar'}
          </button>
          
          {error && (
            <div className="alert alert-error mt-3">
              ❌ {error}
            </div>
          )}
        </form>
        
        <div className="card-footer mt-4" style={{ background: 'var(--gray-light)', margin: '1.5rem -2rem -2rem', padding: '1rem 2rem', borderRadius: '0 0 12px 12px' }}>
          <p style={{ fontSize: '0.875rem', textAlign: 'center', marginBottom: 0 }}>
            💡 <strong>Credenciales de prueba:</strong><br/>
            Usuario: admin | Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  )
}
