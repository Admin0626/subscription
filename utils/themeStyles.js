const app = getApp();

function getThemeStyles() {
  const theme = app.getEffectiveTheme();
  const isDark = theme === 'dark';

  const lightStyles = {
    container: 'background-color: #f9f9fb;',
    card: 'background-color: #ffffff; border-color: rgba(0,0,0,0.08);',
    text: 'color: #333333;',
    textSecondary: 'color: #666666;',
    textTertiary: 'color: #999999;',
    primary: 'color: #07C160;',
    border: 'border-color: rgba(0,0,0,0.12);',
    divider: 'background-color: rgba(0,0,0,0.08);',
    inputBg: 'background-color: #ffffff;',
    inputText: 'color: #333333;',
    tabActive: 'color: #07C160;',
    tabInactive: 'color: #86868B;',
    navIcon: 'color: #333333;',
    switchBg: 'background-color: #e0e0e0;',
    switchActive: 'background-color: #07C160;',
    mask: 'background-color: rgba(0,0,0,0.5);',
    btnPrimary: 'background-color: #07C160; color: #ffffff;',
    btnSecondary: 'background-color: #f5f5f5; color: #333333;',
    logoBg: 'background-color: #f1f1f1;',
    tagSafe: 'background-color: rgba(7,193,96,0.1); color: #07C160;',
    tagWarning: 'background-color: rgba(255,153,0,0.1); color: #ff9900;',
    tagUrgent: 'background-color: rgba(186,26,26,0.1); color: #ba1a1a;',
    progressBg: 'background-color: #e0e0e0;',
    progressFill: 'background-color: #07C160;',
    emptyText: 'color: #999999;'
  };

  const darkStyles = {
    container: 'background-color: #121212;',
    card: 'background-color: #1e1e1e; border-color: rgba(255,255,255,0.12);',
    text: 'color: #ffffff;',
    textSecondary: 'color: #b0b0b0;',
    textTertiary: 'color: #707070;',
    primary: 'color: #4cd964;',
    border: 'border-color: rgba(255,255,255,0.15);',
    divider: 'background-color: rgba(255,255,255,0.12);',
    inputBg: 'background-color: #2a2a2a;',
    inputText: 'color: #ffffff;',
    tabActive: 'color: #4cd964;',
    tabInactive: 'color: #a0a0a0;',
    navIcon: 'color: #ffffff;',
    switchBg: 'background-color: #3a3a3a;',
    switchActive: 'background-color: #4cd964;',
    mask: 'background-color: rgba(0,0,0,0.7);',
    btnPrimary: 'background-color: #4cd964; color: #000000;',
    btnSecondary: 'background-color: #2a2a2a; color: #ffffff;',
    logoBg: 'background-color: #2a2a2a;',
    tagSafe: 'background-color: rgba(76,217,100,0.2); color: #4cd964;',
    tagWarning: 'background-color: rgba(255,193,7,0.2); color: #ffc107;',
    tagUrgent: 'background-color: rgba(255,82,82,0.2); color: #ff5252;',
    progressBg: 'background-color: #3a3a3a;',
    progressFill: 'background-color: #4cd964;',
    emptyText: 'color: #707070;'
  };

  return isDark ? darkStyles : lightStyles;
}

function syncThemeStyles(pageInstance) {
  const styles = getThemeStyles();
  if (pageInstance && pageInstance.setData) {
    pageInstance.setData({ styles });
  }
}

module.exports = {
  getThemeStyles,
  syncThemeStyles
};