import { Router } from 'express'
import ConfiguracaoController from '../controllers/ConfiguracaoController'

const router = Router()

// Rotas de configurações
router.get('/', ConfiguracaoController.buscar)
router.put('/', ConfiguracaoController.atualizar)

export default router