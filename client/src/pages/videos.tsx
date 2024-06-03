import axiosInstance from "@/utils/axios-instance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Videos() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<
    Array<{
      converted_file: string;
      original_file: string;
      _id: string;
    }>
  >([]);

  const getVideos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/upload");
      if (response && response.status === 200) {
        setVideos(response.data.data);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Videos</h1>
      {videos.length &&
        videos.map((item, index) => {
          return (
            <p className="py-3" key={item._id}>
              <Link to={`/video/${item._id}`}>Video {index + 1}</Link>
            </p>
          );
        })}
    </div>
  );
}
