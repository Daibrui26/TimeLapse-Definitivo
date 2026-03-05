<template>
  <div>
    <div class="admin-section-header">
      <div>
        <h1 class="admin-section-header__title">Comentarios</h1>
        <p class="admin-section-header__subtitle">{{ comentarios.length }} comentarios en total</p>
      </div>
    </div>

    <div class="admin-table">
      <div class="admin-table__search">
        <input
          v-model="busqueda"
          class="admin-table__search-input"
          placeholder="Buscar en el texto del comentario..."
        />
      </div>

      <p v-if="loading" class="admin-table__empty">Cargando...</p>
      <p v-else-if="error" class="admin-table__empty">{{ error }}</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Texto</th>
            <th>Usuario</th>
            <th>Cápsula</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="comentariosFiltrados.length === 0">
            <td colspan="6" style="text-align:center; padding:40px; color:#999">No se encontraron comentarios</td>
          </tr>
          <tr v-for="c in comentariosFiltrados" :key="c.idComentario">
            <td>#{{ c.idComentario }}</td>
            <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">{{ c.texto }}</td>
            <td>#{{ c.idUsuario }}</td>
            <td>#{{ c.idCapsula }}</td>
            <td>{{ formatFecha(c.fechaComentario) }}</td>
            <td>
              <div class="admin-table__actions">
                <button class="admin-table__btn admin-table__btn--delete" @click="eliminarComentario(c.idComentario)">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

interface Comentario {
  idComentario: number; texto: string; fechaComentario: string; idUsuario: number; idCapsula: number
}

const toast       = useToast()
const { confirm } = useConfirm()

const comentarios = ref<Comentario[]>([])
const loading     = ref(true)
const error       = ref('')
const busqueda    = ref('')

const comentariosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return comentarios.value
  return comentarios.value.filter(c => c.texto.toLowerCase().includes(q))
})

onMounted(async () => { await cargarComentarios() })

async function cargarComentarios() {
  loading.value = true
  try { comentarios.value = await api.get<Comentario[]>('/Comentario') }
  catch { error.value = 'Error al cargar comentarios' }
  finally { loading.value = false }
}

async function eliminarComentario(id: number) {
  const ok = await confirm({
    title:       'Eliminar comentario',
    message:     '¿Seguro que quieres eliminar este comentario?',
    confirmText: 'Eliminar',
    danger:      true
  })
  if (!ok) return
  try {
    await api.delete(`/Comentario/${id}`)
    await cargarComentarios()
    toast.success('Comentario eliminado.')
  } catch {
    toast.error('Error al eliminar el comentario.')
  }
}

function formatFecha(fecha: string): string {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>