import api from '@/services/api'
import { Produto } from './produtoService'

export enum StatusInventario {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export interface ItemInventario {
  id?: number
  inventarioId: number
  produtoId: number
  quantidadeSistema: number
  quantidadeContada: number
  diferenca: number
  observacao?: string
  produto?: Produto
  createdAt?: string
  updatedAt?: string
}

export interface Inventario {
  id?: number
  data: string
  observacao?: string
  status: StatusInventario
  itens?: ItemInventario[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de inventários
 */
export default {
  /**
   * Busca todos os inventários
   * @returns Promise com a lista de inventários
   */
  listar(): Promise<Inventario[]> {
    return api.get('/inventarios').then(response => response.data)
  },
  
  /**
   * Busca um inventário pelo ID
   * @param id ID do inventário
   * @returns Promise com os dados do inventário
   */
  buscarPorId(id: number): Promise<Inventario> {
    return api.get(`/inventarios/${id}`).then(response => response.data)
  },
  
  /**
   * Cria um novo inventário
   * @param inventario Dados do inventário
   * @returns Promise com o inventário criado
   */
  criar(inventario: Inventario): Promise<Inventario> {
    return api.post('/inventarios', inventario).then(response => response.data)
  },
  
  /**
   * Atualiza um inventário existente
   * @param id ID do inventário
   * @param inventario Dados do inventário
   * @returns Promise com o inventário atualizado
   */
  atualizar(id: number, inventario: Inventario): Promise<Inventario> {
    return api.put(`/inventarios/${id}`, inventario).then(response => response.data)
  },
  
  /**
   * Adiciona um item ao inventário
   * @param inventarioId ID do inventário
   * @param item Dados do item
   * @returns Promise com o item criado
   */
  adicionarItem(inventarioId: number, item: ItemInventario): Promise<ItemInventario> {
    return api.post(`/inventarios/${inventarioId}/itens`, item).then(response => response.data)
  },
  
  /**
   * Atualiza um item do inventário
   * @param inventarioId ID do inventário
   * @param itemId ID do item
   * @param item Dados do item
   * @returns Promise com o item atualizado
   */
  atualizarItem(inventarioId: number, itemId: number, item: ItemInventario): Promise<ItemInventario> {
    return api.put(`/inventarios/${inventarioId}/itens/${itemId}`, item).then(response => response.data)
  },
  
  /**
   * Finaliza um inventário
   * @param id ID do inventário
   * @param ajustarEstoque Se deve ajustar o estoque com base nas diferenças
   * @returns Promise com o inventário finalizado
   */
  finalizar(id: number, ajustarEstoque: boolean = false): Promise<Inventario> {
    return api.post(`/inventarios/${id}/finalizar`, { ajustarEstoque }).then(response => response.data)
  },
  
  /**
   * Cancela um inventário
   * @param id ID do inventário
   * @returns Promise com o inventário cancelado
   */
  cancelar(id: number): Promise<Inventario> {
    return api.post(`/inventarios/${id}/cancelar`).then(response => response.data)
  },
  
  /**
   * Gera um relatório do inventário
   * @param id ID do inventário
   * @returns Promise com a URL do relatório
   */
  gerarRelatorio(id: number): Promise<{ url: string }> {
    return api.get(`/inventarios/${id}/relatorio`).then(response => response.data)
  }
}