<template>
  <div class="departamento-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Departamento' : 'Novo Departamento' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="departamento.nome"
              label="Nome do Departamento"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="departamento.empresaId"
              :items="empresas"
              item-title="nome"
              item-value="id"
              label="Empresa"
              :rules="[v => !!v || 'Empresa é obrigatória']"
              required
              :loading="carregandoEmpresas"
            ></v-select>
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
import departamentoService, { Departamento } from '../services/departamentoService'
import empresaService, { Empresa } from '../services/empresaService'

export default defineComponent({
  name: 'DepartamentoForm',
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
    const carregandoEmpresas = ref(false)
    const empresas = ref<Empresa[]>([])
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados do departamento
    const departamento = ref<Departamento>({
      nome: '',
      empresaId: 0
    })
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Carrega a lista de empresas
    const carregarEmpresas = async () => {
      carregandoEmpresas.value = true
      try {
        empresas.value = await empresaService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar empresas', 'error')
        console.error(error)
      } finally {
        carregandoEmpresas.value = false
      }
    }
    
    // Carrega os dados do departamento para edição
    const carregarDepartamento = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await departamentoService.buscarPorId(id)
        departamento.value = data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados do departamento', 'error')
        console.error(error)
        router.push('/administrativo/departamentos')
      }
    }
    
    // Salva o departamento (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await departamentoService.atualizar(id, departamento.value)
          mostrarNotificacao('Departamento atualizado com sucesso')
        } else {
          await departamentoService.criar(departamento.value)
          mostrarNotificacao('Departamento cadastrado com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/administrativo/departamentos')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar departamento', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de departamentos
    const voltar = () => {
      router.push('/administrativo/departamentos')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarEmpresas()
      carregarDepartamento()
    })
    
    return {
      departamento,
      empresas,
      form,
      formValido,
      salvando,
      carregandoEmpresas,
      isEdicao,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>