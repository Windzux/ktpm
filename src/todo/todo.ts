import { Sequelize, DataTypes, Model } from "sequelize";

export namespace TodoNS {
    export const Todo = (sequelize: Sequelize) => {
        class Todo extends Model { }
        Todo.init({
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            modelName: 'todo',
            timestamps: true,
            sequelize,
            // paranoid: true
        })
        return Todo;
    } 

    export interface Todo {
        id : number;
        name : string;
        createdAt : Date;
        updatedAt : Date;
    }
    export interface CreateTodoParams {
        name : string;
    }

    export interface UpdateTodoParams {
        name? : string;
    }

    export interface BLL {
        GetTodo(id : number) : Promise<Todo>;
        ListTodo() : Promise<Todo[]>;
        CreateTodo(params : CreateTodoParams) : Promise<Todo>;
        UpdateTodo(id: number, params : UpdateTodoParams) : Promise<Todo>;
        DeleteTodo(id: number) : Promise<void>;
    }

    export interface DAL {
        GetTodo(id : number) : Promise<Todo>;
        ListTodo() : Promise<Todo[]>;
        CreateTodo(params : CreateTodoParams) : Promise<Todo>;
        UpdateTodo(id: number, params : UpdateTodoParams) : Promise<Todo>;
        DeleteTodo(id: number) : Promise<void>;
    }

    export const Errors = {
        TodoNotFound : new Error("Todo Not Found"),
        TodoExist : new Error("Todo does existed")
    }
}