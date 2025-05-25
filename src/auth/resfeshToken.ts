import jwt = require("jsonwebtoken");
import { paramsSetToken}  from './createJwt';
import { UserNS } from '../user/user';
import { dePassword } from '../lib/hashing';
interface tokenInterface {
    username: string;
    password: string;
    role: string;
}
const tokenExpired = (token: string) : boolean => {
    const { exp } = jwt.decode(token) as {
        exp: number;
    };
    const expirationDatetime: number = exp + parseInt(process.env.expTime);
    if(Date.now() >= expirationDatetime){
        return false;
    }
    return true;
}
export const refeshToken = (params: UserNS.refeshToken) : string => {
    let newToken: string;
    const { username, password, role } = jwt.decode(params.token) as tokenInterface;
    const paramsToken: paramsSetToken = {
          username : username,
          password : password,
          role     : role

    }
    if(tokenExpired(params.token)){
          newToken = jwt.sign(paramsToken, process.env.SECRETTOKEN, {
          expiresIn: process.env.expTime
         })
    }
 
    return newToken;
}
