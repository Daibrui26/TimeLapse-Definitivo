<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">

      <!-- Título -->
      <div class="amigos-titulo">
        <h1 class="perfil-header__title">Buscar Usuarios</h1>
      </div>

      <!-- Buscador -->
      <div class="card" style="padding: 16px 20px; width: 100%">
        <div style="position: relative;">
          <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:18px; pointer-events:none">🔍</span>
          <input
            v-model="query"
            type="text"
            class="form__input"
            placeholder="Buscar por nombre..."
            style="padding-left: 40px; width: 100%"
            @input="onInput"
          />
        </div>
      </div>

      <!-- Estado: cargando -->
      <p
        v-if="cargando"
        style="text-align:center; color:#697C9F; padding: 20px 0; font-size:14px"
      >
        Buscando...
      </p>

      <!-- Estado: sin resultados -->
      <div
        v-else-if="query.length >= 2 && resultados.length === 0"
        class="capsulas-empty"
        style="padding: 30px 35px"
      >
        <p class="capsulas-empty__text" style="font-size:15px">
          No se encontró ningún usuario con ese nombre.
        </p>
      </div>

      <!-- Lista de resultados -->
      <section v-else-if="resultados.length > 0" class="capsulas-list">
        <div
          v-for="usuario in resultados"
          :key="usuario.idUsuario"
          class="capsula-item"
          style="cursor: pointer"
          @click="verPerfil(usuario.idUsuario)"
        >
          <img
            src="@/assets/img/Perfil.png"
            alt="Avatar"
            class="card__profile-img"
            style="flex-shrink:0"
          />

          <div class="capsula-item__content">
            <h3 class="capsula-item__title">{{ usuario.nombre }}</h3>
            <p class="capsula-item__date">{{ usuario.email }}</p>
          </div>

          <!-- Botón de acción según estado de la relación -->
          <button
            class="solicitud-btn"
            :class="claseBtnSolicitud(usuario.idUsuario)"
            :disabled="estadoRelacion(usuario.idUsuario) !== 'ninguno'"
            @click.stop="enviarSolicitud(usuario)"
          >
            {{ textoBtnSolicitud(usuario.idUsuario) }}
          </button>
        </div>
      </section>

      <!-- Estado inicial: escribe para buscar -->
      <div
        v-else
        class="card"
        style="width:100%; padding:35px; text-align:center"
      >
        <p style="font-size:40px; margin-bottom:12px">👥</p>
        <p style="color:#697C9F; font-size:15px">
          Escribe al menos 2 letras para buscar usuarios.
        </p>
      </div>

    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { Amistad } from '@/services/amigosService'
import type { Notificacion } from '@/services/notificacionesService'

interface Usuario {
  idUsuario: number
  nombre: string
  email: string
}

const router    = useRouter()
const authStore = useAuthStore()
const toast     = useToast()

const query      = ref('')
const resultados = ref<Usuario[]>([])
const cargando   = ref(false)

// Todas las amistades donde el usuario actual está implicado
const misAmistades = ref<Amistad[]>([])

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ── Cargar amistades al montar ────────────────────────────────────────────────
onMounted(async () => {
  try {
    const todas = await api.get<Amistad[]>('/Amistad')
    misAmistades.value = todas.filter(
      a =>
        a.idUsuario1 === authStore.usuario?.idUsuario ||
        a.idUsuario2 === authStore.usuario?.idUsuario
    )
  } catch {
    // Si falla, continuamos sin estado de amistad
  }
})

// ── Búsqueda con debounce ─────────────────────────────────────────────────────
function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)

  if (query.value.length < 2) {
    resultados.value = []
    return
  }

  debounceTimer = setTimeout(buscar, 350)
}

async function buscar() {
  cargando.value = true
  try {
    const todos = await api.get<Usuario[]>(
      `/Usuario/search?nombre=${encodeURIComponent(query.value)}`
    )
    // Excluir al propio usuario del resultado
    resultados.value = todos.filter(
      u => u.idUsuario !== authStore.usuario?.idUsuario
    )
  } catch {
    toast.error('Error al buscar usuarios.')
    resultados.value = []
  } finally {
    cargando.value = false
  }
}

// ── Estado de la relación con cada usuario ────────────────────────────────────
// Devuelve: 'amigos' | 'enviada' | 'recibida' | 'ninguno'
function estadoRelacion(idOtro: number): string {
  const yo = authStore.usuario?.idUsuario
  const rel = misAmistades.value.find(
    a =>
      (a.idUsuario1 === yo && a.idUsuario2 === idOtro) ||
      (a.idUsuario1 === idOtro && a.idUsuario2 === yo)
  )
  if (!rel) return 'ninguno'
  if (rel.estado === 'aceptada') return 'amigos'
  if (rel.estado === 'pendiente') {
    return rel.idUsuario1 === yo ? 'enviada' : 'recibida'
  }
  return 'ninguno'
}

function textoBtnSolicitud(idOtro: number): string {
  const estado = estadoRelacion(idOtro)
  if (estado === 'amigos')   return '✅ Amigos'
  if (estado === 'enviada')  return '⏳ Enviada'
  if (estado === 'recibida') return '📬 Recibida'
  return '➕ Añadir'
}

function claseBtnSolicitud(idOtro: number): string {
  const estado = estadoRelacion(idOtro)
  if (estado === 'amigos')  return 'solicitud-btn--amigos'
  if (estado === 'enviada') return 'solicitud-btn--enviada'
  if (estado === 'recibida') return 'solicitud-btn--recibida'
  return 'solicitud-btn--añadir'
}

// ── Enviar solicitud ──────────────────────────────────────────────────────────
async function enviarSolicitud(destino: Usuario) {
  if (!authStore.usuario) return

  try {
    // 1. Crear la amistad en estado 'pendiente'
    const nuevaAmistad = await api.post<Amistad>('/Amistad', {
      idUsuario1: authStore.usuario.idUsuario,
      idUsuario2: destino.idUsuario,
      estado: 'pendiente'
    })

    // 2. Crear notificación para el destinatario
    await api.post<Notificacion>('/Notificacion', {
      tipo: 'solicitud_amistad',
      mensaje: `${authStore.usuario.nombre} te ha enviado una solicitud de amistad.`,
      fechaCreacion: new Date().toISOString(),
      leida: false,
      idUsuario: destino.idUsuario,
      idCapsula: null
    })

    // 3. Actualizar estado local para que el botón cambie al instante
    misAmistades.value.push(nuevaAmistad)

    toast.success(`Solicitud enviada a ${destino.nombre}`)
  } catch (e: any) {
    toast.error(e?.message || 'Error al enviar la solicitud.')
  }
}

// ── Navegar al perfil ─────────────────────────────────────────────────────────
function verPerfil(idUsuario: number) {
  router.push(`/amigos/${idUsuario}`)
}
</script>

<style scoped>
/* Botón de solicitud */
.solicitud-btn {
  flex-shrink: 0;
  border: none;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.solicitud-btn--añadir {
  background: #183263;
  color: #fff;
}
.solicitud-btn--añadir:hover {
  background: #0f1f3d;
  transform: scale(1.04);
}

.solicitud-btn--enviada {
  background: #f0f0f0;
  color: #697C9F;
  cursor: default;
}

.solicitud-btn--recibida {
  background: #CCDAE0;
  color: #183263;
  cursor: default;
}

.solicitud-btn--amigos {
  background: #d4edda;
  color: #2d6a4f;
  cursor: default;
}
</style>