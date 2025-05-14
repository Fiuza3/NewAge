import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Importação das páginas
const Dashboard = () => import('@/pages/Dashboard.vue')

// Módulo Administrativo
const Empresas = () => import('@/modules/administrativo/pages/Empresas.vue')
const EmpresaForm = () => import('@/modules/administrativo/pages/EmpresaForm.vue')
const Departamentos = () => import('@/modules/administrativo/pages/Departamentos.vue')
const DepartamentoForm = () => import('@/modules/administrativo/pages/DepartamentoForm.vue')
const Colaboradores = () => import('@/modules/administrativo/pages/Colaboradores.vue')
const ColaboradorForm = () => import('@/modules/administrativo/pages/ColaboradorForm.vue')
const Configuracoes = () => import('@/modules/administrativo/pages/Configuracoes.vue')

// Módulo de Estoque
const Produtos = () => import('@/modules/estoque/pages/Produtos.vue')
const ProdutoForm = () => import('@/modules/estoque/pages/ProdutoForm.vue')
const Categorias = () => import('@/modules/estoque/pages/Categorias.vue')
const CategoriaForm = () => import('@/modules/estoque/pages/CategoriaForm.vue')
const Fornecedores = () => import('@/modules/estoque/pages/Fornecedores.vue')
const FornecedorForm = () => import('@/modules/estoque/pages/FornecedorForm.vue')
const Inventarios = () => import('@/modules/estoque/pages/Inventarios.vue')
const InventarioForm = () => import('@/modules/estoque/pages/InventarioForm.vue')
const InventarioDetalhes = () => import('@/modules/estoque/pages/InventarioDetalhes.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  // Rotas do Módulo Administrativo
  {
    path: '/administrativo/empresas',
    name: 'Empresas',
    component: Empresas,
    meta: { title: 'Empresas' }
  },
  {
    path: '/administrativo/empresas/nova',
    name: 'NovaEmpresa',
    component: EmpresaForm,
    meta: { title: 'Nova Empresa' }
  },
  {
    path: '/administrativo/empresas/:id',
    name: 'EditarEmpresa',
    component: EmpresaForm,
    meta: { title: 'Editar Empresa' }
  },
  {
    path: '/administrativo/departamentos',
    name: 'Departamentos',
    component: Departamentos,
    meta: { title: 'Departamentos' }
  },
  {
    path: '/administrativo/departamentos/novo',
    name: 'NovoDepartamento',
    component: DepartamentoForm,
    meta: { title: 'Novo Departamento' }
  },
  {
    path: '/administrativo/departamentos/:id',
    name: 'EditarDepartamento',
    component: DepartamentoForm,
    meta: { title: 'Editar Departamento' }
  },
  {
    path: '/administrativo/colaboradores',
    name: 'Colaboradores',
    component: Colaboradores,
    meta: { title: 'Colaboradores' }
  },
  {
    path: '/administrativo/colaboradores/novo',
    name: 'NovoColaborador',
    component: ColaboradorForm,
    meta: { title: 'Novo Colaborador' }
  },
  {
    path: '/administrativo/colaboradores/:id',
    name: 'EditarColaborador',
    component: ColaboradorForm,
    meta: { title: 'Editar Colaborador' }
  },
  {
    path: '/administrativo/configuracoes',
    name: 'Configuracoes',
    component: Configuracoes,
    meta: { title: 'Configurações' }
  },
  // Rotas do Módulo de Estoque
  {
    path: '/estoque/produtos',
    name: 'Produtos',
    component: Produtos,
    meta: { title: 'Produtos' }
  },
  {
    path: '/estoque/produtos/novo',
    name: 'NovoProduto',
    component: ProdutoForm,
    meta: { title: 'Novo Produto' }
  },
  {
    path: '/estoque/produtos/:id',
    name: 'EditarProduto',
    component: ProdutoForm,
    meta: { title: 'Editar Produto' }
  },
  {
    path: '/estoque/categorias',
    name: 'Categorias',
    component: Categorias,
    meta: { title: 'Categorias' }
  },
  {
    path: '/estoque/categorias/nova',
    name: 'NovaCategoria',
    component: CategoriaForm,
    meta: { title: 'Nova Categoria' }
  },
  {
    path: '/estoque/categorias/:id',
    name: 'EditarCategoria',
    component: CategoriaForm,
    meta: { title: 'Editar Categoria' }
  },
  {
    path: '/estoque/fornecedores',
    name: 'Fornecedores',
    component: Fornecedores,
    meta: { title: 'Fornecedores' }
  },
  {
    path: '/estoque/fornecedores/novo',
    name: 'NovoFornecedor',
    component: FornecedorForm,
    meta: { title: 'Novo Fornecedor' }
  },
  {
    path: '/estoque/fornecedores/:id',
    name: 'EditarFornecedor',
    component: FornecedorForm,
    meta: { title: 'Editar Fornecedor' }
  },
  {
    path: '/estoque/inventarios',
    name: 'Inventarios',
    component: Inventarios,
    meta: { title: 'Inventários' }
  },
  {
    path: '/estoque/inventarios/novo',
    name: 'NovoInventario',
    component: InventarioForm,
    meta: { title: 'Novo Inventário' }
  },
  {
    path: '/estoque/inventarios/:id',
    name: 'InventarioDetalhes',
    component: InventarioDetalhes,
    meta: { title: 'Detalhes do Inventário' }
  },
  // Rota para página não encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router