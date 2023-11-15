import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICompanyDetails, ICreateCompany, IUpdateCompany } from "../interfaces/company";

export const addCompany = async (data: ICreateCompany): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const companyData = {
      company_name: data.company_name,
      address: data.address,
      contact: data.contact,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    const [results] = await query("INSERT INTO Companies SET ?", companyData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/company/addCompany => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding job => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCompanies = async (): Promise<Result<ICompanyDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: ICompanyDetails[] = await query("SELECT * from Companies");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/company/retrieveCompanies => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving companies => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCompanyDetailsById = async (id: number): Promise<Result<ICompanyDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: ICompanyDetails[] = await query("SELECT * from Companies where company_id = ?", [id]);
    
    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/company/retrieveCompanyDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving companies => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateCompanyById = async (data:IUpdateCompany): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query("UPDATE Companies SET company_name = ?, address = ?, contact = ? WHERE company_id = ?", [data.company_name,data.address,data.contact,data.company_id]);

    return Result.ok("Update company detail");
  } catch (err) {
    logger.error(`at: repositories/company/updateCompanyById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error updating company detail => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
}