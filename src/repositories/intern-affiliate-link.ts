import { PoolConnection } from "mysql";
import STATUS from "../constants/status-code";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import {
  ICreateInternAffiliateLink,
  IInternAffiliateLinkDetails,
  IUpdateInternAffiliateLink,
} from "../interfaces/intern-affiliate-link";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";

export const addInternAffiliateLink = async (
  data: ICreateInternAffiliateLink,
): Promise<Result<{ link_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "INSERT INTO internAffiliateLinks SET ?", data);

    return Result.ok({ link_id: result.insertId });
  } catch (err) {
    logger.error(`at: repositories/intern/addInternAffiliateLink => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding addInternAffiliateLink => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllInternshipAffiliateLinksCreatedByAnEmployee = async (
  employee_id: number,
): Promise<Result<IInternAffiliateLinkDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from internAffiliateLinks where created_by = ?", [employee_id]);

    return Result.ok(result);
  } catch (err) {
    logger.error(
      `at: repositories/intern/retrieveAllInternshipAffiliateLinksCreatedByAnEmployee => ${JSON.stringify(
        err,
      )} \n  ${err}`,
    );

    return Result.error(`Error retrieving intern affiliate links => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveInternAffiliateLinkById = async (
  link_id: number,
): Promise<Result<IInternAffiliateLinkDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from internAffiliateLinks where link_id = ?", [link_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/intern/retrieveInternAffiliateLinkById => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error retrieving affiliate link details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteInternAffiliateLinkById = async (link_id: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection, "Delete from internAffiliateLinks where link_id = ?", [link_id]);

    return Result.ok("intern affiliate link deleted successfully");
  } catch (err) {
    logger.error(`at: repositories/intern/deleteInternAffiliateLinkById => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error while delete a intern affiliate link => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateInternAffiliateLink = async (link_id: number, data: IUpdateInternAffiliateLink): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const updateSql =
      "UPDATE InternAffiliateLinks SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE link_id = ?";

    const result = await query(connection, updateSql, [...Object.values(data), link_id]);

    if (!result.affectedRows) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Link not found",
      };
    }

    return Result.ok("Intern affiliate link updated successfully.");
  } catch (err: any) {
    logger.error(`at: repositories/intern/updateInternAffiliateLink => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(err.customMessage ?? `Error while update an intern affiliate link => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
