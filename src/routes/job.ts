import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as jobController from "../controllers/job";
import { Result } from "../interfaces/result";
import { ICreateJob, IJobDetails } from "../interfaces/job";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      job_title,
      company,
      location,
      description,
      salary,
      employment_type,
      job_category,
      application_deadline,
      experience_level,
      education,
      contact_email,
      posted_date,
      application_url,
    } = req.body;

    // validate request body
    if (!job_title || !company || !location || !description || !employment_type) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `job_title , description, location, company and employment_type are required`,
      };

      throw err;
    }

    const data: ICreateJob = {
      job_title,
      company,
      location,
      description,
      salary,
      employment_type,
      job_category,
      application_deadline,
      experience_level,
      education,
      contact_email,
      posted_date,
      application_url,
    };

    // controller call to save user details
    const result: Result = await jobController.addJob(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created event",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isJobExists: Result<IJobDetails[]> = await jobController.retrieveJobDetails();
    if (isJobExists.isError()) {
      throw isJobExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting job details",
      data: isJobExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isJobExists: Result<IJobDetails> = await jobController.retrieveJobDetailsById(parseInt(req.params.id));
    if (isJobExists.isError()) {
      throw isJobExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting job details",
      data: isJobExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isJobExist: Result = await jobController.deleteJobById(parseInt(req.params.id));
    if (isJobExist.isError()) {
      throw isJobExist.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isJobExist.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
