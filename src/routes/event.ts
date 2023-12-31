import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as eventController from "../controllers/event";
import { ICreateEvent, IEventDetails } from "../interfaces/event";
import { Result } from "../interfaces/result";
import { verifyEmployee } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/", verifyEmployee, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      event_name,
      description,
      event_date,
      start_time,
      end_time,
      location,
      event_category,
      organizer,
      contact_info,
      registration_link,
      registration_fee,
      event_capacity,
      event_image,
      status,
      registration_status,
      payment_type,
    } = req.body;

    // validate request body
    if (!event_name || !description || !event_date || !status || !registration_status || !company_id) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `event name , description, event date, status and registration_status are required`,
      };

      throw err;
    }

    const data: ICreateEvent = {
      company_id,
      event_name,
      description,
      event_date: new Date(event_date),
      start_time,
      end_time,
      location,
      event_category,
      organizer,
      contact_info,
      registration_fee,
      event_capacity,
      event_image,
      status,
      registration_status,
      payment_type,
    };

    // controller call to save user details
    const result: Result = await eventController.addEvent(data);
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
    const isEventExists: Result<IEventDetails[]> = await eventController.retrieveEventDetails();
    if (isEventExists.isError()) {
      throw isEventExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting event details",
      data: isEventExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:startDate/:endDate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isEventExists: Result<IEventDetails[]> = await eventController.retrieveEventsByGivenDateRange(
      new Date(req.params.startDate),
      new Date(req.params.endDate),
    );
    if (isEventExists.isError()) {
      throw isEventExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting event details within the given date range",
      data: isEventExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/events-by-month-year/:year/:month", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isEventExists: Result<IEventDetails[]> = await eventController.retrieveEventsByGivenMonthAndYear(
      parseInt(req.params.month),
      parseInt(req.params.year),
    );
    if (isEventExists.isError()) {
      throw isEventExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting event details within the given month and year",
      data: isEventExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:event_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isEventExists: Result<IEventDetails[]> = await eventController.deleteEventById(parseInt(req.params.event_id));
    if (isEventExists.isError()) {
      throw isEventExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isEventExists.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
