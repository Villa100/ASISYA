import React, { useMemo, useState } from 'react'
import { whoAmI } from '../services/auth'

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.')
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export default function AuthTest() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')
  const payload = useMemo(() => (token ? decodeJwt(token) : null), [token])

  const checkMe = async () => {
    setError('')
    setMe(null)
    try {
      const res = await whoAmI()
      setMe(res)
    } catch (e) {
      setError(e?.response?.status ? `HTTP ${e.response.status}` : e.message || 'Error desconocido')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Prueba de Autenticación</h2>
        <p style={{ color: 'var(--gray)' }}>Verifica token y endpoint protegido</p>
      </div>

      {!token ? (
        <div className="alert alert-warning">No hay token en localStorage. Inicia sesión primero.</div>
      ) : (
        <>
          <div className="mb-3">
            <label>Token (abreviado)</label>
            <div style={{
              background: 'var(--gray-light)', padding: '0.75rem', borderRadius: '8px',
              fontFamily: 'monospace', overflowX: 'auto'
            }}>
              {token.slice(0, 24)}...{token.slice(-12)}
            </div>
          </div>

          <div className="mb-3">
            <label>Payload decodificado</label>
            <pre style={{ background: 'var(--gray-light)', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
              {payload ? JSON.stringify(payload, null, 2) : 'No se pudo decodificar el token'}
            </pre>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={checkMe}>Probar /api/Auth/me</button>
            <button className="btn-outline" onClick={() => { localStorage.removeItem('token'); window.location.reload() }}>Cerrar sesión (borrar token)</button>
          </div>

          {me && (
            <div className="alert alert-success mt-3">
              ✅ Autenticado como <strong>{me.user}</strong> (roles: {me.roles?.join(', ') || 'n/a'})
            </div>
          )}
          {error && (
            <div className="alert alert-error mt-3">
              ❌ Error: {error}
            </div>
          )}
        </>
      )}
    </div>
  )
}
