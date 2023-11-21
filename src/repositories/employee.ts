import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { IEmployeeDetails, IStoreEmployeeDetails, IStoredEmployeeDetails } from "../interfaces/employee";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";

export const addEmployee = async (employeeDetails: IStoreEmployeeDetails): Promise<Result<{ employee_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const result = await query(connection, "INSERT INTO Employees SET ? ", employeeDetails);

    return Result.ok({ employee_id: result.insertId });
  } catch (err) {
    logger.error(`at: repositories/employee/addEmployee => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error adding employee => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchEmployeeDetailsByEmail = async (
  company_id: number,
  email: string,
): Promise<Result<IEmployeeDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT e.*, u.user_type, u.full_name, u.mobile_number, u.email, u.password, u.dob from Employees e INNER JOIN Users u on u.user_id = e.user_id AND u.company_id = e.company_id WHERE e.company_id = ? AND u.email= ?",
      [company_id, email],
    );

    console.log("result  ", result);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/employee/fetchEmployeeDetailsByEmail => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error fetching employee details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchEmployeeDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<IEmployeeDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT e.*, u.user_type, u.full_name, u.mobile_number, u.email, u.dob from Employees e INNER JOIN Users u on u.user_id = e.user_id AND u.company_id = e.company_id WHERE e.company_id = ? AND u.mobile_number= ?",
      [company_id, mobile_number],
    );

    console.log("result  ", result);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/employee/fetchEmployeeDetailsByMobileNumber => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error fetching employee details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchEmployeeDetailsById = async (employee_id: number): Promise<Result<IEmployeeDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT e.*, u.user_type, u.full_name, u.mobile_number, u.email, u.dob from Employees e INNER JOIN Users u on u.user_id = e.user_id WHERE e.employee_id = ?",
      [employee_id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/employee/fetchEmployeeById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error fetching employee => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const fetchEmployeeDetailsByUserId = async (user_id: number): Promise<Result<IStoredEmployeeDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Employees WHERE user_id = ?", [user_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/employee/fetchEmployeeDetailsByUserId => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error fetching employee => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
