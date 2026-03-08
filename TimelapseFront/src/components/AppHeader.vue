<template>
  <header class="header">
    <RouterLink :to="logoLink">
      <img
        src="@/assets/img/LogoCompletoClaro-removebg-preview.png"
        alt="Timelapse"
        class="header__logo"
      />
    </RouterLink>

    <RouterLink v-if="variant === 'public'" to="/iniciar-sesion" class="header__btn">
      Iniciar sesión
    </RouterLink>

    <RouterLink v-if="variant === 'app'" to="/menu">
      <img
        :src="fotoPerfil"
        alt="Perfil"
        class="header__profile"
      />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import perfilFallback from '@/assets/img/Perfil-removebg-preview.png'

interface Props {
  variant?: 'public' | 'app'
  logoLink?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'app',
  logoLink: '/home'
})

const authStore = useAuthStore()

const fotoPerfil = computed(() =>
  authStore.usuario?.fotoPerfil || perfilFallback
)
</script>