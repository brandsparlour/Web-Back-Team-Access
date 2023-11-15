import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateUser } from "../interfaces/user";

export const addUser = async (data: ICreateUser): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const userData = {
      company_id: data.company_id,
      user_type: data.user_type,
      role: data.role,
      full_name: data.full_name,
      mobile_number: data.mobile_number,
      email: data.email,
      password: data.password,
      dob: data.dob,
      profile_image: data.profile_image,
      address: data.address,
      reporting_to: data.reporting_to,
      locations_responsible: data.locations_responsible,
    };
    const [results] = await query("INSERT INTO Users SET ?", userData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/users/addUser => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding user => ${err}`);
  }
  finally {
    releaseDbConnection(connection);
  }
};

export const fetchUserByUserPhoneNumber = async (
  phoneNumber: string
): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query('SELECT * from Users WHERE mobile_number= ?', [
      phoneNumber,
    ]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(
      `at: repositories/users/fetchUserByUserName => ${err} \n ${JSON.stringify(
        err
      )}`
    );

    return Result.error(`Error fetching user => ${err}`);
  }
  finally {
    releaseDbConnection(connection);
  }
};

export const fetchUserById = async (
  id: number
): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query('SELECT * from Users WHERE user_id= ?', [
      id,
    ]);

    return Result.ok(result);
  } catch (err) {
    logger.error(
      `at: repositories/users/fetchUserById => ${err} \n ${JSON.stringify(
        err
      )}`
    );

    return Result.error(`Error fetching user => ${err}`);
  }
  finally {
    releaseDbConnection(connection);
  }
};