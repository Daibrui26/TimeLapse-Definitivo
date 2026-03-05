<template>
  <div class="page">
    <AppHeader variant="public" logo-link="/" />

    <main class="page__main">
      <section class="card welcome">
        <h1 class="welcome__title">BIENVENIDO A<br />TIMELAPSE</h1>
        <RouterLink to="/iniciar-sesion" class="welcome__btn">Iniciar sesión</RouterLink>
        <p class="welcome__text">
          ¿No tienes cuenta?
          <RouterLink to="/registro" class="link">Regístrate</RouterLink>
        </p>
      </section>

      <section class="card info">
        <p class="info__description">
          En <strong>Timelapse</strong> puedes crear cápsulas del tiempo, guardar recuerdos,
          aprender de otros y explorar herramientas únicas sobre tu vida y tu historia.
        </p>
        <h2 class="info__title">¡A qué esperas!</h2>
        <p class="info__cta">
          <RouterLink to="/registro" class="link">Regístrate</RouterLink>
          para poder tener acceso a todas las herramientas de <strong>Timelapse</strong>
        </p>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>