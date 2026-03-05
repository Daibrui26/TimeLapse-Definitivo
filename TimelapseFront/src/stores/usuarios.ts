import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Usuario {
  idUsuario: number
  nombre: string
  email: string
  contraseña: string
  rol: string
}

export const useUsuarioStore = defineStore('usuarios', () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  const usuarios = ref<Usuario[]>([])
  const loading  = ref(false)
  const error    = ref('')

  // ── Computed ──────────────────────────────────────────────────────────────
  const total = computed(() => usuarios.value.length)

  const admins = computed(() =>
    usuarios.value.filter(u => u.rol === 'admin')
  )

  const normales = computed(() =>
    usuarios.value.filter(u => u.rol === 'usuario')
  )

  // ── Acciones ──────────────────────────────────────────────────────────────

  /** Carga todos los usuarios */
  async function fetchAll() {
    loading.value = true
    error.value   = ''
    try {
      usuarios.value = await api.get<Usuario[]>('/Usuario')
    } catch (e: any) {
      error.value = e?.message || 'Error al cargar usuarios.'
    } finally {
      loading.value = false
    }
  }

  /** Crea un usuario nuevo */
  async function create(datos: Omit<Usuario, 'idUsuario'>) {
    await api.post('/Usuario', datos)
    await fetchAll()
  }

  /** Actualiza un usuario */
  async function update(id: number, datos: Partial<Usuario>) {
    const usuario = usuarios.value.find(u => u.idUsuario === id)
    if (!usuario) return

    // Si no se proporciona contraseña nueva, conservamos la actual
    const contraseñaFinal = datos.contraseña || usuario.contraseña

    await api.put(`/Usuario/${id}`, {
      ...usuario,
      ...datos,
      contraseña: contraseñaFinal
    })
    await fetchAll()
  }

  /** Elimina un usuario */
  async function remove(id: number) {
    await api.delete(`/Usuario/${id}`)
    usuarios.value = usuarios.value.filter(u => u.idUsuario !== id)
  }

  /** Busca un usuario por id en el estado local */
  function getById(id: number): Usuario | undefined {
    return usuarios.value.find(u => u.idUsuario === id)
  }

  /** Limpia el estado */
  function reset() {
    usuarios.value = []
    error.value    = ''
  }

  return {
    usuarios, loading, error,
    total, admins, normales,
    fetchAll, create, update, remove, getById, reset
  }
})