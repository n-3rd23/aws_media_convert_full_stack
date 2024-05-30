import { createBrowserRouter } from "react-router-dom";
import Upload from "@/pages/upload";
import Videos from "@/pages/videos";
export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Upload />,
  },
  {
    path: "/videos",
    element: <Videos />,
  },
]);
