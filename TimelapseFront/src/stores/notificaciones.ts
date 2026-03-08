import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { Notificacion } from '@/services/notificacionesService'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  const notificaciones = ref<Notificacion[]>([])
  const cargando       = ref(false)

  const noLeidas = computed(() => notificaciones.value.filter(n => !n.leida).length)

  async function cargar() {
    const authStore = useAuthStore()
    cargando.value  = true
    try {
      const todas = await api.get<Notificacion[]>('/Notificacion')
      notificaciones.value = todas
        .filter(n => n.idUsuario === authStore.usuario?.idUsuario)
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    } finally {
      cargando.value = false
    }
  }

  async function marcarLeida(notif: Notificacion) {
    const actualizada = await api.put<Notificacion>(`/Notificacion/${notif.idNotificacion}`, {
      ...notif,
      leida: true
    })
    const idx = notificaciones.value.findIndex(n => n.idNotificacion === notif.idNotificacion)
    if (idx !== -1) notificaciones.value[idx] = actualizada
  }

  async function limpiarLeidas() {
    const leidas = notificaciones.value.filter(n => n.leida)
    await Promise.all(leidas.map(n => api.delete(`/Notificacion/${n.idNotificacion}`)))
    notificaciones.value = notificaciones.value.filter(n => !n.leida)
  }

  function reset() {
    notificaciones.value = []
  }

  return { notificaciones, cargando, noLeidas, cargar, marcarLeida, limpiarLeidas, reset }
})