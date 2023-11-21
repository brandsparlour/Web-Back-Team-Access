import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateVacancy, IUpdateVacancy, IVacancyDetails } from "../interfaces/vacancy";

export const addVacancy = async (data: ICreateVacancy): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const jobData = {
      job_id: data.job_id,
      number_of_positions: data.number_of_positions,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    const [results] = await query(connection, "INSERT INTO Vacancies SET ?", jobData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/vacancy/addVacancy => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding vacancy => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveVacancies = async (): Promise<Result<IVacancyDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IVacancyDetails[] = await query(connection, "SELECT * from Vacancies");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/vacancy/retrieveVacancies => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving vacancies => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updateVacancyById = async (data: IUpdateVacancy): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(
      connection,
      "Update Vacancies set number_of_positions = ? , status = ? where vacancy_id = ? and job_id = ?",
      [data.numberOfPositions, data.status, data.vacancyId, data.jobId],
    );

    return Result.ok("Update vacancy successfully");
  } catch (err) {
    logger.error(`at: repositories/vacancy/updateVacancyById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while updating the vacancy => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteVacancyById = async (vacancyId: number, jobId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection, "Delete from Vacancies where vacancy_id = ? and job_id = ?", [vacancyId, jobId]);

    return Result.ok("Delete vacancy successfully");
  } catch (err) {
    logger.error(`at: repositories/vacancy/deleteVacancyById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the vacancy => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
