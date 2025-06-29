import http from "@/utils/http";
import type { OrderTypes } from "types/server";

export default {
  orderList: {
    url: "/order/list",
    name: "订单列表",
    post: async function (data?: any) {
      return await http.post(this.url, data);
    },
  },
  CRUD: {
    url: "/order",
    name: "订单CURD",
    post: async function (data?: any): Promise<OrderTypes> {
      return await http.post(this.url, data);
    },
    get: async function ({
      id,
      hasDetail = false,
    }: {
      id: string;
      hasDetail?: boolean;
    }): Promise<OrderTypes> {
      return await http.get(`${this.url}/${id}`, {
        data: { hasDetail: hasDetail },
      });
    },
  },
};
