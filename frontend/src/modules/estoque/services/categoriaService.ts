import api from '@/services/api'

export interface Categoria {
  id?: number
  nome: string
  descricao?: string
  categoriaPaiId?: number | null
  categoriaPai?: Categoria
  subcategorias?: Categoria[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de categorias
 */
export default {
  /**
   * Busca todas as categorias
   * @returns Promise com a lista de categorias
   */
  listar(): Promise<Categoria[]> {
    return api.get('/categorias').then(response => response.data)
  },
  
  /**
   * Busca categorias raiz (sem categoria pai)
   * @returns Promise com a lista de categorias raiz
   */
  listarCategoriasPrincipais(): Promise<Categoria[]> {
    return api.get('/categorias/principais').then(response => response.data)
  },
  
  /**
   * Busca subcategorias de uma categoria
   * @param categoriaId ID da categoria pai
   * @returns Promise com a lista de subcategorias
   */
  listarSubcategorias(categoriaId: number): Promise<Categoria[]> {
    return api.get(`/categorias/${categoriaId}/subcategorias`).then(response => response.data)
  },
  
  /**
   * Busca uma categoria pelo ID
   * @param id ID da categoria
   * @returns Promise com os dados da categoria
   */
  buscarPorId(id: number): Promise<Categoria> {
    return api.get(`/categorias/${id}`).then(response => response.data)
  },
  
  /**
   * Cria uma nova categoria
   * @param categoria Dados da categoria
   * @returns Promise com a categoria criada
   */
  criar(categoria: Categoria): Promise<Categoria> {
    return api.post('/categorias', categoria).then(response => response.data)
  },
  
  /**
   * Atualiza uma categoria existente
   * @param id ID da categoria
   * @param categoria Dados da categoria
   * @returns Promise com a categoria atualizada
   */
  atualizar(id: number, categoria: Categoria): Promise<Categoria> {
    return api.put(`/categorias/${id}`, categoria).then(response => response.data)
  },
  
  /**
   * Remove uma categoria
   * @param id ID da categoria
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/categorias/${id}`).then(() => {})
  }
}