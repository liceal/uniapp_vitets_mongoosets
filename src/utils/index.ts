/**
 * 后退，如果有上一页则后退 否则到主页
 */
export function back() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
}
