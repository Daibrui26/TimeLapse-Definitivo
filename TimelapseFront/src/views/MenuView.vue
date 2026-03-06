<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main">
      <section class="card card--profile">
        <img src="@/assets/img/Perfil.png" alt="Perfil" class="card__profile-img" />
        <div class="card__profile-info">
          <h2 class="card__title">{{ authStore.usuario?.nombre }}</h2>
          <p class="card__subtitle">{{ authStore.usuario?.email }}</p>
        </div>
      </section>

      <section class="card card--menu">
        <nav class="menu-nav">
          <RouterLink to="/perfil" class="menu-nav__item">
            <img src="@/assets/img/Perfil.png" class="menu-nav__icon" alt="Perfil" />
            Mi Perfil
          </RouterLink>
          <RouterLink to="/amigos" class="menu-nav__item">
            <img src="@/assets/img/Perfil.png" class="menu-nav__icon" alt="Perfil" />
            Amigos
          </RouterLink>
          <RouterLink to="/tus-capsulas" class="menu-nav__item">
            <img src="@/assets/img/Reloj.png" class="menu-nav__icon" alt="Cápsulas" />
            Tus Cápsulas
          </RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" class="menu-nav__item">
            <img src="@/assets/img/Stats.png" class="menu-nav__icon" alt="Admin" />
            Panel de Administración
          </RouterLink>
          <a href="#" class="menu-nav__item">
            <img src="@/assets/img/Bandeja.png" class="menu-nav__icon" alt="Bandeja" />
            Bandeja de Entrada
          </a>
        </nav>
      </section>

      <section class="card card--menu">
        <nav class="menu-nav">
          <RouterLink to="/contacto" class="menu-nav__item">
            <img src="@/assets/img/Contacto.png" class="menu-nav__icon" alt="Contacto" />
            Contacto
          </RouterLink>
          <a href="#" class="menu-nav__item">
            <span class="menu-nav__star">★</span> Sobre Nosotros
          </a>
          <a href="#" class="menu-nav__item">
            <span class="menu-nav__star">★</span> Política &amp; Privacidad
          </a>
        </nav>
      </section>

      <section class="card card--menu">
        <nav class="menu-nav">
          <button
            @click="cerrarSesion"
            class="menu-nav__item menu-nav__item--danger"
            style="background:none;border:none;width:100%;text-align:left;cursor:pointer;"
          >
            <img src="@/assets/img/salir.png" class="menu-nav__icon" alt="Salir" />
            Cerrar Sesión
          </button>
          <button
            @click="eliminarCuenta"
            class="menu-nav__item menu-nav__item--danger"
            style="background:none;border:none;width:100%;text-align:left;cursor:pointer;"
          >
            <img src="@/assets/img/Papelera.png" class="menu-nav__icon" alt="Eliminar" />
            Eliminar Cuenta
          </button>
        </nav>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { api } from '@/services/api'

const router    = useRouter()
const authStore = useAuthStore()
const toast     = useToast()
const { confirm } = useConfirm()

function cerrarSesion() {
  authStore.logout()
  router.push('/iniciar-sesion')
}

async function eliminarCuenta() {
  const ok = await confirm({
    title:       'Eliminar cuenta',
    message:     '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText:  'Cancelar',
    danger:      true
  })
  if (!ok) return

  try {
    await api.delete(`/Usuario/${authStore.usuario?.idUsuario}`)
    authStore.logout()
    router.push('/iniciar-sesion')
  } catch {
    toast.error('Error al eliminar la cuenta. Inténtalo de nuevo.')
  }
}
</script>