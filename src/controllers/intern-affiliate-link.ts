import STATUS from "../constants/status-code";
import * as companyController from "../controllers/company";
import {
  ICreateInternAffiliateLink,
  IInternAffiliateLinkDetails,
  IUpdateInternAffiliateLink,
} from "../interfaces/intern-affiliate-link";
import { Result } from "../interfaces/result";
import * as internAffiliateLinkRepo from "../repositories/intern-affiliate-link";
import logger from "../utils/logger";

export const addInternAffiliateLink = async (
  data: ICreateInternAffiliateLink,
): Promise<Result<{ link_id: number }>> => {
  try {
    const companyDetails = await companyController.retrieveCompanyDetailsById(data.company_id);

    if (companyDetails.isError()) {
      throw companyDetails.error;
    }

    if (!companyDetails.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company not found",
      };
    }

    // calling repo function to store data
    const addInternAffiliateResult = await internAffiliateLinkRepo.addInternAffiliateLink(data);
    // If there is any error then throw error
    if (addInternAffiliateResult.isError()) {
      throw addInternAffiliateResult.error;
    }

    return Result.ok(addInternAffiliateResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveAllInternshipAffiliateLinksCreatedByAnEmployee = async (
  employee_id: number,
): Promise<Result<IInternAffiliateLinkDetails[]>> => {
  try {
    const internAffiliateDetails =
      await internAffiliateLinkRepo.retrieveAllInternshipAffiliateLinksCreatedByAnEmployee(employee_id);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error) {
    logger.error(
      `at: "controllers/intern/retrieveAllInternshipAffiliateLinksCreatedByAnEmployee" => ${JSON.stringify(
        error,
      )}\n${error}`,
    );

    // return negative response
    return Result.error("Error retrieving links created by an employee");
  }
};

export const retrieveInternAffiliateLinkById = async (
  link_id: number,
): Promise<Result<IInternAffiliateLinkDetails>> => {
  try {
    const internAffiliateDetails = await internAffiliateLinkRepo.retrieveInternAffiliateLinkById(link_id);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    if (!internAffiliateDetails.data) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Link not found",
      };
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error: any) {
    logger.error(
      `at: "controllers/intern-affiliate-link/retrieveInternAffiliateLinkById" => ${JSON.stringify(error)}\n${error}`,
    );

    return Result.error(error.customMessage ?? "Error retrieveInternAffiliateLinkById");
  }
};

export const updateInternAffiliateLink = async (link_id: number, data: IUpdateInternAffiliateLink) => {
  try {
    const internAffiliateDetails = await internAffiliateLinkRepo.updateInternAffiliateLink(link_id, data);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error: any) {
    logger.error(
      `at: "controllers/intern-affiliate-link/updateInternAffiliateLink" => ${JSON.stringify(error)}\n${error}`,
    );

    return Result.error(error.customMessage ?? "Error while update internAffiliateLink");
  }
};

export const deleteInternAffiliateLinkById = async (link_id: number) => {
  try {
    const internAffiliateDetails = await internAffiliateLinkRepo.deleteInternAffiliateLinkById(link_id);

    if (internAffiliateDetails.isError()) {
      throw internAffiliateDetails.error;
    }

    return Result.ok(internAffiliateDetails.data);
  } catch (error) {
    logger.error(
      `at: "controllers/intern-affiliate-link/deleteInternAffiliateLinkById" => ${JSON.stringify(error)} \n ${error}`,
    );

    return Result.error("Error while deleting deleteInternAffiliateLinkById");
  }
};
