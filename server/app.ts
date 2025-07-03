import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes";
import userRoutes from "./routes/userRoutes";
import shopRoutes from "./routes/shopRoutes";
import { goodsRoutes } from "./routes/goodsRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { commentsRoutes } from "./routes/commentRoutes";
import { commentsClassesRoutes } from "./routes/commentClassesRoutes";
import { addressesRoutes } from "./routes/addressesRoutes";
import { skusRoutes } from "./routes/skusRoutes";
import { skuGroupsRoutes } from "./routes/skuGroupRoutes";
import { expressesRouter } from "./routes/ExpressesRoutes";
import { createServer, IncomingMessage } from "http";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";
import { chatRoomsRoutes } from "./routes/chatRoomsRoutes";
import { chatRoomsConnect } from "./models/chatRooms";

dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER;

// 连接数据库
const MONGODB_URI = process.env.MONGODB_URL!;

console.log(`准备连接数据库:${MONGODB_URI}`);
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

// 请求日志
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// 路由
app.use("/api/test", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/goods", goodsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/comments_classes", commentsClassesRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/skus", skusRoutes); //单一规格属性
app.use("/api/sku_groups", skuGroupsRoutes); //规格组
app.use("/api/expresses", expressesRouter); //物流
app.use("/api/chat_rooms", chatRoomsRoutes); //聊天

// 启动服务器
// app.listen(PORT, () => {
//   console.log(`服务器运行在 http://localhost:${PORT}`);
// });

// 启动定时任务
// cleanupCaptchasJob;

// 创建HTTP服务器
export const httpServer = createServer(app);

export const wsMap = new Map<string, WebSocket>();

chatRoomsConnect(httpServer, wsMap);

httpServer.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
