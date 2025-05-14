<template>
  <div class="colaborador-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Colaborador' : 'Novo Colaborador' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="colaborador.nome"
              label="Nome do Colaborador"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="colaborador.cargo"
              label="Cargo"
              :rules="[v => !!v || 'Cargo é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="colaborador.salario"
              label="Salário"
              type="number"
              prefix="R$"
              :rules="[
                v => !!v || 'Salário é obrigatório',
                v => v > 0 || 'Salário deve ser maior que zero'
              ]"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="colaborador.dataAdmissao"
              label="Data de Admissão"
              type="date"
              :rules="[v => !!v || 'Data de admissão é obrigatória']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-select
              v-model="colaborador.departamentoId"
              :items="departamentos"
              item-title="nome"
              item-value="id"
              label="Departamento"
              :rules="[v => !!v || 'Departamento é obrigatório']"
              required
              :loading="carregandoDepartamentos"
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="item.raw.nome" :subtitle="item.raw.empresaNome"></v-list-item>
              </template>
            </v-select>
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
import colaboradorService, { Colaborador } from '../services/colaboradorService'
import departamentoService, { Departamento } from '../services/departamentoService'

export default defineComponent({
  name: 'ColaboradorForm',
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
    const carregandoDepartamentos = ref(false)
    const departamentos = ref<Departamento[]>([])
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados do colaborador
    const colaborador = ref<Colaborador>({
      nome: '',
      cargo: '',
      salario: 0,
      dataAdmissao: new Date().toISOString().split('T')[0],
      departamentoId: 0
    })
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Carrega a lista de departamentos
    const carregarDepartamentos = async () => {
      carregandoDepartamentos.value = true
      try {
        departamentos.value = await departamentoService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar departamentos', 'error')
        console.error(error)
      } finally {
        carregandoDepartamentos.value = false
      }
    }
    
    // Carrega os dados do colaborador para edição
    const carregarColaborador = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await colaboradorService.buscarPorId(id)
        colaborador.value = {
          ...data,
          dataAdmissao: new Date(data.dataAdmissao).toISOString().split('T')[0]
        }
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados do colaborador', 'error')
        console.error(error)
        router.push('/administrativo/colaboradores')
      }
    }
    
    // Salva o colaborador (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await colaboradorService.atualizar(id, colaborador.value)
          mostrarNotificacao('Colaborador atualizado com sucesso')
        } else {
          await colaboradorService.criar(colaborador.value)
          mostrarNotificacao('Colaborador cadastrado com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/administrativo/colaboradores')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar colaborador', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de colaboradores
    const voltar = () => {
      router.push('/administrativo/colaboradores')
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
      carregarDepartamentos()
      carregarColaborador()
    })
    
    return {
      colaborador,
      departamentos,
      form,
      formValido,
      salvando,
      carregandoDepartamentos,
      isEdicao,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>