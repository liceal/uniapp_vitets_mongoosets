import http from "@/utils/http";
import type { CommentClassTypes, CommentsListTypes } from "types/server";

export default {
  list: {
    url: "/comments/list",
    name: "评论列表",
    post: async function (data?: any): Promise<CommentsListTypes> {
      return await http.post(this.url, data);
    },
  },
  classes: {
    url: "/comments_classes",
    name: "评论分类",
    get: async function (params?: any): Promise<CommentClassTypes[]> {
      return await http.get(this.url, { params });
    },
  },
};
