import { Result } from "../interfaces/result";
import * as eventParticipantRepo from "../repositories/event-participant";
import logger from "../utils/logger";
import { ICreateEventParticipant, IEventParticipantDetails } from "../interfaces/event-participant";

export const addEventParticipants = async (data: ICreateEventParticipant) => {
  try {
    // calling repo function to store data
    const addEventResult: Result = await eventParticipantRepo.addEventParticipants(data);
    // If there is any error then throw error
    if (addEventResult.isError()) {
      throw addEventResult.error;
    }

    return Result.ok(addEventResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveEventParticipants = async () => {
  try {
    // To check whether user exists with this userName
    const eventDetails: Result<IEventParticipantDetails[] | any> = await eventParticipantRepo.retrieveEventParticipants();

    if (eventDetails.isError()) {
      throw eventDetails.error;
    }

    return Result.ok(eventDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event/retrieveEventParticipants" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving events participants");
  }
};

export const retrieveEventParticipantsByEventId = async (eventId: number) => {
    try {
      // To check whether user exists with this userName
      const eventDetails: Result<IEventParticipantDetails[] | any> = await eventParticipantRepo.retrieveEventParticipantsByEventId(eventId);
  
      if (eventDetails.isError()) {
        throw eventDetails.error;
      }
  
      return Result.ok(eventDetails.data);
    } catch (error) {
      // logging the error
      logger.error(`at: "controllers/event-participant/retrieveEventParticipantsByEventId" => ${JSON.stringify(error)}\n${error}`);
  
      // return negative response
      return Result.error("Error retrieving events participants by event id");
    }
  };

export const deleteEventParticipantById = async (participantId: number ) => {
  try {
    // To check whether user exists with this userName
    const eventParticipantDetails: Result = await eventParticipantRepo.deleteEventParticipantById(
        participantId
    );

    if (eventParticipantDetails.isError()) {
      throw eventParticipantDetails.error;
    }

    return Result.ok(eventParticipantDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/event-participants/deleteEventParticipantById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
