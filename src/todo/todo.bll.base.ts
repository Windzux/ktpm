import { TodoNS } from "./todo";

export class TodoBLLBase implements TodoNS.BLL {
    constructor(
        private dal : TodoNS.DAL
    ) { }

    async init() { }

    async ListTodo(): Promise<TodoNS.Todo[]> {
        const docs = await this.dal.ListTodo();
        return docs;
    }

    async GetTodo(id: number): Promise<TodoNS.Todo> {
        const doc = await this.dal.GetTodo(id);
        return doc;
    }

    async CreateTodo(params: TodoNS.CreateTodoParams): Promise<TodoNS.Todo> {
        const todo = await this.dal.CreateTodo(params);
        return todo;
    }

    async UpdateTodo(id: number, params: TodoNS.UpdateTodoParams): Promise<TodoNS.Todo> {
        const todo = await this.dal.UpdateTodo(id, params);
        return todo;
    }

    async DeleteTodo(id: number): Promise<void> {
            
            await this.dal.DeleteTodo(id);
    }
}