<template>
  <div class="produtos">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Produtos</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/estoque/produtos/novo">
        Novo Produto
      </v-btn>
    </div>
    
    <base-card>
      <div class="d-flex align-center na-mb-3">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar produtos"
          single-line
          hide-details
          class="mr-3"
        ></v-text-field>
        
        <v-select
          v-model="categoriaFiltro"
          :items="categorias"
          item-title="nome"
          item-value="id"
          label="Filtrar por categoria"
          clearable
          hide-details
          class="mr-3"
          @update:model-value="filtrarPorCategoria"
        ></v-select>
        
        <v-select
          v-model="fornecedorFiltro"
          :items="fornecedores"
          item-title="nome"
          item-value="id"
          label="Filtrar por fornecedor"
          clearable
          hide-details
          @update:model-value="filtrarPorFornecedor"
        ></v-select>
      </div>
      
      <base-table
        :headers="headers"
        :items="produtos"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.quantidadeAtual="{ item }">
          <v-chip
            :color="getEstoqueColor(item)"
            text-color="white"
            size="small"
          >
            {{ item.quantidadeAtual }} {{ item.unidadeMedida }}
          </v-chip>
        </template>
        
        <template v-slot:item.custo="{ item }">
          {{ formatarMoeda(item.custo) }}
        </template>
        
        <template v-slot:item.precoVenda="{ item }">
          {{ formatarMoeda(item.precoVenda) }}
        </template>
        
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/estoque/produtos/${item.id}`"
            title="Editar"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="success"
            @click="abrirMovimentacao(item)"
            title="Movimentar estoque"
          >
            <v-icon>mdi-package-variant</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="info"
            @click="verHistorico(item)"
            title="Histórico de movimentações"
          >
            <v-icon>mdi-history</v-icon>
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
      
      <!-- Scroll infinito -->
      <div class="text-center na-mt-3" v-if="temMaisPaginas">
        <v-btn
          color="primary"
          variant="text"
          :loading="carregandoMais"
          @click="carregarMais"
        >
          Carregar mais
        </v-btn>
      </div>
    </base-card>
    
    <!-- Dialog de movimentação de estoque -->
    <base-dialog
      v-model="dialogMovimentacao"
      :title="'Movimentação de Estoque - ' + produtoSelecionado?.nome"
      max-width="500px"
    >
      <v-form ref="formMovimentacao" @submit.prevent="salvarMovimentacao" v-model="formMovimentacaoValido">
        <v-select
          v-model="movimentacao.tipo"
          :items="tiposMovimentacao"
          item-title="texto"
          item-value="valor"
          label="Tipo de Movimentação"
          :rules="[v => !!v || 'Tipo é obrigatório']"
          required
        ></v-select>
        
        <v-text-field
          v-model="movimentacao.quantidade"
          label="Quantidade"
          type="number"
          :suffix="produtoSelecionado?.unidadeMedida"
          :rules="[
            v => !!v || 'Quantidade é obrigatória',
            v => v > 0 || 'Quantidade deve ser maior que zero'
          ]"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="movimentacao.observacao"
          label="Observação"
          rows="3"
        ></v-textarea>
        
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="mr-2"
            @click="dialogMovimentacao = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="salvandoMovimentacao"
            :disabled="!formMovimentacaoValido"
          >
            Confirmar
          </v-btn>
        </div>
      </v-form>
    </base-dialog>
    
    <!-- Dialog de histórico de movimentações -->
    <base-dialog
      v-model="dialogHistorico"
      :title="'Histórico de Movimentações - ' + produtoSelecionado?.nome"
      max-width="800px"
    >
      <v-data-table
        :headers="headersHistorico"
        :items="historicoMovimentacoes"
        :loading="carregandoHistorico"
        class="na-table"
      >
        <template v-slot:item.tipo="{ item }">
          <v-chip
            :color="getTipoMovimentacaoColor(item.tipo)"
            text-color="white"
            size="small"
          >
            {{ getTipoMovimentacaoTexto(item.tipo) }}
          </v-chip>
        </template>
        
        <template v-slot:item.quantidade="{ item }">
          {{ item.quantidade }} {{ produtoSelecionado?.unidadeMedida }}
        </template>
        
        <template v-slot:item.quantidadeAnterior="{ item }">
          {{ item.quantidadeAnterior }} {{ produtoSelecionado?.unidadeMedida }}
        </template>
        
        <template v-slot:item.quantidadeNova="{ item }">
          {{ item.quantidadeNova }} {{ produtoSelecionado?.unidadeMedida }}
        </template>
        
        <template v-slot:item.createdAt="{ item }">
          {{ formatarDataHora(item.createdAt) }}
        </template>
      </v-data-table>
      
      <div class="d-flex justify-end na-mt-3">
        <v-btn
          color="primary"
          @click="dialogHistorico = false"
        >
          Fechar
        </v-btn>
      </div>
    </base-dialog>
    
    <!-- Dialog de confirmação de exclusão -->
    <base-dialog
      v-model="dialogExclusao"
      title="Confirmar exclusão"
      max-width="400px"
    >
      <p>Deseja realmente excluir o produto <strong>{{ produtoSelecionado?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirProduto" :loading="excluindo">
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
import produtoService, { Produto } from '../services/produtoService'
import categoriaService, { Categoria } from '../services/categoriaService'
import fornecedorService, { Fornecedor } from '../services/fornecedorService'
import movimentacaoService, { MovimentacaoEstoque, TipoMovimentacao } from '../services/movimentacaoService'

export default defineComponent({
  name: 'Produtos',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const produtos = ref<Produto[]>([])
    const categorias = ref<Categoria[]>([])
    const fornecedores = ref<Fornecedor[]>([])
    const loading = ref(true)
    const carregandoMais = ref(false)
    const search = ref('')
    const categoriaFiltro = ref<number | null>(null)
    const fornecedorFiltro = ref<number | null>(null)
    const dialogExclusao = ref(false)
    const dialogMovimentacao = ref(false)
    const dialogHistorico = ref(false)
    const produtoSelecionado = ref<Produto | null>(null)
    const excluindo = ref(false)
    const formMovimentacao = ref(null)
    const formMovimentacaoValido = ref(false)
    const salvandoMovimentacao = ref(false)
    const historicoMovimentacoes = ref<MovimentacaoEstoque[]>([])
    const carregandoHistorico = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Paginação
    const paginaAtual = ref(1)
    const limitePorPagina = ref(10)
    const totalItens = ref(0)
    const temMaisPaginas = ref(false)
    
    // Dados da movimentação
    const movimentacao = ref({
      tipo: TipoMovimentacao.ENTRADA,
      quantidade: 0,
      observacao: ''
    })
    
    // Tipos de movimentação
    const tiposMovimentacao = [
      { texto: 'Entrada', valor: TipoMovimentacao.ENTRADA },
      { texto: 'Saída por Venda', valor: TipoMovimentacao.SAIDA_VENDA },
      { texto: 'Saída por Perda', valor: TipoMovimentacao.SAIDA_PERDA },
      { texto: 'Ajuste', valor: TipoMovimentacao.AJUSTE }
    ]
    
    // Definição das colunas da tabela de produtos
    const headers = [
      { title: 'SKU', key: 'sku' },
      { title: 'Nome', key: 'nome' },
      { title: 'Categoria', key: 'categoria.nome' },
      { title: 'Fornecedor', key: 'fornecedor.nome' },
      { title: 'Estoque', key: 'quantidadeAtual' },
      { title: 'Custo', key: 'custo' },
      { title: 'Preço', key: 'precoVenda' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Definição das colunas da tabela de histórico
    const headersHistorico = [
      { title: 'Data/Hora', key: 'createdAt' },
      { title: 'Tipo', key: 'tipo' },
      { title: 'Quantidade', key: 'quantidade' },
      { title: 'Estoque Anterior', key: 'quantidadeAnterior' },
      { title: 'Estoque Atual', key: 'quantidadeNova' },
      { title: 'Observação', key: 'observacao' }
    ]
    
    // Carrega a lista de produtos
    const carregarProdutos = async (pagina: number = 1) => {
      if (pagina === 1) loading.value = true
      else carregandoMais.value = true
      
      try {
        const resultado = await produtoService.listar(pagina, limitePorPagina.value)
        
        if (pagina === 1) {
          produtos.value = resultado.data
        } else {
          produtos.value = [...produtos.value, ...resultado.data]
        }
        
        totalItens.value = resultado.total
        temMaisPaginas.value = produtos.value.length < totalItens.value
        paginaAtual.value = pagina
      } catch (error) {
        mostrarNotificacao('Erro ao carregar produtos', 'error')
        console.error(error)
      } finally {
        loading.value = false
        carregandoMais.value = false
      }
    }
    
    // Carrega mais produtos (scroll infinito)
    const carregarMais = () => {
      carregarProdutos(paginaAtual.value + 1)
    }
    
    // Carrega as categorias para o filtro
    const carregarCategorias = async () => {
      try {
        categorias.value = await categoriaService.listar()
      } catch (error) {
        console.error(error)
      }
    }
    
    // Carrega os fornecedores para o filtro
    const carregarFornecedores = async () => {
      try {
        fornecedores.value = await fornecedorService.listar()
      } catch (error) {
        console.error(error)
      }
    }
    
    // Filtra produtos por categoria
    const filtrarPorCategoria = async () => {
      if (!categoriaFiltro.value) {
        if (!fornecedorFiltro.value) {
          carregarProdutos(1)
        } else {
          filtrarPorFornecedor()
        }
        return
      }
      
      loading.value = true
      try {
        produtos.value = await produtoService.listarPorCategoria(categoriaFiltro.value)
        temMaisPaginas.value = false
      } catch (error) {
        mostrarNotificacao('Erro ao filtrar produtos', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Filtra produtos por fornecedor
    const filtrarPorFornecedor = async () => {
      if (!fornecedorFiltro.value) {
        if (!categoriaFiltro.value) {
          carregarProdutos(1)
        } else {
          filtrarPorCategoria()
        }
        return
      }
      
      loading.value = true
      try {
        produtos.value = await produtoService.listarPorFornecedor(fornecedorFiltro.value)
        temMaisPaginas.value = false
      } catch (error) {
        mostrarNotificacao('Erro ao filtrar produtos', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Abre o dialog de movimentação de estoque
    const abrirMovimentacao = (produto: Produto) => {
      produtoSelecionado.value = produto
      movimentacao.value = {
        tipo: TipoMovimentacao.ENTRADA,
        quantidade: 0,
        observacao: ''
      }
      dialogMovimentacao.value = true
    }
    
    // Salva a movimentação de estoque
    const salvarMovimentacao = async () => {
      if (!produtoSelecionado.value?.id) return
      
      salvandoMovimentacao.value = true
      try {
        const { tipo, quantidade, observacao } = movimentacao.value
        
        switch (tipo) {
          case TipoMovimentacao.ENTRADA:
            await movimentacaoService.registrarEntrada(produtoSelecionado.value.id, quantidade, observacao)
            break
          case TipoMovimentacao.SAIDA_VENDA:
            await movimentacaoService.registrarSaidaVenda(produtoSelecionado.value.id, quantidade, observacao)
            break
          case TipoMovimentacao.SAIDA_PERDA:
            await movimentacaoService.registrarSaidaPerda(produtoSelecionado.value.id, quantidade, observacao)
            break
          case TipoMovimentacao.AJUSTE:
            await movimentacaoService.registrarAjuste(produtoSelecionado.value.id, quantidade, observacao)
            break
        }
        
        mostrarNotificacao('Movimentação registrada com sucesso')
        dialogMovimentacao.value = false
        carregarProdutos(1)
      } catch (error) {
        mostrarNotificacao('Erro ao registrar movimentação', 'error')
        console.error(error)
      } finally {
        salvandoMovimentacao.value = false
      }
    }
    
    // Abre o dialog de histórico de movimentações
    const verHistorico = async (produto: Produto) => {
      if (!produto.id) return
      
      produtoSelecionado.value = produto
      dialogHistorico.value = true
      carregandoHistorico.value = true
      
      try {
        historicoMovimentacoes.value = await movimentacaoService.listarPorProduto(produto.id)
      } catch (error) {
        mostrarNotificacao('Erro ao carregar histórico', 'error')
        console.error(error)
      } finally {
        carregandoHistorico.value = false
      }
    }
    
    // Confirma a exclusão de um produto
    const confirmarExclusao = (produto: Produto) => {
      produtoSelecionado.value = produto
      dialogExclusao.value = true
    }
    
    // Exclui o produto selecionado
    const excluirProduto = async () => {
      if (!produtoSelecionado.value?.id) return
      
      excluindo.value = true
      try {
        await produtoService.remover(produtoSelecionado.value.id)
        mostrarNotificacao('Produto excluído com sucesso')
        dialogExclusao.value = false
        carregarProdutos(1)
      } catch (error) {
        mostrarNotificacao('Erro ao excluir produto', 'error')
        console.error(error)
      } finally {
        excluindo.value = false
      }
    }
    
    // Retorna a cor do chip de estoque com base na quantidade
    const getEstoqueColor = (produto: Produto) => {
      if (produto.quantidadeAtual <= produto.quantidadeMinima) {
        return 'error'
      } else if (produto.quantidadeAtual >= produto.quantidadeMaxima) {
        return 'success'
      } else {
        return 'primary'
      }
    }
    
    // Retorna a cor do chip de tipo de movimentação
    const getTipoMovimentacaoColor = (tipo: TipoMovimentacao) => {
      switch (tipo) {
        case TipoMovimentacao.ENTRADA:
          return 'success'
        case TipoMovimentacao.SAIDA_VENDA:
          return 'primary'
        case TipoMovimentacao.SAIDA_PERDA:
          return 'error'
        case TipoMovimentacao.AJUSTE:
          return 'warning'
        default:
          return 'grey'
      }
    }
    
    // Retorna o texto do tipo de movimentação
    const getTipoMovimentacaoTexto = (tipo: TipoMovimentacao) => {
      switch (tipo) {
        case TipoMovimentacao.ENTRADA:
          return 'Entrada'
        case TipoMovimentacao.SAIDA_VENDA:
          return 'Saída (Venda)'
        case TipoMovimentacao.SAIDA_PERDA:
          return 'Saída (Perda)'
        case TipoMovimentacao.AJUSTE:
          return 'Ajuste'
        default:
          return tipo
      }
    }
    
    // Formata o valor monetário
    const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor)
    }
    
    // Formata a data e hora
    const formatarDataHora = (data: string) => {
      return new Date(data).toLocaleString('pt-BR')
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
      carregarProdutos()
      carregarCategorias()
      carregarFornecedores()
    })
    
    return {
      produtos,
      categorias,
      fornecedores,
      loading,
      carregandoMais,
      search,
      categoriaFiltro,
      fornecedorFiltro,
      headers,
      dialogExclusao,
      dialogMovimentacao,
      dialogHistorico,
      produtoSelecionado,
      excluindo,
      formMovimentacao,
      formMovimentacaoValido,
      salvandoMovimentacao,
      movimentacao,
      tiposMovimentacao,
      historicoMovimentacoes,
      headersHistorico,
      carregandoHistorico,
      snackbar,
      temMaisPaginas,
      filtrarPorCategoria,
      filtrarPorFornecedor,
      carregarMais,
      abrirMovimentacao,
      salvarMovimentacao,
      verHistorico,
      confirmarExclusao,
      excluirProduto,
      getEstoqueColor,
      getTipoMovimentacaoColor,
      getTipoMovimentacaoTexto,
      formatarMoeda,
      formatarDataHora
    }
  }
})
</script>