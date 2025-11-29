import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import categoryService from '../services/category'

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Error cargando categorías:', error)
      alert('Error al cargar categorías: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta categoría?')) {
      return
    }
    
    setDeleting(true)
    try {
      await categoryService.delete(id)
      alert('Categoría eliminada correctamente')
      loadCategories()
    } catch (error) {
      alert('Error al eliminar: ' + (error.response?.data?.message || error.message))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>🏷️ Categorías</h2>
          <p style={{ marginBottom: 0, color: 'var(--gray)' }}>
            {categories.length} categorías en total
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/categories/new')}>
          ➕ Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>Cargando categorías...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="alert alert-info">
          ℹ️ No hay categorías disponibles
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.categoryID}>
                <td><strong>#{c.categoryID}</strong></td>
                <td>
                  <span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}>
                    {c.categoryName}
                  </span>
                </td>
                <td style={{ color: 'var(--gray)' }}>{c.description || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="btn-ghost" 
                    style={{ padding: '0.5rem', marginRight: '0.25rem' }}
                    onClick={() => navigate(`/categories/edit/${c.categoryID}`)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-ghost" 
                    style={{ padding: '0.5rem' }}
                    onClick={() => handleDelete(c.categoryID)}
                    disabled={deleting}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
