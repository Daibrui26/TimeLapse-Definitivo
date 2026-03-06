<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--crear-capsula">
      <section class="card card--crear-capsula">

        <!-- Cabecera -->
        <div class="crear-capsula__header">
          <h1 class="crear-capsula__title">Nueva Cápsula</h1>
          <p class="crear-capsula__subtitle">Guarda tus recuerdos y ábrelos en el futuro</p>
        </div>

        <form class="form" @submit.prevent="handleSubmit">

          <!-- Selector de emoji -->
          <div class="form__group">
            <div class="emoji-selector">
              <span class="emoji-selector__label">Elige un icono para tu cápsula</span>
              <div class="emoji-selector__grid">
                <button
                  v-for="emojiOption in EMOJIS"
                  :key="emojiOption"
                  type="button"
                  class="emoji-selector__option"
                  :class="{ 'emoji-selector__option--selected': emojiSeleccionado === emojiOption }"
                  @click="emojiSeleccionado = emojiOption"
                >
                  {{ emojiOption }}
                </button>
              </div>
              <div class="emoji-selector__preview">
                <span>{{ emojiSeleccionado }}</span>
                <span>Icono seleccionado</span>
              </div>
            </div>
          </div>

          <!-- Título -->
          <div class="form__group">
            <label for="titulo" class="form__label">Título de la cápsula</label>
            <input
              v-bind="tituloAttrs"
              v-model="titulo"
              type="text"
              id="titulo"
              class="form__input"
              :class="{ 'form__input--error': errors.titulo }"
              placeholder="Ej: Verano 2025"
            />
            <span v-if="errors.titulo" class="form__error-msg">{{ errors.titulo }}</span>
          </div>

          <!-- Descripción -->
          <div class="form__group">
            <label for="descripcion" class="form__label">Descripción</label>
            <textarea
              v-bind="descripcionAttrs"
              v-model="descripcion"
              id="descripcion"
              class="form__textarea"
              :class="{ 'form__input--error': errors.descripcion }"
              placeholder="Describe qué hay en esta cápsula..."
            ></textarea>
            <span v-if="errors.descripcion" class="form__error-msg">{{ errors.descripcion }}</span>
          </div>

          <!-- Fecha de apertura -->
          <div class="form__group">
            <label for="fechaApertura" class="form__label">Fecha de apertura</label>
            <input
              v-bind="fechaAperturaAttrs"
              v-model="fechaApertura"
              type="date"
              id="fechaApertura"
              class="form__input"
              :class="{ 'form__input--error': errors.fechaApertura }"
              :min="minDate"
            />
            <span v-if="errors.fechaApertura" class="form__error-msg">{{ errors.fechaApertura }}</span>
          </div>

          <!-- Visibilidad -->
          <div class="form__group">
            <label class="form__label">Visibilidad</label>
            <div class="visibility-selector">
              <button
                type="button"
                class="visibility-selector__option"
                :class="{ 'visibility-selector__option--selected': visibilidad === 'privada' }"
                @click="visibilidad = 'privada'"
              >
                <span class="visibility-selector__option-icon">🔒</span>
                Privada
              </button>
              <button
                type="button"
                class="visibility-selector__option"
                :class="{ 'visibility-selector__option--selected': visibilidad === 'publica' }"
                @click="visibilidad = 'publica'"
              >
                <span class="visibility-selector__option-icon">🌍</span>
                Pública
              </button>
            </div>
          </div>

          <!-- Participantes (solo amigos) -->
          <div class="form__group">
            <label class="form__label">Participantes</label>

            <div class="participantes">

              <!-- Cargando amigos -->
              <p v-if="amigosStore.loading" class="participantes__empty">
                Cargando amigos...
              </p>

              <!-- Sin amigos -->
              <p v-else-if="amigosStore.total === 0" class="participantes__empty">
                No tienes amigos añadidos todavía.
              </p>

              <template v-else>
                <!-- Buscador dentro de los amigos -->
                <input
                  v-model="filtroAmigos"
                  type="text"
                  class="participantes__input"
                  placeholder="Buscar entre tus amigos..."
                />

                <!-- Lista de amigos disponibles -->
                <div v-if="amigosDisponibles.length > 0" class="participantes__list">
                  <button
                    v-for="amigo in amigosDisponibles"
                    :key="amigo.idUsuario"
                    type="button"
                    class="participantes__tag"
                    style="cursor: pointer; opacity: 0.7"
                    @click="añadirParticipante(amigo)"
                  >
                    👤 {{ amigo.nombre }}
                    <span style="font-size:11px">+</span>
                  </button>
                </div>
                <p v-else-if="filtroAmigos" class="participantes__empty">
                  No se encontró ningún amigo con ese nombre.
                </p>

                <!-- Participantes seleccionados -->
                <div v-if="participantesSeleccionados.length > 0" class="participantes__list" style="margin-top: 8px">
                  <span
                    v-for="p in participantesSeleccionados"
                    :key="p.idUsuario"
                    class="participantes__tag"
                  >
                    👤 {{ p.nombre }}
                    <button
                      type="button"
                      class="participantes__tag-remove"
                      @click="quitarParticipante(p.idUsuario)"
                    >×</button>
                  </span>
                </div>
                <span v-else class="participantes__empty">
                  Sin participantes adicionales
                </span>
              </template>
            </div>
          </div>

          <!-- Subir archivos -->
          <div class="form__group">
            <label class="form__label">Archivos (imágenes, vídeos, documentos)</label>
            <div
              class="upload-area"
              :class="{ 'upload-area--dragover': isDragging }"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
            >
              <span class="upload-area__icon">📎</span>
              <p class="upload-area__text">Haz clic o arrastra archivos aquí</p>
              <p class="upload-area__hint">Imágenes, vídeos y documentos (máx. 10 archivos)</p>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                class="upload-area__input"
                accept="image/*,video/*,.pdf,.doc,.docx"
                @change="onFileChange"
              />
            </div>

            <div v-if="archivos.length > 0" class="file-list">
              <div v-for="(file, index) in archivos" :key="index" class="file-list__item">
                <span class="file-list__icon">{{ getFileIcon(file) }}</span>
                <span class="file-list__name">{{ file.name }}</span>
                <button type="button" class="file-list__remove" @click="quitarArchivo(index)">×</button>
              </div>
            </div>
          </div>

          <hr class="form__separator" />

          <span v-if="errorServidor" class="form__error-msg form__error-msg--center">
            {{ errorServidor }}
          </span>

          <div class="crear-capsula-actions">
            <button type="submit" class="btn btn--submit" :disabled="loading">
              {{ loading ? 'Sellando...' : '🔒 Sellar Cápsula' }}
            </button>
            <RouterLink to="/home" class="btn btn--cancel">Cancelar</RouterLink>
          </div>

        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppHeader from '@/components/AppHeader.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useAmigosStore } from '@/stores/amigos'
import type { Amigo } from '@/services/amigosService'

interface CapsulaCreada {
  idCapsula: number
}

const router      = useRouter()
const authStore   = useAuthStore()
const amigosStore = useAmigosStore()

const loading      = ref(false)
const errorServidor = ref('')
const filtroAmigos = ref('')

// ── Emojis ────────────────────────────────────────────────────────────────────
const EMOJIS = ['⏳', '📦', '🌟', '💌', '🎁', '🏖️', '🎓', '❤️', '🌍', '📷', '🎵', '🏡']
const emojiSeleccionado = ref('⏳')
const visibilidad = ref('privada')

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

// ── Cargar amigos al montar ───────────────────────────────────────────────────
onMounted(async () => {
  if (authStore.usuario?.idUsuario) {
    await amigosStore.fetchByUsuario(authStore.usuario.idUsuario)
  }
})

// ── Participantes ─────────────────────────────────────────────────────────────
const participantesSeleccionados = ref<Amigo[]>([])

// Amigos que aún no han sido añadidos como participantes, filtrados por búsqueda
const amigosDisponibles = computed(() =>
  amigosStore.amigos.filter(a =>
    !participantesSeleccionados.value.some(p => p.idUsuario === a.idUsuario) &&
    a.nombre.toLowerCase().includes(filtroAmigos.value.toLowerCase())
  )
)

function añadirParticipante(amigo: Amigo) {
  participantesSeleccionados.value.push(amigo)
  filtroAmigos.value = ''
}

function quitarParticipante(id: number) {
  participantesSeleccionados.value = participantesSeleccionados.value.filter(p => p.idUsuario !== id)
}

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = yup.object({
  titulo: yup
    .string()
    .required('El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(150, 'El título no puede superar los 150 caracteres'),
  descripcion: yup
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres'),
  fechaApertura: yup
    .string()
    .required('La fecha de apertura es obligatoria')
    .test('futura', 'La fecha de apertura debe ser posterior a hoy', value => {
      if (!value) return false
      return new Date(value) > new Date()
    })
})

// ── Form ──────────────────────────────────────────────────────────────────────
const { errors, handleSubmit: veeHandleSubmit, defineField } = useForm({ validationSchema: schema })

const [titulo, tituloAttrs]               = defineField('titulo')
const [descripcion, descripcionAttrs]     = defineField('descripcion')
const [fechaApertura, fechaAperturaAttrs] = defineField('fechaApertura')

// ── Archivos ──────────────────────────────────────────────────────────────────
const archivos     = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging   = ref(false)

function triggerFileInput() { fileInputRef.value?.click() }
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(Array.from(input.files))
}
function onDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) addFiles(Array.from(e.dataTransfer.files))
}
function addFiles(nuevos: File[]) {
  archivos.value = [...archivos.value, ...nuevos].slice(0, 10)
}
function quitarArchivo(index: number) { archivos.value.splice(index, 1) }
function getFileIcon(file: File): string {
  if (file.type.startsWith('image/')) return '🖼️'
  if (file.type.startsWith('video/')) return '🎥'
  if (file.type.includes('pdf')) return '📄'
  return '📎'
}
function getTipo(file: File): string {
  if (file.type.startsWith('image/')) return 'imagen'
  if (file.type.startsWith('video/')) return 'video'
  return 'documento'
}

// ── Submit ────────────────────────────────────────────────────────────────────
const handleSubmit = veeHandleSubmit(async (values) => {
  errorServidor.value = ''
  loading.value = true

  try {
    const hoy = new Date().toISOString()

    const nuevaCapsula = await api.post<CapsulaCreada>('/Capsula', {
      titulo: values.titulo,
      descripcion: values.descripcion ?? '',
      fechaCreacion: hoy,
      fechaApertura: new Date(values.fechaApertura).toISOString(),
      estado: 'cerrada',
      visibilidad: visibilidad.value
    })

    const idCapsula = nuevaCapsula.idCapsula

    // Añadir al creador
    await api.post('/UsuarioCapsula', {
      idUsuario: authStore.usuario!.idUsuario,
      idCapsula,
      rol: 'creador'
    })

    // Añadir participantes (solo amigos seleccionados)
    if (participantesSeleccionados.value.length > 0) {
      await Promise.all(
        participantesSeleccionados.value.map(u =>
          api.post('/UsuarioCapsula', { idUsuario: u.idUsuario, idCapsula, rol: 'participante' })
        )
      )
    }

    // Subir archivos
    if (archivos.value.length > 0) {
      await Promise.all(
        archivos.value.map(file => {
          const formData = new FormData()
          formData.append('IdCapsula', String(idCapsula))
          formData.append('Tipo', getTipo(file))
          formData.append('Archivo', file)
          return fetch('/api/Contenido/archivo', { method: 'POST', body: formData })
        })
      )
    }

    // Guardar emoji en localStorage
    const emojisGuardados = JSON.parse(localStorage.getItem('capsula_emojis') || '{}')
    emojisGuardados[idCapsula] = emojiSeleccionado.value
    localStorage.setItem('capsula_emojis', JSON.stringify(emojisGuardados))

    router.push('/tus-capsulas')
  } catch (e: any) {
    errorServidor.value = e?.message || 'Ha ocurrido un error. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
})
</script>