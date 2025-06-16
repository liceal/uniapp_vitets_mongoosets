import { Comments } from "#/models/comments";
import { generateRoutes } from "#/utils/crudFactory";
import { Router } from "express";

const router = Router();

generateRoutes(router, Comments, {
  postList: {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userDetail",
    },
  },
});

export const commentsRoutes = router;
