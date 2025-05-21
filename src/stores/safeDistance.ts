import { defineStore } from "pinia";

export const useSafeDistanceStore = defineStore("safeDistance", {
  state: () => ({
    topSafeAreaHeight: 0,
  }),
  actions: {
    setTopSafeAreaHeight(height: number | undefined) {
      this.topSafeAreaHeight = height || 0;
    },
  },
});
