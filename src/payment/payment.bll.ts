import { Sequelize } from "sequelize";
import PaymentModel from "./payment.dal.sql"; // Sử dụng default import
import {
  PaymentAttributes,
  PaymentCreationAttributes,
} from "./payment.dal.sql"; // Giả định named export

export class PaymentBLL {
  private sequelize: Sequelize;
  private Payment: ReturnType<typeof PaymentModel>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.Payment = PaymentModel(this.sequelize);
  }

  async init() {
    await this.sequelize.sync();
  }

  async createPayment(
    params: PaymentCreationAttributes
  ): Promise<PaymentAttributes> {
    const payment = await this.Payment.create(params);
    return payment.get({ plain: true }) as PaymentAttributes;
  }

  async getPayments(user_id: string): Promise<PaymentAttributes[]> {
    const payments = await this.Payment.findAll({ where: { user_id } });
    return payments.map(
      (payment) => payment.get({ plain: true }) as PaymentAttributes
    );
  }
}
