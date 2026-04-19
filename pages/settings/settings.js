const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    pageClass: '',
    theme: 'light',
    stats: { activeCount: 0, totalSpent: 0 },
    showDatePicker: false,
    dateRangeType: 'all',
    customStartDate: '',
    customEndDate: '',
    pickerRange: []
  },

  onLoad() {
    this.syncTheme();
  },

  onShow() {
    this.syncTheme();
    const subs = app.globalData.subscriptions || [];
    const totalSpent = subs.reduce((sum, item) => {
      const monthly = item.cycle === 'monthly' ? item.price : item.price / 12;
      return sum + monthly;
    }, 0);

    this.setData({
      'stats.activeCount': subs.length,
      'stats.totalSpent': totalSpent.toFixed(2)
    });
  },

  syncTheme() {
    const theme = app.getEffectiveTheme ? app.getEffectiveTheme() : 'light';
    this.setData({ theme, pageClass: theme === 'dark' ? 'dark' : '' });
  },

  onToggleTheme() {
    const theme = app.getEffectiveTheme ? app.getEffectiveTheme() : 'light';
    const newMode = theme === 'dark' ? 'light' : 'dark';
    app.setThemeMode(newMode);
    this.setData({ theme: newMode, pageClass: newMode === 'dark' ? 'dark' : '' });
  },

  onExportData() {
    const subs = app.globalData.subscriptions || [];
    if (subs.length === 0) {
      wx.showToast({ title: '暂无数据可导出', icon: 'none' });
      return;
    }

    const that = this;
    wx.showActionSheet({
      itemList: ['全部', '本月', '本季度', '本年', '自定义'],
      success(res) {
        const typeMap = ['all', 'month', 'quarter', 'year', 'custom'];
        const selectedType = typeMap[res.tapIndex];

        if (selectedType === 'custom') {
          that.showCustomDatePicker();
        } else {
          that.doExport(selectedType);
        }
      }
    });
  },

  showCustomDatePicker() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    this.setData({
      showDatePicker: true,
      dateRangeType: 'custom',
      customStartDate: `${year}-01-01`,
      customEndDate: today
    });
  },

  onPickerClose() {
    this.setData({ showDatePicker: false });
  },

  onStartDateChange(e) {
    this.setData({ customStartDate: e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ customEndDate: e.detail.value });
  },

  onConfirmDate() {
    const { customStartDate, customEndDate } = this.data;
    if (new Date(customStartDate) > new Date(customEndDate)) {
      wx.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' });
      return;
    }
    this.setData({ showDatePicker: false });
    this.doExport('custom');
  },

  doExport(rangeType) {
    wx.showLoading({ title: '正在生成...' });

    const subs = app.globalData.subscriptions || [];
    const allRecords = util.getAllPaymentRecords(subs);
    
    const customRange = rangeType === 'custom' ? {
      startDate: this.data.customStartDate,
      endDate: this.data.customEndDate
    } : {};

    const filteredRecords = util.filterRecordsByDateRange(allRecords, rangeType, customRange);

    if (filteredRecords.length === 0) {
      wx.hideLoading();
      wx.showToast({ title: '所选范围内无扣费记录', icon: 'none' });
      return;
    }

    const csvContent = util.generatePaymentCSV(filteredRecords);
    const rangeLabel = util.getDateRangeLabel(rangeType, customRange);

    const fileName = `账单_${rangeLabel}_${Date.now()}.csv`;
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;

    const fs = wx.getFileSystemManager();
    
    fs.writeFile({
      filePath: filePath,
      data: csvContent,
      encoding: 'utf8',
      success() {
        wx.hideLoading();
        wx.openDocument({
          filePath: filePath,
          fileType: 'csv',
          success() {
            wx.showToast({ title: '导出成功', icon: 'success' });
          },
          fail(err) {
            wx.showToast({ title: '打开文件失败', icon: 'none' });
          }
        });
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({ title: '生成文件失败', icon: 'none' });
      }
    });
  },

  onFeedback() {
    wx.setClipboardData({
      data: 'zmfzsq2427280601',
      success: () => {
        wx.showToast({ title: '客服微信已复制', icon: 'success' });
      }
    });
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
          this.onShow();
        }
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
});