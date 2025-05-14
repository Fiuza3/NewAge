import { Router } from 'express'
import InventarioController from '../controllers/InventarioController'

const router = Router()

router.get('/', InventarioController.listar)
router.get('/:id', InventarioController.buscarPorId)
router.post('/', InventarioController.criar)
router.post('/:id/finalizar', InventarioController.finalizar)
router.post('/:id/cancelar', InventarioController.cancelar)
router.get('/:id/relatorio', InventarioController.gerarRelatorio)
router.post('/:inventarioId/itens', InventarioController.adicionarItem)
router.put('/:inventarioId/itens/:itemId', InventarioController.atualizarItem)

export default router