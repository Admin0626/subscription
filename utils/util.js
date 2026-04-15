// 工具函数

const formatAmount = (amount) => {
  return `¥${Number(amount).toFixed(2)}`;
};

const getCycleText = (cycle) => {
  return cycle === 'monthly' ? '/月' : '/年';
};

const getDaysUntil = (startDate, duration) => {
  const now = new Date();
  const start = new Date(startDate);
  const nextBilling = new Date(start);
  
  while (nextBilling <= now) {
    nextBilling.setDate(nextBilling.getDate() + duration);
  }
  
  const diffTime = nextBilling - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getProgressPercent = (startDate, duration) => {
  const daysUntil = getDaysUntil(startDate, duration);
  return Math.round(((duration - daysUntil) / duration) * 100);
};

const getCurrentCycleInfo = (startDate, duration) => {
  const now = new Date();
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  
  if (daysSinceStart < 0) {
    return {
      cycleStartDate: startDate,
      nextBillingDate: new Date(start.getTime() + duration * 24 * 60 * 60 * 1000),
      daysPassed: 0,
      daysRemaining: duration,
      progressPercent: 0
    };
  }
  
  const cycleNumber = Math.floor(daysSinceStart / duration);
  const cycleStart = new Date(start);
  cycleStart.setDate(cycleStart.getDate() + cycleNumber * duration);
  
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + duration);
  
  const daysPassedInCycle = daysSinceStart - cycleNumber * duration;
  const daysRemainingInCycle = duration - daysPassedInCycle;
  const progressPercent = Math.round((daysPassedInCycle / duration) * 100);
  
  return {
    cycleStartDate: cycleStart.toISOString().split('T')[0],
    nextBillingDate: cycleEnd,
    daysPassed: daysPassedInCycle,
    daysRemaining: daysRemainingInCycle,
    progressPercent
  };
};

const formatDate = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日`;
};

const getMonthlyAmount = (price, cycle) => {
  return cycle === 'monthly' ? price : (price / 12);
};

const getAllPaymentRecords = (subscriptions) => {
  const records = [];
  const now = new Date();

  subscriptions.forEach(sub => {
    if (!sub.startDate) return;
    
    const startDate = new Date(sub.startDate);
    const duration = sub.duration || 30;

    if (isNaN(startDate.getTime())) return;

    let paymentDate = new Date(startDate);
    while (paymentDate <= now) {
      records.push({
        name: sub.name,
        date: paymentDate.toISOString().split('T')[0],
        price: sub.price,
        status: 'paid'
      });
      paymentDate.setDate(paymentDate.getDate() + duration);
    }
  });

  records.sort((a, b) => new Date(b.date) - new Date(a.date));
  return records;
};

const filterRecordsByDateRange = (records, rangeType, customRange = {}) => {
  const now = new Date();
  let startDate, endDate;

  const getMonthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getMonthEnd = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const getQuarterStart = (date) => new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
  const getQuarterEnd = (date) => {
    const quarterEndMonth = (Math.floor(date.getMonth() / 3) + 1) * 3 - 1;
    return new Date(date.getFullYear(), quarterEndMonth, 0);
  };
  const getYearStart = (date) => new Date(date.getFullYear(), 0, 1);
  const getYearEnd = (date) => new Date(date.getFullYear(), 11, 31);

  switch (rangeType) {
    case 'month':
      startDate = getMonthStart(now);
      endDate = getMonthEnd(now);
      break;
    case 'quarter':
      startDate = getQuarterStart(now);
      endDate = getQuarterEnd(now);
      break;
    case 'year':
      startDate = getYearStart(now);
      endDate = getYearEnd(now);
      break;
    case 'custom':
      startDate = new Date(customRange.startDate);
      endDate = new Date(customRange.endDate);
      break;
    default:
      return records;
  }

  return records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

const generatePaymentCSV = (records) => {
  const header = '\uFEFF服务名称,扣费日期,金额,状态\n';
  const rows = records.map(r => 
    `${r.name},${r.date},${r.price.toFixed(2)},已支付`
  ).join('\n');
  return header + rows;
};

const getDateRangeLabel = (rangeType, customRange = {}) => {
  const now = new Date();
  const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  
  switch (rangeType) {
    case 'all': return '全部';
    case 'month': return '本月';
    case 'quarter': return '本季度';
    case 'year': return '本年';
    case 'custom': return `${customRange.startDate} 至 ${customRange.endDate}`;
    default: return '';
  }
};

module.exports = {
  formatAmount,
  getCycleText,
  getDaysUntil,
  getProgressPercent,
  formatDate,
  getMonthlyAmount,
  getCurrentCycleInfo,
  getAllPaymentRecords,
  filterRecordsByDateRange,
  generatePaymentCSV,
  getDateRangeLabel
};
