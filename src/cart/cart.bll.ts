import { Sequelize } from "sequelize";
import CartModel, {
  CartAttributes,
  CartCreationAttributes,
} from "./cart.dal.sql";

export class CartBLL {
  private sequelize: Sequelize;
  private Cart: ReturnType<typeof CartModel>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.Cart = CartModel(this.sequelize);
  }

  async init() {
    await this.sequelize.sync();
  }

  async addToCart(params: CartCreationAttributes): Promise<CartAttributes> {
    const existingItem = await this.Cart.findOne({
      where: { user_id: params.user_id, product_id: params.product_id },
    });
    if (existingItem) {
      const newQuantity = existingItem.quantity + (params.quantity || 0);
      await existingItem.update({ quantity: newQuantity });
      return existingItem.get({ plain: true }) as CartAttributes;
    }
    const cartItem = await this.Cart.create(params);
    return cartItem.get({ plain: true }) as CartAttributes;
  }

  async getCart(user_id: string): Promise<CartAttributes[]> {
    const cartItems = await this.Cart.findAll({ where: { user_id } });
    return cartItems.map((item) => item.get({ plain: true }) as CartAttributes);
  }

  async getCartItem(id: number): Promise<CartAttributes | null> {
    const cartItem = await this.Cart.findByPk(id);
    return cartItem ? (cartItem.get({ plain: true }) as CartAttributes) : null;
  }

  async updateCartItem(
    id: number,
    quantity: number
  ): Promise<CartAttributes | null> {
    const cartItem = await this.Cart.findByPk(id);
    if (!cartItem) return null;
    await cartItem.update({ quantity });
    return cartItem.get({ plain: true }) as CartAttributes;
  }

  async removeFromCart(id: number): Promise<void> {
    const cartItem = await this.Cart.findByPk(id);
    if (cartItem) await cartItem.destroy();
  }
}
