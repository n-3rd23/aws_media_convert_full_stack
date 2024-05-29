import { getCallback, startJob } from "@src/services";

export const uploadFile = async (s3Link: string) => {
  const res = await startJob(s3Link);
  return res;
};

export const uploadComplete = async (data: any) => {
  const res = await getCallback(data);
  return res;
};
