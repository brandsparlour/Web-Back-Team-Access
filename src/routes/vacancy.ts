import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as vacancyController from "../controllers/vacancy";
import { Result } from "../interfaces/result";
import { ICreateVacancy, IUpdateVacancy, IVacancyDetails } from "../interfaces/vacancy";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job_id, number_of_positions, status, created_at, updated_at } = req.body;

    // validate request body
    if (!job_id || !number_of_positions || !status || !created_at || !updated_at) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `job_id , number_of_positions, status, created_at and updated_at are required`,
      };

      throw err;
    }

    const data: ICreateVacancy = {
      job_id,
      number_of_positions,
      status,
      created_at,
      updated_at,
    };

    // controller call to save user details
    const result: Result = await vacancyController.addVacancy(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created vacancy",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isJobExists: Result<IVacancyDetails[]> = await vacancyController.retrieveVacancyDetails();
    if (isJobExists.isError()) {
      throw isJobExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting vacancy details",
      data: isJobExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId, numberOfPositions, status, vacancyId } = req.body;

    // validate request body
    if (!jobId || !numberOfPositions || !status || !vacancyId) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `jobId , numberOfPositions, status, vacancyId are required`,
      };

      throw err;
    }

    const data: IUpdateVacancy = {
      jobId,
      numberOfPositions,
      status,
      vacancyId,
    };

    // controller call to save user details
    const result: Result = await vacancyController.updateVacancyById(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:vacancyId/:jobId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isJobExists: Result<IVacancyDetails[]> = await vacancyController.deleteVacancyById(
      parseInt(req.params.vacancyId),
      parseInt(req.params.jobId),
    );
    if (isJobExists.isError()) {
      throw isJobExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isJobExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
