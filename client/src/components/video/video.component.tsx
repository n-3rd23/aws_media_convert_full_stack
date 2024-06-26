import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function Video({ src }: any) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: [
          {
            src,
          },
        ],
      });
    }
  }, []);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" controls />
    </div>
  );
}
