/*
  命令执行 npx tsx ./server/migrations/add-new-fields.ts
  
*/

import mongoose from "mongoose";
import { Goods } from "#/models/goods";
import dotenv from "dotenv";

dotenv.config();

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    // 如果price_type或者sales_type字段不存在 则插入price_type=0 sales_type=0
    // const result = await Goods.updateMany(
    //   {
    //     $or: [
    //       { price_type: { $exists: false } },
    //       { sales_type: { $exists: false } },
    //     ],
    //   },
    //   {
    //     $set: {
    //       price_type: 0,
    //       sales_type: 0,
    //     },
    //   }
    // );

    /**
     * 批量更新操作：为所有缺少price_type或sales_type字段的商品文档设置默认值
     * 使用bulkWrite执行多个updateMany操作，比单独执行更高效
     * 包含两个更新操作：
     * 1. 为缺少price_type字段的文档设置默认值0
     * 2. 为缺少sales_type字段的文档设置默认值0
     *
     * 业务逻辑说明：
     * - price_type=0表示无特殊价格类型，1表示券后价
     * - sales_type=0表示无特殊销售类型，1表示总销量
     * - 这两个字段在商品模型中已有默认值设置，此操作用于迁移旧数据
     */
    const result = await Goods.bulkWrite([
      {
        updateMany: {
          filter: {
            $or: [{ price_type: { $exists: false } }],
          },
          update: {
            $set: {
              price_type: 0,
            },
          },
        },
      },
      {
        updateMany: {
          filter: {
            $or: [{ sales_type: { $exists: false } }],
          },
          update: {
            $set: {
              sales_type: 0,
            },
          },
        },
      },
    ]);

    console.log(`${result.modifiedCount} documents updated.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
