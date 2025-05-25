import { Sequelize } from "sequelize";
import SQLDALUser from "./user.dal.sql";
import { UserAttributes, UserCreationAttributes } from "./user.dal.sql";

export class UserBLL {
  private sequelize: Sequelize;
  private User: ReturnType<typeof SQLDALUser>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.User = SQLDALUser(this.sequelize);
  }

  async init() {
    await this.sequelize.sync();
  }

  async createUser(params: UserCreationAttributes): Promise<UserAttributes> {
    const user = await this.User.create(params);
    return user.get({ plain: true }) as UserAttributes; // Chuyển thành plain object
  }

  async findUserByUsername(username: string): Promise<UserAttributes | null> {
    const user = await this.User.findOne({ where: { username } });
    return user ? (user.get({ plain: true }) as UserAttributes) : null; // Chuyển thành plain object
  }
}
