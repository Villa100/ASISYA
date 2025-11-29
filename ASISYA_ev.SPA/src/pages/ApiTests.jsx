import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5195';

export default function ApiTests() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para formularios
  const [loginData, setLoginData] = useState({ username: 'admin', password: 'admin123' });
  const [productData, setProductData] = useState({
    productName: 'Producto de Prueba',
    categoryID: 1,
    unitPrice: 99.99,
    unitsInStock: 10
  });
  const [categoryData, setCategoryData] = useState({
    name: 'CATEGORIA TEST',
    description: 'Categoría de prueba'
  });
  const [productId, setProductId] = useState('1');
  const [categoryId, setCategoryId] = useState('1');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, filter: '' });

  const executeRequest = async (method, url, data = null, useAuth = true) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (useAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        method,
        url: `${API_BASE}${url}`,
        headers
      };

      if (data) {
        config.data = data;
      }

      const res = await axios(config);
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        headers: res.headers
      });
    } catch (err) {
      setError({
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  // Handlers para cada endpoint
  const handleLogin = () => {
    executeRequest('POST', '/api/Auth/login', loginData, false);
  };

  const handleGetProducts = () => {
    const params = new URLSearchParams();
    if (pagination.page) params.append('page', pagination.page);
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize);
    if (pagination.filter) params.append('filter', pagination.filter);
    executeRequest('GET', `/api/Product?${params.toString()}`);
  };

  const handleGetProductDetail = () => {
    executeRequest('GET', `/api/Product/${productId}`);
  };

  const handleCreateProduct = () => {
    executeRequest('POST', '/api/Product', productData);
  };

  const handleUpdateProduct = () => {
    executeRequest('PUT', `/api/Product/${productId}`, { ...productData, productID: parseInt(productId) });
  };

  const handleDeleteProduct = () => {
    if (confirm(`¿Eliminar producto ${productId}?`)) {
      executeRequest('DELETE', `/api/Product/${productId}`);
    }
  };

  const handleGetCategories = () => {
    executeRequest('GET', '/api/Category');
  };

  const handleGetCategoryDetail = () => {
    executeRequest('GET', `/api/Category/${categoryId}`);
  };

  const handleCreateCategory = () => {
    executeRequest('POST', '/api/Category', categoryData);
  };

  const handleUpdateCategory = () => {
    executeRequest('PUT', `/api/Category/${categoryId}`, { ...categoryData, categoryID: parseInt(categoryId) });
  };

  const handleDeleteCategory = () => {
    if (confirm(`¿Eliminar categoría ${categoryId}?`)) {
      executeRequest('DELETE', `/api/Category/${categoryId}`);
    }
  };

  const handleBulkInsert = () => {
    const bulkProducts = Array.from({ length: 5 }, (_, i) => ({
      productName: `Producto Bulk ${Date.now()}-${i}`,
      categoryID: Math.floor(Math.random() * 10) + 1,
      unitPrice: Math.random() * 1000 + 100,
      unitsInStock: Math.floor(Math.random() * 50) + 10
    }));
    executeRequest('POST', '/api/Product/batch', { products: bulkProducts });
  };

  // Guardar token del login
  React.useEffect(() => {
    if (response && response.data?.token) {
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }
  }, [response]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🧪 Pruebas de API - Servicios Web</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Herramienta interactiva para probar todos los endpoints de la API REST
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Panel Izquierdo: Endpoints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AUTENTICACIÓN */}
          <section className="api-test-section">
            <h2>🔐 Autenticación</h2>
            <div className="api-test-form">
              <label>
                Usuario:
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </label>
              <button onClick={handleLogin} className="btn-primary">
                POST /api/Auth/login
              </button>
            </div>
            {token && (
              <div style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '0.5rem' }}>
                ✅ Token JWT activo (guardado en localStorage)
              </div>
            )}
          </section>

          {/* PRODUCTOS */}
          <section className="api-test-section">
            <h2>📦 Productos</h2>
            
            <div className="api-test-form">
              <h3>Listar Productos (Paginado)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Página"
                  value={pagination.page}
                  onChange={(e) => setPagination({ ...pagination, page: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Tamaño"
                  value={pagination.pageSize}
                  onChange={(e) => setPagination({ ...pagination, pageSize: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Filtro"
                  value={pagination.filter}
                  onChange={(e) => setPagination({ ...pagination, filter: e.target.value })}
                />
              </div>
              <button onClick={handleGetProducts} className="btn-secondary">
                GET /api/Product
              </button>
            </div>

            <div className="api-test-form">
              <h3>Detalle de Producto</h3>
              <input
                type="number"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <button onClick={handleGetProductDetail} className="btn-secondary">
                GET /api/Product/{'{id}'}
              </button>
            </div>

            <div className="api-test-form">
              <h3>Crear Producto</h3>
              <input
                type="text"
                placeholder="Nombre"
                value={productData.productName}
                onChange={(e) => setProductData({ ...productData, productName: e.target.value })}
              />
              <input
                type="number"
                placeholder="Category ID"
                value={productData.categoryID}
                onChange={(e) => setProductData({ ...productData, categoryID: parseInt(e.target.value) })}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={productData.unitPrice}
                onChange={(e) => setProductData({ ...productData, unitPrice: parseFloat(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Stock"
                value={productData.unitsInStock}
                onChange={(e) => setProductData({ ...productData, unitsInStock: parseInt(e.target.value) })}
              />
              <button onClick={handleCreateProduct} className="btn-primary">
                POST /api/Product
              </button>
            </div>

            <div className="api-test-form">
              <h3>Actualizar Producto</h3>
              <input
                type="number"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <button onClick={handleUpdateProduct} className="btn-warning">
                PUT /api/Product/{'{id}'}
              </button>
            </div>

            <div className="api-test-form">
              <h3>Eliminar Producto</h3>
              <input
                type="number"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <button onClick={handleDeleteProduct} className="btn-danger">
                DELETE /api/Product/{'{id}'}
              </button>
            </div>

            <div className="api-test-form">
              <h3>Carga Masiva (Bulk Insert)</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Inserta 5 productos de prueba automáticamente
              </p>
              <button onClick={handleBulkInsert} className="btn-primary">
                POST /api/Product/batch
              </button>
            </div>
          </section>

          {/* CATEGORÍAS */}
          <section className="api-test-section">
            <h2>🏷️ Categorías</h2>
            
            <div className="api-test-form">
              <h3>Listar Categorías</h3>
              <button onClick={handleGetCategories} className="btn-secondary">
                GET /api/Category
              </button>
            </div>

            <div className="api-test-form">
              <h3>Detalle de Categoría</h3>
              <input
                type="number"
                placeholder="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
              <button onClick={handleGetCategoryDetail} className="btn-secondary">
                GET /api/Category/{'{id}'}
              </button>
            </div>

            <div className="api-test-form">
              <h3>Crear Categoría</h3>
              <input
                type="text"
                placeholder="Nombre (máx 15 chars)"
                maxLength={15}
                value={categoryData.name}
                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={categoryData.description}
                onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
              />
              <button onClick={handleCreateCategory} className="btn-primary">
                POST /api/Category
              </button>
            </div>

            <div className="api-test-form">
              <h3>Actualizar Categoría</h3>
              <input
                type="number"
                placeholder="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
              <button onClick={handleUpdateCategory} className="btn-warning">
                PUT /api/Category/{'{id}'}
              </button>
            </div>

            <div className="api-test-form">
              <h3>Eliminar Categoría</h3>
              <input
                type="number"
                placeholder="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
              <button onClick={handleDeleteCategory} className="btn-danger">
                DELETE /api/Category/{'{id}'}
              </button>
            </div>
          </section>
        </div>

        {/* Panel Derecho: Respuesta */}
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <section className="api-test-section" style={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <h2>📄 Respuesta</h2>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#10b981' }}>
                <div className="spinner"></div>
                <p>Ejecutando petición...</p>
              </div>
            )}

            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#7f1d1d', borderRadius: '8px', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fca5a5', marginTop: 0 }}>❌ Error</h3>
                <p><strong>Status:</strong> {error.status} {error.statusText}</p>
                <p><strong>Mensaje:</strong> {error.message}</p>
                {error.data && (
                  <pre style={{ backgroundColor: '#450a0a', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                    {JSON.stringify(error.data, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {response && (
              <div>
                <div style={{ padding: '1rem', backgroundColor: '#065f46', borderRadius: '8px', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#6ee7b7', marginTop: 0 }}>✅ Success</h3>
                  <p><strong>Status:</strong> {response.status} {response.statusText}</p>
                </div>
                
                <h4 style={{ color: '#60a5fa' }}>Response Data:</h4>
                <pre style={{ 
                  backgroundColor: '#0f172a', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  overflow: 'auto',
                  maxHeight: '500px',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {JSON.stringify(response.data, null, 2)}
                </pre>

                {response.data?.token && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#065f46', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: '#6ee7b7' }}>
                      🔑 Token JWT guardado automáticamente en localStorage
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && !response && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <p>Selecciona un endpoint de la izquierda para ver la respuesta aquí</p>
              </div>
            )}
          </section>

          {/* Información de la API */}
          <section className="api-test-section" style={{ marginTop: '1rem' }}>
            <h3>ℹ️ Información</h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.8' }}>
              <li><strong>Base URL:</strong> {API_BASE}</li>
              <li><strong>Ambiente:</strong> {import.meta.env.VITE_ENVIRONMENT || 'DESARROLLO'}</li>
              <li><strong>Autenticación:</strong> JWT Bearer Token</li>
              <li><strong>Swagger:</strong> <a href={`${API_BASE}/swagger`} target="_blank" rel="noopener">{API_BASE}/swagger</a></li>
            </ul>
          </section>
        </div>
      </div>

      {/* Estilos inline para esta página */}
      <style>{`
        .api-test-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .api-test-section h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1.25rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .api-test-section h3 {
          color: #374151;
          font-size: 1rem;
          margin-top: 0;
          margin-bottom: 0.75rem;
        }

        .api-test-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .api-test-form:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .api-test-form label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .api-test-form input {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .api-test-form input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .btn-secondary {
          background: #6b7280;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn-warning {
          background: #f59e0b;
        }

        .btn-warning:hover {
          background: #d97706;
        }

        .spinner {
          border: 3px solid #374151;
          border-top-color: #10b981;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
