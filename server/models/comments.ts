import { MySchema } from "#/utils/mySchema";
import mongoose, { type SchemaTimestampsConfig } from "mongoose";
import type { CommentClassTypes, CommentTypes } from "types/server";

type CommentDocument = mongoose.Document &
  CommentTypes &
  SchemaTimestampsConfig;

const commentSchema = new MySchema<CommentDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  skuStr: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  imgs: {
    type: [String],
    default: [],
  },
  likeCount: {
    type: Number,
    default: 0,
  },
});

type CommentClassDocument = mongoose.Document &
  CommentClassTypes &
  SchemaTimestampsConfig;
// 评价类别
const commentClassSchema = new MySchema<CommentClassDocument>({
  des: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    default: 1,
  },
  icon: {
    type: String,
    default: "",
  },
  type: {
    type: Number,
    default: 1, //默认好的评论
  },
});
// 虚拟字段 number转str
commentClassSchema.virtual("numberStr").get(function () {
  const num = this.number;
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
});

export const Comments = mongoose.model<CommentDocument>(
  "Comments",
  commentSchema
);

export const CommentClasses = mongoose.model<CommentClassDocument>(
  "CommentClasses",
  commentClassSchema
);
