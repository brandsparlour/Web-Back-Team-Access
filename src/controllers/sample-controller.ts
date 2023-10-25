import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import * as sampleRepository from "../repositories/sample-repository";

// Sample controller
export const insertToUserDataSample = async (): Promise<Result<any>> => {
  try {
    // Sample User details to be inserted
    const sampleUserData = {
      username: "john_doe",
      email: "john@example.com",
      password: "hashed_password_here",
    };

    // repository call to store details
    const insertedResult = await sampleRepository.insertData("users", sampleUserData);

    // throw error
    if (insertedResult.isError()) {
      throw insertedResult.error;
    }

    // return data
    return Result.ok(insertedResult.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/sample-controller/insertToUserDataSample" => ${JSON.stringify(error)}`);

    // return negative response
    return Result.error(error);
  }
};
