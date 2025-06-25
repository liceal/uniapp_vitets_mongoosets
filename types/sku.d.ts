import { ObjectId } from "mongoose";
import type { DateTypes } from "./server";

/*
  sku 绑定一个商品
  多个规格组
    规格组里面有属性
      属性有类型，图片或者文字
  
  规格组笛卡尔积，生成唯一规格，每个规格对应商品价格库存
*/

// 商品规格
export interface SkuGroupValueTypes {
  _id: any | ObjectId;
  image: string;
  name: string;
  is_avaliable: Boolean;
  is_fire: Boolean;
  is_check?: boolean; //给前端用的 是否选中
}
// 商品的属性表 定义商品有哪些属性和规格
export interface SkuGroupTypes extends DateTypes {
  _id: any | ObjectId;
  name: string; //属性组名称
  values: SkuGroupValueTypes[]; //多个规格 每个规格有图片和名称和是否可用
}

// sku属性键值对
type SkuAttr = {
  [key: string]: string;
};
// 唯一sku的价格库存
export interface SkuTypes extends DateTypes {
  _id: any | ObjectId;
  goods_id: any | ObjectId;
  attr: SkuAttr;
  image: string; //图片
  price: number; //价格
  stock: number; //库存
}
