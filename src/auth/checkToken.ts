import { verify , decode} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpUnauthorized } from '../lib/http';
import { paramsSetToken } from "./createJwt";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
   const token :string = req.headers.authorization.split(' ')[1];
   
   try {
       verify(token, process.env.SECRETTOKEN);   
       next(); 
    }
    catch (error) {
        throw  HttpUnauthorized();
   }
   
}
const tokenExpired = (token: string) : boolean => {
   
        const { exp } = decode(token) as {
            exp: number;
        };
        const expirationDatetime = exp + parseInt(process.env.expTime);
        if(Date.now() >= expirationDatetime){
            return false;
        }else 
            return true;
    
}

