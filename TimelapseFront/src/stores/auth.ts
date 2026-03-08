import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UsuarioSesion {
  idUsuario: number
  nombre: string
  email: string
  rol: string
  fotoPerfil?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<UsuarioSesion | null>(null)

  function setUsuario(u: UsuarioSesion) {
    usuario.value = u
  }

  function clearUsuario() {
    usuario.value = null
  }

  return { usuario, setUsuario, clearUsuario }
}, {
  persist: true
})