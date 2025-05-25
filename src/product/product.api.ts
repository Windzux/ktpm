import { Router, Request, Response } from "express";
import { ProductBLL } from "./product.bll";
import { ProductAttributes } from "./product.dal.sql";

export function ProductAPI(productBLL: ProductBLL) {
  const router = Router();

  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const product = await productBLL.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: unknown) {
      // Sửa kiểu thành unknown
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  router.get("/", async (req: Request, res: Response) => {
    try {
      const products = await productBLL.getProducts();
      res.json(products);
    } catch (error: unknown) {
      // Sửa kiểu thành unknown
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Các route khác như POST, PUT, DELETE...

  return router;
}
