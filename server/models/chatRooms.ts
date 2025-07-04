import { httpServer } from "#/app";
import { MySchema } from "#/utils/mySchema";
import type { IncomingMessage, Server } from "http";
import moment from "moment";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { ChatRoomTypes, ChatMessageTypes, UserTypes } from "types/server";
import { WebSocketServer } from "ws";
import { User, type UserDocument } from "./user";

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

// 存放用户id 对应聊天室
export const userToWsMap = new Map<string, WebSocket>();

// socket连接聊天室
export function chatRoomsConnect(httpServer: Server) {
  // 原生WebSocket路由
  const wss = new WebSocketServer({ server: httpServer }); // 原生WS
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    console.log("原生WebSocket用户连接", req.url);

    /*
      用户连接聊天室，并且有用户id
      聊天室绑定店铺id
      有用户也绑定店铺id
      发送消息 将会把消息发送给店铺id也是这个的用户那边
    */
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
        let message = e.data;
        try {
          // 为这个聊天室的聊天记录增加一条
          const chatRoom = await ChatRooms.findById(roomId);
          const user = await User.findById(userId);
          if (!user) {
            ws.send(JSON.stringify({ type: "error", message: "用户不存在" }));
            throw new Error("用户不存在");
          }
          if (chatRoom) {
            // 广播消息
            await broadcastToUser(chatRoom, user, message, ws);

            // 消息发送成功 把消息记录插进去保存
            chatRoom.messages.push({
              user_id: userId,
              user_detail: user?.toJSON(),
              message,
              createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            });

            await chatRoom.save();
            // 回去的消息设置标识符

            ws.send(`__SendSuccess__`);
          }
        } catch (err: any) {
          console.log(err);

          console.error("创建信息失败", err);
        }
      };

      ws.send(
        JSON.stringify({
          type: "success",
          message: `userId：${userId}连接成功`,
        })
      );

      userToWsMap.set(userId, ws);
    } catch (err: any) {
      ws.close(1008, err.message); // 政策违规状态码
    }
  });
}

/*
  广播消息给对方
  
  !有缺陷
  前提是这个聊天室是用户创建的 不能是商户对自己创建

  chatRoom里面
    user_id是创建方 那肯定是用户
    shop_id是店铺id，可以用店铺id找到店铺的用户

  user 是当前发消息的人 里面有user.shop_id 如果有 则这个用户是商户
    如果是商户，则对chatRoom里的user_id发送消息
    否则是客户
      则对chatRoom.shop_id找到的用户发送消息
*/
async function broadcastToUser(
  chatRoom: ChatRoomsDocument,
  user: UserDocument,
  message: any,
  ws: WebSocket
) {
  // 判断是用户还是客户
  if (user.shop_id) {
    // 店铺
    // 店铺向客户发送消息
    const toWs = userToWsMap.get(chatRoom.user_id.toString());
    if (toWs) {
      // 客户存在 发消息给它
      toWs.send(
        JSON.stringify({
          type: "receive",
          message,
          user_id: user.id,
          user_detail: user.toJSON(),
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "客户不在线",
        })
      );
      throw new Error("客户不在线");
    }
  } else {
    // 客户
    // 客户向店铺发消息
    // 去找一下店铺的对应的用户id
    const shopUser = await User.findOne({
      shop_id: chatRoom.shop_id.toString(),
    });
    if (!shopUser) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "店铺没有绑定用户，请检查",
        })
      );
      throw new Error("店铺没有绑定用户，请检查");
    }
    const toWs = userToWsMap.get(shopUser._id.toString());
    if (toWs) {
      // 店铺老板在 发消息给他
      toWs.send(
        JSON.stringify({
          type: "receive",
          message,
          user_id: user.id,
          user_detail: user.toJSON(),
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "店铺老板不在",
        })
      );
      throw new Error("店铺老板不在");
    }
  }

  // let targetUserId = "";
  // let sendMsg = "";
  // const shopUser = await User.findOne({
  //   shop_id: chatRoom.shop_id.toString(),
  // });

  // if (!shopUser) {
  //   throw new Error("店铺用户不存在");
  // }

  // // 判断 发过来的人是用户还是商户 判断目标人

  // if (user.shop_id) {
  //   // 如果发送人有店铺id 则这是店铺的人 那么发送给用户

  //   targetUserId = user._id;
  //   sendMsg = JSON.stringify({
  //     type: "receive",
  //     message: message,
  //     user_id: shopUser?.id,
  //     user_detail: shopUser?.toJSON(),
  //   });
  // } else {
  //   // 发送人是客户 则发给客户店铺的信息
  //   targetUserId = shopUser._id.toString();
  //   sendMsg = JSON.stringify({
  //     type: "receive",
  //     message: message,
  //     user_id: user._id,
  //     user_detail: user,
  //   });
  // }

  // // 给目标id发送消息
  // if (targetUserId) {
  //   const ws = userToWsMap.get(targetUserId);
  //   if (ws) {
  //     ws.send(sendMsg);
  //   }
  // } else {
  //   throw new Error("对方不在");
  // }
}
