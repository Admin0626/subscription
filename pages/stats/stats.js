const app = getApp();
const util = require('../../utils/util.js');

const COLORS = ['#a23d33', '#006d33', '#2f6a3f', '#6c7b6c', '#007AFF', '#FF9500'];
const CATEGORY_CN = {
  'entertainment': '娱乐',
  'music': '音乐',
  'productivity': '效率',
  'cloud': '云服务',
  '其他': '其他'
};

Page({
  data: {
    activeTab: 'month',
    subscriptions: [],
    totalSpending: '0',
    trend: 12,
    categoryStats: [],
    donutColors: '',
    topSubscriptions: [],
    insight: '',
    currentDate: '2026年10月',
    userInfo: {
      avatarUrl: ''
    }
  },

  onLoad() {
    this.calculate();
  },

  onShow() {
    this.calculate();
  },

  calculate() {
    let rawList = app.globalData.subscriptions || [];
    if (!rawList || rawList.length === 0) {
      const stored = wx.getStorageSync('subscriptions');
      rawList = stored || [];
      if (rawList.length > 0) {
        app.globalData.subscriptions = rawList;
      }
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    this.setData({
      currentDate: `${currentYear}年${currentMonth}月`
    });

    if (rawList.length === 0) {
      this.setData({
        subscriptions: [],
        totalSpending: '0',
        categoryStats: [],
        donutColors: '',
        topSubscriptions: [],
        insight: ''
      });
      return;
    }

    const subs = rawList.map((item, idx) => {
      const price = item.price || 0;
      const cycle = item.cycle || 'monthly';
      const duration = item.duration || 30;
      
      return {
        ...item,
        price,
        cycle,
        duration,
        monthly: cycle === 'monthly' ? price : (cycle === 'yearly' ? price / 12 : price / 3),
        initial: item.name ? item.name[0] : '?',
        color: COLORS[idx % COLORS.length],
        colorLight: COLORS[idx % COLORS.length] + '80'
      };
    });

    const categoryMap = {};
    let monthlyTotal = 0;
    let yearlyTotal = 0;

    const startOfYear = new Date(now.getFullYear(), 0, 1);

    subs.forEach(sub => {
      const monthlyPrice = sub.monthly;
      monthlyTotal += monthlyPrice;

      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      let actualSpent = 0;

      if (startDate && !isNaN(startDate.getTime())) {
        const effectiveStart = startDate < startOfYear ? startOfYear : startDate;
        const daysSinceStart = Math.floor((now - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
        
        let daysInPeriod = 30;
        if (sub.cycle === 'yearly') daysInPeriod = 365;
        else if (sub.cycle === 'quarterly') daysInPeriod = 90;

        const periodsPassed = Math.floor(daysSinceStart / daysInPeriod);
        actualSpent = periodsPassed * sub.price + (sub.price * (daysSinceStart % daysInPeriod) / daysInPeriod);
      } else {
        actualSpent = monthlyPrice * 12;
      }
      yearlyTotal += actualSpent;

      const cat = '其他';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { monthly: 0, yearly: 0 };
      }
      categoryMap[cat].monthly += monthlyPrice;
      categoryMap[cat].yearly += actualSpent;
    });

    const grandTotal = this.data.activeTab === 'month' ? monthlyTotal : yearlyTotal;

    const categoryStats = subs.map((sub, idx) => {
      const monthlyPrice = sub.monthly;
      let value;
      let percent;

      if (this.data.activeTab === 'month') {
        value = monthlyPrice;
        percent = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
      } else {
        const startDate = sub.startDate ? new Date(sub.startDate) : null;
        let subActualSpent = 0;
        if (startDate && !isNaN(startDate.getTime())) {
          const effectiveStart = startDate < startOfYear ? startOfYear : startDate;
          const daysSinceStart = Math.floor((now - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
          let daysInPeriod = 30;
          if (sub.cycle === 'yearly') daysInPeriod = 365;
          else if (sub.cycle === 'quarterly') daysInPeriod = 90;
          const periodsPassed = Math.floor(daysSinceStart / daysInPeriod);
          subActualSpent = periodsPassed * sub.price + (sub.price * (daysSinceStart % daysInPeriod) / daysInPeriod);
        } else {
          subActualSpent = monthlyPrice * 12;
        }
        value = subActualSpent;
        percent = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
      }
      
      return {
        name: sub.name,
        amount: value.toFixed(0),
        percent: percent.toFixed(0),
        color: COLORS[idx % COLORS.length]
      };
    }).sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));

    let cumulativePercent = 0;
    const donutColors = categoryStats.map((item, idx) => {
      const color = COLORS[idx % COLORS.length];
      const start = cumulativePercent;
      cumulativePercent += parseFloat(item.percent);
      return `${color} ${start.toFixed(1)}% ${cumulativePercent.toFixed(1)}%`;
    }).join(', ');

    const getActualSpent = (sub) => {
      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      if (startDate && !isNaN(startDate.getTime())) {
        const start = startDate < startOfYear ? startOfYear : startDate;
        const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
        let daysInPeriod = 30;
        if (sub.cycle === 'yearly') daysInPeriod = 365;
        else if (sub.cycle === 'quarterly') daysInPeriod = 90;
        const periodsPassed = Math.floor(daysSinceStart / daysInPeriod);
        return periodsPassed * sub.price + (sub.price * (daysSinceStart % daysInPeriod) / daysInPeriod);
      }
      return sub.monthly * 12;
    };

    const topSubscriptions = [...subs]
      .sort((a, b) => {
        const aValue = this.data.activeTab === 'month' ? a.monthly : getActualSpent(a);
        const bValue = this.data.activeTab === 'month' ? b.monthly : getActualSpent(b);
        return bValue - aValue;
      })
      .slice(0, 5)
      .map((sub, idx) => {
        const monthlyPrice = sub.monthly;
        let value;
        let percent;

        if (this.data.activeTab === 'month') {
          value = monthlyPrice;
          percent = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
        } else {
          const startDate = sub.startDate ? new Date(sub.startDate) : null;
          let subActualSpent = 0;
          if (startDate && !isNaN(startDate.getTime())) {
            const effectiveStart = startDate < startOfYear ? startOfYear : startDate;
            const daysSinceStart = Math.floor((now - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
            let daysInPeriod = 30;
            if (sub.cycle === 'yearly') daysInPeriod = 365;
            else if (sub.cycle === 'quarterly') daysInPeriod = 90;
            const periodsPassed = Math.floor(daysSinceStart / daysInPeriod);
            subActualSpent = periodsPassed * sub.price + (sub.price * (daysSinceStart % daysInPeriod) / daysInPeriod);
          } else {
            subActualSpent = monthlyPrice * 12;
          }
          value = subActualSpent;
          percent = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
        }
        
        return {
          ...sub,
          monthly: value.toFixed(0),
          percent: percent.toFixed(0),
          color: COLORS[idx % COLORS.length],
          colorLight: COLORS[idx % COLORS.length] + '80'
        };
      });

    const insight = `您本月共 ${subs.length} 个订阅，总支出 ¥${grandTotal.toFixed(0)}`;

    // Calculate trend vs last month
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    let lastMonthTotal = 0;

    subs.forEach(sub => {
      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      if (startDate && !isNaN(startDate.getTime())) {
        if (startDate > lastMonthEnd) return;
        
        const effectiveStart = startDate < lastMonth ? lastMonth : startDate;
        const daysInMonth = lastMonthEnd.getDate();
        const daysInPeriod = sub.cycle === 'yearly' ? 365 : (sub.cycle === 'quarterly' ? 90 : 30);
        const dailyPrice = sub.price / daysInPeriod;
        
        if (startDate <= lastMonthEnd) {
          const startDay = effectiveStart.getDate();
          const daysInLastMonth = lastMonthEnd.getDate();
          const daysUsed = Math.min(daysInLastMonth - startDay + 1, daysInLastMonth);
          lastMonthTotal += dailyPrice * daysUsed;
        }
      } else {
        const daysInPeriod = sub.cycle === 'yearly' ? 365 : (sub.cycle === 'quarterly' ? 90 : 30);
        const dailyPrice = sub.price / daysInPeriod;
        lastMonthTotal += dailyPrice * lastMonthEnd.getDate();
      }
    });

    let trend = 0;
    if (lastMonthTotal > 0) {
      trend = ((grandTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0);
    }

    this.setData({
      subscriptions: subs,
      totalSpending: grandTotal.toFixed(0),
      categoryStats,
      donutColors,
      topSubscriptions,
      insight,
      trend: trend != 0 ? trend : null
    });
  },

  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      activeTab: type
    });
    this.calculate();
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goToAdd() {
    wx.switchTab({
      url: '/pages/add/add'
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});