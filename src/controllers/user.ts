import STATUS from "../constants/status-code";
import { compareHash } from "../helpers/bcrypt";
import { generateJWTToken } from "../helpers/jwt";
import { Result } from "../interfaces/result";
import { ICreateUser, IUserDetails, IUserLoginRes, UserTypes } from "../interfaces/user";
import { fetchEmployeeDetailsByUserId } from "../repositories/employee";
import * as userRepo from "../repositories/user";
import logger from "../utils/logger";

export const addUser = async (data: ICreateUser): Promise<Result<{ user_id: number }>> => {
  try {
    // Check if user with this phone number already exists
    const isUserExists = await userRepo.fetchUserByMobileNumber(data.company_id, data.mobile_number);

    // throws as error if user exist
    if (isUserExists?.data) {
      return Result.error({
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "User already exists with this phone number.",
      });
    }

    // calling repo function to store user data
    const addUserResult = await userRepo.addUser(data);

    // If there is any error then throw error
    if (addUserResult.isError()) {
      throw addUserResult.error;
    }

    return Result.ok(addUserResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const loginUser = async (
  company_id: number,
  phoneNumber: string,
  password: string,
): Promise<Result<IUserLoginRes>> => {
  try {
    // To check whether user exists with this email
    const isUserExists = await userRepo.fetchUserByMobileNumber(company_id, phoneNumber);

    if (isUserExists.isError()) {
      throw isUserExists.error;
    }

    // If userName doesn't exist throw an error
    if (!isUserExists.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "User doesn't exist!",
      };
    }

    const { password: storedPassword, ...userDetailsWithoutPassword } = isUserExists.data!;

    // compare password
    const isValidPassword = compareHash(password, storedPassword);

    if (!isValidPassword) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid Password",
      };
    }

    const token = generateJWTToken(userDetailsWithoutPassword);

    const result: IUserLoginRes = {
      token,
      userDetails: userDetailsWithoutPassword,
    };

    if (userDetailsWithoutPassword.user_type === UserTypes.EMPLOYEE) {
      const employeeDetailsRes = await fetchEmployeeDetailsByUserId(userDetailsWithoutPassword.user_id);

      if (employeeDetailsRes.isError()) {
        throw employeeDetailsRes.error;
      }

      if (!employeeDetailsRes.data) {
        throw {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: "Employee details not found",
        };
      }

      result.employee_id = employeeDetailsRes.data!.employee_id;
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/users/loginUser" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching user details");
  }
};

export const fetchUserDetailsByMobileNumber = async (
  company_id: number,
  mobileNumber: string,
): Promise<Result<IUserDetails>> => {
  try {
    const isUserExists = await userRepo.fetchUserByMobileNumber(company_id, mobileNumber);

    if (isUserExists.isError()) {
      throw isUserExists.error;
    }

    // If user doesn't exist throw an error
    if (!isUserExists.data) {
      return Result.error("User doesn't exist with mobile number!");
    }

    return Result.ok(isUserExists.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/user/fetchUserDetailsByMobileNumber" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching user details.");
  }
};

export const fetchUserById = async (id: number) => {
  try {
    const isUserExist = await userRepo.fetchUserById(id);
    if (isUserExist.isError()) {
      throw isUserExist.error;
    }

    if (!isUserExist.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "User doesn't exist.",
      };
    }

    return Result.ok(isUserExist.data);
  } catch (error: any) {
    // logging the error
    logger.error(`at: "controllers/users/fetchUserById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error.customMessage ?? "Error fetching user details");
  }
};
