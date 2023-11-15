// [ALOK PRASAD - 24-10-2023] - Express server setup for WEB-BACK-TEAM-ACCESS server

import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";
import express, { Request } from "express";
import helmet from "helmet";
import morgan from "morgan";

import error from "./middlewares/error";
import logger from "./utils/logger";

dotenv.config();

import healthcheck from "./routes/healthcheck";
import user from "./routes/user";
import event from "./routes/event";
import job from "./routes/job";
import vacancy from "./routes/vacancy";
import company from "./routes/company";
import internAffiliateLink from "./routes/intern-affiliates-link";

// In case of production environment, disable console logs
if (process.env.NODE_ENV === "production") {
  console.log = (_msg: string) => {};
  console.info = (_msg: string) => {};
  console.warn = (_msg: string) => {};
  console.error = (_msg: string) => {};
}

declare module "express" {
  interface Request {
    user?: any;
  }
}

// Create an instance of express
const app = express();

// Setting trust proxy level to 1
app.set("trust-proxy", 1);

// Block all unwanted headers using helmet
app.use(helmet());

// Disable x-powered-by header separately
app.disable("x-powered-by");

// Setup server
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.disable("etag"); // Disables caching
morgan.token("remote-addr", (req: Request) => {
  return req.header("X-Real-IP") ?? req.ip;
});
app.use(
  morgan("common", {
    stream: {
      write: (message) => logger.http(message),
    },
  }),
);

app.use("/healthcheck", healthcheck);
app.use("/user", user);
app.use("/event", event);
app.use("/job", job);
app.use("/vacancy", vacancy);
app.use("/company", company);
app.use("/intern-affiliate-link",internAffiliateLink)

// Express error middleware
app.use(error);

// Check if port exists in the environment else use 3001
const port = process.env.PORT ?? 3000;

// If the environment is test, do not start the express server
if (process.env.NODE_ENV !== "test") {
  app
    .listen(parseInt(port.toString()), "0.0.0.0", () => {
      // Listen the express server on the given port and log a message to the logs
      logger.info(`Server is listening on port ${port}`);
    })
    .on("error", (err: any) => {
      // In case of an error, log the error to the logs
      logger.error(JSON.stringify(err));
    });
}

export default app;
