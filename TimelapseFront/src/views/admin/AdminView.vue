<template>
  <div class="admin-layout">

    <!-- Header -->
    <header class="admin-header">
      <RouterLink to="/home">
        <img
          src="@/assets/img/LogoCompletoClaro-removebg-preview.png"
          alt="Timelapse"
          class="admin-header__logo"
        />
      </RouterLink>

      <div class="admin-header__center">
        <span class="admin-header__badge">Admin</span>
        <span class="admin-header__title">Panel de Administración</span>
      </div>

      <div class="admin-header__right">
        <span class="admin-header__user">{{ authStore.usuario?.nombre }}</span>
        <RouterLink to="/home">
          <button class="admin-header__btn-exit">← Volver a la app</button>
        </RouterLink>
      </div>
    </header>

    <!-- Body -->
    <div class="admin-body">

      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <span class="admin-sidebar__section-title">Gestión</span>

        <RouterLink
          to="/admin/usuarios"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': route.name === 'AdminUsuarios' }"
        >
          <span class="admin-sidebar__icon">👤</span>
          <span>Usuarios</span>
        </RouterLink>

        <RouterLink
          to="/admin/capsulas"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': route.name === 'AdminCapsulas' }"
        >
          <span class="admin-sidebar__icon">⏳</span>
          <span>Cápsulas</span>
        </RouterLink>

        <RouterLink
          to="/admin/comentarios"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': route.name === 'AdminComentarios' }"
        >
          <span class="admin-sidebar__icon">💬</span>
          <span>Comentarios</span>
        </RouterLink>
      </aside>

      <!-- Contenido dinámico -->
      <main class="admin-content">
        <RouterView />
      </main>

    </div>

    <!-- Footer -->
    <footer class="admin-footer">
      Timelapse Admin Panel © {{ new Date().getFullYear() }}
    </footer>

  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
</script>