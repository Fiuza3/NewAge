<template>
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    DefaultLayout,
    BlankLayout
  },
  setup() {
    const route = useRoute()
    
    // Determina qual layout usar com base na rota
    const layout = computed(() => {
      const layoutName = route.meta.layout || 'default'
      return layoutName === 'blank' ? 'BlankLayout' : 'DefaultLayout'
    })

    return {
      layout
    }
  }
})
</script>

<style lang="scss">
// Estilos globais
</style>