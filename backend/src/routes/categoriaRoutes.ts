import { Router } from 'express'
import CategoriaController from '../controllers/CategoriaController'

const router = Router()

// Rotas de categorias
router.get('/', CategoriaController.listar)
router.get('/principais', CategoriaController.listarPrincipais)
router.get('/:id', CategoriaController.buscarPorId)
router.get('/:id/subcategorias', CategoriaController.listarSubcategorias)
router.post('/', CategoriaController.criar)
router.put('/:id', CategoriaController.atualizar)
router.delete('/:id', CategoriaController.remover)

export default router