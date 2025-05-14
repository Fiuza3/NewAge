import { Router } from 'express'
import empresaRoutes from './empresaRoutes'
import departamentoRoutes from './departamentoRoutes'
import colaboradorRoutes from './colaboradorRoutes'
import configuracaoRoutes from './configuracaoRoutes'

const router = Router()

// Rotas da API
router.use('/empresas', empresaRoutes)
router.use('/departamentos', departamentoRoutes)
router.use('/colaboradores', colaboradorRoutes)
router.use('/configuracoes', configuracaoRoutes)

// Rota de teste
router.get('/', (req, res) => {
  res.json({ message: 'API NewAge ERP - Módulo Administrativo' })
})

export default router