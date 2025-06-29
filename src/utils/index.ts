/**
 * 后退，如果有上一页则后退 否则到主页
 */
export function back(url?: string) {
  // 有些地址要用switch 否则用navigateTo
  if (url) {
    // 判断是否是tabbar页面
    const isTabBar = ["/pages/index/index", "/pages/mine/index"].includes(url);

    if (isTabBar) {
      uni.switchTab({ url });
    } else {
      uni.navigateTo({ url });
    }
    return;
  }
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
}

export function deepEqual(obj1: any, obj2: any) {
  // 1. 判断基本类型
  if (obj1 === obj2) return true;

  // 2. 检查类型是否为对象或数组
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  // 3. 检查键数量是否一致
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // 4. 递归比较每个键值
  for (const key of keys1) {
    if (!keys2.includes(key)) return false; // 键不同
    if (!deepEqual(obj1[key], obj2[key])) return false; // 值不同
  }

  return true;
}

/**
 * 复制文本
 * @param data 复制的内容
 */
export function copy(data: string) {
  // 复制文本到剪贴板
  uni.setClipboardData({
    data: data,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    },
    fail: (err) => {
      console.error("复制失败", err);
    },
  });
}
