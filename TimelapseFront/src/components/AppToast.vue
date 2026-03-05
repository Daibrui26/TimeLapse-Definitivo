<template>
  <v-snackbar
    v-model="state.visible"
    location="top center"
    :color="colorMap[state.type]"
    :timeout="3500"
    rounded="lg"
    elevation="4"
    min-width="300"
    max-width="480"
  >
    <div class="d-flex align-center gap-2">
      <v-icon :icon="iconMap[state.type]" size="20" />
      <span style="font-size: 14px; font-weight: 500;">{{ state.message }}</span>
    </div>

    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click="hide"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { state, hide } = useToast()

const colorMap = {
  success: 'success',
  error:   'error',
  info:    'primary'
}

const iconMap = {
  success: 'mdi-check-circle',
  error:   'mdi-alert-circle',
  info:    'mdi-information'
}
</script>