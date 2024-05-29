import { getCallback, startJob } from "@src/services";
import express from "express";
const router = express.Router();

router.route("/").post(async (req, res) => {
  const { s3Link } = req.body;
  const response = await startJob(s3Link);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

router.route("/complete").post(async (req, res) => {
  const response = await getCallback(req.body);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export default router;
