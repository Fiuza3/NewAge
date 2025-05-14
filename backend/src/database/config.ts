import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Carrega as variáveis de ambiente
dotenv.config()

// Configuração do Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'newage',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: false
    }
  }
)