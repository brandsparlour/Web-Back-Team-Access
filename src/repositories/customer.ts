import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import STATUS from "../constants/status-code";
import {
  ICustomerDetails,
  IStoreCustomerDetails,
  IStoredCustomerDetails,
  IUpdateCustomer,
} from "../interfaces/customer";

export const addCustomer = async (data: IStoreCustomerDetails): Promise<Result<{ customer_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "INSERT INTO Customers SET ?", data);

    return Result.ok(result.insertId);
  } catch (err) {
    logger.error(`at: repositories/customer/addCustomer => ${JSON.stringify(err)} \n  ${err} `);

    return Result.error(`Error adding Customer => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllCustomerInACompany = async (company_id: number): Promise<Result<IStoredCustomerDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Customers WHERE company_id = ?", [company_id]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/customer/retrieveAllCustomerInACompany => ${JSON.stringify(err)} \n ${err}`);

    return Result.error(`Error retrieving customers => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCustomerDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<ICustomerDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Customers i INNER JOIN Users u on u.user_id = i.user_id where  i.company_id = ? AND u.mobile_number = ?",
      [company_id, mobile_number],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/customer/retrieveCustomerDetailsByMobileNumber => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving customer details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCustomerDetailsById = async (customer_id: number): Promise<Result<ICustomerDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Customers i INNER JOIN Users u on u.user_id = i.user_id where  i.customer_id = ?",
      [customer_id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/customer/retrieveCustomerDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving customer details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCustomerDetailsByUserId = async (user_id: number): Promise<Result<ICustomerDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Customers i INNER JOIN Users u on u.user_id = i.user_id where i.user_id = ?",
      [user_id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/customer/retrieveCustomerDetailsByUserId => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving customer details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateCustomerById = async (intern_id: number, data: IUpdateCustomer): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const updateSql =
      "UPDATE Customers SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE customer_id = ?";

    const result = await query(connection, updateSql, [...Object.values(data), intern_id]);

    if (!result.affectedRows) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Customer not found.",
      };
    }

    return Result.ok("Updated customer detail");
  } catch (err) {
    logger.error(`at: repositories/customer/updateCustomerById => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error updating customer detail");
  } finally {
    releaseDbConnection(connection);
  }
};
