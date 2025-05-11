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

export const getAll = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const docs = await Model.find();
      res.status(200).json(docs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
};

export const getOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response) => {
    try {
      const doc = await Model.findById(req.params.id);
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

export const generateRoutes = <T>(router: Router, Model: Model<T>) => {
  router.post("/", createOne(Model));
  router.get("/", getAll(Model));
  router.get("/:id", getOne(Model));
  router.put("/:id", updateOne(Model));
  router.delete("/:id", deleteOne(Model));
  return router;
};
