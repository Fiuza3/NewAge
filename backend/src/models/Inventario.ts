import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import Produto from './Produto'

/**
 * Status do inventário
 */
export enum StatusInventario {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

/**
 * Modelo de Inventário
 */
class Inventario extends Model {
  public id!: number
  public data!: Date
  public observacao!: string
  public status!: StatusInventario
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Inventario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StatusInventario)),
      allowNull: false,
      defaultValue: StatusInventario.EM_ANDAMENTO
    }
  },
  {
    sequelize,
    tableName: 'inventarios',
    modelName: 'Inventario'
  }
)

/**
 * Modelo de Item de Inventário
 */
class ItemInventario extends Model {
  public id!: number
  public inventarioId!: number
  public produtoId!: number
  public quantidadeSistema!: number
  public quantidadeContada!: number
  public diferenca!: number
  public observacao!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ItemInventario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    inventarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Inventario,
        key: 'id'
      }
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produto,
        key: 'id'
      }
    },
    quantidadeSistema: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantidadeContada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    diferenca: {
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
    tableName: 'itens_inventario',
    modelName: 'ItemInventario'
  }
)

// Relacionamentos
Inventario.hasMany(ItemInventario, { foreignKey: 'inventarioId', as: 'itens' })
ItemInventario.belongsTo(Inventario, { foreignKey: 'inventarioId', as: 'inventario' })

ItemInventario.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' })
Produto.hasMany(ItemInventario, { foreignKey: 'produtoId', as: 'itensInventario' })

export { Inventario, ItemInventario }