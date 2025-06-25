import { SkuGroups } from "#/models/sku_groups";
import { generateRoutes } from "#/utils/crudFactory";
import { Router } from "express";

const router = Router();

generateRoutes(router, SkuGroups);

export const skuGroupsRoutes = router;
