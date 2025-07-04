import { createPinia, defineStore } from "pinia";
import type { UserTypes } from "types/server";

const pinia = createPinia();

export const useUserStore = defineStore("userStore", {
  state: () => ({
    _userInfo: null as UserTypes | null,
  }),
  getters: {
    userInfo(state): UserTypes {
      if (state._userInfo) {
        return state._userInfo as UserTypes;
      } else {
        state._userInfo = uni.getStorageSync("userInfo") as UserTypes | null;
        return state._userInfo as UserTypes;
      }
    },
  },
  actions: {
    setUserInfo(userInfo: UserTypes | any, token?: string) {
      this._userInfo = userInfo;
      uni.setStorageSync("userInfo", userInfo);
      if (token) {
        uni.setStorageSync("token", token);
      }
    },
    async logout() {
      this._userInfo = null;
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
