// app.js
App({
  globalData: {
    subscriptions: [],
    userInfo: null,
    theme: 'light'
  },

  onLaunch() {
    const savedData = wx.getStorageSync('subscriptions');
    if (savedData) {
      this.globalData.subscriptions = savedData;
    }

    const savedTheme = wx.getStorageSync('theme') || 'light';
    this.globalData.theme = savedTheme;
    this.applyTheme(savedTheme);
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
  },

  setTheme(theme) {
    this.globalData.theme = theme;
    wx.setStorageSync('theme', theme);
    this.applyTheme(theme);
  },

  applyTheme(theme) {
    const isDark = theme === 'dark';
    console.log('[Theme] applyTheme:', theme);

    wx.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#121212' : '#f9f9fb',
      animation: { duration: 300, timingFunc: 'easeInOut' }
    });

    wx.setTabBarStyle({
      backgroundColor: isDark ? '#121212' : '#f9f9fb',
      borderStyle: 'black',
      color: isDark ? '#a0a0a0' : '#8a8a8a',
      selectedColor: isDark ? '#00c853' : '#006d33'
    });

    // Force page dark class via setPageStyle
    if (wx.setPageStyle) {
      const pages = getCurrentPages();
      pages.forEach(page => {
        if (page) {
          wx.setPageStyle({
            pageId: page.__pageId || 0,
            style: isDark ? 'page.dark { display: block; }' : ''
          });
        }
      });
    }
  },

  getTheme() {
    return this.globalData.theme;
  }
});