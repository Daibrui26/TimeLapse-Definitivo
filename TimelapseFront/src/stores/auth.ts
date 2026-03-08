import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface UsuarioSesion {
  idUsuario: number
  nombre: string
  email: string
  rol: string
  fotoPerfil?: string | null
}

const STORAGE_KEY = 'auth_usuario'

function cargarDeStorage(): UsuarioSesion | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<UsuarioSesion | null>(cargarDeStorage())

  const isLoggedIn    = computed(() => usuario.value !== null)
  const nombreUsuario = computed(() => usuario.value?.nombre ?? '')
  const isAdmin       = computed(() => usuario.value?.rol === 'admin')

  // Persiste automáticamente cualquier cambio en localStorage
  watch(
    usuario,
    (val) => {
      if (val) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    { deep: true }
  )

  function setUsuario(data: UsuarioSesion) {
    usuario.value = data
  }

  function logout() {
    usuario.value = null
  }

  return { usuario, isLoggedIn, nombreUsuario, isAdmin, setUsuario, logout }
})