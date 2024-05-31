import validateEnv from "@src/utils/validate-env";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import API_ROUTES from "./src/routes";
import {
  errorConverter,
  errorHandler,
} from "@src/middlewares/error.middleware";
require("@src/db/config");

const app = express();

dotenv.config();
validateEnv();

app.use(cors());
app.use(express.json());

// routes;
app.use("/api", API_ROUTES);

// error converter;
app.use(errorConverter);

// error handler;
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`server listening on ${PORT} 🚀`);
});
