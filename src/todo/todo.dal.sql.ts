import { Sequelize } from "sequelize";
import { TodoNS } from "./todo";

export class TodoDALSQL implements TodoNS.DAL {
    constructor(
        private db: Sequelize
    ) {}
    
    private TodoModel = TodoNS.Todo(this.db);
    
    async init() {
        await this.TodoModel.sync();
    }
    
    async GetTodo(id: number): Promise<TodoNS.Todo> {
        const doc = await this.TodoModel.findOne({ where: { id }});
        if (!doc) {
            throw TodoNS.Errors.TodoNotFound;
        }
        return doc.toJSON();
    }

    async ListTodo(): Promise<TodoNS.Todo[]> {
        const docs = await this.TodoModel.findAll();
        console.log(docs);
        return docs.map(d => d.toJSON());
    }

    async CreateTodo(params: TodoNS.CreateTodoParams): Promise<TodoNS.Todo> {
        try {
            const doc = await this.TodoModel.create({ name: params.name });
            return doc.toJSON();
        } catch {
            throw TodoNS.Errors.TodoExist;
        }
        
    }

    async UpdateTodo(id: number, params: TodoNS.UpdateTodoParams): Promise<TodoNS.Todo> {
        const todo = await this.TodoModel.findOne({ where: { id }});
        await todo.update({
            ...params
        })
        return todo.toJSON();
    }

    async DeleteTodo(id: number): Promise<void> {
        console.log(id);
        const todo = await this.TodoModel.findOne({ where: { id }});
        await todo.destroy();
    }
}