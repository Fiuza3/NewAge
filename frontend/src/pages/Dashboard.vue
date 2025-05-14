<template>
  <div class="dashboard">
    <h1 class="na-mb-3">Dashboard</h1>
    
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <base-card title="Empresas">
          <div class="text-center">
            <h3 class="text-h3">{{ empresasCount }}</h3>
            <p>Total de empresas</p>
          </div>
          <template #actions>
            <v-btn color="primary" to="/administrativo/empresas">
              Ver todas
            </v-btn>
          </template>
        </base-card>
      </v-col>
      
      <v-col cols="12" md="6" lg="3">
        <base-card title="Departamentos">
          <div class="text-center">
            <h3 class="text-h3">{{ departamentosCount }}</h3>
            <p>Total de departamentos</p>
          </div>
          <template #actions>
            <v-btn color="primary" to="/administrativo/departamentos">
              Ver todos
            </v-btn>
          </template>
        </base-card>
      </v-col>
      
      <v-col cols="12" md="6" lg="3">
        <base-card title="Colaboradores">
          <div class="text-center">
            <h3 class="text-h3">{{ colaboradoresCount }}</h3>
            <p>Total de colaboradores</p>
          </div>
          <template #actions>
            <v-btn color="primary" to="/administrativo/colaboradores">
              Ver todos
            </v-btn>
          </template>
        </base-card>
      </v-col>
      
      <v-col cols="12" md="6" lg="3">
        <base-card title="Configurações">
          <div class="text-center">
            <v-icon size="x-large" color="primary">mdi-cog</v-icon>
            <p>Configurações do sistema</p>
          </div>
          <template #actions>
            <v-btn color="primary" to="/administrativo/configuracoes">
              Acessar
            </v-btn>
          </template>
        </base-card>
      </v-col>
    </v-row>
    
    <v-row class="na-mt-3">
      <v-col cols="12">
        <base-card title="Bem-vindo ao NewAge ERP">
          <p>Este é o sistema de gestão empresarial NewAge. Utilize o menu lateral para navegar entre os módulos.</p>
          <p class="na-mt-2">Fase atual: Módulo Administrativo</p>
          <v-list>
            <v-list-item>
              <v-list-item-title>✅ Cadastro de Empresas</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>✅ Cadastro de Departamentos</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>✅ Cadastro de Colaboradores</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>✅ Configurações Gerais</v-list-item-title>
            </v-list-item>
          </v-list>
        </base-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseCard from '@/components/BaseCard.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    BaseCard
  },
  setup() {
    // Dados simulados para o dashboard
    const empresasCount = ref(0)
    const departamentosCount = ref(0)
    const colaboradoresCount = ref(0)
    
    // Simulação de carregamento de dados
    setTimeout(() => {
      empresasCount.value = 5
      departamentosCount.value = 12
      colaboradoresCount.value = 48
    }, 1000)
    
    return {
      empresasCount,
      departamentosCount,
      colaboradoresCount
    }
  }
})
</script>