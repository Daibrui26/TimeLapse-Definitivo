<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main">
      <section class="card card--main">
        <h1 class="card__title card__title--main">BIENVENIDO A TIMELAPSE</h1>
        <p class="card__subtitle card__subtitle--main">
          Crea tu cápsula del tiempo y guarda tus recuerdos para el futuro.
        </p>
        <RouterLink to="/crear-capsula" class="btn btn--primary">
          <span class="btn__icon">+</span> Crear Cápsula
        </RouterLink>
        <RouterLink to="/tus-capsulas" class="btn btn--secondary">
          <span class="btn__icon-menu">☰</span> Tus Cápsulas
        </RouterLink>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>