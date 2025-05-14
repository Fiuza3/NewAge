import { defineStore } from 'pinia'

interface NotificacaoState {
  visivel: boolean
  texto: string
  cor: string
  timeout: number
}

export const useNotificacaoStore = defineStore('notificacao', {
  state: (): NotificacaoState => ({
    visivel: false,
    texto: '',
    cor: 'success',
    timeout: 5000
  }),
  
  actions: {
    /**
     * Exibe uma notificação de sucesso
     * @param texto Texto da notificação
     */
    sucesso(texto: string) {
      this.mostrar(texto, 'success')
    },
    
    /**
     * Exibe uma notificação de erro
     * @param texto Texto da notificação
     */
    erro(texto: string) {
      this.mostrar(texto, 'error')
    },
    
    /**
     * Exibe uma notificação de alerta
     * @param texto Texto da notificação
     */
    alerta(texto: string) {
      this.mostrar(texto, 'warning')
    },
    
    /**
     * Exibe uma notificação de informação
     * @param texto Texto da notificação
     */
    info(texto: string) {
      this.mostrar(texto, 'info')
    },
    
    /**
     * Exibe uma notificação
     * @param texto Texto da notificação
     * @param cor Cor da notificação
     * @param timeout Tempo de exibição em ms
     */
    mostrar(texto: string, cor: string = 'success', timeout: number = 5000) {
      this.texto = texto
      this.cor = cor
      this.timeout = timeout
      this.visivel = true
    },
    
    /**
     * Esconde a notificação
     */
    esconder() {
      this.visivel = false
    }
  }
})