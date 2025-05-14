import api from '@/services/api'
import { Produto } from './produtoService'

export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA_VENDA = 'SAIDA_VENDA',
  SAIDA_PERDA = 'SAIDA_PERDA',
  AJUSTE = 'AJUSTE'
}

export interface MovimentacaoEstoque {
  id?: number
  produtoId: number
  tipo: TipoMovimentacao
  quantidade: number
  quantidadeAnterior: number
  quantidadeNova: number
  observacao?: string
  produto?: Produto
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de movimentações de estoque
 */
export default {
  /**
   * Busca todas as movimentações
   * @param pagina Número da página
   * @param limite Limite de itens por página
   * @returns Promise com a lista de movimentações
   */
  listar(pagina: number = 1, limite: number = 10): Promise<{ data: MovimentacaoEstoque[], total: number }> {
    return api.get(`/movimentacoes?_page=${pagina}&_limit=${limite}`).then(response => {
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count'] || '0')
      }
    })
  },
  
  /**
   * Busca movimentações por produto
   * @param produtoId ID do produto
   * @returns Promise com a lista de movimentações
   */
  listarPorProduto(produtoId: number): Promise<MovimentacaoEstoque[]> {
    return api.get(`/movimentacoes?produtoId=${produtoId}`).then(response => response.data)
  },
  
  /**
   * Registra uma entrada de estoque
   * @param produtoId ID do produto
   * @param quantidade Quantidade a ser adicionada
   * @param observacao Observação opcional
   * @returns Promise com a movimentação criada
   */
  registrarEntrada(produtoId: number, quantidade: number, observacao?: string): Promise<MovimentacaoEstoque> {
    return api.post('/movimentacoes/entrada', { produtoId, quantidade, observacao }).then(response => response.data)
  },
  
  /**
   * Registra uma saída de estoque por venda
   * @param produtoId ID do produto
   * @param quantidade Quantidade a ser removida
   * @param observacao Observação opcional
   * @returns Promise com a movimentação criada
   */
  registrarSaidaVenda(produtoId: number, quantidade: number, observacao?: string): Promise<MovimentacaoEstoque> {
    return api.post('/movimentacoes/saida-venda', { produtoId, quantidade, observacao }).then(response => response.data)
  },
  
  /**
   * Registra uma saída de estoque por perda
   * @param produtoId ID do produto
   * @param quantidade Quantidade a ser removida
   * @param observacao Observação opcional
   * @returns Promise com a movimentação criada
   */
  registrarSaidaPerda(produtoId: number, quantidade: number, observacao?: string): Promise<MovimentacaoEstoque> {
    return api.post('/movimentacoes/saida-perda', { produtoId, quantidade, observacao }).then(response => response.data)
  },
  
  /**
   * Registra um ajuste de estoque
   * @param produtoId ID do produto
   * @param quantidade Quantidade final após o ajuste
   * @param observacao Observação opcional
   * @returns Promise com a movimentação criada
   */
  registrarAjuste(produtoId: number, quantidade: number, observacao?: string): Promise<MovimentacaoEstoque> {
    return api.post('/movimentacoes/ajuste', { produtoId, quantidade, observacao }).then(response => response.data)
  }
}