import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import Empresa from './Empresa'

/**
 * Modelo de Departamento
 */
class Departamento extends Model {
  public id!: number
  public nome!: string
  public empresaId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Departamento.init(
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
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empresa,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'departamentos',
    modelName: 'Departamento'
  }
)

// Relacionamentos
Departamento.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' })
Empresa.hasMany(Departamento, { foreignKey: 'empresaId', as: 'departamentos' })

export default Departamento