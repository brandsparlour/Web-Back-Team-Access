import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import STATUS from "../constants/status-code";
import * as assetsController from "../controllers/assets";
import { deleteLocalFiles, uniqueFileName } from "../helpers/files";
const router = express.Router();

// Defining the storage that will be used to store multer files temporarily
let storage = multer.diskStorage({
  destination: "./src/uploads/",
  // We create the filename by taking the original name and adding date string to it
  filename: function (_req: any, file: any, cb: any) {
    cb(null, uniqueFileName(file.originalname));
  },
});

// upload contains the path where multer will temporarily store files
let upload = multer({ storage: storage, limits: { fileSize: 150000000 } });

/**
 * @route to upload a asset
 * @description
 * - @accept asset type and files
 * - @returns success message
 */
router.post("/upload", upload.array("file"), async (req: Request, res: Response, next: NextFunction) => {
  const files = (req as any).files;

  try {
    if (!files?.length) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Files not found.",
      };
    }

    const result = await assetsController.uploadAssets(files);

    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      success: true,
      message: "Successfully uploaded documents.",
      response: result.data,
    });
  } catch (error) {
    next(error);
  } finally {
    if (files?.length) {
      deleteLocalFiles(files);
    }
  }
});

export default router;
