import { Sequelize, DataTypes, Model } from "sequelize";

export interface CartAttributes {
  id?: number;
  user_id: number; // Sửa từ STRING thành INTEGER
  product_id: number;
  quantity: number;
}

export interface CartCreationAttributes {
  user_id: number;
  product_id: number;
  quantity: number;
}

export default function CartModel(sequelize: Sequelize) {
  class Cart
    extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes
  {
    public id!: number;
    public user_id!: number;
    public product_id!: number;
    public quantity!: number;
  }

  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER, // Sửa thành INTEGER
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "carts",
      timestamps: false,
    }
  );

  return Cart;
}

export function associate(models: any) {
  const { User, Cart, Product, Payment } = models;
  Cart.belongsTo(User, { foreignKey: "user_id" });
  Cart.belongsTo(Product, { foreignKey: "product_id" });
}
