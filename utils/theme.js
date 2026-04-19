const app = getApp();

function syncTheme(pageInstance) {
  const theme = app.getEffectiveTheme();
  const themeClass = theme === 'dark' ? 'dark-theme' : '';
  if (pageInstance && pageInstance.setData) {
    pageInstance.setData({
      pageTheme: themeClass,
      isDarkTheme: theme === 'dark'
    });
  }
}

module.exports = {
  syncTheme
};