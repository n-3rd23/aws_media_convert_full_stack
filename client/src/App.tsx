import { uploadFile } from "@/utils/s3";
import { ChangeEvent, useState } from "react";
import "./App.css";
import Video from "./components/video/video.component";
import axiosInstance from "./utils/axios-instance";

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  const uploadToS3 = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target?.files?.length ? event.target.files[0] : null;
      if (!file) {
        return;
      }
      const uploaded = await uploadFile(
        "armiamediaconvertbucket",
        "system_uploads",
        file
      );
      if (uploaded?.path) {
        setVideoSrc(uploaded.path);
        await uploadVideo(uploaded.path);
      }
    } catch (err) {
      console.error("s3 error::", err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadVideo = async (link: string) => {
    try {
      setIsUploading(true);
      const response = await axiosInstance.post("/upload", {
        s3Link: link,
      });
      if (response.status === 200) {
        console.log("upload completed");
      }
    } catch (err) {
      console.error("error on uploading video for compression : ", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div>
        <input
          disabled={isUploading}
          onChange={uploadToS3}
          type="file"
          name="file"
          id="file"
        />
      </div>
      <p>{isUploading && "Uploading...."}</p>
      {/* can play either mp4 or hsl videos */}
      {/* <Video src="https://armiamediaconvertbucket.s3.ap-south-1.amazonaws.com/new_convert/Zack+Snyder_s+Justice+Leagueconverted.m3u8" /> */}
      {/* <Video src="https://armiamediaconvertbucket.s3.ap-south-1.amazonaws.com/uploads/Zack+Snyder_s+Justice+League.mp4" /> */}
      {videoSrc.length ? <Video src={videoSrc} /> : null}
    </div>
  );
}

export default App;
