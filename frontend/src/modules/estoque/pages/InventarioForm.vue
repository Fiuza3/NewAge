<template>
  <div class="inventario-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>Novo Inventário</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="inventario.data"
              label="Data do Inventário"
              type="date"
              :rules="[v => !!v || 'Data é obrigatória']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="inventario.observacao"
              label="Observação"
              rows="3"
            ></v-textarea>
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
            Criar Inventário
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import inventarioService, { Inventario, StatusInventario } from '../services/inventarioService'

export default defineComponent({
  name: 'InventarioForm',
  components: {
    BaseCard,
    BaseSnackbar
  },
  setup() {
    const router = useRouter()
    const form = ref(null)
    const formValido = ref(false)
    const salvando = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados do inventário
    const inventario = ref<Inventario>({
      data: new Date().toISOString().split('T')[0],
      status: StatusInventario.EM_ANDAMENTO,
      observacao: ''
    })
    
    // Salva o inventário
    const salvar = async () => {
      salvando.value = true
      
      try {
        const novoInventario = await inventarioService.criar(inventario.value)
        mostrarNotificacao('Inventário criado com sucesso')
        
        // Redireciona para a página de detalhes do inventário
        setTimeout(() => {
          router.push(`/estoque/inventarios/${novoInventario.id}`)
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao criar inventário', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de inventários
    const voltar = () => {
      router.push('/estoque/inventarios')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    return {
      inventario,
      form,
      formValido,
      salvando,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>