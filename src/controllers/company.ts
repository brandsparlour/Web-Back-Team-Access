import { Result } from "../interfaces/result";
import * as companyRepo from "../repositories/company";
import logger from "../utils/logger";
import { ICompanyDetails, ICreateCompany, IUpdateCompany } from "../interfaces/company";

export const addCompany = async (data: ICreateCompany) => {
  try {
    // calling repo function to store data
    const addCompanyResult: Result = await companyRepo.addCompany(data);
    // If there is any error then throw error
    if (addCompanyResult.isError()) {
      throw addCompanyResult.error;
    }

    return Result.ok(addCompanyResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveCompanyDetails = async () => {
    try {
      // To check whether user exists with this userName
      const companyDetails: Result<ICompanyDetails[] | any> =
        await companyRepo.retrieveCompanies();
  
      if (companyDetails.isError()) {
        throw companyDetails.error;
      }
  
      return Result.ok(companyDetails.data);
    } catch (error) {
      // logging the error
      logger.error(
        `at: "controllers/company/retrieveCompanyDetails" => ${JSON.stringify(
          error
        )}\n${error}`
      );
  
      // return negative response
      return Result.error("Error retrieving companies");
    }
  };

export const retrieveCompanyDetailsById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const jobDetails: Result<ICompanyDetails | any> =
      await companyRepo.retrieveCompanyDetailsById(id);

    if (jobDetails.isError()) {
      throw jobDetails.error;
    }

    return Result.ok(jobDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/retrieveCompanyDetailsById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error retrieving company");
  }
};

export const updateCompanyById = async (data: IUpdateCompany)=>{
  try {
    // calling repo function to store data
    const updateCompanyResult: Result = await companyRepo.updateCompanyById(data);
    // If there is any error then throw error
    if (updateCompanyResult.isError()) {
      throw updateCompanyResult.error;
    }

    return Result.ok(updateCompanyResult.data);
  } catch (error) {
    return Result.error(error);
  }
}