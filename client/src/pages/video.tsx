import axiosInstance from "@/utils/axios-instance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoComponent from "@/components/video/video.component";

export default function Video() {
  const [video, setVideo] = useState<null | string>(null);

  const { id } = useParams<{ id: string }>();

  const getVideo = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/upload/${id}`);
      if (response && response.status === 200) {
        let videoLink: null | string = null;
        if (response.data?.data?.converted_file) {
          videoLink = response.data?.data?.converted_file.split(
            "s3://armiamediaconvertbucket/"
          )[1];
        } else {
          videoLink = response.data?.data?.original_file.split(
            "https://armiamediaconvertbucket.s3.ap-south-1.amazonaws.com/"
          )[1];
        }
        videoLink = `https://dz12l8a6mvkc1.cloudfront.net/${videoLink}`;
        console.log("video link :: ", videoLink);
        setVideo(videoLink);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getVideo(id);
    }
  }, [id]);

  return <div>{video && <VideoComponent src={video} />}</div>;
}
