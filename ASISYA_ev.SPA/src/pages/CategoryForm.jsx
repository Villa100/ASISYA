import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../services/category';

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoadingData(true);
      const data = await categoryService.getById(id);
      setFormData({
        categoryName: data.categoryName || '',
        description: data.description || ''
      });
    } catch (err) {
      setError('Error cargando categoría: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        await categoryService.update(id, formData);
        setSuccess('Categoría actualizada correctamente');
      } else {
        await categoryService.create(formData);
        setSuccess('Categoría creada correctamente');
      }
      
      setTimeout(() => {
        navigate('/categories');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container">
        <div className="spinner"></div>
        <p>Cargando categoría...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>{isEditMode ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h1>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="categoryName">Nombre de la Categoría *</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                maxLength={15}
                placeholder="Ej: SERVIDORES, CLOUD, NETWORKING"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descripción opcional de la categoría"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-outline"
                onClick={() => navigate('/categories')}
                disabled={loading}
              >
                ← Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoryForm;
