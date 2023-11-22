import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as eventParticipantController from "../controllers/event-participant";
import { Result } from "../interfaces/result";
import { ICreateEventParticipant, IEventParticipantDetails } from "../interfaces/event-participant";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      customer_id,
      event_id,
      name,
      email,
      phone,
      registration_date,
      payment_status,
      additional_info,
    } = req.body;

    // validate request body
    if (!company_id || !customer_id || !event_id ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `company_id , customer_id, event_id are required`,
      };

      throw err;
    }

    const data: ICreateEventParticipant = {
      company_id,
      customer_id,
      event_id,
      name,
      email,
      phone,
      registration_date: new Date(registration_date),
      payment_status,
      additional_info,
    };

    // controller call to save user details
    const result: Result = await eventParticipantController.addEventParticipants(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created event participant",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isEventParticipantExists: Result<IEventParticipantDetails[]> = await eventParticipantController.retrieveEventParticipants();
    if (isEventParticipantExists.isError()) {
      throw isEventParticipantExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting event participant details",
      data: isEventParticipantExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:eventId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isEventParticipantExists: Result<IEventParticipantDetails[]> = await eventParticipantController.retrieveEventParticipantsByEventId(parseInt(req.params.eventId));
      if (isEventParticipantExists.isError()) {
        throw isEventParticipantExists.error;
      }
  
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: "Getting event participant details by given event id",
        data: isEventParticipantExists.data,
      });
    } catch (error) {
      next(error);
    }
  });


router.delete("/:participantId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isEventParticipantExists: Result = await eventParticipantController.deleteEventParticipantById(
      parseInt(req.params.participantId),
    );
    if (isEventParticipantExists.isError()) {
      throw isEventParticipantExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isEventParticipantExists.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
