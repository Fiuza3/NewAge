import { Request, Response } from 'express'
import { Fornecedor } from '../models'

class FornecedorController {
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const fornecedores = await Fornecedor.findAll()
      return res.json(fornecedores)
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error)
      return res.status(500).json({ error: 'Erro ao listar fornecedores' })
    }
  }
  
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const fornecedor = await Fornecedor.findByPk(id)
      
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' })
      }
      
      return res.json(fornecedor)
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error)
      return res.status(500).json({ error: 'Erro ao buscar fornecedor' })
    }
  }
  
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato } = req.body
      
      if (!nome || !cnpj) {
        return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios' })
      }
      
      const fornecedorExistente = await Fornecedor.findOne({ where: { cnpj } })
      if (fornecedorExistente) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' })
      }
      
      const fornecedor = await Fornecedor.create({ 
        nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato 
      })
      
      return res.status(201).json(fornecedor)
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
      return res.status(500).json({ error: 'Erro ao criar fornecedor' })
    }
  }
  
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato } = req.body
      
      if (!nome || !cnpj) {
        return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios' })
      }
      
      const fornecedor = await Fornecedor.findByPk(id)
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' })
      }
      
      if (cnpj !== fornecedor.cnpj) {
        const fornecedorExistente = await Fornecedor.findOne({ where: { cnpj } })
        if (fornecedorExistente) {
          return res.status(400).json({ error: 'CNPJ já cadastrado' })
        }
      }
      
      await fornecedor.update({ 
        nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato 
      })
      
      return res.json(fornecedor)
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error)
      return res.status(500).json({ error: 'Erro ao atualizar fornecedor' })
    }
  }
  
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const fornecedor = await Fornecedor.findByPk(id)
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' })
      }
      
      await fornecedor.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover fornecedor:', error)
      return res.status(500).json({ error: 'Erro ao remover fornecedor' })
    }
  }
}

export default new FornecedorController()