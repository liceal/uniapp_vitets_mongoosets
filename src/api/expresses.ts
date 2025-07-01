import http from "@/utils/http";
import type { ExpressTypes } from "types/server";

export default {
  findOne: {
    url: "/expresses/find_one",
    name: "根据订单号查找物流详情",
    post: async function (data: { order_id: string }): Promise<ExpressTypes> {
      return await http.post(this.url, data);
    },
  },
};
