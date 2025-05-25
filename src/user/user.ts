import { Sequelize, Model, DataTypes} from "sequelize";
import { TodoNS } from "../todo/todo";

export namespace UserNS {
    
    export const User = (sequelize : Sequelize) => {
        class User extends Model {
            passwordHashing: any;
}
        User.init({
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            username:{
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey:true,
            },
            passwordHashing:{
                type: DataTypes.STRING,
                allowNull: false
            },
            email:{
                 type: DataTypes.STRING,
                 allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            },
    }

        ,{ 
            timestamps: true,
            modelName: "users",
            sequelize
        })
        
        return User;
    }
    export interface paramsLogin{
        username: string,
        password: string
    }
    export interface refeshToken{
        token: string
    }
     

    export interface paramsUpdateUser{
        name?: string,
        username?: string,
        passwordHashing?: string,
        role?: string
    }
    export interface paramsCreateUser{
        name: string,
        username: string,
        passwordHashing: string,
        email: string,
        role: string,
        todo: number
        
    }
    export interface User {
        name: string;
        username: string;
        passwordHashing: string;
        email: string;
        role: string;
        todo: number;
        createdAt : Date;
        updatedAt : Date;
        
    }
    export interface BLL{
        getUser(username: string): Promise<User>;
        listUser(): Promise<User[]>;
        createUser(user: paramsCreateUser): Promise<User>;
        updateUser(username: string, params: paramsUpdateUser) : Promise<User>;
        deleteUser(username: string) : Promise<void>;
        login(params: paramsLogin): Promise<User>;

        }


    export interface DAL{
        getUser(id: string): Promise<User>;
        listUser(): Promise<User[]>;
        createUser(user: paramsCreateUser): Promise<User>;
        updateUser(id: string, params: paramsUpdateUser): Promise<User>;
        deleteUser(id: string): Promise<void>;
        login(params : paramsLogin): Promise<User>;
    }
    export const Errors = {
        UserNotFound : new Error("user Not Found"),
        UserExist : new Error("user does existed"),
        PassFail : new Error("password fail")
    }
}


