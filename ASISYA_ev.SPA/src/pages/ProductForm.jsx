import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/product';
import categoryService from '../services/category';

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    supplierID: 1,
    categoryID: '',
    quantityPerUnit: '',
    unitPrice: 0,
    unitsInStock: 0,
    unitsOnOrder: 0,
    reorderLevel: 0,
    discontinued: false
  });

  useEffect(() => {
    loadCategories();
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (data.length > 0 && !formData.categoryID) {
        setFormData(prev => ({ ...prev, categoryID: data[0].categoryID }));
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadProduct = async () => {
    try {
      setLoadingData(true);
      const data = await productService.getById(id);
      setFormData({
        productName: data.productName || '',
        supplierID: data.supplierID || 1,
        categoryID: data.categoryID || '',
        quantityPerUnit: data.quantityPerUnit || '',
        unitPrice: data.unitPrice || 0,
        unitsInStock: data.unitsInStock || 0,
        unitsOnOrder: data.unitsOnOrder || 0,
        reorderLevel: data.reorderLevel || 0,
        discontinued: data.discontinued || false
      });
    } catch (err) {
      const errorMsg = err.response?.status === 404 
        ? 'Producto no encontrado. Puede que la base de datos en memoria se haya reiniciado.'
        : 'Error cargando producto: ' + (err.response?.data?.message || err.message);
      setError(errorMsg);
      setTimeout(() => navigate('/products'), 3000);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        await productService.update(id, formData);
        setSuccess('Producto actualizado correctamente');
      } else {
        await productService.create(formData);
        setSuccess('Producto creado correctamente');
      }
      
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.status === 404
        ? 'Producto no encontrado. La base de datos en memoria puede haberse reiniciado. Regresando al listado...'
        : err.response?.data?.message || err.message || 'Error al guardar producto';
      setError(errorMsg);
      if (err.response?.status === 404) {
        setTimeout(() => navigate('/products'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Nombre del Producto *</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="Ej: Laptop Dell XPS 15"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryID">Categoría *</label>
                <select
                  id="categoryID"
                  name="categoryID"
                  value={formData.categoryID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(cat => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantityPerUnit">Cantidad por Unidad</label>
                <input
                  type="text"
                  id="quantityPerUnit"
                  name="quantityPerUnit"
                  value={formData.quantityPerUnit}
                  onChange={handleChange}
                  placeholder="Ej: 1 unidad, 10 piezas"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitPrice">Precio Unitario *</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unitsInStock">Stock Disponible *</label>
                <input
                  type="number"
                  id="unitsInStock"
                  name="unitsInStock"
                  value={formData.unitsInStock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitsOnOrder">Unidades Pedidas</label>
                <input
                  type="number"
                  id="unitsOnOrder"
                  name="unitsOnOrder"
                  value={formData.unitsOnOrder}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reorderLevel">Nivel de Reorden</label>
                <input
                  type="number"
                  id="reorderLevel"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="discontinued"
                  checked={formData.discontinued}
                  onChange={handleChange}
                />
                <span>Producto descontinuado</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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

export default ProductForm;
