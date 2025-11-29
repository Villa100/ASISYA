import { api } from './api';

export const productService = {
  // Obtener lista paginada de productos
  getAll: async (page = 1, pageSize = 20, filter = null) => {
    const params = new URLSearchParams({
      pageNumber: page,
      pageSize: pageSize
    });
    if (filter) params.append('filter', filter);
    
    const response = await api.get(`/api/Product?${params.toString()}`);
    return response.data;
  },

  // Obtener detalle de un producto
  getById: async (id) => {
    const response = await api.get(`/api/Product/${id}`);
    return response.data;
  },

  // Crear lote de productos (batch)
  createBatch: async (products) => {
    const response = await api.post('/api/Product', { products });
    return response.data;
  },

  // Crear un solo producto (usando batch con 1 item)
  create: async (product) => {
    const response = await api.post('/api/Product', {
      products: [product]
    });
    return response.data;
  },

  // Actualizar producto
  update: async (id, product) => {
    const response = await api.put(`/api/Product/${id}`, {
      ...product,
      productID: id
    });
    return response.data;
  },

  // Eliminar producto
  delete: async (id) => {
    const response = await api.delete(`/api/Product/${id}`);
    return response.data;
  }
};

export default productService;
