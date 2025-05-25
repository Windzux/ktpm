// import { FromMongoData, MongoDB, MongoErrorCodes, MongoModel, ToMongoData } from "../lib/mongodb";
// import { TodoNS } from "./todo";

// export class TodoDALMongo implements TodoNS.DAL {
//     constructor(private db : MongoDB) { }

//     private col_todo = this.db.collection<MongoModel<TodoNS.Todo>>("todo");

//     async init() { }

//     async ListTodo() {
//         const docs = await this.col_todo.find().toArray();
//         return FromMongoData.Many<TodoNS.Todo>(docs);
//     }

//     async GetTodo(id: string) {
//         const doc = await this.col_todo.findOne({ _id : id });
//         return FromMongoData.One<TodoNS.Todo>(doc);
//     }

//     async CreateTodo(todo: TodoNS.Todo) {
//         const doc = ToMongoData.One(todo);
//         try {
//             await this.col_todo.insertOne(doc);
//         } catch (e) {
//             if (e.codes === MongoErrorCodes.Duplicate) {
//                 throw TodoNS.Errors.TodoExist
//             } else {
//                 throw e;
//             }
//         }
//     }

//     async UpdateTodo(todo: TodoNS.Todo) {
//         const doc = ToMongoData.One(todo);
//         try {
//             await this.col_todo.updateOne({ _id : todo.id }, { $set : doc });
//         } catch (e) {
//             throw e;
//         }
//     }
// // }