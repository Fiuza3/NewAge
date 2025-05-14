import { Request, Response } from 'express'
import { Configuracao } from '../models'

/**
 * Controlador de Configurações
 */
class ConfiguracaoController {
  /**
   * Busca as configurações do sistema
   */
  async buscar(req: Request, res: Response): Promise<Response> {
    try {
      // Busca a primeira configuração ou cria uma padrão
      let configuracao = await Configuracao.findOne()
      
      if (!configuracao) {
        configuracao = await Configuracao.create({
          moeda: 'BRL',
          idioma: 'pt-BR',
          formatoData: 'DD/MM/YYYY',
          casasDecimais: 2,
          outrosParametros: {
            exibirLogos: true,
            notificacoesEmail: false
          }
        })
      }
      
      return res.json(configuracao)
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      return res.status(500).json({ error: 'Erro ao buscar configurações' })
    }
  }
  
  /**
   * Atualiza as configurações do sistema
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { moeda, idioma, formatoData, casasDecimais, outrosParametros } = req.body
      
      // Validação básica
      if (!moeda || !idioma || !formatoData || casasDecimais === undefined) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      // Busca a primeira configuração ou cria uma nova
      let configuracao = await Configuracao.findOne()
      
      if (configuracao) {
        await configuracao.update({
          moeda,
          idioma,
          formatoData,
          casasDecimais,
          outrosParametros
        })
      } else {
        configuracao = await Configuracao.create({
          moeda,
          idioma,
          formatoData,
          casasDecimais,
          outrosParametros
        })
      }
      
      return res.json(configuracao)
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      return res.status(500).json({ error: 'Erro ao atualizar configurações' })
    }
  }
}

export default new ConfiguracaoController()