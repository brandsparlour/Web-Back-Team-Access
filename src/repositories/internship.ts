import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { ICreateInternship, IInternshipDetails, IUpdateInternship } from "../interfaces/internship";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";

export const addInternship = async (data: ICreateInternship): Promise<Result<{ internship_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "INSERT INTO Internships SET ?", data);

    return Result.ok(result.insertId);
  } catch (err) {
    logger.error(`at: repositories/internship/addInternship => ${JSON.stringify(err)} \n  ${err} `);

    return Result.error(`Error adding Internship => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllInternshipsInACompany = async (company_id: number): Promise<Result<IInternshipDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Internships WHERE company_id = ?", [company_id]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/internship/retrieveAllInternshipsInACompany => ${JSON.stringify(err)} \n ${err}`);

    return Result.error(`Error retrieving internships => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternshipDetailsById = async (internship_id: number): Promise<Result<IInternshipDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Internships where internship_id = ?", [internship_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/internship/retrieveInternshipDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving internship details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateInternshipById = async (internship_id: number, data: IUpdateInternship): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const updateSql =
      "UPDATE Internships SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE internship_id = ?";

    await query(connection, updateSql, [...Object.values(data), internship_id]);

    return Result.ok("Updated internship detail");
  } catch (err) {
    logger.error(`at: repositories/internship/updateInternshipById => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error updating company detail");
  } finally {
    releaseDbConnection(connection);
  }
};
