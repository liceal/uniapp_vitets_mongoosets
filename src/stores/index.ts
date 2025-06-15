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
    },
  },
});

export default pinia;
