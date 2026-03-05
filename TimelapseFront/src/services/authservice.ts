import { api } from './api'

export interface LoginRequest {
  email: string
  contraseña: string
}

export interface LoginResponse {
  idUsuario: number
  nombre: string
  email: string
  rol: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  contraseña: string
}

export const authService = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/Usuario/login', data)
  },

  register(data: RegisterRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/Usuario', data)
  }
}