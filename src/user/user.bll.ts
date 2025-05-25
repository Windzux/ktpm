    import { UserNS } from "./user";
    export class UserBLL implements UserNS.BLL { 
        constructor (
            private dal : UserNS.DAL
        ) { }
    async init() { }
    async getUser(username: string): Promise<UserNS.User> {
            const User = this.dal.getUser(username);
            return User;
    }
    async listUser(): Promise<UserNS.User[]> {
            const listU = await this.dal.listUser();
            return listU;
    }
    async createUser(user: UserNS.paramsCreateUser): Promise<UserNS.User> {
            const user1 = await this.dal.createUser(user);
            return user1;
    }
    async updateUser(username: string, params: UserNS.paramsUpdateUser): Promise<UserNS.User> {
            const UserUd = await this.dal.updateUser(username, params);
            return UserUd;
    }
    async deleteUser(username: string): Promise<void> {
              await this.dal.deleteUser(username);
            
    }
    async login(params: UserNS.paramsLogin): Promise<UserNS.User> {
            const User = await this.dal.login(params);
            return User;

    }

} 