const app = getApp();

Page({
  data: {
    subscriptionId: null,
    name: '',
    price: '',
    cycle: 'monthly',
    startDate: '',
    reminder: true,
    focused: false,
    selectedService: '',
    logoUrl: '',
    logoBg: '#f1f1f1',
    quickServices: [
      { name: 'Netflix', label: 'Netflix', logoUrl: '../../assets/icons/Netflix.png', bgColor: '#E50914' },
      { name: 'Spotify', label: 'Spotify', logoUrl: '../../assets/icons/Spotify.jpg', bgColor: '#1DB954' },
      { name: 'YouTube', label: 'YouTube', logoUrl: '../../assets/icons/Youtube.png', bgColor: '#FF0000' },
      { name: 'iCloud', label: 'iCloud', logoUrl: '../../assets/icons/iCloud.png', bgColor: '#3693F3' },
      { name: 'Apple Music', label: 'Apple Music', logoUrl: '../../assets/icons/applemusic.png', bgColor: '#FA243C' },
      { name: 'ChatGPT', label: 'ChatGPT', logoUrl: '../../assets/icons/ChatGPT.png', bgColor: '#10a37f' },
      { name: '爱奇艺', label: '爱奇艺', logoUrl: '../../assets/icons/iQIYI.jpg', bgColor: '#00A1D6' },
      { name: '腾讯视频', label: '腾讯视频', logoUrl: '../../assets/icons/TencentVideo.jpg', bgColor: '#FA3F44' },
      { name: 'B站大会员', label: 'B站大会员', logoUrl: '../../assets/icons/Bilibili.png', bgColor: '#FB7299' },
      { name: 'QQ音乐', label: 'QQ音乐', logoUrl: '../../assets/icons/QQMusic.png', bgColor: '#31C27C' },
      { name: '网易云音乐', label: '网易云音乐', logoUrl: '../../assets/icons/NetEaseMusic.png', bgColor: '#E20000' },
      { name: '百度网盘', label: '百度网盘', logoUrl: '../../assets/icons/BaiduNetdisk.png', bgColor: '#4B8F00' },
      { name: 'Claude Code', label: 'Claude Code', logoUrl: '../../assets/icons/Claude.png', bgColor: '#D97706' },
      { name: 'Qwen', label: 'Qwen', logoUrl: '../../assets/icons/Qwen.png', bgColor: '#8338EC' }
    ]
  },

  onLoad(options) {
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

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${year}-${month}-${day}`;

    this.setData({
      subscriptionId: item.id,
      name: item.name || '',
      price: item.price ? String(item.price) : '',
      cycle: item.cycle || 'monthly',
      startDate: item.startDate || defaultDate,
      reminder: item.reminder !== undefined ? item.reminder : true,
      logoUrl: item.logoUrl || '',
      logoBg: item.logoBg || '#f1f1f1',
      selectedService: item.name || ''
    });
  },

  onInputChange(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.setData({ [key]: value });
  },

  clearName() {
    this.setData({ name: '', selectedService: '', logoUrl: '', logoBg: '#f1f1f1' });
  },

  onSearchFocus() {
    this.setData({ focused: true });
  },

  onSearchBlur() {
    this.setData({ focused: false });
  },

  selectQuickService(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      name: item.name,
      logoUrl: item.logoUrl,
      logoBg: item.bgColor,
      selectedService: item.name
    });
  },

  onCycleChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ cycle: value });
  },

  onDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },

  onReminderChange(e) {
    this.setData({ reminder: e.detail.value });
  },

  onCancel() {
    wx.navigateBack();
  },

  onSubmit() {
    const { subscriptionId, name, price, cycle, startDate, reminder, logoUrl, logoBg } = this.data;

    if (!name.trim() || !price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const durationMap = {
      'monthly': 30,
      'quarterly': 90,
      'yearly': 365
    };

    const list = app.globalData.subscriptions || [];
    const index = list.findIndex(item => item.id === subscriptionId);

    if (index !== -1) {
      list[index] = {
        ...list[index],
        name: name.trim(),
        price: parseFloat(price),
        cycle,
        startDate,
        duration: durationMap[cycle] || 30,
        logoUrl: logoUrl || '',
        logoBg: logoBg || '#f1f1f1',
        reminder
      };
    }

    app.globalData.subscriptions = list;
    wx.setStorageSync('subscriptions', list);

    wx.showToast({ title: '更新成功', icon: 'success' });

    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${this.data.name}」吗？`,
      confirmText: '删除',
      confirmColor: '#ba1a1a',
      success: (res) => {
        if (res.confirm) {
          const list = app.globalData.subscriptions || [];
          const newList = list.filter(item => item.id !== this.data.subscriptionId);
          app.globalData.subscriptions = newList;
          wx.setStorageSync('subscriptions', newList);

          wx.showToast({ title: '已删除', icon: 'success' });

          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      }
    });
  }
});