import http from "@/utils/http";

export default {
  goodsList: {
    url: "/goods/list",
    name: "商品列表",
    post: async function (data?: any) {
      return await http.post(this.url, data);
    },
  },
};
