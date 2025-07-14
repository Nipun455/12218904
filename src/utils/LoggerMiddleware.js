export const logEvent = (msg) => {
    const existingLogs = localStorage.getItem('logs');
    const logList = existingLogs ? JSON.parse(existingLogs) : [];
    logList.push({ timestamp: new Date().toISOString(), message: msg });
    localStorage.setItem('logs', JSON.stringify(logList));
  };
  