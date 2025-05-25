import { Sequelize, DataTypes, Model } from "sequelize";

export interface PaymentAttributes {
  id?: number;
  user_id: number; // Sửa từ STRING thành INTEGER
  amount: number;
  status: string;
  created_at?: Date;
}

export interface PaymentCreationAttributes {
  user_id: number;
  amount: number;
  status?: string;
}

export default function PaymentModel(sequelize: Sequelize) {
  class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes
  {
    public id!: number;
    public user_id!: number;
    public amount!: number;
    public status!: string;
    public created_at!: Date;
  }

  Payment.init(
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
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "payments",
      timestamps: false,
    }
  );

  return Payment;
}

export function associate(models: any) {
  const { User, Cart, Product, Payment } = models;
  User.hasMany(Payment, { foreignKey: "user_id" });
}
