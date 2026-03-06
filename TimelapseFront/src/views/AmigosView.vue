<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">
      <h1 class="perfil-header__title">Mis Amigos</h1>

      <section class="capsulas-list">
        
        <p v-if="cargando">Cargando amigos...</p>

        <p v-else-if="error">{{ error }}</p>

        <p v-else-if="amigos.length === 0">No tienes amigos añadidos todavía.</p>

        <div
          v-else
          v-for="amigo in amigos"
          :key="amigo.idUsuario"
          class="capsula-item"
        >
          <img src="@/assets/img/Perfil.png" alt="Amigo" class="card__profile-img" />
          
          <div class="capsula-item__content">
            <h3 class="capsula-item__title">{{ amigo.nombre }}</h3>
            <p class="capsula-item__date">{{ amigo.email }}</p>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Amigo {
  idUsuario: number
  nombre: string
  email: string
}

const authStore = useAuthStore()
const amigos = ref<Amigo[]>([])
const cargando = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  cargando.value = true
  try {
    const { data } = await api.get(`/Amigos/${authStore.usuario?.idUsuario}`)
    amigos.value = data
  } catch {
    error.value = 'Error al cargar los amigos.'
  } finally {
    cargando.value = false
  }
})
</script>