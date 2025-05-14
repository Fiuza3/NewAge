import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import Produto from './Produto'

/**
 * Tipos de movimentação de estoque
 */
export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA_VENDA = 'SAIDA_VENDA',
  SAIDA_PERDA = 'SAIDA_PERDA',
  AJUSTE = 'AJUSTE'
}

/**
 * Modelo de Movimentação de Estoque
 */
class MovimentacaoEstoque extends Model {
  public id!: number
  public produtoId!: number
  public tipo!: TipoMovimentacao
  public quantidade!: number
  public quantidadeAnterior!: number
  public quantidadeNova!: number
  public observacao!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

MovimentacaoEstoque.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produto,
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(TipoMovimentacao)),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantidadeAnterior: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantidadeNova: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'movimentacoes_estoque',
    modelName: 'MovimentacaoEstoque'
  }
)

// Relacionamentos
MovimentacaoEstoque.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' })
Produto.hasMany(MovimentacaoEstoque, { foreignKey: 'produtoId', as: 'movimentacoes' })

export default MovimentacaoEstoque