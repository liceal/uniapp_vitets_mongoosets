import http from "@/utils/http";
import type { SkuTypes } from "types/sku";

export default {
  sku: {
    url: "/skus",
    name: "sku属性",
    get: async function (id: string): Promise<SkuTypes> {
      return await http.get(`${this.url}/${id}`);
    },
  },
};
