import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'

/**
 * Modelo de Configuração
 */
class Configuracao extends Model {
  public id!: number
  public moeda!: string
  public idioma!: string
  public formatoData!: string
  public casasDecimais!: number
  public outrosParametros!: Record<string, any>
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Configuracao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    moeda: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'BRL'
    },
    idioma: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'pt-BR'
    },
    formatoData: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'DD/MM/YYYY'
    },
    casasDecimais: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    outrosParametros: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'configuracoes',
    modelName: 'Configuracao'
  }
)

export default Configuracao