import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { ICompanyDetails, ICreateCompany, IUpdateCompany } from "../interfaces/company";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";

export const addCompany = async (data: ICreateCompany): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const { company_name, address, contact, logo, privacy_policy, terms_and_conditions } = data;

    const companyData = {
      company_name,
      address,
      contact,
      logo,
      privacy_policy,
      terms_and_conditions,
    };

    const [results] = await query(connection, "INSERT INTO Companies SET ?", companyData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/company/addCompany => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding company => ${JSON.stringify(err)} \n ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllCompanies = async (): Promise<Result<ICompanyDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Companies");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/company/retrieveAllCompanies => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error retrieving companies");
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCompanyDetailsById = async (id: number): Promise<Result<ICompanyDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from Companies where company_id = ?", [id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/company/retrieveCompanyDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving companies => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateCompanyById = async (company_id: number, data: IUpdateCompany): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const updateSql =
      "UPDATE Companies SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE company_id = ?";

    await query(connection, updateSql, [...Object.values(data), company_id]);

    return Result.ok("Updated company detail");
  } catch (err) {
    logger.error(`at: repositories/company/updateCompanyById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error("Error updating company detail");
  } finally {
    releaseDbConnection(connection);
  }
};
