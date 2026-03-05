<template>
  <!-- v-app es obligatorio para que Vuetify funcione correctamente -->
  <v-app>
    <RouterView />
    <AppToast />
    <AppConfirm />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppToast from '@/components/AppToast.vue'
import AppConfirm from '@/components/AppConfirm.vue'
</script>