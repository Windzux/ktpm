import { Sequelize } from "sequelize";
import ProductModel from "./product.dal.sql";
import {
  ProductAttributes,
  ProductCreationAttributes,
} from "./product.dal.sql";

export class ProductBLL {
  private sequelize: Sequelize;
  private Product: ReturnType<typeof ProductModel>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.Product = ProductModel(this.sequelize);
  }

  async init() {
    await this.sequelize.sync();
  }

  async createProduct(
    params: ProductCreationAttributes
  ): Promise<ProductAttributes> {
    const product = await this.Product.create(params);
    return product.get({ plain: true }) as ProductAttributes;
  }

  async getProducts(): Promise<ProductAttributes[]> {
    const products = await this.Product.findAll();
    return products.map(
      (product) => product.get({ plain: true }) as ProductAttributes
    );
  }

  async getProductById(id: number): Promise<ProductAttributes | null> {
    const product = await this.Product.findByPk(id);
    return product ? (product.get({ plain: true }) as ProductAttributes) : null;
  }

  async updateProduct(
    id: number,
    params: Partial<ProductAttributes>
  ): Promise<ProductAttributes | null> {
    const product = await this.Product.findByPk(id);
    if (!product) return null;
    await product.update(params);
    return product.get({ plain: true }) as ProductAttributes;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.Product.findByPk(id);
    if (product) await product.destroy();
  }
}
