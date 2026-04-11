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

module.exports = {
  formatAmount,
  getCycleText,
  getDaysUntil,
  getProgressPercent,
  formatDate,
  getMonthlyAmount,
  getCurrentCycleInfo
};
