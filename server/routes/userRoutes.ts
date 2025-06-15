import { Router } from "express";
import UserControlles from "#/controllers/user";
import CaptchaControlles from "#/controllers/captcha";

const router = Router();

router.post("/create", UserControlles.create);
router.post("/login", UserControlles.login);

router.get("/captcha_cache", UserControlles.captcha_cache);
router.get("/captcha_cache/list", UserControlles.captchaList_chache);

router.get("/captcha", CaptchaControlles.createCaptcha);
router.get("/captcha/list", CaptchaControlles.captchaList);

router.get("/validate", UserControlles.protect, (req, res) => {
  res.status(200).json("登录验证成功");
});

export default router;
