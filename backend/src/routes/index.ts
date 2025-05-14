import { Router } from 'express'
import empresaRoutes from './empresaRoutes'
import departamentoRoutes from './departamentoRoutes'
import colaboradorRoutes from './colaboradorRoutes'
import configuracaoRoutes from './configuracaoRoutes'
import categoriaRoutes from './categoriaRoutes'
import fornecedorRoutes from './fornecedorRoutes'
import produtoRoutes from './produtoRoutes'
import movimentacaoRoutes from './movimentacaoRoutes'
import inventarioRoutes from './inventarioRoutes'

const router = Router()

// Rotas da API - Módulo Administrativo
router.use('/empresas', empresaRoutes)
router.use('/departamentos', departamentoRoutes)
router.use('/colaboradores', colaboradorRoutes)
router.use('/configuracoes', configuracaoRoutes)

// Rotas da API - Módulo de Estoque
router.use('/categorias', categoriaRoutes)
router.use('/fornecedores', fornecedorRoutes)
router.use('/produtos', produtoRoutes)
router.use('/movimentacoes', movimentacaoRoutes)
router.use('/inventarios', inventarioRoutes)

// Rota de teste
router.get('/', (req, res) => {
  res.json({ message: 'API NewAge ERP - Módulos Administrativo e Estoque' })
})

export default router