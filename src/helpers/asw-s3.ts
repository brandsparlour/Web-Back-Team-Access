import dotenv from "dotenv";
dotenv.config();

import { DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

import { Result } from "../interfaces/result";
import logger from "../utils/logger";

const pipe = promisify(pipeline);

/**
 * Uploads multiple files to the S3 bucket.
 *
 * @param {Array<Object>} files -  Array of file objects provided by Multer's disk storage engine.
 *
 * @returns {Promise<Result<Array<{  url: string }>>>} - Array of URLs where the files were stored, or an error.
 */
export const uploadFilesToS3 = async (
  files: Array<{ path: string; originalname: string }>,
): Promise<Result<Array<{ url: string }>>> => {
  try {
    // Constants
    const REGION: string = process.env.AWS_REGION!;
    const AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_ASSETS_BUCKET_NAME!;

    const BASE_S3_URL: string = `https://${AWS_S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;

    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    };

    const s3Client = new S3Client({
      region: REGION,
      credentials,
    });

    const uploadedFiles = [];

    for (const file of files) {
      const key = `${file.originalname}`;

      const putObjectParams = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: createReadStream(file.path),
      };

      await s3Client.send(new PutObjectCommand(putObjectParams));

      uploadedFiles.push({
        url: `${BASE_S3_URL}${key}`,
      });
    }

    return Result.ok(uploadedFiles);
  } catch (error) {
    logger.error(`Error uploading files to S3: => ${JSON.stringify(error)}`);

    return Result.error({
      customMessage: "Something went wrong while uploading assets to s3.",
    });
  }
};

export const deleteAssetsFromS3 = async (
  assetUrls: Array<string>,
): Promise<Result<{ success: Array<string>; failed: Array<string> }>> => {
  try {
    // Constants
    const REGION: string = process.env.AWS_REGION!;
    const AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_ASSETS_BUCKET_NAME!;
    const BASE_S3_URL: string = `https://${AWS_S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;

    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    };

    const s3Client = new S3Client({
      region: REGION,
      credentials,
    });

    const objectsToDelete = assetUrls.map((url) => {
      return {
        Key: url.replace(BASE_S3_URL, ""),
      };
    });

    const deleteParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
      },
    };

    const deleteResult = await s3Client.send(new DeleteObjectsCommand(deleteParams));

    const successfulDeletes = deleteResult.Deleted?.map((obj) => `${BASE_S3_URL}${obj.Key}`) ?? [];
    const failedDeletes = deleteResult.Errors?.map((err) => `${BASE_S3_URL}${err.Key}`) ?? [];

    return Result.ok({
      success: successfulDeletes,
      failed: failedDeletes,
    });
  } catch (error) {
    logger.error(`Error deleting assets from S3: => ${JSON.stringify(error)}`);

    return Result.error({
      customMessage: "Something went wrong while deleting assets from s3.",
    });
  }
};
