<template>
  <div class="inventario-detalhes">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>Inventário - {{ formatarData(inventario.data) }}</h1>
    </div>
    
    <v-row>
      <v-col cols="12" md="8">
        <base-card>
          <div class="d-flex justify-space-between align-center na-mb-3">
            <h2 class="text-h6">Itens do Inventário</h2>
            <div>
              <v-btn
                v-if="inventario.status === 'EM_ANDAMENTO'"
                color="primary"
                class="mr-2"
                @click="dialogAdicionarItem = true"
              >
                Adicionar Item
              </v-btn>
              <v-btn
                v-if="inventario.status === 'EM_ANDAMENTO'"
                color="success"
                @click="confirmarFinalizacao"
              >
                Finalizar Inventário
              </v-btn>
            </div>
          </div>
          
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar itens"
            single-line
            hide-details
            class="na-mb-3"
          ></v-text-field>
          
          <v-data-table
            :headers="headers"
            :items="inventario.itens || []"
            :loading="loading"
            :search="search"
            class="na-table"
          >
            <template v-slot:item.quantidadeSistema="{ item }">
              {{ item.quantidadeSistema }} {{ item.produto?.unidadeMedida }}
            </template>
            
            <template v-slot:item.quantidadeContada="{ item }">
              <div v-if="inventario.status === 'EM_ANDAMENTO'">
                <v-text-field
                  v-model="item.quantidadeContada"
                  type="number"
                  step="0.01"
                  density="compact"
                  hide-details
                  :suffix="item.produto?.unidadeMedida"
                  @change="atualizarItem(item)"
                ></v-text-field>
              </div>
              <div v-else>
                {{ item.quantidadeContada }} {{ item.produto?.unidadeMedida }}
              </div>
            </template>
            
            <template v-slot:item.diferenca="{ item }">
              <v-chip
                :color="getDiferencaColor(item)"
                text-color="white"
                size="small"
              >
                {{ item.diferenca }} {{ item.produto?.unidadeMedida }}
              </v-chip>
            </template>
            
            <template v-slot:item.acoes="{ item }">
              <v-btn
                v-if="inventario.status === 'EM_ANDAMENTO'"
                icon
                variant="text"
                color="error"
                @click="confirmarRemocaoItem(item)"
                title="Remover item"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </base-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <base-card>
          <h2 class="text-h6 na-mb-3">Detalhes do Inventário</h2>
          
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar</v-icon>
              </template>
              <v-list-item-title>Data</v-list-item-title>
              <v-list-item-subtitle>{{ formatarData(inventario.data) }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon :color="getStatusColor(inventario.status)">mdi-information</v-icon>
              </template>
              <v-list-item-title>Status</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="getStatusColor(inventario.status)"
                  text-color="white"
                  size="small"
                >
                  {{ getStatusTexto(inventario.status) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-text</v-icon>
              </template>
              <v-list-item-title>Observação</v-list-item-title>
              <v-list-item-subtitle>{{ inventario.observacao || 'Nenhuma observação' }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-package-variant</v-icon>
              </template>
              <v-list-item-title>Total de Itens</v-list-item-title>
              <v-list-item-subtitle>{{ (inventario.itens || []).length }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="error">mdi-alert-circle</v-icon>
              </template>
              <v-list-item-title>Itens com Divergência</v-list-item-title>
              <v-list-item-subtitle>{{ itensDivergentes.length }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <div class="d-flex justify-center na-mt-3">
            <v-btn
              v-if="inventario.status === 'CONCLUIDO'"
              color="primary"
              prepend-icon="mdi-file-document"
              @click="gerarRelatorio"
            >
              Gerar Relatório
            </v-btn>
          </div>
        </base-card>
      </v-col>
    </v-row>
    
    <!-- Dialog para adicionar item -->
    <base-dialog
      v-model="dialogAdicionarItem"
      title="Adicionar Item ao Inventário"
      max-width="500px"
    >
      <v-form ref="formItem" @submit.prevent="adicionarItem" v-model="formItemValido">
        <v-select
          v-model="novoItem.produtoId"
          :items="produtosDisponiveis"
          item-title="nome"
          item-value="id"
          label="Produto"
          :rules="[v => !!v || 'Produto é obrigatório']"
          required
          :loading="carregandoProdutos"
        >
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="item.raw.nome" :subtitle="`SKU: ${item.raw.sku}`"></v-list-item>
          </template>
        </v-select>
        
        <v-text-field
          v-model="novoItem.quantidadeContada"
          label="Quantidade Contada"
          type="number"
          step="0.01"
          :suffix="getProdutoUnidade(novoItem.produtoId)"
          :rules="[
            v => !!v || 'Quantidade contada é obrigatória',
            v => v >= 0 || 'Quantidade contada deve ser maior ou igual a zero'
          ]"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="novoItem.observacao"
          label="Observação"
          rows="3"
        ></v-textarea>
        
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="mr-2"
            @click="dialogAdicionarItem = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="adicionandoItem"
            :disabled="!formItemValido"
          >
            Adicionar
          </v-btn>
        </div>
      </v-form>
    </base-dialog>
    
    <!-- Dialog de confirmação de finalização -->
    <base-dialog
      v-model="dialogFinalizacao"
      title="Finalizar Inventário"
      max-width="500px"
    >
      <p>Deseja realmente finalizar este inventário?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <v-checkbox
        v-model="ajustarEstoque"
        label="Ajustar estoque automaticamente com base nas diferenças"
      ></v-checkbox>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogFinalizacao = false">
          Cancelar
        </v-btn>
        <v-btn color="success" @click="finalizarInventario" :loading="finalizando">
          Finalizar
        </v-btn>
      </template>
    </base-dialog>
    
    <!-- Dialog de confirmação de remoção de item -->
    <base-dialog
      v-model="dialogRemoverItem"
      title="Remover Item"
      max-width="400px"
    >
      <p>Deseja realmente remover este item do inventário?</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogRemoverItem = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="removerItem" :loading="removendoItem">
          Remover
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import inventarioService, { Inventario, ItemInventario, StatusInventario } from '../services/inventarioService'
import produtoService, { Produto } from '../services/produtoService'

export default defineComponent({
  name: 'InventarioDetalhes',
  components: {
    BaseCard,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const search = ref('')
    const inventario = ref<Inventario>({
      data: new Date().toISOString().split('T')[0],
      status: StatusInventario.EM_ANDAMENTO,
      itens: []
    })
    
    // Dialogs
    const dialogAdicionarItem = ref(false)
    const dialogFinalizacao = ref(false)
    const dialogRemoverItem = ref(false)
    
    // Form de item
    const formItem = ref(null)
    const formItemValido = ref(false)
    const adicionandoItem = ref(false)
    const finalizando = ref(false)
    const removendoItem = ref(false)
    const ajustarEstoque = ref(true)
    
    // Produtos
    const produtos = ref<Produto[]>([])
    const carregandoProdutos = ref(false)
    const itemSelecionado = ref<ItemInventario | null>(null)
    
    // Novo item
    const novoItem = ref<Partial<ItemInventario>>({
      produtoId: 0,
      quantidadeContada: 0,
      observacao: ''
    })
    
    // Notificações
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Definição das colunas da tabela
    const headers = [
      { title: 'Produto', key: 'produto.nome' },
      { title: 'SKU', key: 'produto.sku' },
      { title: 'Qtd. Sistema', key: 'quantidadeSistema' },
      { title: 'Qtd. Contada', key: 'quantidadeContada' },
      { title: 'Diferença', key: 'diferenca' },
      { title: 'Observação', key: 'observacao' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Produtos disponíveis para adicionar (que ainda não estão no inventário)
    const produtosDisponiveis = computed(() => {
      const itensIds = (inventario.value.itens || []).map(item => item.produtoId)
      return produtos.value.filter(produto => !itensIds.includes(produto.id!))
    })
    
    // Itens com divergência
    const itensDivergentes = computed(() => {
      return (inventario.value.itens || []).filter(item => item.diferenca !== 0)
    })
    
    // Carrega os dados do inventário
    const carregarInventario = async () => {
      if (!route.params.id) return
      
      loading.value = true
      try {
        const id = parseInt(route.params.id as string)
        inventario.value = await inventarioService.buscarPorId(id)
      } catch (error) {
        mostrarNotificacao('Erro ao carregar inventário', 'error')
        console.error(error)
        router.push('/estoque/inventarios')
      } finally {
        loading.value = false
      }
    }
    
    // Carrega a lista de produtos
    const carregarProdutos = async () => {
      carregandoProdutos.value = true
      try {
        const resultado = await produtoService.listar(1, 1000)
        produtos.value = resultado.data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar produtos', 'error')
        console.error(error)
      } finally {
        carregandoProdutos.value = false
      }
    }
    
    // Adiciona um item ao inventário
    const adicionarItem = async () => {
      if (!inventario.value.id) return
      
      adicionandoItem.value = true
      try {
        const item = await inventarioService.adicionarItem(inventario.value.id, {
          inventarioId: inventario.value.id,
          produtoId: novoItem.value.produtoId!,
          quantidadeSistema: 0, // Será preenchido pelo backend
          quantidadeContada: novoItem.value.quantidadeContada!,
          diferenca: 0, // Será calculado pelo backend
          observacao: novoItem.value.observacao
        })
        
        // Adiciona o item à lista
        if (!inventario.value.itens) {
          inventario.value.itens = []
        }
        
        // Busca o produto para adicionar ao item
        const produto = produtos.value.find(p => p.id === item.produtoId)
        if (produto) {
          item.produto = produto
        }
        
        inventario.value.itens.push(item)
        
        mostrarNotificacao('Item adicionado com sucesso')
        dialogAdicionarItem.value = false
        
        // Limpa o formulário
        novoItem.value = {
          produtoId: 0,
          quantidadeContada: 0,
          observacao: ''
        }
      } catch (error) {
        mostrarNotificacao('Erro ao adicionar item', 'error')
        console.error(error)
      } finally {
        adicionandoItem.value = false
      }
    }
    
    // Atualiza um item do inventário
    const atualizarItem = async (item: ItemInventario) => {
      if (!inventario.value.id || !item.id) return
      
      try {
        // Calcula a diferença
        item.diferenca = item.quantidadeContada - item.quantidadeSistema
        
        await inventarioService.atualizarItem(inventario.value.id, item.id, item)
      } catch (error) {
        mostrarNotificacao('Erro ao atualizar item', 'error')
        console.error(error)
      }
    }
    
    // Confirma a remoção de um item
    const confirmarRemocaoItem = (item: ItemInventario) => {
      itemSelecionado.value = item
      dialogRemoverItem.value = true
    }
    
    // Remove um item do inventário
    const removerItem = async () => {
      if (!inventario.value.id || !itemSelecionado.value?.id) return
      
      removendoItem.value = true
      try {
        // Aqui seria uma chamada para remover o item
        // Como não temos essa API, vamos simular removendo do array local
        inventario.value.itens = inventario.value.itens?.filter(
          item => item.id !== itemSelecionado.value?.id
        )
        
        mostrarNotificacao('Item removido com sucesso')
        dialogRemoverItem.value = false
      } catch (error) {
        mostrarNotificacao('Erro ao remover item', 'error')
        console.error(error)
      } finally {
        removendoItem.value = false
      }
    }
    
    // Confirma a finalização do inventário
    const confirmarFinalizacao = () => {
      dialogFinalizacao.value = true
    }
    
    // Finaliza o inventário
    const finalizarInventario = async () => {
      if (!inventario.value.id) return
      
      finalizando.value = true
      try {
        await inventarioService.finalizar(inventario.value.id, ajustarEstoque.value)
        mostrarNotificacao('Inventário finalizado com sucesso')
        dialogFinalizacao.value = false
        carregarInventario()
      } catch (error) {
        mostrarNotificacao('Erro ao finalizar inventário', 'error')
        console.error(error)
      } finally {
        finalizando.value = false
      }
    }
    
    // Gera o relatório do inventário
    const gerarRelatorio = async () => {
      if (!inventario.value.id) return
      
      try {
        const resultado = await inventarioService.gerarRelatorio(inventario.value.id)
        window.open(resultado.url, '_blank')
      } catch (error) {
        mostrarNotificacao('Erro ao gerar relatório', 'error')
        console.error(error)
      }
    }
    
    // Retorna a unidade de medida do produto
    const getProdutoUnidade = (produtoId: number) => {
      const produto = produtos.value.find(p => p.id === produtoId)
      return produto?.unidadeMedida || 'UN'
    }
    
    // Retorna a cor do chip de diferença
    const getDiferencaColor = (item: ItemInventario) => {
      if (item.diferenca < 0) {
        return 'error'
      } else if (item.diferenca > 0) {
        return 'warning'
      } else {
        return 'success'
      }
    }
    
    // Retorna a cor do chip de status
    const getStatusColor = (status?: StatusInventario) => {
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
    const getStatusTexto = (status?: StatusInventario) => {
      switch (status) {
        case StatusInventario.EM_ANDAMENTO:
          return 'Em andamento'
        case StatusInventario.CONCLUIDO:
          return 'Concluído'
        case StatusInventario.CANCELADO:
          return 'Cancelado'
        default:
          return status || ''
      }
    }
    
    // Formata a data
    const formatarData = (data?: string) => {
      if (!data) return ''
      return new Date(data).toLocaleDateString('pt-BR')
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
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarInventario()
      carregarProdutos()
    })
    
    return {
      inventario,
      loading,
      search,
      headers,
      dialogAdicionarItem,
      dialogFinalizacao,
      dialogRemoverItem,
      formItem,
      formItemValido,
      adicionandoItem,
      finalizando,
      removendoItem,
      ajustarEstoque,
      produtos,
      carregandoProdutos,
      produtosDisponiveis,
      novoItem,
      itemSelecionado,
      itensDivergentes,
      snackbar,
      adicionarItem,
      atualizarItem,
      confirmarRemocaoItem,
      removerItem,
      confirmarFinalizacao,
      finalizarInventario,
      gerarRelatorio,
      getProdutoUnidade,
      getDiferencaColor,
      getStatusColor,
      getStatusTexto,
      formatarData,
      voltar
    }
  }
})
</script>