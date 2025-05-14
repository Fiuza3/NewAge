import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './database/config'
import routes from './routes'

// Carrega as variáveis de ambiente
dotenv.config()

// Cria a aplicação Express
const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/api', routes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API NewAge ERP - Backend funcionando!' })
})

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado')
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  })
  .catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error)
  })