import { Request, Response } from 'express'
import { Colaborador, Departamento, Empresa } from '../models'

/**
 * Controlador de Colaboradores
 */
class ColaboradorController {
  /**
   * Lista todos os colaboradores com paginação
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { departamentoId } = req.query
      const page = parseInt(req.query._page as string) || 1
      const limit = parseInt(req.query._limit as string) || 10
      const offset = (page - 1) * limit
      
      // Filtro por departamento
      const where = departamentoId ? { departamentoId } : {}
      
      // Busca os colaboradores com paginação
      const { count, rows } = await Colaborador.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['nome'],
            include: [
              {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
              }
            ]
          }
        ],
        order: [['nome', 'ASC']]
      })
      
      // Formata a resposta para incluir os nomes do departamento e empresa
      const colaboradoresFormatados = rows.map(col => {
        const colaborador = col.toJSON() as any
        return {
          ...colaborador,
          departamentoNome: colaborador.departamento?.nome || '',
          empresaNome: colaborador.departamento?.empresa?.nome || ''
        }
      })
      
      // Adiciona o total de itens no header
      res.header('X-Total-Count', count.toString())
      
      return res.json(colaboradoresFormatados)
    } catch (error) {
      console.error('Erro ao listar colaboradores:', error)
      return res.status(500).json({ error: 'Erro ao listar colaboradores' })
    }
  }
  
  /**
   * Busca um colaborador pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const colaborador = await Colaborador.findByPk(id, {
        include: [
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['nome'],
            include: [
              {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
              }
            ]
          }
        ]
      })
      
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' })
      }
      
      // Formata a resposta para incluir os nomes do departamento e empresa
      const colaboradorFormatado = colaborador.toJSON() as any
      return res.json({
        ...colaboradorFormatado,
        departamentoNome: colaboradorFormatado.departamento?.nome || '',
        empresaNome: colaboradorFormatado.departamento?.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error)
      return res.status(500).json({ error: 'Erro ao buscar colaborador' })
    }
  }
  
  /**
   * Cria um novo colaborador
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, cargo, salario, dataAdmissao, departamentoId } = req.body
      
      // Validação básica
      if (!nome || !cargo || !salario || !dataAdmissao || !departamentoId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      // Verifica se o departamento existe
      const departamento = await Departamento.findByPk(departamentoId)
      if (!departamento) {
        return res.status(400).json({ error: 'Departamento não encontrado' })
      }
      
      const colaborador = await Colaborador.create({
        nome,
        cargo,
        salario,
        dataAdmissao,
        departamentoId
      })
      
      // Busca o colaborador com os dados do departamento e empresa
      const colaboradorCompleto = await Colaborador.findByPk(colaborador.id, {
        include: [
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['nome'],
            include: [
              {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
              }
            ]
          }
        ]
      })
      
      // Formata a resposta para incluir os nomes do departamento e empresa
      const colaboradorFormatado = colaboradorCompleto!.toJSON() as any
      return res.status(201).json({
        ...colaboradorFormatado,
        departamentoNome: colaboradorFormatado.departamento?.nome || '',
        empresaNome: colaboradorFormatado.departamento?.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao criar colaborador:', error)
      return res.status(500).json({ error: 'Erro ao criar colaborador' })
    }
  }
  
  /**
   * Atualiza um colaborador existente
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { nome, cargo, salario, dataAdmissao, departamentoId } = req.body
      
      // Validação básica
      if (!nome || !cargo || !salario || !dataAdmissao || !departamentoId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      const colaborador = await Colaborador.findByPk(id)
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' })
      }
      
      // Verifica se o departamento existe
      if (departamentoId) {
        const departamento = await Departamento.findByPk(departamentoId)
        if (!departamento) {
          return res.status(400).json({ error: 'Departamento não encontrado' })
        }
      }
      
      await colaborador.update({
        nome,
        cargo,
        salario,
        dataAdmissao,
        departamentoId
      })
      
      // Busca o colaborador atualizado com os dados do departamento e empresa
      const colaboradorAtualizado = await Colaborador.findByPk(id, {
        include: [
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['nome'],
            include: [
              {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
              }
            ]
          }
        ]
      })
      
      // Formata a resposta para incluir os nomes do departamento e empresa
      const colaboradorFormatado = colaboradorAtualizado!.toJSON() as any
      return res.json({
        ...colaboradorFormatado,
        departamentoNome: colaboradorFormatado.departamento?.nome || '',
        empresaNome: colaboradorFormatado.departamento?.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error)
      return res.status(500).json({ error: 'Erro ao atualizar colaborador' })
    }
  }
  
  /**
   * Remove um colaborador
   */
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const colaborador = await Colaborador.findByPk(id)
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' })
      }
      
      await colaborador.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover colaborador:', error)
      return res.status(500).json({ error: 'Erro ao remover colaborador' })
    }
  }
}

export default new ColaboradorController()