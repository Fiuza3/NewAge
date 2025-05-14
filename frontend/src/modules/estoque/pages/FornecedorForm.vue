<template>
  <div class="fornecedor-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fornecedor.nome"
              label="Nome do Fornecedor"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fornecedor.cnpj"
              label="CNPJ"
              :rules="[
                v => !!v || 'CNPJ é obrigatório',
                v => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(v) || 'CNPJ inválido (formato: 00.000.000/0000-00)'
              ]"
              mask="##.###.###/####-##"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fornecedor.email"
              label="Email"
              type="email"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fornecedor.telefone"
              label="Telefone"
              mask="(##) #####-####"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-text-field
              v-model="fornecedor.endereco"
              label="Endereço"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fornecedor.cidade"
              label="Cidade"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="2">
            <v-select
              v-model="fornecedor.estado"
              :items="estados"
              label="Estado"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="fornecedor.cep"
              label="CEP"
              mask="#####-###"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-text-field
              v-model="fornecedor.contato"
              label="Nome do Contato"
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
import fornecedorService, { Fornecedor } from '../services/fornecedorService'

export default defineComponent({
  name: 'FornecedorForm',
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
    
    // Lista de estados brasileiros
    const estados = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
      'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]
    
    // Dados do fornecedor
    const fornecedor = ref<Fornecedor>({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      contato: ''
    })
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Carrega os dados do fornecedor para edição
    const carregarFornecedor = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await fornecedorService.buscarPorId(id)
        fornecedor.value = data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados do fornecedor', 'error')
        console.error(error)
        router.push('/estoque/fornecedores')
      }
    }
    
    // Salva o fornecedor (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await fornecedorService.atualizar(id, fornecedor.value)
          mostrarNotificacao('Fornecedor atualizado com sucesso')
        } else {
          await fornecedorService.criar(fornecedor.value)
          mostrarNotificacao('Fornecedor cadastrado com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/estoque/fornecedores')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar fornecedor', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de fornecedores
    const voltar = () => {
      router.push('/estoque/fornecedores')
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
      carregarFornecedor()
    })
    
    return {
      fornecedor,
      estados,
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