<template>
  <nav class="nav-bottom">

    <RouterLink
      to="/home"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Home' }"
      title="Inicio"
    >🏠</RouterLink>

    <RouterLink
      to="/buscar"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Buscar' }"
      title="Buscar"
    >🔍</RouterLink>

    <RouterLink
      to="/tus-capsulas"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'TusCapsulas' }"
      title="Tus cápsulas"
    >⏳</RouterLink>

    <RouterLink
      to="/notificaciones"
      class="nav-bottom__btn nav-bottom__btn--notif"
      :class="{ 'nav-bottom__btn--active': route.name === 'Notificaciones' }"
      title="Notificaciones"
    >
      🔔
      <span v-if="store.noLeidas > 0" class="nav-bottom__badge">
        {{ store.noLeidas > 9 ? '9+' : store.noLeidas }}
      </span>
    </RouterLink>

    <RouterLink
      to="/menu"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Menu' }"
      title="Menú"
    >👤</RouterLink>

  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useNotificacionesStore } from '@/stores/notificaciones'

const route = useRoute()
const store = useNotificacionesStore()

onMounted(() => store.cargar())
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