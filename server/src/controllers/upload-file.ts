import {
  getCallback,
  startJob,
  getVideos as listVideos,
  getVideo as getVideoById,
} from "@src/services";
import { catchError } from "@src/utils/catch-error";
import { responseBuilder } from "@src/utils/response-builder";
import httpStatus from "http-status";

export const uploadFile = catchError(async (req, res) => {
  const { s3Link } = req.body;
  const response = await startJob(s3Link);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const completeJob = catchError(async (req, res) => {
  const response = await getCallback(req.body);
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getVideos = catchError(async (_req, res) => {
  const videos = await listVideos();
  return res
    .status(httpStatus.OK)
    .json(responseBuilder(200, videos, "list-videos"));
});

export const getVideo = catchError(async (req, res) => {
  const { id } = req.params;
  const video = await getVideoById(id);
  return res
    .status(httpStatus.OK)
    .json(responseBuilder(200, video, "get-video"));
});

export const test = catchError((_req, res) => {
  return res.status(200).json({
    success: true,
  });
});
