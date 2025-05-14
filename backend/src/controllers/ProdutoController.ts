import { Request, Response } from 'express'
import { Produto, Categoria, Fornecedor } from '../models'

class ProdutoController {
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { categoriaId, fornecedorId } = req.query
      const page = parseInt(req.query._page as string) || 1
      const limit = parseInt(req.query._limit as string) || 10
      const offset = (page - 1) * limit
      
      const where: any = {}
      if (categoriaId) where.categoriaId = categoriaId
      if (fornecedorId) where.fornecedorId = fornecedorId
      
      const { count, rows } = await Produto.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          { model: Categoria, as: 'categoria', attributes: ['nome'] },
          { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] }
        ],
        order: [['nome', 'ASC']]
      })
      
      res.header('X-Total-Count', count.toString())
      return res.json(rows)
    } catch (error) {
      console.error('Erro ao listar produtos:', error)
      return res.status(500).json({ error: 'Erro ao listar produtos' })
    }
  }
  
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const produto = await Produto.findByPk(id, {
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Fornecedor, as: 'fornecedor' }
        ]
      })
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      return res.json(produto)
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      return res.status(500).json({ error: 'Erro ao buscar produto' })
    }
  }
  
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { 
        nome, descricao, sku, categoriaId, fornecedorId, unidadeMedida,
        quantidadeMinima, quantidadeMaxima, quantidadeAtual, custo, precoVenda 
      } = req.body
      
      if (!nome || !sku || !categoriaId || !fornecedorId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      const skuExistente = await Produto.findOne({ where: { sku } })
      if (skuExistente) {
        return res.status(400).json({ error: 'SKU já cadastrado' })
      }
      
      const produto = await Produto.create({
        nome, descricao, sku, categoriaId, fornecedorId, unidadeMedida,
        quantidadeMinima, quantidadeMaxima, quantidadeAtual, custo, precoVenda
      })
      
      return res.status(201).json(produto)
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      return res.status(500).json({ error: 'Erro ao criar produto' })
    }
  }
  
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { 
        nome, descricao, sku, categoriaId, fornecedorId, unidadeMedida,
        quantidadeMinima, quantidadeMaxima, custo, precoVenda 
      } = req.body
      
      if (!nome || !sku || !categoriaId || !fornecedorId) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      const produto = await Produto.findByPk(id)
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      if (sku !== produto.sku) {
        const skuExistente = await Produto.findOne({ where: { sku } })
        if (skuExistente) {
          return res.status(400).json({ error: 'SKU já cadastrado' })
        }
      }
      
      await produto.update({
        nome, descricao, sku, categoriaId, fornecedorId, unidadeMedida,
        quantidadeMinima, quantidadeMaxima, custo, precoVenda
      })
      
      return res.json(produto)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      return res.status(500).json({ error: 'Erro ao atualizar produto' })
    }
  }
  
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const produto = await Produto.findByPk(id)
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      await produto.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover produto:', error)
      return res.status(500).json({ error: 'Erro ao remover produto' })
    }
  }
}

export default new ProdutoController()