const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    subscription: null,
    nextDate: '',
    daysUsed: 0,
    progressPercent: 0,
    totalSpent: 0,
    currentCycleStart: '',
    paymentHistory: [],
    theme: 'light'
  },

  onLoad(options) {
    const theme = wx.getStorageSync('theme') || 'light';
    this.setData({ theme: theme });

    const id = options.id;

    if (!id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      wx.navigateBack();
      return;
    }

    const subs = app.globalData.subscriptions || [];
    const item = subs.find(s => s.id === id);

    if (!item) {
      wx.showToast({ title: '数据丢失', icon: 'none' });
      wx.navigateBack();
      return;
    }

    const currentCycleInfo = util.getCurrentCycleInfo(item.startDate, item.duration);
    const daysUsed = currentCycleInfo.daysPassed;
    const progressPercent = currentCycleInfo.progressPercent;
    const currentCycleStart = currentCycleInfo.cycleStartDate;
    const nextDate = util.formatDate(currentCycleInfo.nextBillingDate);

    const startDate = item.startDate ? new Date(item.startDate) : null;
    const now = new Date();
    let totalSpent = 0;
    let paymentHistory = [];

    if (startDate && !isNaN(startDate.getTime())) {
      const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const duration = item.duration || 30;
      const periodsPassed = Math.floor(daysSinceStart / duration);
      totalSpent = periodsPassed * item.price;

      for (let i = periodsPassed - 1; i >= 0; i--) {
        const paymentDate = new Date(startDate);
        paymentDate.setDate(paymentDate.getDate() + i * duration);
        
        if (paymentDate <= now) {
          paymentHistory.push({
            date: this.formatDateFull(paymentDate),
            price: item.price,
            status: 'paid'
          });
        }
      }
    }

    this.setData({
      subscription: item,
      nextDate,
      daysUsed,
      progressPercent,
      totalSpent,
      currentCycleStart,
      paymentHistory
    });
  },

  onShow() {
    const theme = wx.getStorageSync('theme') || 'light';
    if (this.data.theme !== theme) {
      this.setData({ theme: theme });
    }
  },

  formatDateFull(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  },

  onThemeChangePage(theme) {
    this.setData({ theme });
  },

  onEdit() {
    const item = this.data.subscription;
    wx.navigateTo({
      url: `/pages/add/add?id=${item.id}&name=${encodeURIComponent(item.name)}&price=${item.price}&cycle=${item.cycle}&startDate=${item.startDate}&reminder=${item.reminder ? 1 : 0}&logoUrl=${encodeURIComponent(item.logoUrl || '')}&logoBg=${encodeURIComponent(item.logoBg || '')}`
    });
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${this.data.subscription.name}」吗？`,
      confirmText: '删除',
      confirmColor: '#ba1a1a',
      success: (res) => {
        if (res.confirm) {
          this.doDelete();
        }
      }
    });
  },

  doDelete() {
    const id = this.data.subscription.id;

    const subs = app.globalData.subscriptions || [];
    const newSubs = subs.filter(item => item.id !== id);
    app.globalData.subscriptions = newSubs;
    wx.setStorageSync('subscriptions', newSubs);

    wx.showToast({ title: '已删除', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});