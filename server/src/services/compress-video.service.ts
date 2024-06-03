import { MediaConvert } from "@aws-sdk/client-mediaconvert";
import { Video } from "@src/db/models";
import * as fs from "fs";

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
          CustomName: "1080",
          Name: "Apple HLS",
          Outputs: [
            {
              Preset: "System-Avc_16x9_1080p_29_97fps_8500kbps",
              NameModifier: "_1080",
            },
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              SegmentLength: 10,
              Destination: DESTINATION,
              MinSegmentLength: 0,
            },
          },
        },
        {
          CustomName: "720",
          Name: "Apple HLS",
          Outputs: [
            {
              Preset: "System-Avc_16x9_720p_29_97fps_5000kbps",
              NameModifier: "_720",
            },
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              SegmentLength: 10,
              Destination: DESTINATION,
              MinSegmentLength: 0,
            },
          },
        },
        {
          CustomName: "540",
          Name: "Apple HLS",
          Outputs: [
            {
              Preset: "System-Avc_16x9_540p_29_97fps_3500kbps",
              NameModifier: "_540",
            },
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              SegmentLength: 10,
              Destination: DESTINATION,
              MinSegmentLength: 0,
            },
          },
        },
        {
          CustomName: "360",
          Name: "Apple HLS",
          Outputs: [
            {
              Preset: "System-Avc_16x9_360p_29_97fps_600kbps",
              NameModifier: "_360",
            },
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              SegmentLength: 10,
              Destination: DESTINATION,
              MinSegmentLength: 0,
            },
          },
        },
      ],
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      FollowSource: 1,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
          FileInput: input,
        },
      ],
    },
    Queue: "arn:aws:mediaconvert:ap-south-1:590183874188:queues/Default",
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
  const filePath = data.event.detail.outputGroupDetails[0].playlistFilePaths[0];
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
