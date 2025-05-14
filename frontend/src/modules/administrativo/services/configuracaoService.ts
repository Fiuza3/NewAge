import api from '@/services/api'

export interface Configuracao {
  id?: number
  moeda: string
  idioma: string
  formatoData: string
  casasDecimais: number
  outrosParametros: Record<string, any>
}

/**
 * Serviço para gerenciamento de configurações
 */
export default {
  /**
   * Busca as configurações do sistema
   * @returns Promise com as configurações
   */
  buscar(): Promise<Configuracao> {
    return api.get('/configuracoes').then(response => response.data)
  },
  
  /**
   * Atualiza as configurações do sistema
   * @param configuracao Dados da configuração
   * @returns Promise com as configurações atualizadas
   */
  atualizar(configuracao: Configuracao): Promise<Configuracao> {
    return api.put('/configuracoes', configuracao).then(response => response.data)
  }
}