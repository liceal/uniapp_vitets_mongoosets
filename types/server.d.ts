import { ObjectId } from "mongoose";
import type { SkuGroupTypes, SkuTypes } from "./sku";
import type { AddressesDocument } from "#/models/addresses";

// 时间参数 数据创建的更新和创建时间
export interface DateTypes {
  createdAt: string; //创建时间
  updatedAt: string; //更新时间
}

// 分页参数
interface PageTypes<T> {
  data: Array<T>;
  total: number;
  page: number;
  pageSize: number;
}

// 店铺
export interface ShopTypes {
  id: any | ObjectId; //主键
  name: string; //店铺名字
  pictureUrl: string; //店铺图片
}

// 商品属性
interface GoodsAttrs {
  shippingFee: boolean; // 是否包运费
  noReason7d: boolean; //7天无理由
  useFirst: boolean; //先用后付
}

// 商品
export interface GoodsTypes extends GoodsAttrs {
  id: any | ObjectId; //主键
  name: string; //商品名称
  price: number; //商品价格
  pictureUrl: string; //商品图片
  shopId: ObjectId | any; //商品所属店铺
  createdAt: string; //创建时间
  updatedAt: string; //更新时间
  sales_str: string; //价格描述 拼接的字段 例如：¥10.00 券后¥9.00 总售100件
  price_type: 0 | 1; //0无 1券后
  sales_type: 0 | 1; //0无 1总售
  shopDetail?: ShopTypes;
  sku_group_ids: (any | ObjectId)[]; //规格属性组的ids
}

// 设置商品规格属性 唯一规格的属性
export interface GoodsAttrsTypes {
  goods_id: any | ObjectId;
  attrs: SkuGroupTypes[];
  skus: SkuTypes[];
}

// 状态枚举 1全部 10拼团中 20打包中 30待收获 40已完成
type OrderStatus = 1 | 10 | 20 | 30 | 40 | 50;
export interface OrderTypes extends GoodsAttrs {
  id: any | ObjectId; //主键
  shopId: any | ObjectId; //订单id
  shopDetail: ShopTypes; //订单详细信息
  goodsId: any | ObjectId; //商品id
  goodsDetail: GoodsTypes; //商品详细信息
  expressId: any | ObjectId; //物流id
  createdAt: string; //创建时间
  updatedAt: string; //更新时间
  shopName: string; //店铺名称
  shopImgUrl: string; //店铺图片
  goodsName: string; //商品名称
  goodsSkuStr: string; //商品sku字符串
  goodsUnitPrice: number; //单价
  goodsNumber: number; //商品数量
  goodsTotalPrice: number; //总价
  goodsImgUrl: string; //商品图片
  status: OrderStatus; //状态
  statusName: "全部" | "待付款" | "拼团中" | "打包中" | "待收货" | "已完成";
  address: AddressesTypes | AddressesDocument; //地址详情
}

// 用户
export interface UserTypes {
  username: string;
  password: string;
  email: string;
  avatar: string;
}

// 验证码入参
export interface CaptchaReqTypes {
  captchaKey: string;
  captchaText: string;
}

// 创建验证码 返回
export interface CaptchaResTypes {
  captchaKey: string;
  captchaBase64: string;
}

// 登录请求参数
export interface UserLoginReqTypes extends CaptchaReqTypes {
  username: string;
  password: string;
}

// 登录返回参数
export interface UserLoginResTypes {
  message: string;
  data?: UserTypes;
  token?: string;
}

// 创建账户参数
export interface UserCreateReqTypes extends CaptchaReqTypes {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

// 评论
export interface CommentTypes extends DateTypes {
  _id: any | ObjectId;
  user: any | ObjectId;
  skuStr: string;
  comment: string;
  imgs: string[];
  likeCount: number;
  userDetail: UserTypes;
}

// 评论列表返回数据
export interface CommentsListTypes extends PageTypes<CommentTypes> {}

// 评论类别
export interface CommentClassTypes extends DateTypes {
  _id: any | ObjectId;
  des: string;
  number: number;
  numberStr: string;
  icon: string;
  type: number | 1 | 2; //1好的评论 2不好的评论
}

// 地址
export interface AddressesTypes extends DateTypes {
  _id: any | ObjectId;
  province: string;
  city: string;
  area: string;
  address: string;
  address_full: string;
  username: string;
  phone: string;
  order: number;
  is_default: boolean;
  is_top: boolean;
}

type ExpressStatusDict = {
  1: "订单已确认";
  10: "已下单";
  20: "已发货";
  30: "运输中";
  40: "派送中";
  50: "待取件";
  60: "已签收";
};

// 物流状态 1订单已确认 10已下单 20已发货 30运输中 40派送中 50待取件 60已签收
type ExpressStatus = keyof ExpressStatusDict;
// 物流状态名称类型
type ExpressStatusName = ExpressStatusDict[ExpressStatus];
// 物流快递信息

export interface ExpressTypes extends DateTypes {
  _id: any | ObjectId;
  order_id: any | ObjectId; //订单id
  status: ExpressStatus;
  status_name: ExpressStatusName;
  pickup_code: string; //取件码
  collect: string; //快递收集点
  address: string; //具体存放点
  courier: string; //快递员
  courier_phone: string; //快递员手机号
  express_name: string; //快递公司
  express_code: string; //快递编号
  express_logs: ExpressLogTypes[]; //物流日志
  status_dict: ExpressStatusDict;
  receive_addr: string; //收货地址
}

// 物流日志
interface ExpressLogTypes {
  status: ExpressStatus; //物流状态
  status_name?: ExpressStatusName; //物流状态中文
  location: string; //位置
  remark: string; //信息
  createdAt: string; //创建时间
}

// 物流新增日志参数
export interface ExpressLogReqTypes {
  id: any | ObjectId; //物流id
  status: ExpressStatus; //物流状态
  location: string; //位置
  remark: string; //信息
}
