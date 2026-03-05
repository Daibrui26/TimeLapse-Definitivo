<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">
      <p v-if="loading" class="capsulas-list__msg">Cargando cápsulas...</p>
      <p v-else-if="error" class="capsulas-list__msg">{{ error }}</p>

      <div v-else-if="capsulas.length === 0" class="capsulas-empty">
        <p class="capsulas-empty__text">Aún no tienes ninguna cápsula del tiempo.</p>
        <p class="capsulas-empty__subtext">¡Crea tu primera cápsula y empieza a guardar recuerdos!</p>
        <RouterLink to="/crear-capsula" class="btn btn--submit capsulas-empty__btn">
          + Crear mi primera cápsula
        </RouterLink>
      </div>

      <section v-else class="capsulas-list">
        <div v-for="capsula in capsulas" :key="capsula.idCapsula" class="capsula-item-wrapper">
          <CapsuleItem
            :title="capsula.titulo"
            :date="capsula.fechaApertura"
            :to="`/capsula/${capsula.idCapsula}`"
            :emoji="getEmoji(capsula.idCapsula)"
          />
          <button
            v-if="rolesCapsula[capsula.idCapsula] === 'creador'"
            class="capsula-item__delete-btn"
            title="Eliminar cápsula"
            @click.stop="eliminarCapsula(capsula)"
          >
            ❌
          </button>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import CapsuleItem from '@/components/CapsuleItem.vue'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'
import { api } from '@/services/api'

interface Capsula {
  idCapsula: number
  titulo: string
  fechaApertura: string
}

interface UsuarioCapsula {
  idUsuarioCapsula: number
  idUsuario: number
  idCapsula: number
  rol: string
}

const authStore = useAuthStore()
const { confirm } = useConfirm()

const capsulas = ref<Capsula[]>([])
// mapa idCapsula → rol del usuario actual en esa cápsula
const rolesCapsula = ref<Record<number, string>>({})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await cargarCapsulas()
})

async function cargarCapsulas() {
  loading.value = true
  try {
    const [data, todasUC] = await Promise.all([
      api.get<Capsula[]>(`/Capsula/usuario/${authStore.usuario?.idUsuario}`),
      api.get<UsuarioCapsula[]>('/UsuarioCapsula')
    ])

    capsulas.value = data

    // Filtrar solo las relaciones del usuario actual y construir el mapa de roles
    const idUsuario = authStore.usuario?.idUsuario
    const mapaRoles: Record<number, string> = {}
    todasUC
      .filter(uc => uc.idUsuario === idUsuario)
      .forEach(uc => { mapaRoles[uc.idCapsula] = uc.rol })

    rolesCapsula.value = mapaRoles
  } catch {
    error.value = 'Error al cargar las cápsulas.'
  } finally {
    loading.value = false
  }
}

async function eliminarCapsula(capsula: Capsula) {
  const confirmado = await confirm({
    title: 'Eliminar cápsula',
    message: `¿Seguro que quieres eliminar "${capsula.titulo}"? Se borrarán todos sus contenidos y comentarios. Esta acción no se puede deshacer.`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    danger: true
  })

  if (!confirmado) return

  try {
    await api.delete(`/Capsula/${capsula.idCapsula}`)
    capsulas.value = capsulas.value.filter(c => c.idCapsula !== capsula.idCapsula)
  } catch {
    error.value = 'Error al eliminar la cápsula.'
  }
}

function getEmoji(id: number): string {
  try {
    const guardados = JSON.parse(localStorage.getItem('capsula_emojis') || '{}')
    return guardados[id] ?? '⏳'
  } catch {
    return '⏳'
  }
}
</script>

<style scoped>
.capsula-item-wrapper {
  position: relative;
}

.capsula-item__delete-btn {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s;
  line-height: 1;
  padding: 4px;
}

.capsula-item__delete-btn:hover {
  opacity: 1;
}
</style>