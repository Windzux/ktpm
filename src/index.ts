import { ReadConfig } from "./config";
import * as express from "express";
import * as cors from "cors";
import "./lib/express";
import "./ext/log";
import { ExpressStaticFallback } from "./lib/express";
import { HttpErrorHandler } from "./common/http_errror_handler";
import { ExpressPeerServer } from "peer";
import { createServer } from "http";
import { Server } from "socket.io";
import { TodoBLLBase } from "./todo/todo.bll.base";
import { NewTodoAPI } from "./todo/todo.api";
import { UserAPI } from "./user/user.api";
import { Connect } from "./lib/database";
import { Dialect } from "sequelize/types";
import { TodoDALSQL } from "./todo/todo.dal.sql";
import { UserBLL } from "./user/user.bll";
import { SQLDALUser } from "./user/user.dal.sql"
import { checkJwt } from "./auth/checkToken";
export async function main() {
    const config = await ReadConfig();
    console.log(config);
    // const client = await MongoCommon.Connect(config.database.db_url);
    console.log('connected to database');
    const database = await Connect({
        host: config.database.db_url, 
        database: config.database.db_name,
        username: config.database.db_user,
        password: config.database.db_pass,
        dialect: config.database.db_dialect as Dialect
    })
    /********************************************************/
    // const todoDAL = new TodoDALMongo(database);
    const todoDAL = new TodoDALSQL(database);
    const userDAL = new SQLDALUser(database)
    todoDAL.init();
    userDAL.init();
    const todoBLL = new TodoBLLBase(todoDAL);
    const userBll = new UserBLL(userDAL)
    todoBLL.init();
    userBll.init();
    /*******************************************************/
    
    const app = express();
    const httpServer = createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
          }
    });
    // io.on("connection", socket => console.log(socket.id));
    const peer:any = ExpressPeerServer(httpServer);
    app.disable("x-powered-by");
    app.use(cors());

    app.use(express.json());
    /*******************************************************/
    app.use('/peer', peer, ()=> {
        console.log('asdfajskhfajkh');
    });
    peer.on('connection', (client) => { console.log(client.id) });
    app.use("/api/v1/todo",checkJwt, NewTodoAPI(todoBLL));
    app.use("/api/v1", UserAPI(userBll));
    /*******************************************************/
    app.use("/", ExpressStaticFallback(config.app.dir));
    app.use(HttpErrorHandler);
    httpServer.listen(6969, ()=>{
        console.log("socket running in 6969");
    });
    app.listen(config.server.port, "0.0.0.0", () => {
        const err = arguments[0];
        console.log("running");
        if (err) {
            console.log(err);
        }
    });
}
main().catch(err => console.log(err));




