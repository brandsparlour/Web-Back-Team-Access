import { Result } from "../interfaces/result";
import { ICreateRole, IRoleDetails, IUpdateRole } from "../interfaces/role";
import * as roleRepo from "../repositories/role";
import logger from "../utils/logger";

export const addRole = async (data: ICreateRole) => {
  try {
    // calling repo function to store data
    const addRoleResult: Result = await roleRepo.addRole(data);
    // If there is any error then throw error
    if (addRoleResult.isError()) {
      throw addRoleResult.error;
    }

    return Result.ok(addRoleResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveAllRoles = async (company_id: number) => {
  try {
    const roleDetails = await roleRepo.retrieveAllRoles(company_id);

    if (roleDetails.isError()) {
      throw roleDetails.error;
    }

    return Result.ok(roleDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/role/retrieveAllRoles" => ${JSON.stringify(error)} \n ${error}`);

    // return negative response
    return Result.error("Error retrieving roles within a company");
  }
};

export const retrieveRoleDetailsById = async (role_id: number) => {
  try {
    // To check whether user exists with this userName
    const roleDetails: Result<IRoleDetails> = await roleRepo.retrieveRoleDetailsById(role_id);

    if (roleDetails.isError()) {
      throw roleDetails.error;
    }

    return Result.ok(roleDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/role/retrieveRoleDetailsById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving role");
  }
};

export const updateRoleById = async (role_id: number, data: IUpdateRole) => {
  try {
    const updateRoleRes: Result<IRoleDetails | any> = await roleRepo.updateRoleById(role_id, data);

    if (updateRoleRes.isError()) {
      throw updateRoleRes.error;
    }

    return Result.ok(updateRoleRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/role/updateRoleById" => ${JSON.stringify(error)} \n ${error}`);

    // return negative response
    return Result.error("Error updating role");
  }
};
