import STATUS from "../constants/status-code";
import { ICreateEmployeeReq, IEmployeeDetails, IStoreEmployeeDetails } from "../interfaces/employee";
import { Result } from "../interfaces/result";
import { ICreateUser, UserTypes } from "../interfaces/user";
import * as employeeRepo from "../repositories/employee";
import { addUser } from "../repositories/user";
import logger from "../utils/logger";
import * as companyController from "./company";

export const registerEmployee = async (data: ICreateEmployeeReq): Promise<Result<{ employeeId: number }>> => {
  try {
    const {
      company_id,
      role_id,
      full_name,
      mobile_number,
      email,
      password,
      dob,
      profile_image,
      address,
      reporting_to,
      locations_responsible,
    } = data;

    // Check if employee with this mobile number already exists
    const isUserExists = await employeeRepo.fetchEmployeeDetailsByMobileNumber(company_id, mobile_number);

    // throws as error if employee exist
    if (isUserExists?.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Employee already exists with this mobile number",
      };
    }

    // check if company name already exists
    const companyDetails = await companyController.retrieveCompanyDetailsById(company_id);

    if (companyDetails.isError()) {
      throw companyDetails.error;
    }

    if (!companyDetails.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid company id.",
      };
    }

    // create a user
    const userCreateReq: ICreateUser = {
      company_id,
      user_type: UserTypes.EMPLOYEE,
      full_name,
      mobile_number,
      email,
      password,
      dob,
    };

    const createUserRes = await addUser(userCreateReq);
    if (createUserRes.isError()) {
      throw createUserRes.error;
    }

    const userId = createUserRes.data!.user_id;

    // store employee details
    const employeeDetails: IStoreEmployeeDetails = {
      company_id,
      user_id: userId,
      role_id,
      profile_image,
      address,
      reporting_to,
      locations_responsible,
    };

    // calling repo function to store employee data
    const addEmployeeResult = await employeeRepo.addEmployee(employeeDetails);
    // If there is any error then throw error
    if (addEmployeeResult.isError()) {
      throw addEmployeeResult.error;
    }

    return Result.ok({ employeeId: addEmployeeResult.data!.employee_id });
  } catch (error) {
    return Result.error(error);
  }
};

export const fetchEmployeeDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<IEmployeeDetails>> => {
  try {
    const employeeDetailsRes = await employeeRepo.fetchEmployeeDetailsByMobileNumber(company_id, mobile_number);

    if (employeeDetailsRes.isError()) {
      throw employeeDetailsRes.error;
    }

    // If user doesn't exist throw an error
    if (!employeeDetailsRes.data) {
      return Result.error("Employee doesn't exist with mobile number!");
    }

    // return user details if exists
    return Result.ok(employeeDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/employee/fetchEmployeeDetailsByEmail" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching employee details.");
  }
};

export const fetchEmployeeDetailsById = async (employee_id: number) => {
  try {
    const employeeDetailsRes = await employeeRepo.fetchEmployeeDetailsById(employee_id);
    if (employeeDetailsRes.isError()) {
      throw employeeDetailsRes.error;
    }

    if (!employeeDetailsRes.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Employee not found",
      };
    }

    return Result.ok(employeeDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/users/fetchUserDetails" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching user details");
  }
};
