import { Request, Response, Router } from "express";
import { Document, Model } from "mongoose";

export const createOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
};

export const getAll = <T>(
  Model: Model<T>,
  _getAll?: generateRoutesConfigTypes["getAll"]
) => {
  return async (req: Request, res: Response) => {
    try {
      let data;
      if (_getAll) {
        if (typeof _getAll === "function") {
          data = await _getAll(req);
        } else {
          let query = {};
          if (_getAll.query) {
            query = _getAll.query(req);
          }
          data = await Model.find(query);
        }
      } else {
        data = await Model.find();
      }
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
};

export const getOne = <T>(
  Model: Model<T>,
  _getOne: generateRoutesConfigTypes["getOne"]
) => {
  return async (req: Request, res: Response) => {
    try {
      let doc;
      if (typeof _getOne === "function") {
        doc = await _getOne(req);
      } else {
        doc = await Model.findById(req.params.id);
      }
      if (!doc) {
        res.status(404).json({ message: "未找到对应记录" });
        return;
      }
      res.status(200).json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
};

export const updateOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const updateFields = req.body;
      const doc = await Model.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
      });
      if (!doc) {
        res.status(404).json({ message: "未找到对应记录" });
        return;
      }
      res.status(200).json(doc);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
};

export const deleteOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        res.status(404).json({ message: "未找到对应记录" });
        return;
      }
      res.status(200).json({ message: "记录删除成功" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
};

type generateRoutesConfigTypes = {
  /**
   * 配置 `getAll` 接口的行为，支持两种配置方式：
   * 1. **对象形式**：可通过 `query` 函数生成查询条件。
   * 2. **函数形式**：直接返回一个 `Promise`，该 `Promise` 解析为查询结果。
   */
  getAll?:
    | {
        /**
         * 可选的查询函数，根据请求对象生成查询条件。
         * @param {Request} req - Express 请求对象，包含请求的相关信息。
         * @returns {Object} - 返回一个对象，用于作为 Mongoose 查询的条件。
         */
        query?: (req: Request) => Object;
      }
    | {
        /**
         * 函数形式配置 `getAll`，直接返回查询结果的 `Promise`。
         * @param {Request} req - Express 请求对象，包含请求的相关信息。
         * @returns {Promise<Object>} - 返回一个 `Promise`，解析为查询结果数据。
         */
        (req: Request): Promise<Object>;
      };
  /**
   * 重写getOne 查询单个记录 get接口 参数id
   *
   * 例子：baseurl/:id
   */
  getOne?: {
    (req: Request): Promise<Object | null>;
  };
};
export const generateRoutes = <T>(
  router: Router,
  Model: Model<T>,
  config?: generateRoutesConfigTypes
) => {
  router.post("/", createOne(Model));
  router.get("/", getAll(Model, config?.getAll));
  router.get("/:id", getOne(Model, config?.getOne));
  router.put("/:id", updateOne(Model));
  router.delete("/:id", deleteOne(Model));
  return router;
};
