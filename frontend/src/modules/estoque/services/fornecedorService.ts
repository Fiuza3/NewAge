import api from '@/services/api'

export interface Fornecedor {
  id?: number
  nome: string
  cnpj: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  contato?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de fornecedores
 */
export default {
  /**
   * Busca todos os fornecedores
   * @returns Promise com a lista de fornecedores
   */
  listar(): Promise<Fornecedor[]> {
    return api.get('/fornecedores').then(response => response.data)
  },
  
  /**
   * Busca um fornecedor pelo ID
   * @param id ID do fornecedor
   * @returns Promise com os dados do fornecedor
   */
  buscarPorId(id: number): Promise<Fornecedor> {
    return api.get(`/fornecedores/${id}`).then(response => response.data)
  },
  
  /**
   * Cria um novo fornecedor
   * @param fornecedor Dados do fornecedor
   * @returns Promise com o fornecedor criado
   */
  criar(fornecedor: Fornecedor): Promise<Fornecedor> {
    return api.post('/fornecedores', fornecedor).then(response => response.data)
  },
  
  /**
   * Atualiza um fornecedor existente
   * @param id ID do fornecedor
   * @param fornecedor Dados do fornecedor
   * @returns Promise com o fornecedor atualizado
   */
  atualizar(id: number, fornecedor: Fornecedor): Promise<Fornecedor> {
    return api.put(`/fornecedores/${id}`, fornecedor).then(response => response.data)
  },
  
  /**
   * Remove um fornecedor
   * @param id ID do fornecedor
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/fornecedores/${id}`).then(() => {})
  }
}