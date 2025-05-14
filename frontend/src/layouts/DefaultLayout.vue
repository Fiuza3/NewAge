<template>
  <div class="default-layout">
    <v-layout>
      <!-- Sidebar fixa -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="miniVariant"
        permanent
        color="grey-lighten-4"
        class="sidebar"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="NewAge ERP"
          subtitle="Sistema de Gestão"
          @click="miniVariant = !miniVariant"
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="miniVariant = !miniVariant"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            :value="item"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Header fixo -->
      <v-app-bar color="primary" density="compact">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ currentPageTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>
        
        <!-- Botão de tema dark/light -->
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
        
        <!-- Menu de usuário -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item title="Perfil"></v-list-item>
            <v-list-item title="Configurações"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Sair"></v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Área dinâmica para conteúdo -->
      <v-main>
        <v-container fluid>
          <slot></slot>
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    const drawer = ref(true)
    const miniVariant = ref(false)
    const route = useRoute()
    const theme = useTheme()
    
    // Menu items
    const menuItems = [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
      { title: 'Empresas', icon: 'mdi-domain', to: '/administrativo/empresas' },
      { title: 'Departamentos', icon: 'mdi-office-building', to: '/administrativo/departamentos' },
      { title: 'Colaboradores', icon: 'mdi-account-group', to: '/administrativo/colaboradores' },
      { title: 'Configurações', icon: 'mdi-cog', to: '/administrativo/configuracoes' }
    ]
    
    // Título da página atual
    const currentPageTitle = computed(() => {
      return route.meta.title || 'NewAge ERP'
    })
    
    // Controle do tema
    const isDarkTheme = computed(() => theme.global.current.value.dark)
    
    const toggleTheme = () => {
      theme.global.name.value = isDarkTheme.value ? 'light' : 'dark'
    }

    return {
      drawer,
      miniVariant,
      menuItems,
      currentPageTitle,
      isDarkTheme,
      toggleTheme
    }
  }
})
</script>

<style lang="scss" scoped>
.default-layout {
  height: 100%;
}
</style>