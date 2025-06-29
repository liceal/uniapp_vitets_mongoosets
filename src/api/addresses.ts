import http from "@/utils/http";
import type { AddressesTypes } from "types/server";

export default {
  list: {
    url: "/addresses",
    name: "地址列表",
    get: async function (params?: any): Promise<AddressesTypes[]> {
      return await http.get(this.url, {
        params: {
          ...params,
          noPage: 1,
        },
      });
    },
  },
  top: {
    url: "/addresses/top",
    name: "地址置顶/取消",
    post: async function (id?: AddressesTypes["_id"]): Promise<AddressesTypes> {
      return await http.post(this.url, { id });
    },
  },
  setDefault: {
    url: "/addresses/set_default",
    name: "设置默认地址",
    post: async function (id?: AddressesTypes["_id"]): Promise<AddressesTypes> {
      return await http.post(this.url, { id });
    },
  },
  create: {
    url: "/addresses",
    name: "新增地址",
    post: async function (
      data: Partial<AddressesTypes>
    ): Promise<AddressesTypes> {
      return await http.post(this.url, data);
    },
  },
  update: {
    url: "/addresses",
    name: "新增地址",
    put: async function (
      data: Partial<AddressesTypes>,
      id: AddressesTypes["_id"]
    ): Promise<AddressesTypes> {
      return await http.put(`${this.url}/${id}`, data);
    },
  },
  delete: {
    url: "/addresses",
    name: "删除地址",
    delete: async function (
      id: AddressesTypes["_id"]
    ): Promise<AddressesTypes> {
      return await http.delete(`${this.url}/${id}`);
    },
  },
  default: {
    url: "/addresses/default",
    name: "默认地址",
    post: async function (): Promise<AddressesTypes> {
      return await http.post(this.url);
    },
  },
};
