import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'

/**
 * Modelo de Empresa
 */
class Empresa extends Model {
  public id!: number
  public nome!: string
  public cnpj!: string
  public areaAtuacao!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Empresa.init(
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
    areaAtuacao: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'empresas',
    modelName: 'Empresa'
  }
)

export default Empresa