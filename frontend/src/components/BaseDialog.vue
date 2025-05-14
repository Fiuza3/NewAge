<template>
  <v-dialog
    v-model="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <v-card>
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn
          v-if="!persistent"
          icon
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <slot></slot>
      </v-card-text>
      
      <v-card-actions v-if="$slots.actions">
        <v-spacer></v-spacer>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: '500px'
    },
    persistent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const close = () => {
      emit('update:modelValue', false)
    }
    
    return {
      close
    }
  }
})
</script>