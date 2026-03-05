<template>
  <nav class="nav-bottom">
    <RouterLink
      to="/home"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Home' }"
      title="Inicio"
    >★</RouterLink>
    <RouterLink
      to="/explorar"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Explorar' }"
      title="Explorar"
    >★</RouterLink>
    <RouterLink
      to="/notificaciones"
      class="nav-bottom__btn"
      :class="{ 'nav-bottom__btn--active': route.name === 'Notificaciones' }"
      title="Notificaciones"
    >★</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
</script>