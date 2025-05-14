import api from '@/services/api'
import { Categoria } from './categoriaService'
import { Fornecedor } from './fornecedorService'

export interface Produto {
  id?: number
  nome: string
  descricao?: string
  sku: string
  categoriaId: number
  fornecedorId: number
  unidadeMedida: string
  quantidadeMinima: number
  quantidadeMaxima: number
  quantidadeAtual: number
  custo: number
  precoVenda: number
  categoria?: Categoria
  fornecedor?: Fornecedor
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de produtos
 */
export default {
  /**
   * Busca todos os produtos
   * @param pagina Número da página
   * @param limite Limite de itens por página
   * @returns Promise com a lista de produtos
   */
  listar(pagina: number = 1, limite: number = 10): Promise<{ data: Produto[], total: number }> {
    return api.get(`/produtos?_page=${pagina}&_limit=${limite}`).then(response => {
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count'] || '0')
      }
    })
  },
  
  /**
   * Busca produtos por categoria
   * @param categoriaId ID da categoria
   * @returns Promise com a lista de produtos
   */
  listarPorCategoria(categoriaId: number): Promise<Produto[]> {
    return api.get(`/produtos?categoriaId=${categoriaId}`).then(response => response.data)
  },
  
  /**
   * Busca produtos por fornecedor
   * @param fornecedorId ID do fornecedor
   * @returns Promise com a lista de produtos
   */
  listarPorFornecedor(fornecedorId: number): Promise<Produto[]> {
    return api.get(`/produtos?fornecedorId=${fornecedorId}`).then(response => response.data)
  },
  
  /**
   * Busca um produto pelo ID
   * @param id ID do produto
   * @returns Promise com os dados do produto
   */
  buscarPorId(id: number): Promise<Produto> {
    return api.get(`/produtos/${id}`).then(response => response.data)
  },
  
  /**
   * Cria um novo produto
   * @param produto Dados do produto
   * @returns Promise com o produto criado
   */
  criar(produto: Produto): Promise<Produto> {
    return api.post('/produtos', produto).then(response => response.data)
  },
  
  /**
   * Atualiza um produto existente
   * @param id ID do produto
   * @param produto Dados do produto
   * @returns Promise com o produto atualizado
   */
  atualizar(id: number, produto: Produto): Promise<Produto> {
    return api.put(`/produtos/${id}`, produto).then(response => response.data)
  },
  
  /**
   * Remove um produto
   * @param id ID do produto
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/produtos/${id}`).then(() => {})
  }
}