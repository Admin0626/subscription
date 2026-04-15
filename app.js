// app.js
App({
  globalData: {
    subscriptions: [],
    userInfo: null
  },

  onLaunch() {
    const savedData = wx.getStorageSync('subscriptions');
    if (savedData) {
      this.globalData.subscriptions = savedData;
    }
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