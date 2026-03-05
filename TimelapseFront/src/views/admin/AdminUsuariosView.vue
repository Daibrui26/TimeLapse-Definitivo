<template>
  <div>
    <div class="admin-section-header">
      <div>
        <h1 class="admin-section-header__title">Usuarios</h1>
        <p class="admin-section-header__subtitle">
          {{ usuarioStore.total }} usuarios
          ({{ usuarioStore.admins.length }} admins, {{ usuarioStore.normales.length }} normales)
        </p>
      </div>
      <button
        class="admin-table__btn admin-table__btn--edit"
        style="padding: 10px 20px; font-size:14px"
        @click="abrirModalCrear"
      >
        + Nuevo usuario
      </button>
    </div>

    <div class="admin-table">
      <div class="admin-table__search">
        <input v-model="busqueda" class="admin-table__search-input" placeholder="Buscar por nombre o email..." />
      </div>

      <p v-if="usuarioStore.loading" class="admin-table__empty">Cargando...</p>
      <p v-else-if="usuarioStore.error" class="admin-table__empty">{{ usuarioStore.error }}</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="usuariosFiltrados.length === 0">
            <td colspan="5" style="text-align:center; padding:40px; color:#999">No se encontraron usuarios</td>
          </tr>
          <tr v-for="u in usuariosFiltrados" :key="u.idUsuario">
            <td>#{{ u.idUsuario }}</td>
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span class="admin-table__badge" :class="`admin-table__badge--${u.rol}`">{{ u.rol }}</span>
            </td>
            <td>
              <div class="admin-table__actions">
                <button class="admin-table__btn admin-table__btn--edit" @click="abrirModalEditar(u)">Editar</button>
                <button class="admin-table__btn admin-table__btn--delete" @click="eliminarUsuario(u.idUsuario)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalAbierto" class="admin-modal-overlay" @click.self="cerrarModal">
      <div class="admin-modal">
        <h2 class="admin-modal__title">{{ modoEdicion ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
        <form class="form" @submit.prevent="guardarUsuario">
          <div class="form__group">
            <label class="form__label">Nombre</label>
            <input v-model="form.nombre" type="text" class="form__input" required />
          </div>
          <div class="form__group">
            <label class="form__label">Email</label>
            <input v-model="form.email" type="email" class="form__input" required />
          </div>
          <div class="form__group">
            <label class="form__label">Contraseña{{ modoEdicion ? ' (vacío = no cambiar)' : '' }}</label>
            <input v-model="form.contraseña" type="password" class="form__input" :required="!modoEdicion" />
          </div>
          <div class="form__group">
            <label class="form__label">Rol</label>
            <select v-model="form.rol" class="form__input">
              <option value="usuario">usuario</option>
              <option value="admin">admin</option>
            </select>
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
import { useUsuarioStore } from '@/stores/usuarios'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

const usuarioStore = useUsuarioStore()
const toast        = useToast()
const { confirm }  = useConfirm()

const busqueda     = ref('')
const modalAbierto = ref(false)
const modoEdicion  = ref(false)
const guardando    = ref(false)
const errorModal   = ref('')
const form = reactive({ idUsuario: 0, nombre: '', email: '', contraseña: '', rol: 'usuario' })

const usuariosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return usuarioStore.usuarios
  return usuarioStore.usuarios.filter(u =>
    u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

onMounted(async () => { await usuarioStore.fetchAll() })

function abrirModalCrear() {
  modoEdicion.value = false
  Object.assign(form, { idUsuario: 0, nombre: '', email: '', contraseña: '', rol: 'usuario' })
  errorModal.value = ''
  modalAbierto.value = true
}

function abrirModalEditar(u: typeof usuarioStore.usuarios[0]) {
  modoEdicion.value = true
  Object.assign(form, { idUsuario: u.idUsuario, nombre: u.nombre, email: u.email, contraseña: '', rol: u.rol })
  errorModal.value = ''
  modalAbierto.value = true
}

function cerrarModal() { modalAbierto.value = false }

async function guardarUsuario() {
  errorModal.value = ''
  guardando.value  = true
  try {
    if (modoEdicion.value) {
      await usuarioStore.update(form.idUsuario, { nombre: form.nombre, email: form.email, contraseña: form.contraseña, rol: form.rol })
      toast.success('Usuario actualizado correctamente.')
    } else {
      await usuarioStore.create({ nombre: form.nombre, email: form.email, contraseña: form.contraseña, rol: form.rol })
      toast.success('Usuario creado correctamente.')
    }
    cerrarModal()
  } catch (e: any) {
    errorModal.value = e?.message || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

async function eliminarUsuario(id: number) {
  const ok = await confirm({ title: 'Eliminar usuario', message: '¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.', confirmText: 'Eliminar', danger: true })
  if (!ok) return
  try {
    await usuarioStore.remove(id)
    toast.success('Usuario eliminado.')
  } catch {
    toast.error('Error al eliminar el usuario.')
  }
}
</script>