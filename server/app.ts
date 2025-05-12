import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes";
import userRoutes from "./routes/userRoutes";
import shopRoutes from "./routes/shopRoutes";
import { goodsRoutes } from "./routes/goodsRoutes";

dotenv.config();

const app = express();
const PORT = 7200;

// 连接数据库
const MONGODB_URI = process.env.MONGODB_URL!;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`数据库连接成功到:${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error("数据库连接失败", err);
  });

// 中间件
app.use(express.json());

// 路由
app.use("/api/test", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/goods", goodsRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 启动定时任务
// cleanupCaptchasJob;
