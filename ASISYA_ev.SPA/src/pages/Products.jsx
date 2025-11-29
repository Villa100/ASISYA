import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import productService from '../services/product'
import categoryService from '../services/category'

export default function Products() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const pageSize = 20

  useEffect(() => {
    loadProducts()
  }, [page])

  useEffect(() => {
    // Cargar categorías al montar
    categoryService.getAll().then(setCategories).catch(() => setCategories([]))
  }, [])

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.categoryID === id)
    return cat ? cat.categoryName : 'Sin categoría'
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll(page, pageSize)
      setData(res)
    } catch (error) {
      console.error('Error cargando productos:', error)
      alert('Error al cargar productos: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) {
      return
    }
    setDeleting(true)
    try {
      await productService.delete(id)
      alert('Producto eliminado correctamente')
      loadProducts() // Recargar lista
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
          <h2 style={{ marginBottom: '0.25rem' }}>📦 Catálogo de Productos</h2>
          <p style={{ marginBottom: 0, color: 'var(--gray)' }}>
            {data?.totalCount || 0} productos en total
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/products/new')}>
          ➕ Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>Cargando productos...</p>
        </div>
      ) : !data || !data.items || data.items.length === 0 ? (
        <div className="alert alert-info">
          ℹ️ No hay productos disponibles
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Producto</th>
                <th>ID Categoría</th>
                <th>Nombre Categoría</th>
                <th>Precio Unitario</th>
                <th>Stock</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.productID}>
                  <td><strong>#{p.productID}</strong></td>
                  <td>{p.productName}</td>
                  <td>{p.categoryID || '-'}</td>
                  <td><span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>{getCategoryName(p.categoryID)}</span></td>
                  <td><strong style={{ color: 'var(--secondary)' }}>${p.unitPrice?.toFixed(2)}</strong></td>
                  <td>
                    <span style={{
                      color: p.unitsInStock > 10 ? 'var(--secondary)' : 'var(--danger)',
                      fontWeight: '500'
                    }}>
                      {p.unitsInStock || 0} unidades
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem', marginRight: '0.25rem' }}
                      onClick={() => navigate(`/products/${p.productID}`)}
                      title="Ver detalle"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem', marginRight: '0.25rem' }}
                      onClick={() => navigate(`/products/edit/${p.productID}`)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem' }}
                      onClick={() => handleDelete(p.productID)}
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
          
          <div className="pagination">
            <button 
              className="btn-outline" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              ← Anterior
            </button>
            <span>Página <strong>{page}</strong> de <strong>{data.totalPages}</strong></span>
            <button 
              className="btn-outline" 
              disabled={!data.hasNextPage} 
              onClick={() => setPage(page + 1)}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
