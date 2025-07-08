import { ChatRooms } from "#/models/chatRooms";
import { type UserDocument } from "#/models/user";
import moment from "moment";
import { type IncomingMessage, type Server } from "http";
import { WebSocket, WebSocketServer, type MessageEvent } from "ws";
import { getUserInfo } from "./user";
import type { ChatWSReturn, UserTypes } from "types/server";

/*
  开启聊天室
  聊天室是独立的，每个进去的人都能聊天
*/

// 一个用户对应一个ws
const userToWsMap = new Map<string, WebSocket>();

// 一个聊天室里面的用户
const chatRoomUsersMap = new Map<string, Set<UserDocument>>();

// socket 连接聊天室
export function chatRoomsConnect(httpServer: Server) {
  const WS = new WebSocketServer({ server: httpServer }); //原生WS
  WS.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    console.log("原生WebSocket用户连接", req.url);

    // 身份校验
    const url = new URL(req.url || "", `ws://${req.headers.host}`);
    const roomId = url.searchParams.get("room_id");
    const token = url.searchParams.get("token");

    // 发送消息
    function wsSend(data: ChatWSReturn) {
      ws.send(JSON.stringify(data));
    }

    try {
      if (!roomId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "聊天室id未填",
          } as ChatWSReturn)
        );
        throw Error("聊天室id未填");
      }

      // token鉴权 是否已经登录
      if (!token) {
        throw Error("token未填写");
      }

      // 根据token找到用户
      const user = (await getUserInfo(token)) as UserDocument;
      if (!user) {
        throw Error("token对应用户没找到");
      }

      // 为这个用户存储ws
      userToWsMap.set(user.id, ws);

      // 给这个聊天室加人
      if (!chatRoomUsersMap.has(roomId)) {
        // 如果第一次有人 则创建聊天室 插入第一个人
        chatRoomUsersMap.set(roomId, new Set([user]));
      } else {
        // 聊天室正在开启中 则插入人
        chatRoomUsersMap.get(roomId)?.add(user);
      }

      wsSend({
        type: "init",
        message: `用户 ${user.username} 加入`,
      });
      broadcast({
        roomId,
        message: `用户 ${user.username} 加入`,
        type: "new_user",
        user,
      });

      // 监听信息
      ws.onmessage = async (e: MessageEvent) => {
        let message = e.data as string; //只接收字符串数据

        // 为这个聊天室的聊天记录增加一条
        const chatRoom = await ChatRooms.findById(roomId);
        if (!chatRoom) {
          wsSend({ type: "error", message: "聊天室不存在" });
          return;
        }
        if (!message) {
          wsSend({ type: "error", message: "消息不能为空" });
          return;
        }
        chatRoom.messages.push({
          user_id: user?.id,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          message,
          user_detail: user?.toJSON() as UserTypes,
        });
        await chatRoom.save();

        // 广播消息
        broadcast({ roomId, message, user });
      };

      // 监听关闭
      ws.onclose = async () => {
        // 聊天室关闭 把聊天室里面这个人删掉
        chatRoomUsersMap.get(roomId)?.delete(user);
        // 如果聊天室没人了则把聊天室关闭了
        if (chatRoomUsersMap.get(roomId)?.size === 0) {
          chatRoomUsersMap.delete(roomId);
        }
        // 关闭这个连接存储
        userToWsMap.delete(user.id);
      };
    } catch (error: any) {
      console.log(`用户连接错误`, error);
      if (error.name === "TokenExpiredError") {
        ws.close(4000, "token已过期，请重写登录");
        return;
      } else if (error.name === "JsonWebTokenError") {
        ws.close(4000, "token错误");
        return;
      }
      ws.send(
        JSON.stringify({
          type: "error",
          message: error.message,
        } as ChatWSReturn)
      );
      ws.close(4000, error.message || "连接错误");
      // 连接错误 关闭这个用户的连接
      // if (user) {
      //   userToWsMap.delete(user.id);
      // }
    }
  });
}

/**
 * 广播消息给聊天室
 * @param roomId 聊天室id
 * @param message 消息
 * @param type 类型
 * @param isAll 是否广播给所有用户
 */
function broadcast(data: {
  roomId: string;
  message: string;
  type?: ChatWSReturn["type"];
  isAll?: boolean;
  user: UserDocument;
}) {
  let { roomId, message, type = "accept", isAll = false, user } = data;
  let chat_users = chatRoomUsersMap.get(roomId);
  if (chat_users) {
    for (let chat_user of chat_users) {
      if (chat_user.id !== user.id || isAll) {
        // 不是当前用户 则给这个用户发送消息
        let other_user_ws = userToWsMap.get(chat_user.id);
        if (other_user_ws) {
          other_user_ws.send(
            JSON.stringify({
              type,
              message,
              user,
            } as ChatWSReturn)
          );
        }
      }
    }
  }
}
