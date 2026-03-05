<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsula-detalle">

      <p v-if="loading" class="capsulas-list__msg">Cargando cápsula...</p>
      <p v-else-if="error" class="capsulas-list__msg">{{ error }}</p>

      <template v-else-if="capsula">

        <!-- Cabecera -->
        <section class="card card--perfil" style="flex-direction: column; align-items: flex-start;">
          <div class="capsula-detalle__header">
            <span class="capsula-detalle__emoji">{{ emoji }}</span>
            <div class="capsula-detalle__info">
              <h1 class="capsula-detalle__titulo">{{ capsula.titulo }}</h1>
              <div class="capsula-detalle__badges">
                <span
                  class="capsula-detalle__badge"
                  :class="`capsula-detalle__badge--${capsula.visibilidad}`"
                >
                  {{ capsula.visibilidad === 'publica' ? '🌍 Pública' : '🔒 Privada' }}
                </span>
              </div>
            </div>
          </div>

          <div class="capsula-fechas" style="width:100%">
            <div class="capsula-fechas__item">
              <p class="capsula-fechas__label">Creada el</p>
              <p class="capsula-fechas__valor">{{ formatFecha(capsula.fechaCreacion) }}</p>
            </div>
            <div class="capsula-fechas__item">
              <p class="capsula-fechas__label">Abierta el</p>
              <p class="capsula-fechas__valor">{{ formatFecha(capsula.fechaApertura) }}</p>
            </div>
          </div>
        </section>

        <!-- Descripción -->
        <section v-if="capsula.descripcion" class="card capsula-seccion">
          <h2 class="capsula-seccion__titulo">Descripción</h2>
          <p class="capsula-seccion__texto">{{ capsula.descripcion }}</p>
        </section>

        <!-- Participantes -->
        <section v-if="participantes.length > 0" class="card capsula-seccion">
          <h2 class="capsula-seccion__titulo">Participantes</h2>
          <div class="capsula-participantes">
            <span
              v-for="p in participantes"
              :key="p.idUsuario"
              class="capsula-participantes__tag"
            >
              👤 {{ p.nombre }}
            </span>
          </div>
        </section>

        <!-- Contenido -->
        <section class="card capsula-seccion">
          <h2 class="capsula-seccion__titulo">Contenido</h2>

          <p v-if="loadingContenido" class="capsula-archivos__empty">Cargando archivos...</p>
          <p v-else-if="contenido.length === 0" class="capsula-archivos__empty">
            Esta cápsula no tiene archivos adjuntos.
          </p>

          <div v-else class="capsula-archivos">
            <div class="capsula-archivos__grid">
              <div v-for="item in contenido" :key="item.idContenido" class="capsula-archivos__item">

                <template v-if="item.tipo === 'imagen'">
                  <img
                    :src="item.urlArchivo"
                    alt="Imagen"
                    class="capsula-archivos__img"
                    @click="abrirLightbox(item.urlArchivo!)"
                  />
                </template>

                <template v-else-if="item.tipo === 'video'">
                  <video
                    :src="item.urlArchivo"
                    class="capsula-archivos__video"
                    controls
                    preload="metadata"
                  />
                </template>

                <template v-else-if="item.tipo === 'texto'">
                  <div class="capsula-archivos__doc" style="background: #f5f5f5;">
                    <span class="capsula-archivos__doc-icon">📝</span>
                    <p class="capsula-archivos__doc-name">{{ item.contenidoTexto }}</p>
                  </div>
                </template>

                <template v-else>
                  <a :href="item.urlArchivo" target="_blank" rel="noopener" class="capsula-archivos__doc">
                    <span class="capsula-archivos__doc-icon">{{ getDocIcon(item.urlArchivo) }}</span>
                    <span class="capsula-archivos__doc-name">{{ getNombreArchivo(item.urlArchivo) }}</span>
                  </a>
                </template>

              </div>
            </div>
          </div>
        </section>

        <!-- Comentarios -->
        <section class="card capsula-seccion">
          <h2 class="capsula-seccion__titulo">
            Comentarios
            <span style="font-weight:400; color:#aaa; font-size:13px; margin-left:8px">
              ({{ comentarios.length }})
            </span>
          </h2>

          <div class="capsula-comentarios">

            <!-- Formulario si puede comentar -->
            <div v-if="puedeComentarr" class="capsula-comentarios__form">
              <textarea
                v-model="nuevoComentario"
                class="capsula-comentarios__textarea"
                placeholder="Escribe un comentario..."
                :disabled="enviandoComentario"
              />
              <button
                class="capsula-comentarios__submit"
                :disabled="!nuevoComentario.trim() || enviandoComentario"
                @click="enviarComentario"
              >
                {{ enviandoComentario ? 'Enviando...' : 'Comentar' }}
              </button>
            </div>

            <!-- Sin acceso -->
            <div v-else class="capsula-comentarios__no-access">
              🔒 Solo los participantes de esta cápsula pueden comentar
            </div>

            <!-- Cargando comentarios -->
            <p v-if="loadingComentarios" class="capsula-comentarios__empty">
              Cargando comentarios...
            </p>

            <!-- Sin comentarios -->
            <div v-else-if="comentarios.length === 0" class="capsula-comentarios__empty">
              Aún no hay comentarios. ¡Sé el primero!
            </div>

            <!-- Lista de comentarios -->
            <div v-else class="capsula-comentarios__list">
              <div
                v-for="c in comentarios"
                :key="c.idComentario"
                class="capsula-comentarios__item"
              >
                <div class="capsula-comentarios__item-header">
                  <span class="capsula-comentarios__autor">
                    👤 {{ nombreUsuario(c.idUsuario) }}
                  </span>
                  <div style="display:flex; align-items:center; gap:8px">
                    <span class="capsula-comentarios__fecha">
                      {{ formatFecha(c.fechaComentario) }}
                    </span>
                    <button
                      v-if="c.idUsuario === authStore.usuario?.idUsuario || authStore.isAdmin"
                      class="capsula-comentarios__delete"
                      title="Eliminar comentario"
                      @click="eliminarComentario(c.idComentario)"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p class="capsula-comentarios__texto">{{ c.texto }}</p>
              </div>
            </div>

          </div>
        </section>

      </template>
    </main>

    <!-- Lightbox -->
    <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = ''">
      <img :src="lightboxUrl" class="lightbox__img" @click.stop />
      <button class="lightbox__close" @click="lightboxUrl = ''">✕</button>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useConfirm } from '@/composables/useConfirm'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Capsula {
  idCapsula: number
  titulo: string
  descripcion: string
  fechaCreacion: string
  fechaApertura: string
  estado: string
  visibilidad: string
}

interface Contenido {
  idContenido: number
  tipo: string
  contenidoTexto?: string
  urlArchivo?: string
  fechaSubida: string
}

interface Participante {
  idUsuario: number
  nombre: string
  rol: string
}

interface UsuarioCapsula {
  idUsuarioCapsula: number
  idUsuario: number
  idCapsula: number
  rol: string
}

interface Usuario {
  idUsuario: number
  nombre: string
  email: string
}

interface Comentario {
  idComentario: number
  texto: string
  fechaComentario: string
  idUsuario: number
  idCapsula: number
}

// ── State ─────────────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { confirm } = useConfirm()

const capsula = ref<Capsula | null>(null)
const contenido = ref<Contenido[]>([])
const participantes = ref<Participante[]>([])
const comentarios = ref<Comentario[]>([])

const loading = ref(true)
const loadingContenido = ref(true)
const loadingComentarios = ref(true)
const error = ref('')
const lightboxUrl = ref('')

// mapa idUsuario → nombre, para mostrar en comentarios
const mapaUsuarios = ref<Record<number, string>>({})

const nuevoComentario = ref('')
const enviandoComentario = ref(false)

// ── Computed ──────────────────────────────────────────────────────────────────

const emoji = computed(() => {
  try {
    const id = Number(route.params.id)
    const guardados = JSON.parse(localStorage.getItem('capsula_emojis') || '{}')
    return guardados[id] ?? '⏳'
  } catch {
    return '⏳'
  }
})

const esParticipante = computed(() =>
  participantes.value.some(p => p.idUsuario === authStore.usuario?.idUsuario)
)

// Regla de acceso a comentarios:
// - Admin: siempre puede
// - Cápsula pública: cualquier usuario logueado puede
// - Cápsula privada: solo participantes
const puedeComentarr = computed(() => {
  if (!capsula.value) return false
  if (authStore.isAdmin) return true
  if (capsula.value.visibilidad === 'publica') return true
  if (capsula.value.visibilidad === 'privada') return esParticipante.value
  return false
})

// ── Montaje ───────────────────────────────────────────────────────────────────

onMounted(async () => {
  const id = Number(route.params.id)

  try {
    const data = await api.get<Capsula>(`/Capsula/${id}`)

    // Si la cápsula no está abierta aún, redirigir
    if (new Date(data.fechaApertura) > new Date()) {
      router.replace('/tus-capsulas')
      return
    }

    capsula.value = data

    // Cargamos contenido, participantes y comentarios en paralelo
    const [contenidoData, ucData, comentariosData] = await Promise.all([
      api.get<Contenido[]>(`/Contenido/capsula/${id}`),
      api.get<UsuarioCapsula[]>(`/UsuarioCapsula/capsula/${id}`),
      api.get<Comentario[]>(`/Comentario/capsula/${id}`)
    ])

    contenido.value = contenidoData
    loadingContenido.value = false
    comentarios.value = comentariosData
    loadingComentarios.value = false

    // Cargar nombres de participantes
    const usuariosParticipantes = await Promise.all(
      ucData.map(uc => api.get<Usuario>(`/Usuario/${uc.idUsuario}`))
    )

    participantes.value = ucData.map((uc, i) => ({
      idUsuario: uc.idUsuario,
      nombre: usuariosParticipantes[i].nombre,
      rol: uc.rol
    }))

    // Poblar el mapa de usuarios con los participantes ya cargados
    usuariosParticipantes.forEach(u => {
      mapaUsuarios.value[u.idUsuario] = u.nombre
    })

    // Cargar nombres de usuarios que comentaron pero no son participantes
    const idsEnComentarios = [...new Set(comentariosData.map(c => c.idUsuario))]
    const idsFaltantes = idsEnComentarios.filter(uid => !mapaUsuarios.value[uid])

    if (idsFaltantes.length > 0) {
      const extras = await Promise.all(
        idsFaltantes.map(uid => api.get<Usuario>(`/Usuario/${uid}`))
      )
      extras.forEach(u => {
        mapaUsuarios.value[u.idUsuario] = u.nombre
      })
    }

    // Asegurarnos de tener al usuario actual en el mapa
    if (authStore.usuario && !mapaUsuarios.value[authStore.usuario.idUsuario]) {
      mapaUsuarios.value[authStore.usuario.idUsuario] = authStore.usuario.nombre
    }

  } catch {
    error.value = 'No se pudo cargar la cápsula.'
  } finally {
    loading.value = false
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function nombreUsuario(idUsuario: number): string {
  return mapaUsuarios.value[idUsuario] ?? `Usuario #${idUsuario}`
}

function formatFecha(fecha: string): string {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function getNombreArchivo(url?: string): string {
  if (!url) return 'Archivo'
  return url.split('/').pop()?.split('?')[0] ?? 'Archivo'
}

function getDocIcon(url?: string): string {
  if (!url) return '📎'
  if (url.includes('.pdf')) return '📄'
  if (url.match(/\.(doc|docx)/)) return '📝'
  return '📎'
}

function abrirLightbox(url: string) {
  lightboxUrl.value = url
}

// ── Acciones comentarios ──────────────────────────────────────────────────────

async function enviarComentario() {
  if (!nuevoComentario.value.trim() || !authStore.usuario) return

  enviandoComentario.value = true
  try {
    const nuevo = await api.post<Comentario>('/Comentario', {
      texto: nuevoComentario.value.trim(),
      fechaComentario: new Date().toISOString(),
      idUsuario: authStore.usuario.idUsuario,
      idCapsula: Number(route.params.id)
    })

    // Insertar al principio (más reciente primero)
    comentarios.value.unshift(nuevo)
    nuevoComentario.value = ''
  } catch {
    error.value = 'Error al enviar el comentario. Inténtalo de nuevo.'
  } finally {
    enviandoComentario.value = false
  }
}

async function eliminarComentario(idComentario: number) {
  const confirmado = await confirm({
    title: 'Eliminar comentario',
    message: '¿Seguro que quieres eliminar este comentario? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    danger: true
  })

  if (!confirmado) return

  try {
    await api.delete(`/Comentario/${idComentario}`)
    comentarios.value = comentarios.value.filter(c => c.idComentario !== idComentario)
  } catch {
    // TODO: usar toast
  }
}
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}
.lightbox__img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  cursor: default;
}
.lightbox__close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lightbox__close:hover { opacity: 1; }
</style>