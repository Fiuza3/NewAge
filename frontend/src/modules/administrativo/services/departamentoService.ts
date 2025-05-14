import api from '@/services/api'

export interface Departamento {
  id?: number
  nome: string
  empresaId: number
  empresaNome?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de departamentos
 */
export default {
  /**
   * Busca todos os departamentos
   * @returns Promise com a lista de departamentos
   */
  listar(): Promise<Departamento[]> {
    return api.get('/departamentos').then(response => response.data)
  },
  
  /**
   * Busca departamentos por empresa
   * @param empresaId ID da empresa
   * @returns Promise com a lista de departamentos
   */
  listarPorEmpresa(empresaId: number): Promise<Departamento[]> {
    return api.get(`/departamentos?empresaId=${empresaId}`).then(response => response.data)
  },
  
  /**
   * Busca um departamento pelo ID
   * @param id ID do departamento
   * @returns Promise com os dados do departamento
   */
  buscarPorId(id: number): Promise<Departamento> {
    return api.get(`/departamentos/${id}`).then(response => response.data)
  },
  
  /**
   * Cria um novo departamento
   * @param departamento Dados do departamento
   * @returns Promise com o departamento criado
   */
  criar(departamento: Departamento): Promise<Departamento> {
    return api.post('/departamentos', departamento).then(response => response.data)
  },
  
  /**
   * Atualiza um departamento existente
   * @param id ID do departamento
   * @param departamento Dados do departamento
   * @returns Promise com o departamento atualizado
   */
  atualizar(id: number, departamento: Departamento): Promise<Departamento> {
    return api.put(`/departamentos/${id}`, departamento).then(response => response.data)
  },
  
  /**
   * Remove um departamento
   * @param id ID do departamento
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/departamentos/${id}`).then(() => {})
  }
}