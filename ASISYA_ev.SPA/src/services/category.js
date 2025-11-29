import { api } from './api';

export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/api/Category');
    return response.data;
  },

  // Obtener una categoría por ID
  getById: async (id) => {
    const response = await api.get(`/api/Category/${id}`);
    return response.data;
  },

  // Crear categoría
  create: async (category) => {
    const response = await api.post('/api/Category', category);
    return response.data;
  },

  // Actualizar categoría
  update: async (id, category) => {
    const response = await api.put(`/api/Category/${id}`, {
      ...category,
      categoryID: id
    });
    return response.data;
  },

  // Eliminar categoría
  delete: async (id) => {
    const response = await api.delete(`/api/Category/${id}`);
    return response.data;
  }
};

export default categoryService;
