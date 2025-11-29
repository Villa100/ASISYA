import { api } from './api'

export async function login(username, password) {
  const res = await api.post('/api/Auth/login', { username, password })
  localStorage.setItem('token', res.data.token)
  return res.data
}

export function logout() {
  localStorage.removeItem('token')
}

export async function whoAmI() {
  const res = await api.get('/api/Auth/me')
  return res.data
}
