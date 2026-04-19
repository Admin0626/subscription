// app.js

// Tonal Architecture - 主题配色常量
const THEME_COLORS = {
  light: {
    // 导航栏
    navBackground: '#ffffff',
    navFrontColor: '#000000',
    // 页面背景
    pageBackground: '#f9f9fb',
    // TabBar
    tabColor: '#8e8e93',
    tabSelectedColor: '#07c160',
    tabBackground: '#ffffff',
    tabBorderStyle: 'black'
  },
  dark: {
    // 导航栏
    navBackground: '#121212',
    navFrontColor: '#ffffff',
    // 页面背景
    pageBackground: '#121212',
    // TabBar
    tabColor: '#98989d',
    tabSelectedColor: '#00c853',
    tabBackground: '#121212',
    tabBorderStyle: 'white'
  }
};

App({
  globalData: {
    subscriptions: [],
    userInfo: null,
    themeMode: 'system'
  },

  onLaunch() {
    // 1. 加载订阅数据
    const savedData = wx.getStorageSync('subscriptions');
    if (savedData) {
      this.globalData.subscriptions = savedData;
    }

    // 2. 加载主题设置
    const savedTheme = wx.getStorageSync('themeMode');
    if (savedTheme) {
      this.globalData.themeMode = savedTheme;
    }

    // 3. 监听系统主题变化
    wx.onThemeChange(() => {
      this.applyTheme();
    });

    // 4. 初始化原生层主题（首次启动防闪白/闪黑）
    this.applyTheme();
  },

  // 设置主题模式（手动切换）
  setThemeMode(mode) {
    console.log('[App] setThemeMode:', mode);
    this.globalData.themeMode = mode;
    wx.setStorageSync('themeMode', mode);
    this.applyTheme();
  },

  // 获取当前生效主题
  getEffectiveTheme() {
    const mode = this.globalData.themeMode;
    if (mode === 'system') {
      const sysInfo = wx.getSystemInfoSync();
      return sysInfo.theme || 'light';
    }
    console.log('[App] getEffectiveTheme:', mode);
    return mode;
  },

  // 全局主题管理器 - 原生层同步
  applyTheme() {
    const theme = this.getEffectiveTheme();
    const isDark = theme === 'dark';
    const colors = THEME_COLORS[theme] || THEME_COLORS.light;
    const pageClass = isDark ? 'dark' : '';

    console.log('[App] applyTheme:', theme, 'navBg:', colors.navBackground, 'navTxt:', colors.navFrontColor);

    // 1. 顶部导航栏 - 300ms 动画防闪烁
    wx.setNavigationBarColor({
      frontColor: colors.navFrontColor,
      backgroundColor: colors.navBackground,
      animation: { duration: 300, timingFunc: 'easeIn' },
      success: () => console.log('[App] navBar set success'),
      fail: (err) => console.log('[App] navBar set fail', err)
    });

    // 2. 页面背景
    wx.setBackgroundColor({
      backgroundColor: colors.pageBackground,
      backgroundColorTop: colors.pageBackground,
      backgroundColorBottom: colors.pageBackground
    });

    // 3. 底部 TabBar
    wx.setTabBarStyle({
      color: colors.tabColor,
      selectedColor: colors.tabSelectedColor,
      backgroundColor: colors.tabBackground,
      borderStyle: colors.tabBorderStyle,
      animation: { duration: 300 }
    });

    // 4. 广播主题到所有页面
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page && page.setData) {
        page.setData({ theme, pageClass });
        // 触发页面 onThemeChange 回调（如有）
        page.onThemeChange?.(theme);
        console.log('[App] sync to:', page.route);
      }
    });
  },

  saveSubscriptions() {
    wx.setStorageSync('subscriptions', this.globalData.subscriptions);
  },

  addSubscription(sub) {
    this.globalData.subscriptions.push({
      ...sub,
      id: Date.now().toString()
    });
    this.saveSubscriptions();
  },

  deleteSubscription(id) {
    this.globalData.subscriptions = this.globalData.subscriptions.filter(item => item.id !== id);
    this.saveSubscriptions();
  },

  getTotalMonthly() {
    const util = require('./utils/util.js');
    return this.globalData.subscriptions.reduce((sum, sub) => {
      return sum + util.getMonthlyAmount(sub.price, sub.cycle);
    }, 0);
  }
});