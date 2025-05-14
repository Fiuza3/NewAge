import { Request, Response } from 'express'
import { Categoria } from '../models'
import { Op } from 'sequelize'

/**
 * Controlador de Categorias
 */
class CategoriaController {
  /**
   * Lista todas as categorias
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const categorias = await Categoria.findAll({
        include: [
          {
            model: Categoria,
            as: 'categoriaPai',
            attributes: ['id', 'nome']
          }
        ]
      })
      return res.json(categorias)
    } catch (error) {
      console.error('Erro ao listar categorias:', error)
      return res.status(500).json({ error: 'Erro ao listar categorias' })
    }
  }
  
  /**
   * Lista categorias principais (sem categoria pai)
   */
  async listarPrincipais(req: Request, res: Response): Promise<Response> {
    try {
      const categorias = await Categoria.findAll({
        where: {
          categoriaPaiId: null
        }
      })
      return res.json(categorias)
    } catch (error) {
      console.error('Erro ao listar categorias principais:', error)
      return res.status(500).json({ error: 'Erro ao listar categorias principais' })
    }
  }
  
  /**
   * Lista subcategorias de uma categoria
   */
  async listarSubcategorias(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const subcategorias = await Categoria.findAll({
        where: {
          categoriaPaiId: id
        }
      })
      
      return res.json(subcategorias)
    } catch (error) {
      console.error('Erro ao listar subcategorias:', error)
      return res.status(500).json({ error: 'Erro ao listar subcategorias' })
    }
  }
  
  /**
   * Busca uma categoria pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const categoria = await Categoria.findByPk(id, {
        include: [
          {
            model: Categoria,
            as: 'categoriaPai',
            attributes: ['id', 'nome']
          },
          {
            model: Categoria,
            as: 'subcategorias',
            attributes: ['id', 'nome']
          }
        ]
      })
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' })
      }
      
      return res.json(categoria)
    } catch (error) {
      console.error('Erro ao buscar categoria:', error)
      return res.status(500).json({ error: 'Erro ao buscar categoria' })
    }
  }
  
  /**
   * Cria uma nova categoria
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, descricao, categoriaPaiId } = req.body
      
      // Validação básica
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' })
      }
      
      // Verifica se a categoria pai existe, se informada
      if (categoriaPaiId) {
        const categoriaPai = await Categoria.findByPk(categoriaPaiId)
        if (!categoriaPai) {
          return res.status(400).json({ error: 'Categoria pai não encontrada' })
        }
      }
      
      const categoria = await Categoria.create({ nome, descricao, categoriaPaiId })
      
      return res.status(201).json(categoria)
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      return res.status(500).json({ error: 'Erro ao criar categoria' })
    }
  }
  
  /**
   * Atualiza uma categoria existente
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { nome, descricao, categoriaPaiId } = req.body
      
      // Validação básica
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' })
      }
      
      const categoria = await Categoria.findByPk(id)
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' })
      }
      
      // Verifica se a categoria pai existe, se informada
      if (categoriaPaiId) {
        // Não pode definir a própria categoria como pai
        if (parseInt(id) === categoriaPaiId) {
          return res.status(400).json({ error: 'Uma categoria não pode ser pai dela mesma' })
        }
        
        const categoriaPai = await Categoria.findByPk(categoriaPaiId)
        if (!categoriaPai) {
          return res.status(400).json({ error: 'Categoria pai não encontrada' })
        }
        
        // Verifica se não está criando um ciclo na hierarquia
        let currentPai = categoriaPai
        while (currentPai.categoriaPaiId) {
          if (currentPai.categoriaPaiId === parseInt(id)) {
            return res.status(400).json({ error: 'Esta operação criaria um ciclo na hierarquia de categorias' })
          }
          currentPai = await Categoria.findByPk(currentPai.categoriaPaiId)
        }
      }
      
      await categoria.update({ nome, descricao, categoriaPaiId })
      
      return res.json(categoria)
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      return res.status(500).json({ error: 'Erro ao atualizar categoria' })
    }
  }
  
  /**
   * Remove uma categoria
   */
  async remover(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      
      const categoria = await Categoria.findByPk(id)
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' })
      }
      
      // Verifica se existem subcategorias
      const subcategorias = await Categoria.findOne({
        where: { categoriaPaiId: id }
      })
      
      if (subcategorias) {
        return res.status(400).json({ error: 'Não é possível excluir uma categoria que possui subcategorias' })
      }
      
      await categoria.destroy()
      return res.status(204).send()
    } catch (error) {
      console.error('Erro ao remover categoria:', error)
      return res.status(500).json({ error: 'Erro ao remover categoria' })
    }
  }
}

export default new CategoriaController()