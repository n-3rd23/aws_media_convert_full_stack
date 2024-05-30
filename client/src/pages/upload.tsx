import { uploadFile } from "@/utils/s3";
import { ChangeEvent, useState } from "react";
import Video from "@/components/video/video.component";
import axiosInstance from "@/utils/axios-instance";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <label className="block" htmlFor="file">
          Upload video
        </label>
        <input
          disabled={isUploading}
          onChange={uploadToS3}
          type="file"
          name="file"
          id="file"
        />
        <p>{isUploading && "Uploading...."}</p>
        <div>
          <Link className="text-blue-500 underline" to="/videos">
            Videos
          </Link>
        </div>
      </div>
      {/* can play either mp4 or hsl videos */}
      {/* <Video src="https://dz12l8a6mvkc1.cloudfront.net/system_converted/1716958130126_custom_name.m3u8" /> */}
      {/* <Video src="https://armiamediaconvertbucket.s3.ap-south-1.amazonaws.com/system_converted/1716958130126_custom_name.m3u8" /> */}
      {/* {videoSrc.length ? <Video src={videoSrc} /> : null} */}
    </div>
  );
}

export default App;
