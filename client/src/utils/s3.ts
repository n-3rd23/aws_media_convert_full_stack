import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const REGION = import.meta.env.VITE_S3_REGION;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  },
});

const renameFile = (fileName: string) => {
  const idx = fileName.lastIndexOf(".");
  const fileExtension = fileName.slice(idx);
  return `${new Date().getTime()}${fileExtension}`;
};

const uploadFile = async (bucket: string, folder: string, file: File) => {
  try {
    console.log("upload started");
    const objectKey = `${folder}/${renameFile(file.name)}`;
    const commandInput: PutObjectCommandInput = {
      Bucket: bucket,
      Key: objectKey,
      ACL: "public-read",
      Body: file,
    };
    const putObjectCommand = new PutObjectCommand(commandInput);
    const response = await s3Client.send(putObjectCommand);
    console.log("upload completed", response);
    return {
      response,
      path: `https://${bucket}.s3.${REGION}.amazonaws.com/${objectKey}`,
    };
  } catch (err: any) {
    console.log("Error on uploading : ", err?.message);
    return null;
  }
};

export { uploadFile };
