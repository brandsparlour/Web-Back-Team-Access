import { ICreateInternship, IInternshipDetails, IUpdateInternship } from "../interfaces/internship";
import { Result } from "../interfaces/result";
import * as internshipRepo from "../repositories/internship";
import logger from "../utils/logger";

export const addInternship = async (data: ICreateInternship): Promise<Result<{ internship_id: number }>> => {
  try {
    const addInternshipResult = await internshipRepo.addInternship(data);
    // If there is any error then throw error
    if (addInternshipResult.isError()) {
      throw addInternshipResult.error;
    }

    return Result.ok(addInternshipResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveAllInternshipsInACompany = async (company_id: number): Promise<Result<IInternshipDetails[]>> => {
  try {
    const internshipDetails = await internshipRepo.retrieveAllInternshipsInACompany(company_id);

    if (internshipDetails.isError()) {
      throw internshipDetails.error;
    }

    return Result.ok(internshipDetails.data);
  } catch (error) {
    logger.error(`at: "controllers/internship/retrieveAllInternshipsInACompany" => ${JSON.stringify(error)}\n${error}`);

    return Result.error("Error retrieving internships");
  }
};

export const retrieveInternshipDetailsById = async (internship_id: number): Promise<Result<IInternshipDetails>> => {
  try {
    const internshipDetails = await internshipRepo.retrieveInternshipDetailsById(internship_id);

    if (internshipDetails.isError()) {
      throw internshipDetails.error;
    }

    return Result.ok(internshipDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/job/retrieveInternshipDetailsById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving internship");
  }
};

export const updateInternshipById = async (internship_id: number, data: IUpdateInternship) => {
  try {
    const updateInternshipResult = await internshipRepo.updateInternshipById(internship_id, data);
    // If there is any error then throw error
    if (updateInternshipResult.isError()) {
      throw updateInternshipResult.error;
    }

    return Result.ok(updateInternshipResult.data);
  } catch (error) {
    return Result.error(error);
  }
};
