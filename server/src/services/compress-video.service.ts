import { MediaConvert } from "@aws-sdk/client-mediaconvert";
import * as fs from "fs";
import { Video } from "@src/db/models";
import { ObjectId } from "mongodb";

const DESTINATION = "s3://armiamediaconvertbucket/system_converted/";

export const startJob = async (input: string) => {
  console.log("job started");
  const mediaConvert = new MediaConvert({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });
  const createdVideo = await Video.create({
    original_file: input,
  });
  const job = await mediaConvert.createJob({
    Settings: {
      OutputGroups: [
        {
          Name: "Apple HLS",
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              SegmentLength: 10,
              MinSegmentLength: 0,
              Destination: DESTINATION,
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
                    MaxBitrate: 5000000,
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
              OutputSettings: {
                HlsSettings: {},
              },
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {},
              },
              NameModifier: "_custom_name",
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
      content_id: createdVideo._id.toString(),
      other_details: "sample sample data here",
    },
  });
  return job;
};

export const getCallback = async (data: any) => {
  const dataJSON = JSON.stringify(data);
  fs.writeFileSync(`${__dirname}/../assets/data.json`, dataJSON, "utf-8");
  const filePath =
    data.event.detail.outputGroupDetails[0].outputDetails[0].outputFilePaths[0];
  const userMetaData = data.event.detail.userMetadata;

  const updatedVideo = await Video.updateOne(
    {
      _id: userMetaData.content_id,
    },
    {
      $set: {
        converted_file: filePath,
      },
    }
  );
  return updatedVideo;
};

export const getVideos = async () => {
  const videos = await Video.find();
  return videos;
};

export const getVideo = async (id: string) => {
  const video = await Video.findOne({
    _id: id,
  });
  return video;
};
