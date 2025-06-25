import http from "@/utils/http";
import type { GoodsAttrsTypes } from "types/server";

export default {
  goodsList: {
    url: "/goods/list",
    name: "商品列表",
    post: async function (data?: any) {
      return await http.post(this.url, data);
    },
  },
  goodsAttrs: {
    url: "/goods/attrs",
    name: "商品规格属性",
    post: async function (data?: any): Promise<GoodsAttrsTypes> {
      return await http.post(this.url, data);
    },
  },
};
