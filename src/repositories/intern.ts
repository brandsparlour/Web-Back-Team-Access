import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { IInternDetails, IStoreInternDetails, IStoredInternDetails, IUpdateIntern } from "../interfaces/intern";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import STATUS from "../constants/status-code";

export const addIntern = async (data: IStoreInternDetails): Promise<Result<{ intern_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "INSERT INTO Interns SET ?", data);

    return Result.ok(result.insertId);
  } catch (err) {
    logger.error(`at: repositories/intern/addIntern => ${JSON.stringify(err)} \n  ${err} `);

    return Result.error(`Error adding Intern => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllInternsInACompany = async (company_id: number): Promise<Result<IStoredInternDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Interns WHERE company_id = ?", [company_id]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveAllInternsInACompany => ${JSON.stringify(err)} \n ${err}`);

    return Result.error(`Error retrieving interns => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<IInternDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Interns i INNER JOIN Users u on u.user_id = i.user_id where  i.company_id = ? AND u.mobile_number = ?",
      [company_id, mobile_number],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving intern details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternDetailsById = async (intern_id: number): Promise<Result<IInternDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Interns i INNER JOIN Users u on u.user_id = i.user_id where  i.intern_id = ?",
      [intern_id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving intern details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternDetailsByUserId = async (user_id: number): Promise<Result<IInternDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(
      connection,
      "SELECT i.*, u.full_name, u.mobile_number, u.email, u.dob from Interns i INNER JOIN Users u on u.user_id = i.user_id where i.user_id = ?",
      [user_id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternDetailsByUserId => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving intern details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateInternById = async (intern_id: number, data: IUpdateIntern): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const updateSql =
      "UPDATE Interns SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE intern_id = ?";

    const result = await query(connection, updateSql, [...Object.values(data), intern_id]);

    if (!result.affectedRows) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Intern not found.",
      };
    }

    return Result.ok("Updated intern detail");
  } catch (err) {
    logger.error(`at: repositories/intern/updateInternById => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error updating company detail");
  } finally {
    releaseDbConnection(connection);
  }
};
