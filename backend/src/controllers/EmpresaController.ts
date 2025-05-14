import { Request, Response } from 'express'
import { Empresa } from '../models'

/**
 * Controlador de Empresas
 */
class EmpresaController {
  /**
   * Lista todas as empresas
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const empresas = await Empresa.findAll()
      return res.json(empresas)
    } catch (error) {
      console.error('Erro ao listar empresas:', error)
      return res.status(500).json({ error: 'Erro ao listar empresas' })
    }
  }
  
  /**
   * Busca uma empresa pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const empresa = await Empresa.findByPk(id)
      
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' })
      }
      
      return res.json(empresa)
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
      return res.status(500).json({ error: 'Erro ao buscar empresa' })
    }
  }
  
  /**
   * Cria uma nova empresa
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, cnpj, areaAtuacao } = req.body
      
      // Validação básica
      if (!nome || !cnpj || !areaAtuacao) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      // Verifica se já existe uma empresa com o mesmo CNPJ
      const empresaExistente = await Empresa.findOne({ where: { cnpj } })
      if (empresaExistente) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' })
      }
      
      const empresa = await Empresa.create({ nome, cnpj, areaAtuacao })
      return res.status(201).json(empresa)
    } catch (error) {
      console.error('Erro ao criar empresa:', error)
      return res.status(500).json({ error: 'Erro ao criar empresa' })
    }
  }
  
  /**
   * Atualiza uma empresa existente
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { nome, cnpj, areaAtuacao } = req.body
      
      // Validação básica
      if (!nome || !cnpj || !areaAtuacao) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      const empresa = await Empresa.findByPk(id)
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' })
      }
      
      // Verifica se o CNPJ já está em uso por outra empresa
      if (cnpj !== empresa.cnpj) {
        const empresaExistente = await Empresa.findOne({ where: { cnpj } })
        if (empresaExistente) {
          return res.status(400).json({ error: 'CNPJ já cadastrado' })
        }
      }
      
      await empresa.update({ nome, cnpj, areaAtuacao })
      return res.json(empresa)
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error)
      return res.status(500).json({ error: 'Erro ao atualizar empresa' })
    }
  }
  
  /**
   * Remove uma empresa
   */
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const empresa = await Empresa.findByPk(id)
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' })
      }
      
      await empresa.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover empresa:', error)
      return res.status(500).json({ error: 'Erro ao remover empresa' })
    }
  }
}

export default new EmpresaController()