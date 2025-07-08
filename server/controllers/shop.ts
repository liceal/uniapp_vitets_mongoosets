import type { Request, Response } from "express";
import { Shop } from "../models/shop";

// 创建店铺
const createShop = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json(shop);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 获取所有店铺
const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个店铺
const getShopById = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      res.status(404).json({ message: "店铺未找到" });
      return;
    }
    res.status(200).json(shop);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 更新店铺
const updateShop = async (req: Request, res: Response) => {
  try {
    const updateFields = {
      ...req.body,
      createdAt: undefined, // 确保不覆盖创建时间
    };
    const shop = await Shop.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    if (!shop) {
      res.status(404).json({ message: "店铺未找到" });
      return;
    }
    res.status(200).json(shop);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 删除店铺
const deleteShop = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      res.status(404).json({ message: "店铺未找到" });
      return;
    }
    res.status(200).json({ message: "店铺删除成功" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { createShop, getAllShops, getShopById, updateShop, deleteShop };
