import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Capsula {
  idCapsula: number
  titulo: string
  descripcion: string
  fechaCreacion: string
  fechaApertura: string
  estado: string
  visibilidad: string
}

export const useCapsulaStore = defineStore('capsulas', () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  const capsulas  = ref<Capsula[]>([])
  const loading   = ref(false)
  const error     = ref('')

  // ── Computed ──────────────────────────────────────────────────────────────
  const total = computed(() => capsulas.value.length)

  const abiertas = computed(() =>
    capsulas.value.filter(c => new Date(c.fechaApertura) <= new Date())
  )

  const cerradas = computed(() =>
    capsulas.value.filter(c => new Date(c.fechaApertura) > new Date())
  )

  // ── Acciones ──────────────────────────────────────────────────────────────

  /** Carga las cápsulas del usuario actual */
  async function fetchByUsuario(idUsuario: number) {
    loading.value = true
    error.value   = ''
    try {
      capsulas.value = await api.get<Capsula[]>(`/Capsula/usuario/${idUsuario}`)
    } catch (e: any) {
      error.value = e?.message || 'Error al cargar las cápsulas.'
    } finally {
      loading.value = false
    }
  }

  /** Carga todas las cápsulas (uso admin) */
  async function fetchAll() {
    loading.value = true
    error.value   = ''
    try {
      capsulas.value = await api.get<Capsula[]>('/Capsula')
    } catch (e: any) {
      error.value = e?.message || 'Error al cargar las cápsulas.'
    } finally {
      loading.value = false
    }
  }

  /** Actualiza una cápsula en el servidor y refresca la lista */
  async function update(id: number, datos: Partial<Capsula>) {
    const capsula = capsulas.value.find(c => c.idCapsula === id)
    if (!capsula) return
    await api.put(`/Capsula/${id}`, { ...capsula, ...datos })
    await fetchAll()
  }

  /** Elimina una cápsula */
  async function remove(id: number) {
    await api.delete(`/Capsula/${id}`)
    capsulas.value = capsulas.value.filter(c => c.idCapsula !== id)
  }

  /** Limpia el estado (al hacer logout) */
  function reset() {
    capsulas.value = []
    error.value    = ''
  }

  return {
    capsulas, loading, error,
    total, abiertas, cerradas,
    fetchByUsuario, fetchAll, update, remove, reset
  }
})