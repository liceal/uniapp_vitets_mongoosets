import { CommentClasses } from "#/models/comments";
import { generateRoutes } from "#/utils/crudFactory";
import { Router } from "express";

const router = Router();

generateRoutes(router, CommentClasses);

export const commentsClassesRoutes = router;
