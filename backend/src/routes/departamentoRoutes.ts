import { Router } from 'express'
import DepartamentoController from '../controllers/DepartamentoController'

const router = Router()

// Rotas de departamentos
router.get('/', DepartamentoController.listar)
router.get('/:id', DepartamentoController.buscarPorId)
router.post('/', DepartamentoController.criar)
router.put('/:id', DepartamentoController.atualizar)
router.delete('/:id', DepartamentoController.remover)

export default router