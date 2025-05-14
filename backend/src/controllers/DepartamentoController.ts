import { Request, Response } from 'express'
import { Departamento, Empresa } from '../models'

/**
 * Controlador de Departamentos
 */
class DepartamentoController {
  /**
   * Lista todos os departamentos
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { empresaId } = req.query
      
      // Filtro por empresa
      const where = empresaId ? { empresaId } : {}
      
      const departamentos = await Departamento.findAll({
        where,
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['nome']
          }
        ]
      })
      
      // Formata a resposta para incluir o nome da empresa
      const departamentosFormatados = departamentos.map(dep => {
        const departamento = dep.toJSON() as any
        return {
          ...departamento,
          empresaNome: departamento.empresa?.nome || ''
        }
      })
      
      return res.json(departamentosFormatados)
    } catch (error) {
      console.error('Erro ao listar departamentos:', error)
      return res.status(500).json({ error: 'Erro ao listar departamentos' })
    }
  }
  
  /**
   * Busca um departamento pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const departamento = await Departamento.findByPk(id, {
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['nome']
          }
        ]
      })
      
      if (!departamento) {
        return res.status(404).json({ error: 'Departamento não encontrado' })
      }
      
      // Formata a resposta para incluir o nome da empresa
      const departamentoFormatado = departamento.toJSON() as any
      return res.json({
        ...departamentoFormatado,
        empresaNome: departamentoFormatado.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao buscar departamento:', error)
      return res.status(500).json({ error: 'Erro ao buscar departamento' })
    }
  }
  
  /**
   * Cria um novo departamento
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, empresaId } = req.body
      
      // Validação básica
      if (!nome || !empresaId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      // Verifica se a empresa existe
      const empresa = await Empresa.findByPk(empresaId)
      if (!empresa) {
        return res.status(400).json({ error: 'Empresa não encontrada' })
      }
      
      const departamento = await Departamento.create({ nome, empresaId })
      
      // Busca o departamento com os dados da empresa
      const departamentoCompleto = await Departamento.findByPk(departamento.id, {
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['nome']
          }
        ]
      })
      
      // Formata a resposta para incluir o nome da empresa
      const departamentoFormatado = departamentoCompleto!.toJSON() as any
      return res.status(201).json({
        ...departamentoFormatado,
        empresaNome: departamentoFormatado.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao criar departamento:', error)
      return res.status(500).json({ error: 'Erro ao criar departamento' })
    }
  }
  
  /**
   * Atualiza um departamento existente
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { nome, empresaId } = req.body
      
      // Validação básica
      if (!nome || !empresaId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      const departamento = await Departamento.findByPk(id)
      if (!departamento) {
        return res.status(404).json({ error: 'Departamento não encontrado' })
      }
      
      // Verifica se a empresa existe
      if (empresaId) {
        const empresa = await Empresa.findByPk(empresaId)
        if (!empresa) {
          return res.status(400).json({ error: 'Empresa não encontrada' })
        }
      }
      
      await departamento.update({ nome, empresaId })
      
      // Busca o departamento atualizado com os dados da empresa
      const departamentoAtualizado = await Departamento.findByPk(id, {
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['nome']
          }
        ]
      })
      
      // Formata a resposta para incluir o nome da empresa
      const departamentoFormatado = departamentoAtualizado!.toJSON() as any
      return res.json({
        ...departamentoFormatado,
        empresaNome: departamentoFormatado.empresa?.nome || ''
      })
    } catch (error) {
      console.error('Erro ao atualizar departamento:', error)
      return res.status(500).json({ error: 'Erro ao atualizar departamento' })
    }
  }
  
  /**
   * Remove um departamento
   */
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const departamento = await Departamento.findByPk(id)
      if (!departamento) {
        return res.status(404).json({ error: 'Departamento não encontrado' })
      }
      
      await departamento.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover departamento:', error)
      return res.status(500).json({ error: 'Erro ao remover departamento' })
    }
  }
}

export default new DepartamentoController()