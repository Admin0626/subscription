const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    subscriptions: [],
    sortedList: [],
    currentCycle: 'monthly',
    totalAmount: '0',
    expiringSoon: [],
    userInfo: {
      nickName: '用户'
    },
    theme: 'light'
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    const theme = wx.getStorageSync('theme') || 'light';
    if (this.data.theme !== theme) {
      this.setData({ theme: theme });
    }
    this.loadData();
  },

  onThemeChangePage(theme) {
    this.setData({ theme });
  },

  loadData() {
    let subs = app.globalData.subscriptions || [];
    if (!subs || subs.length === 0) {
      const stored = wx.getStorageSync('subscriptions');
      subs = stored || [];
      if (subs.length > 0) {
        app.globalData.subscriptions = subs;
      }
    }

    const processedSubs = subs.map(item => {
      const cycleInfo = util.getCurrentCycleInfo(item.startDate, item.duration);
      const daysLeft = cycleInfo.daysRemaining;
      let daysClass = 'safe';
      let borderColor = '#07c160';
      let logoBg = '#f1f1f1';
      let urgency = 'normal';
      
      if (daysLeft <= 3) {
        daysClass = 'urgent';
        borderColor = '#ba1a1a';
        urgency = 'critical';
      } else if (daysLeft <= 7) {
        daysClass = 'warning';
        borderColor = '#a23d33';
        urgency = 'warning';
      }

      return {
        ...item,
        daysLeft,
        daysClass,
        borderColor,
        logoBg,
        urgency,
        progress: cycleInfo.progressPercent,
        billedDays: cycleInfo.daysPassed,
        nextDate: util.formatDate(cycleInfo.nextBillingDate),
        cycleText: item.cycle === 'monthly' ? '月度' : '年度'
      };
    });

    const sortedList = [...processedSubs].sort((a, b) => a.daysLeft - b.daysLeft);
    console.log('[首页] 排序后列表:', sortedList);

    const expiring = sortedList
      .filter(item => item.daysLeft <= 15)
      .slice(0, 5);

    let total = 0;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    if (this.data.currentCycle === 'monthly') {
      total = processedSubs.reduce((sum, item) => sum + util.getMonthlyAmount(item.price, item.cycle), 0);
    } else {
      processedSubs.forEach(item => {
        const startDate = item.startDate ? new Date(item.startDate) : null;
        if (!startDate || isNaN(startDate.getTime())) {
          total += util.getMonthlyAmount(item.price, item.cycle) * 12;
          return;
        }
        
        const effectiveStart = startDate < startOfYear ? startOfYear : startDate;
        const daysSinceStart = Math.floor((now - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
        
        let daysInPeriod = 30;
        if (item.cycle === 'yearly') daysInPeriod = 365;
        else if (item.cycle === 'quarterly') daysInPeriod = 90;
        
        const periodsPassed = Math.floor(daysSinceStart / daysInPeriod);
        const actualSpent = periodsPassed * item.price + (item.price * (daysSinceStart % daysInPeriod) / daysInPeriod);
        total += actualSpent;
      });
    }

    this.setData({
      subscriptions: processedSubs,
      sortedList: sortedList,
      expiringSoon: expiring,
      totalAmount: total.toFixed(0)
    });
  },

  switchCycle(e) {
    const cycle = e.currentTarget.dataset.cycle;
    this.setData({ currentCycle: cycle });
    this.loadData();
  },

    goToSettings() {
      wx.navigateTo({
        url: '/pages/settings/settings'
      });
    },

    navToSettings() {
      wx.navigateTo({
        url: '/pages/settings/settings'
      });
    },

    onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('[首页] 点击订阅 ID:', id);
    if (!id) return;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  goToAdd() {
    wx.switchTab({
      url: '/pages/add/add'
    });
  },

  goToStats() {
    wx.switchTab({
      url: '/pages/stats/stats'
    });
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});