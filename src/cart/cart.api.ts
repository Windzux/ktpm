import { Router } from "express";
import { CartBLL } from "./cart.bll";
import { checkJwt } from "../auth/checkToken";

export function CartAPI(cartBLL: CartBLL) {
  const router = Router();

  // Thêm sản phẩm vào giỏ hàng
  router.post("/cart", checkJwt, async (req, res) => {
    try {
      const { user_id, product_id, quantity } = req.body;
      if (!user_id || !product_id || !quantity) {
        return res
          .status(400)
          .json({ error: "user_id, product_id, and quantity are required" });
      }
      const cartItem = await cartBLL.addToCart({
        user_id,
        product_id,
        quantity,
      });
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Lấy giỏ hàng của người dùng
  router.get("/cart/:user_id", checkJwt, async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const cartItems = await cartBLL.getCart(user_id);
      res.status(200).json(cartItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  router.put("/cart/:id", checkJwt, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      if (!quantity) {
        return res.status(400).json({ error: "quantity is required" });
      }
      const updatedCartItem = await cartBLL.updateCartItem(id, quantity);
      if (!updatedCartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.status(200).json(updatedCartItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Xóa sản phẩm khỏi giỏ hàng
  router.delete("/cart/:id", checkJwt, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await cartBLL.removeFromCart(id);
      res.status(204).json();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
