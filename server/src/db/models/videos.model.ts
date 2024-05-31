import { Schema, model } from "mongoose";

const videoSchema = new Schema({
  original_file: { type: String },
  converted_file: { type: String },
});

export const Video = model("video", videoSchema);
