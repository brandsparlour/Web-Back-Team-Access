import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import logger from "../utils/logger";
import { Result } from "../interfaces/result";

export const insertData = async (
  tb: string,
  insertObject: Record<string, any>,
  returnColumn: string = "id",
): Promise<Result<any>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const [results]: any = await query(`INSERT INTO ?? SET ?`, [tb, insertObject]);
    return Result.ok(results.insertId);
  } catch (error: any) {
    logger.error(`at src/repositories/sample-repository.ts => ${JSON.stringify(error)}`);

    return Result.error({ customMessage: error.customMessage ?? "Error inserting data." });
  } finally {
    releaseDbConnection(connection);
  }
};
