import http from "@/utils/http";
import type { ChatRoomTypes } from "types/server";

export default {
  list: {
    url: "/chat_rooms/list",
    name: "聊天室列表",
    post: async function (data?: any): Promise<ChatRoomTypes[]> {
      return await http.post(this.url, {
        ...data,
        noPage: 1,
      });
    },
  },
  crud: {
    url: "/chat_rooms",
    name: "聊天室crud",
    post: async function (data?: {
      user_id: string;
      shop_id: string;
    }): Promise<ChatRoomTypes> {
      return await http.post(this.url, data);
    },
    get: async function (id: string): Promise<ChatRoomTypes> {
      return await http.get(`${this.url}/${id}`);
    },
  },
};
