import { Addresses } from "#/models/addresses";
import { generateRoutes } from "#/utils/crudFactory";
import { type Request, type Response, Router } from "express";

const router = Router();

generateRoutes(router, Addresses);

router.post("/top", async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "ID不能为空" });
    return;
  }

  const address = await Addresses.findById(id);
  if (!address) {
    res.status(404).json({ message: "未找到地址" });
    return;
  }
  const maxOrderDoc = await Addresses.findOne().sort("-order");
  const maxOrder = maxOrderDoc?.order || 0;

  address.order = maxOrder + 1;

  if (address.is_top) {
    // 已置顶 取消置顶
    address.is_top = false;
  } else {
    address.is_top = true;
  }
  await address?.save();

  res.status(200).json(address);
});

router.post("/set_default", async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "ID不能为空" });
    return;
  }

  // 开启事务
  const session = await Addresses.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. 检查目标地址是否存在
      const address = await Addresses.findById(id).session(session);
      if (!address) {
        throw new Error("未找到地址");
      }

      // 如果当前这个是非默认的 就代表有一个默认的地址 取消这个默认地址
      if (!address.is_default) {
        // 2. 查找当前默认地址（如果存在），并取消默认
        const currentDefault = await Addresses.findOne({
          is_default: true,
          _id: { $ne: id },
        }).session(session);
        if (currentDefault) {
          currentDefault.is_default = false;
          await currentDefault.save({ session });
        }
      }

      address.is_default = true;
      await address.save({ session });
      res.status(200).json(address);
    });
  } catch (err: any) {
    console.log("设置默认地址出错：", err);
    if (err.message === "未找到地址") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message || "服务器内部错误" });
    }
  } finally {
    session.endSession();
  }
});

export const addressesRoutes = router;
