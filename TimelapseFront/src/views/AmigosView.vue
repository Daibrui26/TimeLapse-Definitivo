<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">
      <h1 class="perfil-header__title">Mis Amigos</h1>

      <p v-if="amigosStore.loading">Cargando amigos...</p>
      <p v-else-if="amigosStore.error">{{ amigosStore.error }}</p>

      <div v-else-if="amigosStore.total === 0" class="capsulas-empty">
        <p class="capsulas-empty__text">No tienes amigos añadidos todavía.</p>
      </div>

      <section v-else class="capsulas-list">
        <div
          v-for="amigo in amigosStore.amigos"
          :key="amigo.idUsuario"
          class="capsula-item"
        >
          <img src="@/assets/img/Perfil.png" alt="Amigo" class="card__profile-img" />

          <div class="capsula-item__content">
            <h3 class="capsula-item__title">{{ amigo.nombre }}</h3>
            <p class="capsula-item__date">{{ amigo.email }}</p>
          </div>

          <button class="amigo__btn-eliminar" @click="eliminarAmigo(amigo)">✕</button>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAmigosStore } from '@/stores/amigos'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import type { Amigo } from '@/services/amigosService'

const authStore   = useAuthStore()
const amigosStore = useAmigosStore()
const { confirm } = useConfirm()
const toast       = useToast()

onMounted(async () => {
  if (authStore.usuario?.idUsuario) {
    await amigosStore.fetchByUsuario(authStore.usuario.idUsuario)
  }
})

async function eliminarAmigo(amigo: Amigo) {
  const ok = await confirm({
    title:       'Eliminar amigo',
    message:     `¿Seguro que quieres eliminar a ${amigo.nombre} de tu lista de amigos?`,
    confirmText: 'Eliminar',
    cancelText:  'Cancelar',
    danger:      true
  })
  if (!ok) return

  try {
    await amigosStore.eliminar(authStore.usuario!.idUsuario, amigo.idUsuario)
    toast.success(`${amigo.nombre} eliminado de tu lista de amigos.`)
  } catch {
    toast.error('Error al eliminar el amigo. Inténtalo de nuevo.')
  }
}
</script>

<style scoped>
.amigo__btn-eliminar {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 16px;
  color: #ccc;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.amigo__btn-eliminar:hover {
  color: #C85C5C;
  background: #fde8e8;
}
</style>