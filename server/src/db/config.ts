import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
  mongoose.connect(process.env.DB_URI as string, {});
  mongoose.connection.on("connected", () => {
    console.log("mongodb connected");
  });

  mongoose.connection.on("error", (err: any) => {
    console.error("mongodb connection error :: ", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("database disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("db closed as app terminated");
    process.exit(0);
  });
})();
