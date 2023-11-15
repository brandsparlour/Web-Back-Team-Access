import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateJob, IJobDetails } from "../interfaces/job";

export const addJob = async (data: ICreateJob): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const jobData = {
        job_title: data.job_title,
        company: data.company,
        location:data.location,
        description: data.description,
        salary: data.salary,
        employment_type: data.employment_type,
        job_category:data.job_category,
        application_deadline: data.application_deadline,
        experience_level: data.experience_level,
        education: data.education,
        contact_email: data.contact_email,
        posted_date: data.posted_date,
        application_url: data.application_url,
    };
    const [results] = await query("INSERT INTO Jobs SET ?", jobData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/job/addJob => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding job => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveJobs = async (): Promise<Result<IJobDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result:IJobDetails[] = await query("SELECT * from Jobs");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/job/retrieveJobs => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving jobs => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveJobById = async (id:number): Promise<Result<IJobDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IJobDetails[] = await query("SELECT * from Jobs where job_id = ?", [id]);
    
    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/job/retrieveJobById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving jobs => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteJobById = async(jobId: number ): Promise<Result> =>{
  const connection: PoolConnection = await getDbConnection();
  try {
     await query("Delete from Jobs where job_id = ? ",[jobId]);

    return Result.ok("Delete job successfully");
  } catch (err) {
    logger.error(`at: repositories/job/deleteJobById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the job => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
}

