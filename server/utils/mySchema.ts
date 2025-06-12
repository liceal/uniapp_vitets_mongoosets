// baseSchema.ts
import mongoose, { mongo } from "mongoose";
import moment from "moment";

/*
mongoose.SchemaOptions<any> 这个any 解决跟 mongoose.SchemaDefinition 的docType类型匹配问题
因为SchemaDefinition里面是any

*/
export interface MySchemaOptions extends mongoose.SchemaOptions<any> {
  /**
   * 日期格式化字符串，用于格式化 createdAt/updatedAt/deletedAt 字段
   * 默认格式: 'YYYY-MM-DD HH:mm:ss'
   * 例如:
   * - 'YYYY/MM/DD' => 2023/01/01
   * - 'MM-DD-YYYY HH:mm' => 01-01-2023 14:30
   */
  timestampFormat?: string;

  /**
   * 是否禁用自动添加时间戳字段（createdAt/updatedAt）
   * 默认为 false（即自动添加）
   * 设为 true 时，需要手动定义日期字段
   */
  disableTimestamps?: boolean;

  /**
   * 是否启用软删除功能
   * 默认为 false（物理删除）
   * 设为 true 时，会自动添加 deletedAt 和 isDeleted 字段
   */
  softDelete?: boolean;
}

/**
 * 基础 Schema 类
 * 提供以下功能:
 * 1. 自动标准化日期字段（带格式化）
 * 2. 可选软删除支持
 * 3. 统一 Schema 配置
 */
export class MySchema<T = unknown> extends mongoose.Schema<T> {
  constructor(
    definition: mongoose.SchemaDefinition<T>, //继承上面的类型
    options: MySchemaOptions = {}
  ) {
    // 合并默认选项
    const mergedOptions: MySchemaOptions = {
      versionKey: false,
      id: true,
      timestamps: !options.disableTimestamps,
      // JSON 序列化配置
      toJSON: {
        virtuals: true, // 包含虚拟字段
        getters: true, // 应用字段的 getter 方法
        transform: (doc, ret: Record<string, any>) => {
          // 转换函数：在转为 JSON 时执行
          // 是否进行日期格式化
          if (!options.disableTimestamps) {
            if (ret.createdAt) {
              ret.createdAt = moment(ret.createdAt).format(
                options.timestampFormat || "YYYY-MM-DD HH:mm:ss"
              ); // 格式化 createdAt 字段
            }
            if (ret.updatedAt) {
              ret.updatedAt = moment(ret.updatedAt).format(
                options.timestampFormat || "YYYY-MM-DD HH:mm:ss"
              ); // 格式化 updatedAt 字段
            }
          }
          return ret;
        },
      },

      // 用户配置覆盖
      ...options,
    };

    // ========== 3. 处理软删除 ========== //
    if (options.softDelete) {
      Object.assign(definition, {
        // 删除时间标记
        deletedAt: {
          type: Date,
          get: (date: Date) =>
            date &&
            moment(date).format(
              options.timestampFormat || "YYYY-MM-DD HH:mm:ss"
            ),
        },

        // 软删除状态标识
        isDeleted: {
          type: Boolean,
          default: false, // 默认未删除
          index: true, // 为查询效率添加索引
        },
      });

      // 注意：实际软删除逻辑需要额外中间件实现
      // 建议在具体 Model 中添加 pre('remove') 钩子
    }

    // ========== 4. 初始化父类 ========== //
    super(definition, mergedOptions);

    // ========== 5. 注册全局钩子 ========== //
    this.registerGlobalHooks();
  }

  /**
   * 注册全局中间件（所有继承的 Schema 都会拥有）
   * 私有方法，仅在类内部使用
   */
  private registerGlobalHooks() {
    // 文档保存前的通用逻辑
    this.pre("save", function (next) {
      // const doc = this as mongoose.Document;

      // console.log("调用了mySchema的pre方法", this);

      // 示例：自动设置 slug（可根据需要修改）
      // if (doc.isModified('name') && !doc.slug) {
      //   doc.slug = generateSlug(doc.name);
      // }

      next();
    });

    // 可添加更多通用中间件...
  }

  /**
   * 静态日期格式化工具方法
   * 可在模型层直接调用，例如：BaseSchema.formatDate(new Date())
   * @param date - 要格式化的日期对象
   * @param format - 目标格式（默认 'YYYY-MM-DD HH:mm:ss'）
   * @returns 格式化后的日期字符串
   */
  static formatDate(date: Date, format = "YYYY-MM-DD HH:mm:ss"): string {
    return moment(date).format(format);
  }
}
