<template>
  <nav class="nav-bottom">

    <!-- Inicio -->
    <RouterLink
      to="/home"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Home' }"
      title="Inicio"
    >🏠</RouterLink>

    <!-- Buscar usuarios -->
    <RouterLink
      to="/buscar"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Buscar' }"
      title="Buscar"
    >🔍</RouterLink>

    <!-- Tus cápsulas -->
    <RouterLink
      to="/tus-capsulas"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'TusCapsulas' }"
      title="Tus cápsulas"
    >⏳</RouterLink>

    <!-- Notificaciones con badge -->
    <RouterLink
      to="/notificaciones"
      class="nav-bottom__btn nav-bottom__btn--notif"
      :class="{ 'nav-bottom__btn--active': route.name === 'Notificaciones' }"
      title="Notificaciones"
    >
      🔔
      <span v-if="noLeidas > 0" class="nav-bottom__badge">{{ noLeidas > 9 ? '9+' : noLeidas }}</span>
    </RouterLink>

    <!-- Menú / perfil -->
    <RouterLink
      to="/menu"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Menu' }"
      title="Menú"
    >👤</RouterLink>

  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { Notificacion } from '@/services/notificacionesService'

const route     = useRoute()
const authStore = useAuthStore()

const noLeidas = ref(0)

onMounted(async () => {
  try {
    const todas = await api.get<Notificacion[]>('/Notificacion')
    noLeidas.value = todas.filter(
      n => n.idUsuario === authStore.usuario?.idUsuario && !n.leida
    ).length
  } catch {
    // Silenciar error — el badge simplemente no aparece
  }
})
</script>

<style scoped>
.nav-bottom__btn--notif {
  position: relative;
}

.nav-bottom__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #C85C5C;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  pointer-events: none;
}
</style>