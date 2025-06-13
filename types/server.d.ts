import { ObjectId } from "mongoose";

// 分页参数

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
}

// 状态枚举 1全部 10拼团中 20打包中 30待收获 40已完成
type OrderStatus = 1 | 10 | 20 | 30 | 40 | 50;
export interface OrderTypes extends GoodsAttrs {
  id: any | ObjectId; //主键
  shopId: any | ObjectId; //订单id
  goodsId: any | ObjectId; //商品id
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
  statusName: "待付款" | "拼团中" | "打包中" | "待收货" | "已完成";
}
