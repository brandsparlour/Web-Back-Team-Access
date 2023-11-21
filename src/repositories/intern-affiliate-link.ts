import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import {
  ICreateInternAffiliateLink,
  IInternAffiliateLinkDetails,
  IUpdateInternAffiliateLink,
} from "../interfaces/intern-affiliate-link";

export const addInternAffiliateLink = async (data: ICreateInternAffiliateLink): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const internAffiliateData = {
      company_id: data.company_id,
      created_by: data.created_by,
      job_details: data.job_details,
      link: data.link,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    const [results] = await query(connection, "INSERT INTO internAffiliateLinks SET ?", internAffiliateData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/intern/addInternAffiliateLink => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding addInternAffiliateLink => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternAffiliateLinkDetails = async (): Promise<Result<IInternAffiliateLinkDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IInternAffiliateLinkDetails[] = await query(connection, "SELECT * from internAffiliateLinks");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternAffiliateLinkDetails => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieveInternAffiliateLinkDetails => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternAffiliateLinkById = async (id: number): Promise<Result<IInternAffiliateLinkDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IInternAffiliateLinkDetails[] = await query(
      connection,
      "SELECT * from internAffiliateLinks where company_id = ?",
      [id],
    );

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternAffiliateLinkById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieveInternAffiliateLinkById => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteInternAffiliateLinkById = async (id: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection, "Delete from internAffiliateLinks where link_id = ?", [id]);

    return Result.ok("Delete internAffiliateLink successfully");
  } catch (err) {
    logger.error(`at: repositories/intern/deleteInternAffiliateLinkById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete a intern affiliate link => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateInternAffiliateLink = async (data: IUpdateInternAffiliateLink): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(
      connection,
      "UPDATE internAffiliateLinks SET job_details = ?, link = ? WHERE company_id = ? and link_id = ?",
      [data.job_details, data.link, data.company_id, data.link_id],
    );

    return Result.ok("Update internAffiliateLink successfully");
  } catch (err) {
    logger.error(`at: repositories/intern/updateInternAffiliateLink => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while update a intern affiliate link => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
