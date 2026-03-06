import { api } from './api'

export interface Notificacion {
  idNotificacion: number
  tipo: string
  mensaje: string
  fechaCreacion: string
  leida: boolean
  idUsuario: number
  idCapsula?: number | null
}

export const notificacionesService = {
  getAll(): Promise<Notificacion[]> {
    return api.get<Notificacion[]>('/Notificacion')
  },

  getById(id: number): Promise<Notificacion> {
    return api.get<Notificacion>(`/Notificacion/${id}`)
  },

  create(notif: Omit<Notificacion, 'idNotificacion'>): Promise<Notificacion> {
    return api.post<Notificacion>('/Notificacion', notif)
  },

  update(notif: Notificacion): Promise<Notificacion> {
    return api.put<Notificacion>(`/Notificacion/${notif.idNotificacion}`, notif)
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/Notificacion/${id}`)
  },

  /** Marca una notificación como leída */
  async marcarLeida(notif: Notificacion): Promise<Notificacion> {
    return api.put<Notificacion>(`/Notificacion/${notif.idNotificacion}`, {
      ...notif,
      leida: true
    })
  }
}