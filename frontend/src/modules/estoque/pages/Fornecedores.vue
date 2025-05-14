<template>
  <div class="fornecedores">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Fornecedores</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/estoque/fornecedores/novo">
        Novo Fornecedor
      </v-btn>
    </div>
    
    <base-card>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar fornecedores"
        single-line
        hide-details
        class="na-mb-3"
      ></v-text-field>
      
      <base-table
        :headers="headers"
        :items="fornecedores"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/estoque/fornecedores/${item.id}`"
            title="Editar"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            @click="confirmarExclusao(item)"
            title="Excluir"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </base-table>
    </base-card>
    
    <!-- Dialog de confirmação de exclusão -->
    <base-dialog
      v-model="dialogExclusao"
      title="Confirmar exclusão"
      max-width="400px"
    >
      <p>Deseja realmente excluir o fornecedor <strong>{{ fornecedorSelecionado?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirFornecedor" :loading="excluindo">
          Excluir
        </v-btn>
      </template>
    </base-dialog>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import fornecedorService, { Fornecedor } from '../services/fornecedorService'

export default defineComponent({
  name: 'Fornecedores',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const fornecedores = ref<Fornecedor[]>([])
    const loading = ref(true)
    const search = ref('')
    const dialogExclusao = ref(false)
    const fornecedorSelecionado = ref<Fornecedor | null>(null)
    const excluindo = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Definição das colunas da tabela
    const headers = [
      { title: 'Nome', key: 'nome' },
      { title: 'CNPJ', key: 'cnpj' },
      { title: 'Telefone', key: 'telefone' },
      { title: 'Email', key: 'email' },
      { title: 'Cidade/UF', key: 'cidade', formatter: (item: Fornecedor) => `${item.cidade}/${item.estado}` },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Carrega a lista de fornecedores
    const carregarFornecedores = async () => {
      loading.value = true
      try {
        fornecedores.value = await fornecedorService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar fornecedores', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma a exclusão de um fornecedor
    const confirmarExclusao = (fornecedor: Fornecedor) => {
      fornecedorSelecionado.value = fornecedor
      dialogExclusao.value = true
    }
    
    // Exclui o fornecedor selecionado
    const excluirFornecedor = async () => {
      if (!fornecedorSelecionado.value?.id) return
      
      excluindo.value = true
      try {
        await fornecedorService.remover(fornecedorSelecionado.value.id)
        mostrarNotificacao('Fornecedor excluído com sucesso')
        dialogExclusao.value = false
        carregarFornecedores()
      } catch (error) {
        mostrarNotificacao('Erro ao excluir fornecedor. Verifique se não há produtos vinculados.', 'error')
        console.error(error)
      } finally {
        excluindo.value = false
      }
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
      carregarFornecedores()
    })
    
    return {
      fornecedores,
      loading,
      search,
      headers,
      dialogExclusao,
      fornecedorSelecionado,
      excluindo,
      snackbar,
      confirmarExclusao,
      excluirFornecedor
    }
  }
})
</script>