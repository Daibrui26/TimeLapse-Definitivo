import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { amigosService } from '@/services/amigosService'
import type { Amigo, Amistad } from '@/services/amigosService'

export const useAmigosStore = defineStore('amigos', () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  const amigos  = ref<Amigo[]>([])
  const loading = ref(false)
  const error   = ref('')

  // ── Computed ──────────────────────────────────────────────────────────────
  const total = computed(() => amigos.value.length)

  // ── Acciones ──────────────────────────────────────────────────────────────

  async function fetchByUsuario(idUsuario: number) {
    loading.value = true
    error.value   = ''

    try {
      const amistades = await amigosService.getAll()

      const amistadesAceptadas = amistades.filter(
        (a: Amistad) =>
          a.estado === 'aceptada' &&
          (a.idUsuario1 === idUsuario || a.idUsuario2 === idUsuario)
      )

      const idsAmigos = amistadesAceptadas.map((a: Amistad) =>
        a.idUsuario1 === idUsuario ? a.idUsuario2 : a.idUsuario1
      )

      amigos.value = await Promise.all(
        idsAmigos.map((id: number) => amigosService.getUsuario(id))
      )
    } catch (e: any) {
      error.value = e?.message || 'Error al cargar los amigos.'
    } finally {
      loading.value = false
    }
  }

  async function eliminar(idUsuarioActual: number, idAmigo: number) {
    const amistades = await amigosService.getAll()
    const amistad = amistades.find(
      (a: Amistad) =>
        (a.idUsuario1 === idUsuarioActual && a.idUsuario2 === idAmigo) ||
        (a.idUsuario1 === idAmigo && a.idUsuario2 === idUsuarioActual)
    )
    if (!amistad) throw new Error('Amistad no encontrada')
    await amigosService.delete(amistad.idAmistad)
    amigos.value = amigos.value.filter(a => a.idUsuario !== idAmigo)
  }

  function reset() {
    amigos.value = []
    error.value  = ''
  }

  return {
    amigos, loading, error,
    total,
    fetchByUsuario, eliminar, reset
  }
})