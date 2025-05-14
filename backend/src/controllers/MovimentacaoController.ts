import { Request, Response } from 'express'
import { MovimentacaoEstoque, Produto } from '../models'
import { TipoMovimentacao } from '../models/MovimentacaoEstoque'
import { sequelize } from '../database/config'

class MovimentacaoController {
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { produtoId } = req.query
      const page = parseInt(req.query._page as string) || 1
      const limit = parseInt(req.query._limit as string) || 10
      const offset = (page - 1) * limit
      
      const where: any = {}
      if (produtoId) where.produtoId = produtoId
      
      const { count, rows } = await MovimentacaoEstoque.findAndCountAll({
        where,
        limit,
        offset,
        include: [{ model: Produto, as: 'produto' }],
        order: [['createdAt', 'DESC']]
      })
      
      res.header('X-Total-Count', count.toString())
      return res.json(rows)
    } catch (error) {
      console.error('Erro ao listar movimentações:', error)
      return res.status(500).json({ error: 'Erro ao listar movimentações' })
    }
  }
  
  async registrarEntrada(req: Request, res: Response): Promise<Response> {
    const t = await sequelize.transaction()
    
    try {
      const { produtoId, quantidade, observacao } = req.body
      
      if (!produtoId || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' })
      }
      
      const produto = await Produto.findByPk(produtoId, { transaction: t })
      if (!produto) {
        await t.rollback()
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      const quantidadeAnterior = produto.quantidadeAtual
      const quantidadeNova = quantidadeAnterior + parseFloat(quantidade)
      
      // Atualiza o estoque do produto
      await produto.update({ quantidadeAtual: quantidadeNova }, { transaction: t })
      
      // Registra a movimentação
      const movimentacao = await MovimentacaoEstoque.create({
        produtoId,
        tipo: TipoMovimentacao.ENTRADA,
        quantidade: parseFloat(quantidade),
        quantidadeAnterior,
        quantidadeNova,
        observacao
      }, { transaction: t })
      
      await t.commit()
      
      return res.status(201).json(movimentacao)
    } catch (error) {
      await t.rollback()
      console.error('Erro ao registrar entrada:', error)
      return res.status(500).json({ error: 'Erro ao registrar entrada' })
    }
  }
  
  async registrarSaidaVenda(req: Request, res: Response): Promise<Response> {
    const t = await sequelize.transaction()
    
    try {
      const { produtoId, quantidade, observacao } = req.body
      
      if (!produtoId || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' })
      }
      
      const produto = await Produto.findByPk(produtoId, { transaction: t })
      if (!produto) {
        await t.rollback()
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      const quantidadeAnterior = produto.quantidadeAtual
      
      if (quantidadeAnterior < parseFloat(quantidade)) {
        await t.rollback()
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' })
      }
      
      const quantidadeNova = quantidadeAnterior - parseFloat(quantidade)
      
      // Atualiza o estoque do produto
      await produto.update({ quantidadeAtual: quantidadeNova }, { transaction: t })
      
      // Registra a movimentação
      const movimentacao = await MovimentacaoEstoque.create({
        produtoId,
        tipo: TipoMovimentacao.SAIDA_VENDA,
        quantidade: parseFloat(quantidade),
        quantidadeAnterior,
        quantidadeNova,
        observacao
      }, { transaction: t })
      
      await t.commit()
      
      return res.status(201).json(movimentacao)
    } catch (error) {
      await t.rollback()
      console.error('Erro ao registrar saída por venda:', error)
      return res.status(500).json({ error: 'Erro ao registrar saída por venda' })
    }
  }
  
  async registrarSaidaPerda(req: Request, res: Response): Promise<Response> {
    const t = await sequelize.transaction()
    
    try {
      const { produtoId, quantidade, observacao } = req.body
      
      if (!produtoId || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' })
      }
      
      const produto = await Produto.findByPk(produtoId, { transaction: t })
      if (!produto) {
        await t.rollback()
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      const quantidadeAnterior = produto.quantidadeAtual
      
      if (quantidadeAnterior < parseFloat(quantidade)) {
        await t.rollback()
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' })
      }
      
      const quantidadeNova = quantidadeAnterior - parseFloat(quantidade)
      
      // Atualiza o estoque do produto
      await produto.update({ quantidadeAtual: quantidadeNova }, { transaction: t })
      
      // Registra a movimentação
      const movimentacao = await MovimentacaoEstoque.create({
        produtoId,
        tipo: TipoMovimentacao.SAIDA_PERDA,
        quantidade: parseFloat(quantidade),
        quantidadeAnterior,
        quantidadeNova,
        observacao
      }, { transaction: t })
      
      await t.commit()
      
      return res.status(201).json(movimentacao)
    } catch (error) {
      await t.rollback()
      console.error('Erro ao registrar saída por perda:', error)
      return res.status(500).json({ error: 'Erro ao registrar saída por perda' })
    }
  }
  
  async registrarAjuste(req: Request, res: Response): Promise<Response> {
    const t = await sequelize.transaction()
    
    try {
      const { produtoId, quantidade, observacao } = req.body
      
      if (!produtoId || quantidade === undefined) {
        return res.status(400).json({ error: 'Dados inválidos' })
      }
      
      const produto = await Produto.findByPk(produtoId, { transaction: t })
      if (!produto) {
        await t.rollback()
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      const quantidadeAnterior = produto.quantidadeAtual
      const quantidadeNova = parseFloat(quantidade)
      const quantidadeAjuste = quantidadeNova - quantidadeAnterior
      
      // Atualiza o estoque do produto
      await produto.update({ quantidadeAtual: quantidadeNova }, { transaction: t })
      
      // Registra a movimentação
      const movimentacao = await MovimentacaoEstoque.create({
        produtoId,
        tipo: TipoMovimentacao.AJUSTE,
        quantidade: Math.abs(quantidadeAjuste),
        quantidadeAnterior,
        quantidadeNova,
        observacao
      }, { transaction: t })
      
      await t.commit()
      
      return res.status(201).json(movimentacao)
    } catch (error) {
      await t.rollback()
      console.error('Erro ao registrar ajuste:', error)
      return res.status(500).json({ error: 'Erro ao registrar ajuste' })
    }
  }
}

export default new MovimentacaoController()