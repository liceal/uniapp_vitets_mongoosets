import { type Request, type Response, Router } from "express";
import { Aggregate, Document, Model, type PipelineStage } from "mongoose";
import { MySchema } from "./mySchema";
import type { CommentClassTypes } from "types/server";

export const createOne = <T>(
  Model: Model<T>,
  _createOne?: generateRoutesConfigTypes["createOne"]
) => {
  return async (req: Request, res: Response) => {
    try {
      let doc;
      if (_createOne) {
        doc = await _createOne(req);
      } else {
        doc = await Model.create(req.body);
      }
      res.status(201).json(doc);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: "创建失败", error: error.message });
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

      // 可以不分页
      const noPage = req.query.noPage;
      if (noPage) {
        let params: Partial<CommentClassTypes> = {};
        if (req.query.type) {
          params.type = Number(req.query.type);
        }
        data = await Model.find(params);
        res.status(200).json(data);
        return;
      }

      // 增加了分页功能 查询时间比通道多了一倍 待优化 或者去掉
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      if (_getAll) {
        if (typeof _getAll === "function") {
          data = await _getAll(req);
        } else {
          let query = {};
          if (_getAll.query) {
            query = _getAll.query(req);
          }
          data = await Model.find(query).skip(skip).limit(limit).exec();
        }
      } else {
        data = await Model.find().skip(skip).limit(limit).exec();
      }

      const total = await Model.countDocuments();
      res.status(200).json({
        data,
        total,
        page,
        pageSize: limit,
      });
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

// post 分页列表
export interface postListOptions {
  $match?: (req: Request) => PipelineStage.Match["$match"];
  $lookup?: PipelineStage.Lookup["$lookup"];
  $addFields?: PipelineStage.AddFields["$addFields"];
  $pipeline?: PipelineStage[];
}
export const postList = <T>(Model: Model<T>, options?: postListOptions) => {
  return async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      const page = body.page || 1;
      const limit = body.limit || 10;
      const skip = (page - 1) * limit;
      const noPage = body.noPage;
      let pipeline: PipelineStage[] = [];

      // 查询配置
      if (options?.$pipeline) {
        pipeline = pipeline.concat(options?.$pipeline);
      }

      // 过滤条件
      if (options?.$match) {
        let $match = options?.$match(req);
        pipeline.push({ $match: $match });
      }

      // 生成关于连表的配置
      let $lookupOps: Array<PipelineStage.Lookup | PipelineStage.AddFields> =
        [];
      if (options?.$lookup) {
        $lookupOps.push({
          $lookup: options.$lookup,
        });
        // 自动生成取这个关联数据的第一条 并且没数据默认空对象
        $lookupOps.push({
          $addFields: {
            [options.$lookup.as]: {
              $ifNull: [
                { $arrayElemAt: [`$${options.$lookup.as}`, 0] }, // 取数组第一个元素
                {}, // 如果数组为空则设为{}
              ],
            },
          },
        });
      }

      // 生成虚拟字段
      let $addFieldsOps: Array<PipelineStage.AddFields> = [];
      if (options?.$addFields) {
        $addFieldsOps.push({
          $addFields: {
            ...options.$addFields,
            id: "$_id", //默认带id过去
          },
        });
      }

      // aggregate是直接操作数据库的 速度会快很多

      let docsArray;
      if (noPage) {
        let finalPipeline = [...pipeline, ...$lookupOps, ...$addFieldsOps];
        if (!finalPipeline.length) {
          finalPipeline = [{ $match: {} }];
        }
        docsArray = await Model.aggregate(finalPipeline);
      } else {
        docsArray = await Model.aggregate([
          ...pipeline,
          {
            $facet: {
              data: [
                // 调整顺序，先 skip 再 limit
                { $skip: skip },
                { $limit: limit },
                ...$lookupOps,
                ...$addFieldsOps,
              ],
              total: [{ $count: "count" }],
            },
          },
          {
            $project: {
              data: 1,
              total: { $arrayElemAt: ["$total.count", 0] },
              page: { $literal: page },
              pageSize: { $literal: limit },
            },
          },
        ]);
      }
      const docs = docsArray[0] || {};
      // 格式化时间
      if (docs.data) {
        docs.data = docs.data.map((item: any) => {
          if (item.createdAt) {
            item.createdAt = MySchema.formatDate(item.createdAt);
          }
          if (item.updatedAt) {
            item.updatedAt = MySchema.formatDate(item.updatedAt);
          }
          return item;
        });
      }
      res.status(200).json(docs);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
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
  /**
   * 通道分页查询，增加配置
   */
  postList?: postListOptions;
  /**
   * 重写创建单个
   * post /
   */
  createOne?: {
    (req: Request): Promise<Object | null>;
  };
};

/*
  自动生成curd 分页列表
*/
export const generateRoutes = <T>(
  router: Router,
  Model: Model<T>,
  config?: generateRoutesConfigTypes
) => {
  router.post("/", createOne(Model, config?.createOne));
  router.get("/", getAll(Model, config?.getAll));
  router.get("/:id", getOne(Model, config?.getOne));
  router.put("/:id", updateOne(Model));
  router.delete("/:id", deleteOne(Model));
  router.post("/list", postList(Model, config?.postList));
  return router;
};
