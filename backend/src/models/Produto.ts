import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import Categoria from './Categoria'
import Fornecedor from './Fornecedor'

/**
 * Modelo de Produto
 */
class Produto extends Model {
  public id!: number
  public nome!: string
  public descricao!: string
  public sku!: string
  public categoriaId!: number
  public fornecedorId!: number
  public unidadeMedida!: string
  public quantidadeMinima!: number
  public quantidadeMaxima!: number
  public quantidadeAtual!: number
  public custo!: number
  public precoVenda!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Produto.init(
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categoria,
        key: 'id'
      }
    },
    fornecedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Fornecedor,
        key: 'id'
      }
    },
    unidadeMedida: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'UN'
    },
    quantidadeMinima: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    quantidadeMaxima: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    quantidadeAtual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    custo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    precoVenda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'produtos',
    modelName: 'Produto'
  }
)

// Relacionamentos
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' })
Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos' })

Produto.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' })
Fornecedor.hasMany(Produto, { foreignKey: 'fornecedorId', as: 'produtos' })

export default Produto