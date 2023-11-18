import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateEventParticipant, IEventParticipantDetails } from "../interfaces/event-participant";

export const addEventParticipants = async (data: ICreateEventParticipant): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const eventData = {
      company_id: data.company_id,
      customer_id: data.customer_id,
      event_id: data.event_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      registration_date: data.registration_date,
      payment_status: data.payment_status,
      additional_info: data.additional_info,
    };
    const [results] = await query("INSERT INTO EventParticipants SET ?", eventData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/event-participant/addEventParticipants => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding event-participant => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveEventParticipants = async (): Promise<Result<IEventParticipantDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IEventParticipantDetails[] = await query("SELECT * from EventParticipants");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/event-participants/retrieveEventParticipants => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving event-participants => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveEventParticipantsByEventId = async (eventId: number): Promise<Result<IEventParticipantDetails[]>> => {
    const connection: PoolConnection = await getDbConnection();
    try {
      const result: IEventParticipantDetails[] = await query("SELECT * from EventParticipants where event_id = ?", [eventId]);
  
      return Result.ok(result);
    } catch (err) {
      logger.error(`at: repositories/event-participants/retrieveEventParticipantsByEventId => ${err} \n ${JSON.stringify(err)}`);
  
      return Result.error(`Error retrieving event-participants by event id => ${err}`);
    } finally {
      releaseDbConnection(connection);
    }
  };


export const deleteEventParticipantById = async (participantId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query("Delete from Events where participant_id = ? ", [participantId]);

    return Result.ok("Delete event participant successfully");
  } catch (err) {
    logger.error(`at: repositories/event/deleteEventParticipantById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the event participant => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
