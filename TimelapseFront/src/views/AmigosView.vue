<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">

      <div class="amigos-titulo">
        <h1 class="perfil-header__title">Mis Amigos</h1>
      </div>

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
          style="cursor: pointer"
          @click="verPerfil(amigo.idUsuario)"
        >
          <img
            :src="amigo.fotoPerfil || perfilFallback"
            alt="Amigo"
            class="card__profile-img"
          />

          <div class="capsula-item__content">
            <h3 class="capsula-item__title">{{ amigo.nombre }}</h3>
          </div>

          <button
            class="amigo__btn-eliminar"
            title="Eliminar amigo"
            @click.stop="eliminarAmigo(amigo)"
          >✕</button>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAmigosStore } from '@/stores/amigos'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import type { Amigo } from '@/services/amigosService'
import perfilFallback from '@/assets/img/Perfil.png'

const router      = useRouter()
const authStore   = useAuthStore()
const amigosStore = useAmigosStore()
const { confirm } = useConfirm()
const toast       = useToast()

onMounted(async () => {
  if (authStore.usuario?.idUsuario) {
    await amigosStore.fetchByUsuario(authStore.usuario.idUsuario)
  }
})

function verPerfil(idUsuario: number) {
  router.push(`/amigos/${idUsuario}`)
}

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