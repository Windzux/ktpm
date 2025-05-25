import { Sequelize, Model, DataTypes } from "sequelize";

export namespace UserNS {
  export const User = (sequelize: Sequelize) => {
    class User extends Model {
      public name!: string;
      public username!: string;
      public password!: string;
      public role!: "admin" | "user";
      public email!: string;
      public phone?: string;
      public address?: string;
      public readonly created_at!: Date;
      public readonly updated_at!: Date;
    }
    User.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("admin", "user"),
          allowNull: false,
          defaultValue: "user",
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isEmail: true },
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        timestamps: true,
        modelName: "users",
        sequelize,
      }
    );

    return User;
  };

  export interface refreshToken {
    token: string;
  }

  export interface paramsLogin {
    username: string;
    password: string;
  }

  export interface paramsUpdateUser {
    name?: string;
    username?: string;
    password?: string;
    role?: "admin" | "user";
  }

  export interface paramsCreateUser {
    name: string;
    username: string;
    password: string;
    email: string;
    role?: "admin" | "user";
  }

  export interface User {
    name: string;
    username: string;
    password: string;
    role: "admin" | "user";
    email: string;
    phone?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
  }

  export interface BLL {
    getUser(username: string): Promise<User>;
    listUser(): Promise<User[]>;
    createUser(user: paramsCreateUser): Promise<User>;
    updateUser(username: string, params: paramsUpdateUser): Promise<User>;
    deleteUser(username: string): Promise<void>;
    login(params: paramsLogin): Promise<User>;
  }

  export interface DAL {
    getUser(username: string): Promise<User>;
    listUser(): Promise<User[]>;
    createUser(user: paramsCreateUser): Promise<User>;
    updateUser(username: string, params: paramsUpdateUser): Promise<User>;
    deleteUser(username: string): Promise<void>;
    login(params: paramsLogin): Promise<User>;
  }

  export const Errors = {
    UserNotFound: new Error("User Not Found"),
    UserExist: new Error("User already exists"),
    PassFail: new Error("Password incorrect"),
  };
}
