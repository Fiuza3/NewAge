<template>
  <v-snackbar
    v-model="modelValue"
    :color="color"
    :timeout="timeout"
    :location="location"
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="close"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseSnackbar',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'success'
    },
    timeout: {
      type: Number,
      default: 5000
    },
    location: {
      type: String,
      default: 'bottom'
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