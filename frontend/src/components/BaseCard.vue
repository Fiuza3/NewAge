<template>
  <v-card class="na-card" :elevation="elevation" :loading="loading">
    <v-card-title v-if="title" class="na-card__title">
      {{ title }}
      <v-spacer></v-spacer>
      <slot name="title-actions"></slot>
    </v-card-title>
    
    <v-card-text class="na-card__content">
      <slot></slot>
    </v-card-text>
    
    <v-card-actions v-if="$slots.actions" class="na-card__actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    elevation: {
      type: Number,
      default: 2
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
})
</script>