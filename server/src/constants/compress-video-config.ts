const COMPRESS_CONFIG = {
  Settings: {
    Inputs: [
      {
        TimecodeSource: "ZEROBASED",
        VideoSelector: {},
        AudioSelectors: {
          "Audio Selector 1": {
            DefaultSelection: "DEFAULT",
          },
        },
        FileInput:
          "s3://armiamediaconvertbucket/uploads/Zack Snyder_s Justice League.mp4",
      },
    ],
    OutputGroups: [
      {
        Name: "Apple HLS",
        OutputGroupSettings: {
          Type: "HLS_GROUP_SETTINGS",
          HlsGroupSettings: {
            SegmentLength: 10,
            MinSegmentLength: 0,
            Destination: "s3://armiamediaconvertbucket/new_convert/",
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
        CustomName: "_the_converted",
      },
    ],
    TimecodeConfig: {
      Source: "ZEROBASED",
    },
    FollowSource: 1,
  },
  Role: "arn:aws:iam::590183874188:role/service-role/MediaConvert_Default_Role",
};
