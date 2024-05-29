import express from "express";
import UPLOAD_ROUTE from "./upload-file/upload-file.route";

const router = express.Router();

const routes = [
  {
    route: UPLOAD_ROUTE,
    path: "/upload",
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export = router;
