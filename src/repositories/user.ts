import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { Result } from "../interfaces/result";
import { ICreateUser, IUserDetails } from "../interfaces/user";
import logger from "../utils/logger";

export const addUser = async (userData: ICreateUser): Promise<Result<{ user_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const results = await query(connection, "INSERT INTO Users SET ? ", userData);

    return Result.ok({ user_id: results.insertId });
  } catch (err) {
    logger.error(`at: repositories/user/addUser => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding user => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchUserByEmail = async (company_id: number, email: string): Promise<Result<IUserDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Users WHERE company_id = ? AND email= ?", [
      company_id,
      email,
    ]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/user/fetchUserByEmail => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error fetching user details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchUserByMobileNumber = async (
  company_id: number,
  mobileNumber: string,
): Promise<Result<IUserDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Users WHERE company_id = ? AND mobile_number= ?", [
      company_id,
      mobileNumber,
    ]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/user/fetchUserByMobileNumber => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error fetching user details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchUserById = async (user_id: number): Promise<Result<IUserDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Users WHERE user_id= ?", [user_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/user/fetchUserById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error fetching user => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
