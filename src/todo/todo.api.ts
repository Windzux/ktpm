import * as express from "express";
import { HttpParamValidators } from "../lib/http";
import { TodoNS } from "./todo";

export function NewTodoAPI(
    todoBLL : TodoNS.BLL
) {
    const router = express.Router();

    router.get("/list", async (req,res) => {
        const docs = await todoBLL.ListTodo();
        res.json(docs);
    })

    router.get("/get/:id", async (req,res) => {
        const id = HttpParamValidators.MustBeString(req.params, "id", 1);
        const doc = await todoBLL.GetTodo(+id);
        res.json(doc);
    })

    router.post("/create", async (req,res) => {
        const params : TodoNS.CreateTodoParams = {
            name : HttpParamValidators.MustBeString(req.body, "name", 2)
        }
        const doc = await todoBLL.CreateTodo(params);
        res.json(doc);
    })

    router.post("/update/:id", async (req,res) => {
        console.log(req.params);
        const id = HttpParamValidators.MustBeString(req.params, "id", 1);
        let params : TodoNS.UpdateTodoParams = {};
        console.log(req.body.name);
        if (req.body.name) {
            params.name = HttpParamValidators.MustBeString(req.body, "name", 2)
        }
        const doc = await todoBLL.UpdateTodo(+id, params);
        res.json(doc);
    })
    
    router.delete("/:id", async(req, res) => {
        
        const id = HttpParamValidators.MustBeString(req.params, "id", 1);
        const doc = await todoBLL.DeleteTodo( +id );
        res.json(doc);
    })
    return router;
}