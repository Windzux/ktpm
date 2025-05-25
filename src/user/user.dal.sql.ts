import { UserNS } from './user';
import { Sequelize } from "sequelize";
import { dePassword } from '../lib/hashing';
import { TodoBLLBase } from '../todo/todo.bll.base';
export class SQLDALUser implements UserNS.DAL{
      constructor( 
        private db : Sequelize
      ) { }
       private UserModel = UserNS.User(this.db);
       async init () {
          await this.UserModel.sync();
       }
       async getUser(name : string) : Promise<UserNS.User> {
           const user =  await this.UserModel.findOne({where : {name}});
           if( !user ) { 
                throw UserNS.Errors.UserNotFound;
            
                
           }
           return user.toJSON();
       }
       async listUser(): Promise<UserNS.User[]> {
            const  Users = await this.UserModel.findAll();
            if(!Users){ 
              throw UserNS.Errors.UserNotFound;
           }
           return  Users.map(u  => u.toJSON() ) ; 
           
       }
        async createUser(user: UserNS.paramsCreateUser): Promise<UserNS.User> {
            const users = await this.UserModel.create({
                name: user.name,
                username: user.username,
                passwordHashing: user.passwordHashing,
                email: user.email,
                role: user.role,
                todo: user.todo
                
            });
            if(!users){
                throw  UserNS.Errors.UserNotFound;
            }
            return users.toJSON();

        }
        async updateUser(name: string, params: UserNS.paramsUpdateUser): Promise<UserNS.User> {
            const userUp = await this.UserModel.findOne({where: {name}});
            await userUp.update({
                ...params
            });
            return userUp.toJSON();
        
    }
        async deleteUser(name: string): Promise<void> {
            const userD = await this.UserModel.findOne({where : { name}});
            await userD.destroy();
        }
        async login(params : UserNS.paramsLogin ) : Promise<UserNS.User> {
            const username = params.username; 
            const userLogin = await this.UserModel.findOne({where : { username }});
            if(!userLogin)  
            {
                throw UserNS.Errors.UserNotFound;
            }
            const passwordHashing = userLogin.passwordHashing;
            const password = dePassword(passwordHashing);
            if(password !== params.password){
                   throw UserNS.Errors.PassFail;
            }
            return userLogin.toJSON();

            
        }
    }
