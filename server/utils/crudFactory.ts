import { Request, Response, Router } from "express";
import { Aggregate, Document, Model, PipelineStage } from "mongoose";

export const createOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: "创建商品失败", error: error.message });
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

// post 分页列表
export interface postListOptions {
  $lookup: PipelineStage.Lookup["$lookup"];
}
export const postList = <T>(Model: Model<T>, options?: postListOptions) => {
  return async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const page = body.page || 1;
      const limit = body.limit || 10;
      const skip = (page - 1) * limit;

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

      // aggregate是直接操作数据库的 速度会快很多
      const docs = await Model.aggregate([
        {
          $facet: {
            data: [
              // 调整顺序，先 skip 再 limit
              { $skip: skip },
              { $limit: limit },
              ...$lookupOps,

              // {
              //   $lookup: { //链表查询
              //     from: "shops",
              //     localField: "shopId",
              //     foreignField: "_id",
              //     as: "shopDetail",
              //   },
              // },
              // {
              //   $addFields: {//这个方法生成虚拟字段 然后取数组第一个 如果空则给空对象
              //     shopDetail: {
              //       $ifNull: [
              //         { $arrayElemAt: ["$shopDetail", 0] }, // 取数组第一个元素
              //         {}, // 如果数组为空则设为null
              //       ],
              //     },
              //   },
              // },
              // {
              //   $unwind: {//这个方法出来的array会被结构成对象 但是如果查不出来 那键也不会有
              //     path: "$shopDetails",
              //     preserveNullAndEmptyArrays: true,
              //   },
              // },
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
  postList?: postListOptions;
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
  router.post("/list", postList(Model, config?.postList));
  return router;
};
