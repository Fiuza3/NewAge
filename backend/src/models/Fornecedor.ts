import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'

/**
 * Modelo de Fornecedor
 */
class Fornecedor extends Model {
  public id!: number
  public nome!: string
  public cnpj!: string
  public email!: string
  public telefone!: string
  public endereco!: string
  public cidade!: string
  public estado!: string
  public cep!: string
  public contato!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Fornecedor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    cep: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    contato: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'fornecedores',
    modelName: 'Fornecedor'
  }
)

export default Fornecedor