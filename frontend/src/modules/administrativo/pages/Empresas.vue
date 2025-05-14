<template>
  <div class="empresas">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Empresas</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/administrativo/empresas/nova">
        Nova Empresa
      </v-btn>
    </div>
    
    <base-card>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar empresas"
        single-line
        hide-details
        class="na-mb-3"
      ></v-text-field>
      
      <base-table
        :headers="headers"
        :items="empresas"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/administrativo/empresas/${item.id}`"
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
      <p>Deseja realmente excluir a empresa <strong>{{ empresaSelecionada?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirEmpresa" :loading="excluindo">
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
import empresaService, { Empresa } from '../services/empresaService'

export default defineComponent({
  name: 'Empresas',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const empresas = ref<Empresa[]>([])
    const loading = ref(true)
    const search = ref('')
    const dialogExclusao = ref(false)
    const empresaSelecionada = ref<Empresa | null>(null)
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
      { title: 'Área de Atuação', key: 'areaAtuacao' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Carrega a lista de empresas
    const carregarEmpresas = async () => {
      loading.value = true
      try {
        empresas.value = await empresaService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar empresas', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma a exclusão de uma empresa
    const confirmarExclusao = (empresa: Empresa) => {
      empresaSelecionada.value = empresa
      dialogExclusao.value = true
    }
    
    // Exclui a empresa selecionada
    const excluirEmpresa = async () => {
      if (!empresaSelecionada.value?.id) return
      
      excluindo.value = true
      try {
        await empresaService.remover(empresaSelecionada.value.id)
        mostrarNotificacao('Empresa excluída com sucesso')
        dialogExclusao.value = false
        carregarEmpresas()
      } catch (error) {
        mostrarNotificacao('Erro ao excluir empresa', 'error')
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
    
    // Carrega as empresas ao montar o componente
    onMounted(() => {
      carregarEmpresas()
    })
    
    return {
      empresas,
      loading,
      search,
      headers,
      dialogExclusao,
      empresaSelecionada,
      excluindo,
      snackbar,
      confirmarExclusao,
      excluirEmpresa
    }
  }
})
</script>