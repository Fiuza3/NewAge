import { Request, Response } from 'express'
import { Inventario, ItemInventario, Produto, MovimentacaoEstoque } from '../models'
import { StatusInventario } from '../models/Inventario'
import { TipoMovimentacao } from '../models/MovimentacaoEstoque'
import { sequelize } from '../database/config'

class InventarioController {
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const inventarios = await Inventario.findAll({
        order: [['data', 'DESC']]
      })
      return res.json(inventarios)
    } catch (error) {
      console.error('Erro ao listar inventários:', error)
      return res.status(500).json({ error: 'Erro ao listar inventários' })
    }
  }
  
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const inventario = await Inventario.findByPk(id, {
        include: [
          {
            model: ItemInventario,
            as: 'itens',
            include: [{ model: Produto, as: 'produto' }]
          }
        ]
      })
      
      if (!inventario) {
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      return res.json(inventario)
    } catch (error) {
      console.error('Erro ao buscar inventário:', error)
      return res.status(500).json({ error: 'Erro ao buscar inventário' })
    }
  }
  
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { data, observacao } = req.body
      
      if (!data) {
        return res.status(400).json({ error: 'Data é obrigatória' })
      }
      
      const inventario = await Inventario.create({
        data,
        observacao,
        status: StatusInventario.EM_ANDAMENTO
      })
      
      return res.status(201).json(inventario)
    } catch (error) {
      console.error('Erro ao criar inventário:', error)
      return res.status(500).json({ error: 'Erro ao criar inventário' })
    }
  }
  
  async adicionarItem(req: Request, res: Response): Promise<Response> {
    try {
      const { inventarioId } = req.params
      const { produtoId, quantidadeContada, observacao } = req.body
      
      if (!produtoId || quantidadeContada === undefined) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }
      
      // Verifica se o inventário existe e está em andamento
      const inventario = await Inventario.findByPk(inventarioId)
      if (!inventario) {
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      if (inventario.status !== StatusInventario.EM_ANDAMENTO) {
        return res.status(400).json({ error: 'Inventário não está em andamento' })
      }
      
      // Verifica se o produto existe
      const produto = await Produto.findByPk(produtoId)
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
      }
      
      // Verifica se o item já existe no inventário
      const itemExistente = await ItemInventario.findOne({
        where: {
          inventarioId,
          produtoId
        }
      })
      
      if (itemExistente) {
        return res.status(400).json({ error: 'Produto já adicionado ao inventário' })
      }
      
      // Cria o item de inventário
      const quantidadeSistema = produto.quantidadeAtual
      const diferenca = parseFloat(quantidadeContada) - quantidadeSistema
      
      const item = await ItemInventario.create({
        inventarioId: parseInt(inventarioId),
        produtoId,
        quantidadeSistema,
        quantidadeContada: parseFloat(quantidadeContada),
        diferenca,
        observacao
      })
      
      // Busca o item com os dados do produto
      const itemCompleto = await ItemInventario.findByPk(item.id, {
        include: [{ model: Produto, as: 'produto' }]
      })
      
      return res.status(201).json(itemCompleto)
    } catch (error) {
      console.error('Erro ao adicionar item ao inventário:', error)
      return res.status(500).json({ error: 'Erro ao adicionar item ao inventário' })
    }
  }
  
  async atualizarItem(req: Request, res: Response): Promise<Response> {
    try {
      const { inventarioId, itemId } = req.params
      const { quantidadeContada, observacao } = req.body
      
      if (quantidadeContada === undefined) {
        return res.status(400).json({ error: 'Quantidade contada é obrigatória' })
      }
      
      // Verifica se o inventário existe e está em andamento
      const inventario = await Inventario.findByPk(inventarioId)
      if (!inventario) {
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      if (inventario.status !== StatusInventario.EM_ANDAMENTO) {
        return res.status(400).json({ error: 'Inventário não está em andamento' })
      }
      
      // Verifica se o item existe
      const item = await ItemInventario.findOne({
        where: {
          id: itemId,
          inventarioId
        },
        include: [{ model: Produto, as: 'produto' }]
      })
      
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' })
      }
      
      // Atualiza o item
      const diferenca = parseFloat(quantidadeContada) - item.quantidadeSistema
      
      await item.update({
        quantidadeContada: parseFloat(quantidadeContada),
        diferenca,
        observacao
      })
      
      return res.json(item)
    } catch (error) {
      console.error('Erro ao atualizar item do inventário:', error)
      return res.status(500).json({ error: 'Erro ao atualizar item do inventário' })
    }
  }
  
  async finalizar(req: Request, res: Response): Promise<Response> {
    const t = await sequelize.transaction()
    
    try {
      const { id } = req.params
      const { ajustarEstoque } = req.body
      
      // Verifica se o inventário existe e está em andamento
      const inventario = await Inventario.findByPk(id, {
        include: [
          {
            model: ItemInventario,
            as: 'itens',
            include: [{ model: Produto, as: 'produto' }]
          }
        ],
        transaction: t
      })
      
      if (!inventario) {
        await t.rollback()
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      if (inventario.status !== StatusInventario.EM_ANDAMENTO) {
        await t.rollback()
        return res.status(400).json({ error: 'Inventário não está em andamento' })
      }
      
      // Ajusta o estoque se solicitado
      if (ajustarEstoque && inventario.itens && inventario.itens.length > 0) {
        for (const item of inventario.itens) {
          if (item.diferenca !== 0) {
            const produto = item.produto
            
            if (!produto) continue
            
            // Atualiza o estoque do produto
            await produto.update({
              quantidadeAtual: item.quantidadeContada
            }, { transaction: t })
            
            // Registra a movimentação
            await MovimentacaoEstoque.create({
              produtoId: item.produtoId,
              tipo: TipoMovimentacao.AJUSTE,
              quantidade: Math.abs(item.diferenca),
              quantidadeAnterior: item.quantidadeSistema,
              quantidadeNova: item.quantidadeContada,
              observacao: `Ajuste automático por inventário #${inventario.id}`
            }, { transaction: t })
          }
        }
      }
      
      // Finaliza o inventário
      await inventario.update({
        status: StatusInventario.CONCLUIDO
      }, { transaction: t })
      
      await t.commit()
      
      return res.json(inventario)
    } catch (error) {
      await t.rollback()
      console.error('Erro ao finalizar inventário:', error)
      return res.status(500).json({ error: 'Erro ao finalizar inventário' })
    }
  }
  
  async cancelar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      // Verifica se o inventário existe e está em andamento
      const inventario = await Inventario.findByPk(id)
      if (!inventario) {
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      if (inventario.status !== StatusInventario.EM_ANDAMENTO) {
        return res.status(400).json({ error: 'Inventário não está em andamento' })
      }
      
      // Cancela o inventário
      await inventario.update({
        status: StatusInventario.CANCELADO
      })
      
      return res.json(inventario)
    } catch (error) {
      console.error('Erro ao cancelar inventário:', error)
      return res.status(500).json({ error: 'Erro ao cancelar inventário' })
    }
  }
  
  async gerarRelatorio(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      // Verifica se o inventário existe e está concluído
      const inventario = await Inventario.findByPk(id, {
        include: [
          {
            model: ItemInventario,
            as: 'itens',
            include: [{ model: Produto, as: 'produto' }]
          }
        ]
      })
      
      if (!inventario) {
        return res.status(404).json({ error: 'Inventário não encontrado' })
      }
      
      if (inventario.status !== StatusInventario.CONCLUIDO) {
        return res.status(400).json({ error: 'Inventário não está concluído' })
      }
      
      // Em um sistema real, aqui geraria um PDF ou outro formato de relatório
      // Para este exemplo, apenas retornamos uma URL fictícia
      return res.json({
        url: `/api/inventarios/${id}/relatorio.pdf`
      })
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      return res.status(500).json({ error: 'Erro ao gerar relatório' })
    }
  }
}

export default new InventarioController()