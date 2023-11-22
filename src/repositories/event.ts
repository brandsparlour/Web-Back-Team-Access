import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateEvent, IEventDetails } from "../interfaces/event";

export const addEvent = async (data: ICreateEvent): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const eventData = {
      company_id: data.company_id,
      event_name: data.event_name,
      description: data.description,
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: data.end_time,
      location: data.location,
      event_category: data.event_category,
      organizer: data.organizer,
      contact_info: data.contact_info,
      registration_fee: data.registration_fee,
      event_capacity: data.event_capacity,
      event_image: data.event_image,
      status: data.status,
      registration_status: data.registration_status,
      payment_type: data.payment_type ?? "PAID",
    };
    const results = await query(connection, "INSERT INTO Events SET ?", eventData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/event/addEvent => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding event => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveEvents = async (): Promise<Result<IEventDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IEventDetails[] = await query(connection, "SELECT * from Events");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/event/retrieveEvents => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving events => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveEventsByGivenDateRange = async (
  startDate: Date,
  endDate: Date,
): Promise<Result<IEventDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
  
    const result: IEventDetails[] = await query(
      connection,
      "SELECT * from Events where event_date >= ? AND event_date <= ?",
      [startDate, endDate],
    );

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/event/retrieveEventsByGivenDateRange => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving events within date range => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveEventsByGivenMonthAndYear = async (
  month: number,
  year: number,
): Promise<Result<IEventDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    console.log("month",month, "year ", year);
    const result: IEventDetails[] = await query(
      connection,
      "SELECT * from Events where MONTH(event_date) = ? AND YEAR(event_date) = ?",
      [month, year],
    );

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/event/retrieveEventsByGivenMonthAndYear => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving events within month and year => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteEventById = async (eventId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection, "Delete from Events where event_id = ?", [eventId]);

    return Result.ok("Delete event successfully");
  } catch (err) {
    logger.error(`at: repositories/event/deleteEventById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the event => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
