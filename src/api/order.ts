import http from "@/utils/http";

export default {
  orderList: {
    url: "/order/list",
    name: "订单列表",
    post: async function (data?: any) {
      return await http.post(this.url, data);
    },
  },
};
