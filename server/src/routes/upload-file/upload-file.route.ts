import {
  completeJob,
  getVideo,
  getVideos,
  test,
  uploadFile,
} from "@src/controllers";
import express from "express";
const router = express.Router();

router.route("/").post(uploadFile);

router.route("/complete").post(completeJob);

router.route("/").get(getVideos);

router.route("/test").get(test);

router.route("/:id").get(getVideo);

export default router;
