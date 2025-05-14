import { Router } from 'express'
import ColaboradorController from '../controllers/ColaboradorController'

const router = Router()

// Rotas de colaboradores
router.get('/', ColaboradorController.listar)
router.get('/:id', ColaboradorController.buscarPorId)
router.post('/', ColaboradorController.criar)
router.put('/:id', ColaboradorController.atualizar)
router.delete('/:id', ColaboradorController.remover)

export default router