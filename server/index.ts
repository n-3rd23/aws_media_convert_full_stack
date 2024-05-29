import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import validateEnv from "@src/utils/validate-env";
import API_ROUTES from "./src/routes";

const app = express();

dotenv.config();
validateEnv();

app.use(cors());
app.use(express.json());

// routes;
app.use("/api", API_ROUTES);
const PORT = process.env.PORT || 3001;

app.listen(3001, () => {
  console.log(`server listening on ${PORT} 🚀`);
});
