import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/config'

/**
 * Modelo de Categoria de Produtos
 */
class Categoria extends Model {
  public id!: number
  public nome!: string
  public descricao!: string
  public categoriaPaiId!: number | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Categoria.init(
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
    categoriaPaiId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'categorias',
    modelName: 'Categoria'
  }
)

// Auto-relacionamento para hierarquia de categorias
Categoria.belongsTo(Categoria, { as: 'categoriaPai', foreignKey: 'categoriaPaiId' })
Categoria.hasMany(Categoria, { as: 'subcategorias', foreignKey: 'categoriaPaiId' })

export default Categoria