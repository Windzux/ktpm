import * as dotenv from "dotenv";

dotenv.config();

export interface Config {
  app: {
    port: number;
    dir?: string;
  };
  database: {
    db_url: string;
    db_name: string;
    db_user: string;
    db_pass: string;
    db_dialect: string;
  };
}

export function ReadConfig(): Config {
  return {
    app: {
      port: parseInt(process.env.PORT || "6969"),
      dir: process.env.APP_DIR,
    },
    database: {
      db_url: process.env.DB_URL || "localhost",
      db_name: process.env.DB_NAME || "socket_live_sky",
      db_user: process.env.DB_USER || "root",
      db_pass: process.env.DB_PASS || "022537",
      db_dialect: process.env.DB_DIALECT || "mysql",
    },
  };
}
