import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public price!: number;

  static associate(models: any) {
    Product.hasMany(models.Cart, {
      foreignKey: "product_id",
      sourceKey: "id",
    });
  }
}

function ProductModel(sequelize: Sequelize) {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: false,
    }
  );

  return Product;
}

export class ProductDALSQL {
  private sequelize: Sequelize;
  public Product: ReturnType<typeof ProductModel>;

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
    return this.Product.create(params);
  }

  async getProduct(id: number): Promise<ProductAttributes | null> {
    return this.Product.findByPk(id);
  }

  async listProducts(): Promise<ProductAttributes[]> {
    return this.Product.findAll();
  }

  async updateProduct(
    id: number,
    params: Partial<ProductAttributes>
  ): Promise<[number, ProductAttributes[]]> {
    const [affectedCount] = await this.Product.update(params, {
      where: { id },
      returning: true,
    });
    return [affectedCount, await this.Product.findAll({ where: { id } })];
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.Product.findByPk(id);
    if (product) await product.destroy();
  }
}

export default ProductModel;
