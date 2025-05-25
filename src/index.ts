import { ReadConfig } from "./config";
import express from "express";
import cors from "cors";
import "./lib/express";
import "./ext/log"; // Kiểm tra file này
import { ExpressStaticFallback } from "./lib/express";
import { HttpErrorHandler } from "./common/http_error_handler";
import { ExpressPeerServer } from "peer";
import { createServer } from "http";
import { Server } from "socket.io";
import { UserAPI } from "./user/user.api";
import { ProductAPI } from "./product/product.api";
import { CartAPI } from "./cart/cart.api";
import { Connect, IDatabaseParams } from "./lib/database";
import { Dialect } from "sequelize/types";
import { UserBLL } from "./user/user.bll";
import SQLDALUser, { associate as userAssociate } from "./user/user.dal.sql";
import { checkJwt } from "./auth/checkToken";
import { ProductBLL } from "./product/product.bll";
import { CartBLL } from "./cart/cart.bll";
import { PaymentBLL } from "./payment/payment.bll";
import * as dotenv from "dotenv";
import CartModel, { associate as cartAssociate } from "./cart/cart.dal.sql";
import ProductModel, {
  associate as productAssociate,
} from "./product/product.dal.sql";
import PaymentModel, {
  associate as paymentAssociate,
} from "./payment/payment.dal.sql";
import path from "path";

dotenv.config();

async function main() {
  const config = ReadConfig();

  const database = await Connect({
    host: config.database.db_url,
    database: config.database.db_name,
    username: config.database.db_user,
    password: config.database.db_pass,
    dialect: config.database.db_dialect as Dialect,
  } as IDatabaseParams);

  const userBll = new UserBLL(database);
  const productBLL = new ProductBLL(database);
  const cartBLL = new CartBLL(database);
  const paymentBLL = new PaymentBLL(database);

  const User = SQLDALUser(database);
  const Cart = CartModel(database);
  const Product = ProductModel(database);
  const Payment = PaymentModel(database);

  await userBll.init();
  await productBLL.init();
  await cartBLL.init();
  await paymentBLL.init();

  userAssociate({ User, Cart, Product, Payment });
  cartAssociate({ User, Cart, Product, Payment });
  productAssociate({ User, Cart, Product, Payment });
  paymentAssociate({ User, Cart, Product, Payment });

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const peer = ExpressPeerServer(httpServer);
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, "../frontend")));

  app.use("/peer", peer);
  io.on("connect", (socket) => {
    socket.on("joinRoom", (idRoom, userId, id) => {
      socket.join(idRoom);
      socket.to(idRoom).emit("user-connected-room", userId, id);
      socket.on("message", (message) => {
        io.to(idRoom).emit("sendMessage", message, userId);
      });
      socket.on("disconnect", () => {
        socket.to(idRoom).emit("user-disconnected", userId);
      });
    });
  });

  app.use("/api/v1", UserAPI(userBll));
  app.use("/api/v1/product", checkJwt, ProductAPI(productBLL));
  app.use("/api/v1/cart", checkJwt, CartAPI(cartBLL));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  });

  app.use("/", ExpressStaticFallback(config.app.dir ?? process.cwd()));
  app.use(HttpErrorHandler);

  httpServer.listen(config.app.port, () => {
    console.log(`Server running on port ${config.app.port}`);
  });
}

main().catch((err: Error) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
