import { Sequelize, Model, DataTypes} from "sequelize";
import { TodoNS } from "../todo/todo";

export namespace UserNS {
  
  
    export interface BLL{ 
    }

    export interface DAL{
    }
    export const Errors = {
        UserNotFound : new Error("user Not Found"),
        UserExist : new Error("user does existed"),
        PassFail : new Error("password fail")
    }
}


