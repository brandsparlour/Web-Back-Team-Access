import { Result } from "../interfaces/result";
import * as internAffiliateLinkRepo from "../repositories/intern-affiliate-link";
import logger from "../utils/logger";
import { ICreateInternAffiliateLink, IInternAffiliateLinkDetails, IUpdateInternAffiliateLink } from "../interfaces/intern-affiliate-link";
import * as companyController from "../controllers/company"
import * as userController from "../controllers/user"

export const addInternAffiliateLink = async (data: ICreateInternAffiliateLink) => {
  try {
    // check if company name already exists
    const companyDetails = await companyController.retrieveCompanyDetailsById(data.company_id);

    if(companyDetails.isError()){
      throw companyDetails.error;
    }

    const userDetails = await userController.fetchUserById(data.created_by);

    if(userDetails.isError()){
      throw userDetails.error;
    }
    // calling repo function to store data
    const addInternAffiliateResult: Result = await internAffiliateLinkRepo.addInternAffiliateLink(data);
    // If there is any error then throw error
    if (addInternAffiliateResult.isError()) {
      throw addInternAffiliateResult.error;
    }
    

    return Result.ok(addInternAffiliateResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveInternAffiliateLinkDetails = async () => {
    try {
      // To check whether user exists with this userName
      const internAffiliateDetails: Result<IInternAffiliateLinkDetails[] | any> =
        await internAffiliateLinkRepo.retrieveInternAffiliateLinkDetails();
  
      if (internAffiliateDetails.isError()) {
        throw internAffiliateDetails.error;
      }
  
      return Result.ok(internAffiliateDetails.data);
    } catch (error) {
      // logging the error
      logger.error(
        `at: "controllers/intern/retrieveInternAffiliateLinkDetails" => ${JSON.stringify(
          error
        )}\n${error}`
      );
  
      // return negative response
      return Result.error("Error  retrieveInternAffiliateLinkDetails");
    }
  };

export const retrieveInternAffiliateLinkById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const internAffiliateDetails: Result<IInternAffiliateLinkDetails | any> =
      await internAffiliateLinkRepo.retrieveInternAffiliateLinkById(id);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/retrieveInternAffiliateLinkById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error retrieveInternAffiliateLinkById");
  }
};

export const deleteInternAffiliateLinkById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const internAffiliateDetails: Result =
      await internAffiliateLinkRepo.deleteInternAffiliateLinkById(id);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/deleteInternAffiliateLinkById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error while deleting internAffiliateLink");
  }
};

export const updateInternAffiliateLink = async (data:IUpdateInternAffiliateLink) => {
  try {
    // To check whether user exists with this userName
    const internAffiliateDetails: Result =
      await internAffiliateLinkRepo.updateInternAffiliateLink(data);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/updateInternAffiliateLink" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error while update internAffiliateLink");
  }
};