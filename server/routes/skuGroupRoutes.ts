import { SkuGroups } from "#/models/skus";
import { generateRoutes } from "#/utils/crudFactory";
import { Router } from "express";

const router = Router();

generateRoutes(router, SkuGroups);

export const skuGroupsRoutes = router;
