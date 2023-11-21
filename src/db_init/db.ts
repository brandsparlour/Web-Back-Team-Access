import dotenv from "dotenv";
import { FieldInfo, MysqlError, PoolConfig, PoolConnection, createPool } from "mysql";
import logger from "../utils/logger";
dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

const poolOptions: PoolConfig = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: 5,
};

const pool = createPool(poolOptions);

export const getDbConnection = (): Promise<PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(`Error getting connection`, err);
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

export const releaseDbConnection = (connection: PoolConnection): void => {
  connection.release();
};

export const query = async (connection: PoolConnection, sql: string, values?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err: MysqlError | null, results: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
