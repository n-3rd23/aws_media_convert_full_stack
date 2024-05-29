import { MediaConvert } from "@aws-sdk/client-mediaconvert";
import * as fs from "fs";

const REGION = process.env.S3_REGION as string;
const DESTINATION = "s3://armiamediaconvertbucket/system_converted/";

export const startJob = async (input: string) => {
  const mediaConvert = new MediaConvert({
    region: REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });

  const job = await mediaConvert.createJob({
    Settings: {
      OutputGroups: [
        {
          Name: "File Group",
          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: DESTINATION, // update with destination
            },
          },
          Outputs: [
            {
              VideoDescription: {
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    RateControlMode: "QVBR",
                    SceneChangeDetect: "TRANSITION_DETECTION",
                    MaxBitrate: 4000000, // THE BIT RATE
                  },
                },
              },
              AudioDescriptions: [
                {
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 96000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              ContainerSettings: {
                Container: "MP4",
                Mp4Settings: {},
              },
              NameModifier: "_converted_file", // file name modifier
            },
          ],
          CustomName: "_the_converted", // job custom name
        },
      ],
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      FollowSource: 1,
      Inputs: [
        {
          TimecodeSource: "ZEROBASED",
          VideoSelector: {},
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          FileInput: input, // input file
        },
      ],
    },
    Role: "arn:aws:iam::590183874188:role/service-role/MediaConvert_Default_Role", // TODO: the role
    // passing metadata
    UserMetadata: {
      content_id: "65e7fda88e3cb8c0e8e561a4",
      other_details: "sample sample data here",
    },
  });
  return job;
};

export const getCallback = async (data: any) => {
  console.log("upload completed");
  const dataJSON = JSON.stringify(data);
  fs.writeFileSync(`${__dirname}/../assets/data.json`, dataJSON, "utf-8");
  const responseData = {
    filePath:
      data.event.detail.outputGroupDetails[0].outputDetails[0]
        .outputFilePaths[0],
    userMetaData: data.event.detail.userMetadata,
  };
  return responseData;
};
