import { createPinia, defineStore } from "pinia";
import type { UserTypes } from "types/server";

const pinia = createPinia();

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userInfo: {} as UserTypes | any,
  }),
  actions: {
    setUserInfo(userInfo: UserTypes | any) {
      this.userInfo = userInfo;
    },
    async logout() {
      this.userInfo = {};
      uni.removeStorageSync("token");
      uni.removeStorageSync("userInfo");
    },
    getUserInfo(): UserTypes | null {
      // 判断是否登录 没登录跳到登录页面
      const userInfo = uni.getStorageSync("userInfo") as UserTypes | any;
      if (!userInfo?._id) {
        uni.showToast({
          title: "请先登录",
        });
        uni.navigateTo({
          url: "/pages/login/index",
        });
        return null;
      } else {
        return userInfo;
      }
    },
  },
});

export default pinia;
