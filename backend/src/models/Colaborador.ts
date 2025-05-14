import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import Departamento from './Departamento'

/**
 * Modelo de Colaborador
 */
class Colaborador extends Model {
  public id!: number
  public nome!: string
  public cargo!: string
  public salario!: number
  public dataAdmissao!: Date
  public departamentoId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Colaborador.init(
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
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    salario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    dataAdmissao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    departamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Departamento,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'colaboradores',
    modelName: 'Colaborador'
  }
)

// Relacionamentos
Colaborador.belongsTo(Departamento, { foreignKey: 'departamentoId', as: 'departamento' })
Departamento.hasMany(Colaborador, { foreignKey: 'departamentoId', as: 'colaboradores' })

export default Colaborador