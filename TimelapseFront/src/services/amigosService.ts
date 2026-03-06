import { api } from './api'

export interface Amistad {
  idAmistad: number
  idUsuario1: number
  idUsuario2: number
  estado: string
}

export interface Amigo {
  idUsuario: number
  nombre: string
  email: string
}

export const amigosService = {

  getAll(): Promise<Amistad[]> {
    return api.get<Amistad[]>('/Amistad')
  },

  getById(id: number): Promise<Amistad> {
    return api.get<Amistad>(`/Amistad/${id}`)
  },

  getUsuario(id: number): Promise<Amigo> {
    return api.get<Amigo>(`/Usuario/${id}`)
  },

  create(amistad: Omit<Amistad, 'idAmistad'>): Promise<Amistad> {
    return api.post<Amistad>('/Amistad', amistad)
  },

  update(amistad: Amistad): Promise<Amistad> {
    return api.put<Amistad>(`/Amistad/${amistad.idAmistad}`, amistad)
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/Amistad/${id}`)
  }
}
