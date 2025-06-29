import { Skus } from "#/models/skus";
import { generateRoutes } from "#/utils/crudFactory";
import { type Request, type Response, Router } from "express";

const router = Router();

generateRoutes(router, Skus);

export const skusRoutes = router;
