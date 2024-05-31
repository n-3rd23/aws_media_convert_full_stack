import { completeJob, test, uploadFile } from "@src/controllers";
import express from "express";
const router = express.Router();

router.route("/").post(uploadFile);

router.route("/complete").post(completeJob);

router.route("/test").get(test);

export default router;
