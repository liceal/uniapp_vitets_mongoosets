import { MySchema } from "#/utils/mySchema";
import moment from "moment";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { ChatRoomTypes, ChatMessageTypes, UserTypes } from "types/server";

// 聊天室
export type ChatRoomsDocument = mongoose.Document &
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
        // sender: {
        //   // 发送者
        //   type: String,
        //   required: true,
        //   enum: ["shop", "user"],
        // },
        user_id: {
          // 发送消息的用户id
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        user_detail: {
          type: Object,
          default: {},
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
