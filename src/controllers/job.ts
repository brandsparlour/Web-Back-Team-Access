import { Result } from "../interfaces/result";
import * as jobRepo from "../repositories/job";
import logger from "../utils/logger";
import { ICreateJob, IJobDetails } from "../interfaces/job";

export const addJob = async (data: ICreateJob) => {
  try {
    // calling repo function to store data
    const addEventResult: Result = await jobRepo.addJob(data);
    // If there is any error then throw error
    if (addEventResult.isError()) {
      throw addEventResult.error;
    }

    return Result.ok(addEventResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveJobDetails = async () => {
    try {
      // To check whether user exists with this userName
      const jobDetails: Result<IJobDetails[] | any> =
        await jobRepo.retrieveJobs();
  
      if (jobDetails.isError()) {
        throw jobDetails.error;
      }
  
      return Result.ok(jobDetails.data);
    } catch (error) {
      // logging the error
      logger.error(
        `at: "controllers/job/retrieveJobDetails" => ${JSON.stringify(
          error
        )}\n${error}`
      );
  
      // return negative response
      return Result.error("Error retrieving jobs");
    }
  };

export const retrieveJobDetailsById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const jobDetails: Result<IJobDetails | any> =
      await jobRepo.retrieveJobById(id);

    if (jobDetails.isError()) {
      throw jobDetails.error;
    }

    return Result.ok(jobDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/retrieveJobDetailsById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error retrieving jobs");
  }
};

export const deleteJobById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const jobDetails: Result =
      await jobRepo.deleteJobById(id);

    if (jobDetails.isError()) {
      throw jobDetails.error;
    }

    return Result.ok(jobDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/job/deleteJobById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error(error);
  }
}