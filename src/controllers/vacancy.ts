import { Result } from "../interfaces/result";
import * as vacancyRepo from "../repositories/vacancy";
import * as jobController from "../controllers/job";
import logger from "../utils/logger";
import { ICreateVacancy, IUpdateVacancy, IVacancyDetails } from "../interfaces/vacancy";

export const addVacancy = async (data: ICreateVacancy) => {
  try {
    // check provided jobid present in job table or not
    const jobDetails = await jobController.retrieveJobDetailsById(data.job_id);

    if (jobDetails.isError()) {
      throw jobDetails.error;
    }
    // calling repo function to store data
    const addVacancyResult: Result = await vacancyRepo.addVacancy(data);
    // If there is any error then throw error
    if (addVacancyResult.isError()) {
      throw addVacancyResult.error;
    }

    return Result.ok(addVacancyResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveVacancyDetails = async () => {
  try {
    // To check whether user exists with this userName
    const vacancyDetails: Result<IVacancyDetails[] | any> = await vacancyRepo.retrieveVacancies();

    if (vacancyDetails.isError()) {
      throw vacancyDetails.error;
    }

    return Result.ok(vacancyDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/vacancy/retrieveVacancyDetails" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving vacancy");
  }
};

export const updateVacancyById = async (data:IUpdateVacancy) => {
  try {
    // To check whether user exists with this userName
    const vacancyDetails: Result<IVacancyDetails[] | any> = await vacancyRepo.updateVacancyById(data);

    if (vacancyDetails.isError()) {
      throw vacancyDetails.error;
    }

    return Result.ok(vacancyDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/vacancy/updateVacancyById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};

export const deleteVacancyById = async (vacancyId:number,jobId: number ) => {
  try {
    // To check whether user exists with this userName
    const vacancyDetails: Result<IVacancyDetails[] | any> = await vacancyRepo.deleteVacancyById(vacancyId, jobId);

    if (vacancyDetails.isError()) {
      throw vacancyDetails.error;
    }

    return Result.ok(vacancyDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/vacancy/deleteVacancyById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
