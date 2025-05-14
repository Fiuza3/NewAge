# NewAge ERP

Sistema de gestão empresarial modular e escalável.

## Estrutura do Projeto

O projeto está dividido em frontend e backend:

- **Frontend**: Vue 3 com TypeScript, Pinia, Vue Router e Vuetify
- **Backend**: Node.js com Express, MySQL e Sequelize

## Módulos

O sistema está dividido em 4 fases de produção:

### Fase 1 – Estrutura Base e Módulo Administrativo (Atual)

- Layout base com sidebar fixa, header fixo e área dinâmica para conteúdo
- Componentes reutilizáveis (Cards, Tabelas, Dialogs, Snackbars)
- Cadastro de empresas, departamentos e colaboradores
- Configurações gerais do sistema

### Fase 2 – Módulo de Estoque e Produtos (Futuro)

- Cadastro de produtos, categorias e fornecedores
- Movimentações de estoque
- Inventário

### Fase 3 – Módulo Financeiro e Vendas (Futuro)

- Contas a pagar e receber
- Fluxo de caixa
- Pedidos e clientes

### Fase 4 – Módulo de Relatórios, Exportações e Integrações (Futuro)

- Dashboard gerencial
- Relatórios exportáveis
- Integrações com APIs externas

## Tecnologias Utilizadas

### Frontend

- Vue 3 (Composition API)
- Pinia (gerenciamento de estado)
- Vue Router (roteamento dinâmico)
- TypeScript
- SCSS com BEM (metodologia CSS)
- Axios (HTTP)
- Vuetify (UI Component Framework)

### Backend

- Node.js com Express
- MySQL com Sequelize (ORM)
- TypeScript
- Arquitetura limpa (Clean Architecture)

## Como Executar

### Requisitos

- Node.js 16+
- MySQL 8+

### Backend

```bash
cd backend
npm install
# Configure o arquivo .env com as credenciais do banco de dados
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run serve
```

## Padrões de Desenvolvimento

- Nomenclatura semântica (em português)
- Componentes reutilizáveis e modulares
- Responsividade com Grid System do Vuetify
- Requisições assíncronas tratadas com try/catch
- Tratamento de erros com sistema global de notificações
- Comentários descritivos em cada função crítica# NewAge
