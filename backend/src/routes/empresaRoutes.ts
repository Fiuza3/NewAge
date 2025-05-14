import { Router } from 'express'
import EmpresaController from '../controllers/EmpresaController'

const router = Router()

// Rotas de empresas
router.get('/', EmpresaController.listar)
router.get('/:id', EmpresaController.buscarPorId)
router.post('/', EmpresaController.criar)
router.put('/:id', EmpresaController.atualizar)
router.delete('/:id', EmpresaController.remover)

export default router