<template>
  <v-dialog
    v-model="state.visible"
    max-width="420"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title v-if="state.title" class="pt-6 px-6 pb-2" style="color: #183263; font-weight: 700;">
        {{ state.title }}
      </v-card-title>

      <v-card-text class="px-6" :class="state.title ? 'pt-2' : 'pt-6'" style="color: #3A4156; font-size: 15px; line-height: 1.5;">
        {{ state.message }}
      </v-card-text>

      <v-card-actions class="px-6 pb-5 pt-4">
        <v-spacer />
        <v-btn
          variant="tonal"
          color="secondary"
          rounded="lg"
          @click="cancel"
        >
          {{ state.cancelText }}
        </v-btn>
        <v-btn
          :color="state.danger ? 'error' : 'primary'"
          variant="flat"
          rounded="lg"
          @click="accept"
        >
          {{ state.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { state, accept, cancel } = useConfirm()
</script>