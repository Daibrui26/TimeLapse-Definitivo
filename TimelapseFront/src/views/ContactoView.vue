<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--contact">
      <section class="card card--contact">
        <h1 class="card__title card__title--contact">
          Contáctanos para poder ayudarte
        </h1>

        <nav class="contact-nav">
          <a v-for="option in contactOptions" :key="option.id" :href="`#${option.id}`" class="contact-nav__option">
            <span class="contact-nav__icon">{{ option.icon }}</span>
            {{ option.label }}
          </a>
        </nav>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'

const contactOptions = [
  { id: 'reportar', icon: '🔧', label: 'Reportar fallo' },
  { id: 'denunciar', icon: '⚠️', label: 'Denunciar usuario' },
  { id: 'trabajo', icon: '💼', label: 'Trabaja con nosotros' },
  { id: 'sobre', icon: 'ℹ️', label: 'Sobre nosotros' },
  { id: 'otros', icon: '📝', label: 'Otros' }
]
</script>