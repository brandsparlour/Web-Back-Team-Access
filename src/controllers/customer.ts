import STATUS from "../constants/status-code";
import { ICreateCustomerReq, ICustomerDetails, IStoreCustomerDetails, IUpdateCustomer } from "../interfaces/customer";
import { Result } from "../interfaces/result";
import { ICreateUser, UserTypes } from "../interfaces/user";
import * as customerRepo from "../repositories/customer";
import { addUser } from "../repositories/user";
import logger from "../utils/logger";

export const registerCustomer = async (data: ICreateCustomerReq): Promise<Result<{ customerId: number }>> => {
  try {
    const { company_id, type, profile_image, address, full_name, mobile_number, password, email, dob } = data;


    // Check if customer with this mobile number already exists
    const existingCustomerDetails = await customerRepo.retrieveCustomerDetailsByMobileNumber(company_id, mobile_number);

    // throws as error if customer exist
    if (existingCustomerDetails?.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Customer already exists with this mobile number.",
      };
    }

    // create an intern type user
    const userCreateReq: ICreateUser = {
      company_id,
      user_type: UserTypes.CUSTOMER,
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

    // store intern details
    const internDetails: IStoreCustomerDetails = {
      company_id,
      user_id: userId,
      type,
      profile_image,
      address,
    };

    // calling repo function to store customer data
    const addCustomerResult = await customerRepo.addCustomer(internDetails);
    // If there is any error then throw error
    if (addCustomerResult.isError()) {
      throw addCustomerResult.error;
    }

    return Result.ok({ customerId: addCustomerResult.data!.customer_id });
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveCustomerDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<ICustomerDetails>> => {
  try {
    const customerDetailsRes = await customerRepo.retrieveCustomerDetailsByMobileNumber(company_id, mobile_number);

    if (customerDetailsRes.isError()) {
      throw customerDetailsRes.error;
    }

    // If user doesn't exist throw an error
    if (!customerDetailsRes.data) {
      return Result.error("Customer doesn't exist with mobile number!");
    }

    return Result.ok(customerDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/customer/retrieveCustomerDetailsByMobileNumber" => ${JSON.stringify(error)} \n ${error}`,
    );

    // return negative response
    return Result.error("Error fetching customer details.");
  }
};

export const retrieveCustomerDetailsById = async (customer_id: number) => {
  try {
    const customerDetailsRes = await customerRepo.retrieveCustomerDetailsById(customer_id);
    if (customerDetailsRes.isError()) {
      throw customerDetailsRes.error;
    }

    if (!customerDetailsRes.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Customer not found",
      };
    }

    return Result.ok(customerDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/customer/retrieveCustomerDetailsById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching customer details");
  }
};

export const updateCustomerById = async (customer_id: number, data: IUpdateCustomer) => {
  try {
    const updateCustomerResult = await customerRepo.updateCustomerById(customer_id, data);
    // If there is any error then throw error
    if (updateCustomerResult.isError()) {
      throw updateCustomerResult.error;
    }

    return Result.ok(updateCustomerResult.data);
  } catch (error) {
    return Result.error(error);
  }
};
