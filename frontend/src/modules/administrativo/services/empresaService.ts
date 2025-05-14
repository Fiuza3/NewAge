import api from '@/services/api'

export interface Empresa {
  id?: number
  nome: string
  cnpj: string
  areaAtuacao: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de empresas
 */
export default {
  /**
   * Busca todas as empresas
   * @returns Promise com a lista de empresas
   */
  listar(): Promise<Empresa[]> {
    return api.get('/empresas').then(response => response.data)
  },
  
  /**
   * Busca uma empresa pelo ID
   * @param id ID da empresa
   * @returns Promise com os dados da empresa
   */
  buscarPorId(id: number): Promise<Empresa> {
    return api.get(`/empresas/${id}`).then(response => response.data)
  },
  
  /**
   * Cria uma nova empresa
   * @param empresa Dados da empresa
   * @returns Promise com a empresa criada
   */
  criar(empresa: Empresa): Promise<Empresa> {
    return api.post('/empresas', empresa).then(response => response.data)
  },
  
  /**
   * Atualiza uma empresa existente
   * @param id ID da empresa
   * @param empresa Dados da empresa
   * @returns Promise com a empresa atualizada
   */
  atualizar(id: number, empresa: Empresa): Promise<Empresa> {
    return api.put(`/empresas/${id}`, empresa).then(response => response.data)
  },
  
  /**
   * Remove uma empresa
   * @param id ID da empresa
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/empresas/${id}`).then(() => {})
  }
}