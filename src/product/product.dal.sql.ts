import { Sequelize, DataTypes, Model } from "sequelize";

export interface ProductAttributes {
  id?: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string; // Thêm cột imageUrl
}

export interface ProductCreationAttributes {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export default function ProductModel(sequelize: Sequelize) {
  class Product
    extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes
  {
    public id!: number;
    public name!: string;
    public price!: number;
    public description!: string;
    public imageUrl!: string;
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: false,
    }
  );

  return Product;
}

export function associate(models: any) {
  const { User, Cart, Product, Payment } = models;
  Product.hasMany(Cart, { foreignKey: "product_id" });
}
