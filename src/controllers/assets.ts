import { IAssets } from "../interfaces/asset";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";

import { uploadFilesToS3 } from "../helpers/asw-s3";

// Function to upload a new asset
export const uploadAssets = async (files: any): Promise<Result<IAssets[]>> => {
  try {
    // call helper function to upload files to s3
    const s3FileUploadResult = await uploadFilesToS3(files);

    if (s3FileUploadResult.isError()) {
      throw s3FileUploadResult.error;
    }

    return Result.ok(s3FileUploadResult.data);
  } catch (error) {
    logger.error(`at: "controllers/assets/uploadAssets" => ${JSON.stringify(error)} \n ${error}`);

    return Result.error(error);
  }
};
