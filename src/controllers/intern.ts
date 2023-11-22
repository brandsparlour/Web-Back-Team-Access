import STATUS from "../constants/status-code";
import {
  ICreateInternReq,
  IInternDetails,
  IStoreInternDetails,
  IUpdateIntern,
  InternPaymentStatus,
} from "../interfaces/intern";
import { Result } from "../interfaces/result";
import { ICreateUser, UserTypes } from "../interfaces/user";
import * as internRepo from "../repositories/intern";
import { addUser } from "../repositories/user";
import logger from "../utils/logger";

export const registerIntern = async (data: ICreateInternReq): Promise<Result<{ internId: number }>> => {
  try {
    const {
      company_id,
      internship_id,
      link_id,
      referred_by,
      intern_type,
      course,
      year,
      college,
      university,
      photo,
      identity_card,
      full_name,
      mobile_number,
      password,
      email,
      dob,
    } = data;

    // Check if intern with this mobile number already exists
    const existingInternDetails = await internRepo.retrieveInternDetailsByMobileNumber(company_id, mobile_number);
    console.log("existingInternDetails: ", existingInternDetails);

    // throws as error if intern exist
    if (existingInternDetails?.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Intern already exists with this mobile number.",
      };
    }

    // create an intern type user
    const userCreateReq: ICreateUser = {
      company_id,
      user_type: UserTypes.INTERN,
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
    const internDetails: IStoreInternDetails = {
      company_id,
      user_id: userId,
      internship_id,
      link_id,
      referred_by,
      intern_type,
      course,
      year,
      college,
      university,
      photo,
      identity_card,
      payment_status: InternPaymentStatus.PENDING,
    };

    // calling repo function to store intern data
    const addInternResult = await internRepo.addIntern(internDetails);
    // If there is any error then throw error
    if (addInternResult.isError()) {
      throw addInternResult.error;
    }

    return Result.ok({ internId: addInternResult.data!.intern_id });
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveInternDetailsByMobileNumber = async (
  company_id: number,
  mobile_number: string,
): Promise<Result<IInternDetails>> => {
  try {
    const internDetailsRes = await internRepo.retrieveInternDetailsByMobileNumber(company_id, mobile_number);

    if (internDetailsRes.isError()) {
      throw internDetailsRes.error;
    }

    // If user doesn't exist throw an error
    if (!internDetailsRes.data) {
      return Result.error("Intern doesn't exist with mobile number!");
    }

    return Result.ok(internDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/intern/fetchInternDetailsByMobileNumber" => ${JSON.stringify(error)} \n ${error}`);

    // return negative response
    return Result.error("Error fetching intern details.");
  }
};

export const retrieveInternDetailsById = async (intern_id: number) => {
  try {
    const internDetailsRes = await internRepo.retrieveInternDetailsById(intern_id);
    if (internDetailsRes.isError()) {
      throw internDetailsRes.error;
    }

    if (!internDetailsRes.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Intern not found",
      };
    }

    return Result.ok(internDetailsRes.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/intern/retrieveInternDetailsById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error fetching user details");
  }
};

export const updateInternDetailsById = async (intern_id: number, data: IUpdateIntern) => {
  try {
    const updateInternResult = await internRepo.updateInternById(intern_id, data);
    // If there is any error then throw error
    if (updateInternResult.isError()) {
      throw updateInternResult.error;
    }

    return Result.ok(updateInternResult.data);
  } catch (error) {
    return Result.error(error);
  }
};
