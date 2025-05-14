import { Router } from 'express'
import MovimentacaoController from '../controllers/MovimentacaoController'

const router = Router()

router.get('/', MovimentacaoController.listar)
router.post('/entrada', MovimentacaoController.registrarEntrada)
router.post('/saida-venda', MovimentacaoController.registrarSaidaVenda)
router.post('/saida-perda', MovimentacaoController.registrarSaidaPerda)
router.post('/ajuste', MovimentacaoController.registrarAjuste)

export default router