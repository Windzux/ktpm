import * as express from "express";
import { HttpErrorHandler } from "../common/http_errror_handler";
import { UserNS } from "./user";
import { formLoginValidate } from "../lib/validate";
import { paramsSetToken } from "../auth/createJwt";
import { createToken } from "../auth/createJwt";
import { checkJwt } from "../auth/checkToken";
import { refeshToken } from "../auth/resfeshToken";
import { enPassword } from "../lib/hashing";
import { HttpParamValidators } from "../lib/http";
export function UserAPI
      ( bll: UserNS.BLL) 
      {
        const router = express.Router();
        router.get("/listUser" ,checkJwt, async (req, res) => {
            const listUser = await bll.listUser();
            res.json(listUser);
        })
        router.get("/user" , checkJwt , async ( req, res ) => {
            const name = HttpParamValidators.MustBeString(req.body, "name");
            const user = await bll.getUser(name)
            res.json(user);
        })
        router.post("/createUser", async (req, res) => {
            
           // const paramsUser = formLoginValidate.ValidateInputUsername(req.body, "username", "password");
            const paramsUser: UserNS.paramsCreateUser = {
                name: HttpParamValidators.MustBeString(req.body, "name"),
                username: HttpParamValidators.MustBeString(req.body, "username"),
                passwordHashing: enPassword(HttpParamValidators.MustBeString(req.body, "password")),
                email: HttpParamValidators.MustBeString(req.body, "email"),
                role :  HttpParamValidators.MustBeString(req.body, "role") ,
                todo: 1,
            };
            
            const userCreate = await bll.createUser(paramsUser);
            res.json(userCreate);
        })
        router.post("/login", async ( req, res ) => {
            const formLogin = formLoginValidate.ValidateInputUsername(req.body, "username", "password");
            const params: UserNS.paramsLogin = {
                  username: formLogin.username,
                  password: formLogin.password
            }            
            const userLog = await bll.login(params);
            const paramsToken: paramsSetToken = {
                username : userLog.username,
                password : userLog.passwordHashing,
                role     : userLog.role
            };
            const token = createToken(paramsToken);
            res.send({
                userLog,
                accessToken: token});
        })
        router.get("/refeshToken", (req, res) => {
        
            const paramsRefeshToken : UserNS.refeshToken ={
                token: HttpParamValidators.MustBeString(req.body, "token"),
            };           

            const token = refeshToken(paramsRefeshToken);
            res.send({ refeshToken: token });
           
        })
        return router;
  
       
}


