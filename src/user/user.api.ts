import { Router, Request, Response } from "express";
import { UserBLL } from "./user.bll";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";

export function UserAPI(userBLL: UserBLL) {
  const router = Router();

  // Endpoint đăng nhập
  router.post("/login", async (req: Request, res: Response) => {
    // try {
    const { username, password } = req.body || {};
    // if (!username || !password) {
    //   return res
    //     .status(400)
    //     .json({ error: "Username and password are required" });
    // }

    const user = await userBLL.findUserByUsername(username);
    if (!user || !user.password_hash) {
      // return res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      // return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log(user);

    const token = jwt.sign(
      { username: user.username, role: user.role },
      "your-secret-key",
      { expiresIn: "1h" }
    );
    console.log(token);
    return res.status(200).send({ token });
    // } catch (error: unknown) {
    //   const errorMessage =
    //     error instanceof Error ? error.message : "Unknown error occurred";
    //   console.error("Login error:", errorMessage);
    //   return res.status(500).json({ error: errorMessage });
    // }
  });

  // Endpoint đăng ký
  router.post("/register", async (req: Request, res: Response) => {
    let user;
    try {
      const { username, password, role } = req.body || {};
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      user = await userBLL.createUser({
        username,
        password_hash,
        role: role || "user",
      });
      // if (!res.headersSent) {
      //   console.log("Register success, sending response:", user); // Log trước khi gửi
      //   return res.status(201).json(user); // Đảm bảo phản hồi được gửi
      // }
      console.log(user);
      return res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintError) {
        if (!res.headersSent) {
          return res.status(409).json({ error: "Username already exists" });
        }
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Register error:", errorMessage);
      if (!res.headersSent) {
        return res.status(500).json({ error: errorMessage });
      }
    }
    // Log sau khi xử lý (nếu cần)
    console.log("Register - Raw req.body:", JSON.stringify(req.body, null, 2));
  });

  return router;
}
