import { httpServer } from "#/app";
import { MySchema } from "#/utils/mySchema";
import type { IncomingMessage, Server } from "http";
import moment from "moment";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { ChatRoomTypes, ChatMessageTypes } from "types/server";
import { WebSocketServer } from "ws";

// 聊天室
type ChatRoomsDocument = mongoose.Document &
  SchemaTimestampsConfig &
  ChatRoomTypes;
const chatRoomsSchema = new MySchema<ChatRoomsDocument>({
  title: {
    type: String,
    default: "聊天室的title",
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  messages: {
    type: [
      {
        sender: {
          // 发送者
          type: String,
          required: true,
          enum: ["shop", "user"],
        },
        message: {
          // 消息
          type: String,
          required: true,
        },
        createdAt: {
          type: String,
          default: () => moment().format("YYYY-MM-DD HH:mm:ss"), // 使用 moment 格式化时间
        },
      },
    ],
    default: [],
  },
});

export const ChatRooms = mongoose.model<ChatRoomsDocument>(
  "chat_rooms",
  chatRoomsSchema
);

export function chatRoomsConnect(
  httpServer: Server,
  wsMap: Map<string, WebSocket>
) {
  // 原生WebSocket路由
  const wss = new WebSocketServer({ server: httpServer }); // 原生WS
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    console.log("原生WebSocket用户连接", req.url);

    try {
      const url = new URL(req.url || "", `ws://${req.headers.host}`);
      const roomId = url.searchParams.get("room_id");
      const userId = url.searchParams.get("user_id");

      if (!userId) {
        throw new Error("Missing userId parameter");
      }

      // 标记为已认证的连接
      (ws as any).userId = userId; // 适当类型断言

      // 接收消息
      ws.onmessage = async (e) => {
        console.log(e.data);
        try {
          // 为这个聊天室的聊天记录增加一条
          const chatRoom = await ChatRooms.findById(roomId);
          if (chatRoom) {
            chatRoom.messages.push({
              sender: "user",
              message: e.data,
              createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
            await chatRoom.save();
            // 回去的消息设置标识符
            ws.send(`__SendSuccess__`);
          }
        } catch (err: any) {
          console.error("创建信息失败", err);
        }
      };

      ws.send(`userId:${userId} 连接成功`);

      wsMap.set(userId, ws);
    } catch (err: any) {
      ws.close(1008, err.message); // 政策违规状态码
    }
  });
}
