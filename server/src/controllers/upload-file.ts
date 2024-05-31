import { getCallback, startJob } from "@src/services";
import { catchError } from "@src/utils/catch-error";

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

export const test = catchError((_req, res) => {
  return res.status(200).json({
    success: true,
  });
});
