import { ChatRooms } from "#/models/chatRooms";
import { generateRoutes } from "#/utils/crudFactory";
import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

generateRoutes(router, ChatRooms, {
  async getOne(req) {
    const result = await ChatRooms.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "shops",
          localField: "shop_id",
          foreignField: "_id",
          as: "shop_detail",
        },
      },
      { $unwind: { path: "$shop_detail", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_detail",
        },
      },
      { $unwind: { path: "$user_detail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "shop_detail.__v": 0,
          "user_detail.__v": 0,
          "user_detail.password": 0,
        },
      },
    ]);
    return result[0];
  },
});

export const chatRoomsRoutes = router;
