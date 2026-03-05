<template>
  <div>
    <div class="admin-section-header">
      <div>
        <h1 class="admin-section-header__title">Cápsulas</h1>
        <p class="admin-section-header__subtitle">
          {{ capsulaStore.total }} cápsulas
          ({{ capsulaStore.abiertas.length }} abiertas, {{ capsulaStore.cerradas.length }} cerradas)
        </p>
      </div>
    </div>

    <div class="admin-table">
      <div class="admin-table__search">
        <input v-model="busqueda" class="admin-table__search-input" placeholder="Buscar por título, estado o creador..." />
      </div>

      <p v-if="capsulaStore.loading" class="admin-table__empty">Cargando...</p>
      <p v-else-if="capsulaStore.error" class="admin-table__empty">{{ capsulaStore.error }}</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Creador</th><th>Estado</th><th>Visibilidad</th><th>Apertura</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="capsulasFiltradas.length === 0">
            <td colspan="7" style="text-align:center; padding:40px; color:#999">No se encontraron cápsulas</td>
          </tr>
          <tr v-for="c in capsulasFiltradas" :key="c.idCapsula">
            <td>#{{ c.idCapsula }}</td>
            <td>{{ c.titulo }}</td>
            <td>
              <span v-if="creadores[c.idCapsula]">
                👤 {{ creadores[c.idCapsula].nombre }}
                <span style="color:#999; font-size:12px">(#{{ creadores[c.idCapsula].id }})</span>
              </span>
              <span v-else style="color:#999; font-size:12px">—</span>
            </td>
            <td>
              <span class="admin-table__badge" :class="`admin-table__badge--${c.estado}`">{{ c.estado }}</span>
            </td>
            <td>
              <span class="admin-table__badge" :class="`admin-table__badge--${c.visibilidad}`">{{ c.visibilidad }}</span>
            </td>
            <td>{{ formatFecha(c.fechaApertura) }}</td>
            <td>
              <div class="admin-table__actions">
                <button class="admin-table__btn admin-table__btn--edit" @click="abrirModalEditar(c)">Editar</button>
                <button class="admin-table__btn admin-table__btn--delete" @click="eliminarCapsula(c.idCapsula)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalAbierto" class="admin-modal-overlay" @click.self="cerrarModal">
      <div class="admin-modal">
        <h2 class="admin-modal__title">Editar cápsula</h2>
        <form class="form" @submit.prevent="guardarCapsula">
          <div class="form__group">
            <label class="form__label">Título</label>
            <input v-model="form.titulo" type="text" class="form__input" required />
          </div>
          <div class="form__group">
            <label class="form__label">Descripción</label>
            <textarea v-model="form.descripcion" class="form__textarea"></textarea>
          </div>
          <div class="form__group">
            <label class="form__label">Estado</label>
            <select v-model="form.estado" class="form__input">
              <option value="cerrada">cerrada</option>
              <option value="abierta">abierta</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label">Visibilidad</label>
            <select v-model="form.visibilidad" class="form__input">
              <option value="privada">privada</option>
              <option value="publica">publica</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label">Fecha de apertura</label>
            <input v-model="form.fechaApertura" type="date" class="form__input" required />
          </div>
          <p v-if="errorModal" style="color:#C85C5C; font-size:14px">{{ errorModal }}</p>
          <div class="admin-modal__actions">
            <button type="submit" class="btn btn--submit" style="flex:1" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
            <button type="button" class="btn btn--cancel" style="flex:1" @click="cerrarModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '@/services/api'
import { useCapsulaStore } from '@/stores/capsulas'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

interface UsuarioCapsula { idUsuarioCapsula: number; idUsuario: number; idCapsula: number; rol: string }
interface Usuario { idUsuario: number; nombre: string }

const capsulaStore = useCapsulaStore()
const toast        = useToast()
const { confirm }  = useConfirm()

const busqueda     = ref('')
const modalAbierto = ref(false)
const guardando    = ref(false)
const errorModal   = ref('')
const creadores    = ref<Record<number, { id: number; nombre: string }>>({})

const form = reactive({ idCapsula: 0, titulo: '', descripcion: '', fechaCreacion: '', fechaApertura: '', estado: 'cerrada', visibilidad: 'privada' })

const capsulasFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return capsulaStore.capsulas
  return capsulaStore.capsulas.filter(c =>
    c.titulo.toLowerCase().includes(q) || c.estado.toLowerCase().includes(q) ||
    (creadores.value[c.idCapsula]?.nombre ?? '').toLowerCase().includes(q)
  )
})

onMounted(async () => {
  await capsulaStore.fetchAll()
  await cargarCreadores()
})

async function cargarCreadores() {
  const todas = await api.get<UsuarioCapsula[]>('/UsuarioCapsula')
  const soloCreadores = todas.filter(uc => uc.rol === 'creador')
  const idsUnicos = [...new Set(soloCreadores.map(uc => uc.idUsuario))]
  const usuarios = await Promise.all(idsUnicos.map(id => api.get<Usuario>(`/Usuario/${id}`)))
  const mapaU: Record<number, string> = {}
  usuarios.forEach(u => { mapaU[u.idUsuario] = u.nombre })
  const mapaC: Record<number, { id: number; nombre: string }> = {}
  soloCreadores.forEach(uc => { mapaC[uc.idCapsula] = { id: uc.idUsuario, nombre: mapaU[uc.idUsuario] ?? '—' } })
  creadores.value = mapaC
}

function abrirModalEditar(c: typeof capsulaStore.capsulas[0]) {
  Object.assign(form, { ...c, fechaApertura: (c.fechaApertura ?? '').split('T')[0] })
  errorModal.value = ''
  modalAbierto.value = true
}

function cerrarModal() { modalAbierto.value = false }

async function guardarCapsula() {
  errorModal.value = ''
  guardando.value  = true
  try {
    await capsulaStore.update(form.idCapsula, {
      titulo: form.titulo, descripcion: form.descripcion,
      fechaApertura: new Date(form.fechaApertura).toISOString(),
      estado: form.estado, visibilidad: form.visibilidad
    })
    cerrarModal()
    toast.success('Cápsula actualizada correctamente.')
  } catch (e: any) {
    errorModal.value = e?.message || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

async function eliminarCapsula(id: number) {
  const ok = await confirm({ title: 'Eliminar cápsula', message: '¿Seguro que quieres eliminar esta cápsula? Se borrarán todos sus contenidos.', confirmText: 'Eliminar', danger: true })
  if (!ok) return
  try {
    await capsulaStore.remove(id)
    toast.success('Cápsula eliminada.')
  } catch {
    toast.error('Error al eliminar la cápsula.')
  }
}

function formatFecha(fecha: string): string {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>