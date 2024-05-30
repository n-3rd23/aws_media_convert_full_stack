import { Schema, model } from "mongoose";

const videoSchema = new Schema({
  video: { type: String },
});

export const Video = model("video", videoSchema);
