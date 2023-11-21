import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { Result } from "../interfaces/result";
import { ICreateRole, IRoleDetails, IUpdateRole } from "../interfaces/role";
import logger from "../utils/logger";

export const addRole = async (data: ICreateRole): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  const roleData = {
    company_id: data.company_id,
    designation: data.designation,
  };

  try {
    const result = await query(connection, "INSERT INTO Roles SET ? ", roleData);

    return Result.ok(result.insertId);
  } catch (err) {
    logger.error(`at: repositories/Role/addRole => ${JSON.stringify(err)} \n  ${err}`);

    return Result.error(`Error adding Role => ${JSON.stringify(err)} \n ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveAllRoles = async (company_id: number): Promise<Result<IRoleDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IRoleDetails[] = await query(connection, "SELECT * from Roles where company_id = ?", [company_id]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/Role/retrieveAllRoles => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error retrieving roles");
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveRoleDetailsById = async (role_id: number): Promise<Result<IRoleDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IRoleDetails[] = await query(connection, "SELECT * from Roles where role_id = ?", [role_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/Role/retrieveRoleDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving role => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateRoleById = async (role_id: number, data: IUpdateRole): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    await query(connection, "UPDATE Roles SET designation = ? WHERE role_id = ?", [data.designation, role_id]);

    return Result.ok("Updated Role detail");
  } catch (err) {
    logger.error(`at: repositories/Role/updateRoleById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error("Error updating Role detail");
  } finally {
    releaseDbConnection(connection);
  }
};
