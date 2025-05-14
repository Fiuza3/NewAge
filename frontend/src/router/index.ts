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