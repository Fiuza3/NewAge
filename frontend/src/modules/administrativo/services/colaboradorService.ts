import api from '@/services/api'

export interface Colaborador {
  id?: number
  nome: string
  cargo: string
  salario: number
  dataAdmissao: string
  departamentoId: number
  departamentoNome?: string
  empresaNome?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciamento de colaboradores
 */
export default {
  /**
   * Busca todos os colaboradores
   * @param pagina Número da página
   * @param limite Limite de itens por página
   * @returns Promise com a lista de colaboradores
   */
  listar(pagina: number = 1, limite: number = 10): Promise<{ data: Colaborador[], total: number }> {
    return api.get(`/colaboradores?_page=${pagina}&_limit=${limite}`).then(response => {
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count'] || '0')
      }
    })
  },
  
  /**
   * Busca colaboradores por departamento
   * @param departamentoId ID do departamento
   * @returns Promise com a lista de colaboradores
   */
  listarPorDepartamento(departamentoId: number): Promise<Colaborador[]> {
    return api.get(`/colaboradores?departamentoId=${departamentoId}`).then(response => response.data)
  },
  
  /**
   * Busca um colaborador pelo ID
   * @param id ID do colaborador
   * @returns Promise com os dados do colaborador
   */
  buscarPorId(id: number): Promise<Colaborador> {
    return api.get(`/colaboradores/${id}`).then(response => response.data)
  },
  
  /**
   * Cria um novo colaborador
   * @param colaborador Dados do colaborador
   * @returns Promise com o colaborador criado
   */
  criar(colaborador: Colaborador): Promise<Colaborador> {
    return api.post('/colaboradores', colaborador).then(response => response.data)
  },
  
  /**
   * Atualiza um colaborador existente
   * @param id ID do colaborador
   * @param colaborador Dados do colaborador
   * @returns Promise com o colaborador atualizado
   */
  atualizar(id: number, colaborador: Colaborador): Promise<Colaborador> {
    return api.put(`/colaboradores/${id}`, colaborador).then(response => response.data)
  },
  
  /**
   * Remove um colaborador
   * @param id ID do colaborador
   * @returns Promise vazia
   */
  remover(id: number): Promise<void> {
    return api.delete(`/colaboradores/${id}`).then(() => {})
  }
}