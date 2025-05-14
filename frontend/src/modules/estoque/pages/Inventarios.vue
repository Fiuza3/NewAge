<template>
  <div class="inventarios">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Inventários</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/estoque/inventarios/novo">
        Novo Inventário
      </v-btn>
    </div>
    
    <base-card>
      <base-table
        :headers="headers"
        :items="inventarios"
        :loading="loading"
      >
        <template v-slot:item.data="{ item }">
          {{ formatarData(item.data) }}
        </template>
        
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            text-color="white"
            size="small"
          >
            {{ getStatusTexto(item.status) }}
          </v-chip>
        </template>
        
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/estoque/inventarios/${item.id}`"
            title="Ver detalhes"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="success"
            @click="gerarRelatorio(item)"
            title="Gerar relatório"
            :disabled="item.status !== 'CONCLUIDO'"
          >
            <v-icon>mdi-file-document</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            @click="confirmarCancelamento(item)"
            title="Cancelar inventário"
            :disabled="item.status !== 'EM_ANDAMENTO'"
          >
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
        </template>
      </base-table>
    </base-card>
    
    <!-- Dialog de confirmação de cancelamento -->
    <base-dialog
      v-model="dialogCancelamento"
      title="Confirmar cancelamento"
      max-width="400px"
    >
      <p>Deseja realmente cancelar o inventário de <strong>{{ formatarData(inventarioSelecionado?.data) }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogCancelamento = false">
          Não
        </v-btn>
        <v-btn color="error" @click="cancelarInventario" :loading="cancelando">
          Sim, cancelar
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
import inventarioService, { Inventario, StatusInventario } from '../services/inventarioService'

export default defineComponent({
  name: 'Inventarios',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const inventarios = ref<Inventario[]>([])
    const loading = ref(true)
    const dialogCancelamento = ref(false)
    const inventarioSelecionado = ref<Inventario | null>(null)
    const cancelando = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Definição das colunas da tabela
    const headers = [
      { title: 'Data', key: 'data' },
      { title: 'Status', key: 'status' },
      { title: 'Observação', key: 'observacao' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Carrega a lista de inventários
    const carregarInventarios = async () => {
      loading.value = true
      try {
        inventarios.value = await inventarioService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar inventários', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma o cancelamento de um inventário
    const confirmarCancelamento = (inventario: Inventario) => {
      inventarioSelecionado.value = inventario
      dialogCancelamento.value = true
    }
    
    // Cancela o inventário selecionado
    const cancelarInventario = async () => {
      if (!inventarioSelecionado.value?.id) return
      
      cancelando.value = true
      try {
        await inventarioService.cancelar(inventarioSelecionado.value.id)
        mostrarNotificacao('Inventário cancelado com sucesso')
        dialogCancelamento.value = false
        carregarInventarios()
      } catch (error) {
        mostrarNotificacao('Erro ao cancelar inventário', 'error')
        console.error(error)
      } finally {
        cancelando.value = false
      }
    }
    
    // Gera o relatório do inventário
    const gerarRelatorio = async (inventario: Inventario) => {
      if (!inventario.id) return
      
      try {
        const resultado = await inventarioService.gerarRelatorio(inventario.id)
        window.open(resultado.url, '_blank')
      } catch (error) {
        mostrarNotificacao('Erro ao gerar relatório', 'error')
        console.error(error)
      }
    }
    
    // Retorna a cor do chip de status
    const getStatusColor = (status: StatusInventario) => {
      switch (status) {
        case StatusInventario.EM_ANDAMENTO:
          return 'primary'
        case StatusInventario.CONCLUIDO:
          return 'success'
        case StatusInventario.CANCELADO:
          return 'error'
        default:
          return 'grey'
      }
    }
    
    // Retorna o texto do status
    const getStatusTexto = (status: StatusInventario) => {
      switch (status) {
        case StatusInventario.EM_ANDAMENTO:
          return 'Em andamento'
        case StatusInventario.CONCLUIDO:
          return 'Concluído'
        case StatusInventario.CANCELADO:
          return 'Cancelado'
        default:
          return status
      }
    }
    
    // Formata a data
    const formatarData = (data?: string) => {
      if (!data) return ''
      return new Date(data).toLocaleDateString('pt-BR')
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
      carregarInventarios()
    })
    
    return {
      inventarios,
      loading,
      headers,
      dialogCancelamento,
      inventarioSelecionado,
      cancelando,
      snackbar,
      confirmarCancelamento,
      cancelarInventario,
      gerarRelatorio,
      getStatusColor,
      getStatusTexto,
      formatarData
    }
  }
})
</script>