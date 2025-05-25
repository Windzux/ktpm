import { Sequelize, DataTypes, Model } from "sequelize";

export interface UserAttributes {
  id?: number;
  username: string;
  password_hash: string;
  role: string;
}

export interface UserCreationAttributes {
  username: string;
  password_hash: string;
  role?: string;
}

export default function SQLDALUser(sequelize: Sequelize) {
  class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
  {
    public id!: number;
    public username!: string;
    public password_hash!: string;
    public role!: string;
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
}

export function associate(models: any) {
  const { User, Cart, Product, Payment } = models;
  User.hasMany(Cart, { foreignKey: "user_id" });
  User.hasMany(Payment, { foreignKey: "user_id" });
}
