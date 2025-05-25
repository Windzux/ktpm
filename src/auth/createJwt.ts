import jwt = require('jsonwebtoken');
export interface paramsSetToken {
    username: string,
    password: string,
    role: string,
}
export const createToken = (params: paramsSetToken) : any =>    {
       const { username , password, role } =  params;
       const token = jwt.sign(params , process.env.SECRETTOKEN, {
            expiresIn: process.env.expTime,
        })
        return token;
 }