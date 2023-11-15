import { Result } from "../interfaces/result";
import { ICreateEvent, IEventDetails } from "../interfaces/event";
import * as eventRepo from "../repositories/event";
import logger from "../utils/logger";

export const addEvent = async (data: ICreateEvent) => {
  try {
    // calling repo function to store data
    const addEventResult: Result = await eventRepo.addEvent(data);
    // If there is any error then throw error
    if (addEventResult.isError()) {
      throw addEventResult.error;
    }

    return Result.ok(addEventResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveEventDetails = async () => {
  try {
    // To check whether user exists with this userName
    const eventDetails: Result<IEventDetails[] | any> = await eventRepo.retrieveEvents();

    if (eventDetails.isError()) {
      throw eventDetails.error;
    }

    return Result.ok(eventDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event/retrieveEventDetails" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving events");
  }
};

export const retrieveEventsByGivenDateRange = async (startDate: Date, endDate: Date) => {
  try {
    // To check whether user exists with this userName
    const eventDetails: Result<IEventDetails[] | any> = await eventRepo.retrieveEventsByGivenDateRange(
      startDate,
      endDate,
    );

    if (eventDetails.isError()) {
      throw eventDetails.error;
    }

    return Result.ok(eventDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event/retrieveEventsByGivenDateRange" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving events within given date range");
  }
};

export const retrieveEventsByGivenMonthAndYear = async (month: number, year: number) => {
  try {
    // To check whether user exists with this userName
    const eventDetails: Result<IEventDetails[] | any> = await eventRepo.retrieveEventsByGivenMonthAndYear(
      month,
      year,
    );

    if (eventDetails.isError()) {
      throw eventDetails.error;
    }

    return Result.ok(eventDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event/retrieveEventsByGivenMonthAndYear" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};

export const deleteEventById = async (eventId: number , company_id: number) => {
  try {
    // To check whether user exists with this userName
    const eventDetails: Result = await eventRepo.deleteEventById(
     eventId, company_id
    );

    if (eventDetails.isError()) {
      throw eventDetails.error;
    }

    return Result.ok(eventDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event/deleteEventById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
