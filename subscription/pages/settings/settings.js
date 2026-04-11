const app = getApp();

Page({
  data: {
    userInfo: { nickName: '微信用户', avatarUrl: '' },
    stats: { activeCount: 0, totalSpent: 0 },
    theme: 'light'
  },

  onLoad() {
    const theme = wx.getStorageSync('theme') || 'light';
    this.setData({ theme: theme });
  },

  onShow() {
    const theme = wx.getStorageSync('theme') || 'light';
    const subs = app.globalData.subscriptions || [];
    const totalSpent = subs.reduce((sum, item) => {
      const monthly = item.cycle === 'monthly' ? item.price : item.price / 12;
      return sum + monthly;
    }, 0);

    this.setData({
      'stats.activeCount': subs.length,
      'stats.totalSpent': totalSpent.toFixed(2),
      theme: theme
    });
  },

  onThemeChange(e) {
    const newTheme = e.detail.value ? 'dark' : 'light';
    this.setData({ theme: newTheme });
    app.setTheme(newTheme);
  },

  onClearData() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有订阅数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('subscriptions');
          app.globalData.subscriptions = [];
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  onExportData() {
    wx.showToast({ title: '导出功能开发中', icon: 'none' });
  },

  onFeedback() {
    wx.setClipboardData({
      data: 'zmfzsq2427280601',
      success: () => {
        wx.showToast({ title: '客服微信已复制', icon: 'success' });
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
});