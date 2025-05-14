<template>
  <div class="empresa-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Empresa' : 'Nova Empresa' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.nome"
              label="Nome da Empresa"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.cnpj"
              label="CNPJ"
              :rules="[
                v => !!v || 'CNPJ é obrigatório',
                v => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(v) || 'CNPJ inválido (formato: 00.000.000/0000-00)'
              ]"
              mask="##.###.###/####-##"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-text-field
              v-model="empresa.areaAtuacao"
              label="Área de Atuação"
              :rules="[v => !!v || 'Área de atuação é obrigatória']"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="mr-2"
            @click="voltar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="salvando"
            :disabled="!formValido"
          >
            {{ isEdicao ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </div>
      </v-form>
    </base-card>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import empresaService, { Empresa } from '../services/empresaService'

export default defineComponent({
  name: 'EmpresaForm',
  components: {
    BaseCard,
    BaseSnackbar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const form = ref(null)
    const formValido = ref(false)
    const salvando = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados da empresa
    const empresa = ref<Empresa>({
      nome: '',
      cnpj: '',
      areaAtuacao: ''
    })
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Carrega os dados da empresa para edição
    const carregarEmpresa = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await empresaService.buscarPorId(id)
        empresa.value = data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados da empresa', 'error')
        console.error(error)
        router.push('/administrativo/empresas')
      }
    }
    
    // Salva a empresa (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await empresaService.atualizar(id, empresa.value)
          mostrarNotificacao('Empresa atualizada com sucesso')
        } else {
          await empresaService.criar(empresa.value)
          mostrarNotificacao('Empresa cadastrada com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/administrativo/empresas')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar empresa', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de empresas
    const voltar = () => {
      router.push('/administrativo/empresas')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados da empresa ao montar o componente
    onMounted(() => {
      carregarEmpresa()
    })
    
    return {
      empresa,
      form,
      formValido,
      salvando,
      isEdicao,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>