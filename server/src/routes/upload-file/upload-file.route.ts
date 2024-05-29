import express from "express";
import { uploadFile, uploadComplete } from "@src/controllers";
const router = express.Router();

router.route("/").post(async (req, res) => {
  const { s3Link } = req.body;
  const response = await uploadFile(s3Link);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

router.route("/complete").post(async (req, res) => {
  const response = await uploadComplete(req.body);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

router.route("/test").get(async (req, res) => {
  res.send("Hello world");
});

export default router;
