import { Sequelize, Dialect } from "sequelize";

export interface IDatabaseParams {
  host: string;
  database: string;
  username: string;
  password: string;
  dialect: Dialect;
}

export async function Connect(params: IDatabaseParams): Promise<Sequelize> {
  const { host, database, username, password, dialect } = params;
  const client = new Sequelize(database, username, password, {
    host,
    dialect,
  });
  try {
    await client.authenticate();
    console.log("Connection to database has been established successfully.");
    return client;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}
