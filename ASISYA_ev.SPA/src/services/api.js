import axios from 'axios'

// Preferir variable de entorno; fallback al API dev local
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5195'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function getProducts(page=1, pageSize=10) {
  const res = await api.get(`/api/Product?pageNumber=${page}&pageSize=${pageSize}`)
  return res.data
}
