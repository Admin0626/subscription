const app = getApp();

Page({
  data: {
    editId: null,
    name: '',
    price: '',
    cycle: 'monthly',
    startDate: '',
    reminder: true,
    showDatePicker: false,
    focused: false,
    selectedService: '',
    isEditing: false,
    theme: 'light',
    cycleOptions: ['monthly', 'quarterly', 'yearly', 'lifetime', 'weekly'],
    cycleLabels: {
      'monthly': '每月',
      'quarterly': '每季度',
      'yearly': '每年',
      'lifetime': '永久',
      'weekly': '每周'
    },
    quickServices: [
      { name: 'Netflix', label: 'Netflix', logoUrl: '', bgColor: '#E50914', emoji: '🎬' },
      { name: 'Spotify', label: 'Spotify', logoUrl: '', bgColor: '#1DB954', emoji: '🎵' },
      { name: 'YouTube', label: 'YouTube', logoUrl: '', bgColor: '#FF0000', emoji: '▶️' },
      { name: 'iCloud', label: 'iCloud', logoUrl: '', bgColor: '#3693F3', emoji: '☁️' },
      { name: 'Notion', label: 'Notion', logoUrl: '', bgColor: '#000000', emoji: '📝' },
      { name: 'ChatGPT', label: 'ChatGPT', logoUrl: '', bgColor: '#10a37f', emoji: '🤖' },
      { name: 'Other', label: '其他', logoUrl: '', bgColor: '#f3f3f5', emoji: '📦' }
    ]
  },

  onLoad(options) {
    const theme = wx.getStorageSync('theme') || 'light';
    this.setData({ theme: theme });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    if (options.id) {
      const subs = app.globalData.subscriptions || [];
      const item = subs.find(s => s.id === options.id);
      
      if (item) {
        this.setData({
          editId: item.id,
          isEditing: true,
          name: item.name || '',
          price: item.price ? String(item.price) : '',
          cycle: item.cycle || 'monthly',
          startDate: item.startDate || `${year}-${month}-${day}`,
          reminder: item.reminder !== undefined ? item.reminder : true,
          logoUrl: item.logoUrl || '',
          logoBg: item.logoBg || '#f1f1f1',
          selectedService: item.name || ''
        });
        return;
      }
    }
    
    this.setData({
      startDate: `${year}-${month}-${day}`
    });
  },

  onShow() {
    const theme = wx.getStorageSync('theme') || 'light';
    if (this.data.theme !== theme) {
      this.setData({ theme: theme });
    }
  },

  onInputChange(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.setData({
      [key]: value
    });
  },

  clearName() {
    this.setData({ name: '' });
  },

  onSearchFocus() {
    this.setData({ focused: true });
  },

  onSearchBlur() {
    this.setData({ focused: false });
  },

  onThemeChangePage(theme) {
    this.setData({ theme });
  },

  selectQuickService(e) {
    const item = e.currentTarget.dataset.item;
    if (item.name === 'Other') {
      return;
    }
    this.setData({
      name: item.name,
      logoUrl: item.logoUrl,
      logoBg: item.bgColor,
      selectedService: item.name
    });
  },

  onCycleChange(e) {
    const value = e.currentTarget.dataset.value;
    if (value) {
      this.setData({ cycle: value });
    } else {
      const idx = e.detail.value;
      const cycle = this.data.cycleOptions[idx];
      this.setData({ cycle });
    }
  },

  onDateTap() {
    this.setData({ showDatePicker: true });
  },

  onDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      showDatePicker: false
    });
  },

  onDatePickerClose() {
    this.setData({ showDatePicker: false });
  },

  onReminderChange(e) {
    this.setData({ reminder: e.detail.value });
  },

  onCancel() {
    wx.navigateBack();
  },

  onSubmit() {
    const { editId, name, price, cycle, startDate, reminder, logoUrl, logoBg } = this.data;

    if (!name.trim() || !price || parseFloat(price) <= 0) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const durationMap = {
      'monthly': 30,
      'quarterly': 90,
      'yearly': 365,
      'lifetime': 3650,
      'weekly': 7
    };

    const list = app.globalData.subscriptions || [];

    if (editId) {
      const index = list.findIndex(item => item.id === editId);
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
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: name.trim(),
        price: parseFloat(price),
        cycle,
        startDate,
        duration: durationMap[cycle] || 30,
        category: 'entertainment',
        logoUrl: logoUrl || '',
        logoBg: logoBg || '#f1f1f1',
        reminder
      };
      list.push(newItem);
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
    }

    app.globalData.subscriptions = list;
    wx.setStorageSync('subscriptions', list);

    if (!editId) {
      this.setData({
        name: '',
        price: '',
        cycle: 'monthly',
        selectedService: '',
        reminder: true
      });
    }

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});