module.exports = () => {
  const config = {
    envVariable: 'beta',
    // api path
    API_DOMAIN: {
      API_URL: 'http://172.19.228.109:18080/research/',
    },
    cors: {
      credentials: true,
      allowMethods: 'GET,POST',
    },
    fixedData: {
    },
    customLogger: {
      scheduleLogger: {
        file: process.env.NODE_SCHEDULELOGGER,
      },
    },
    // 日志配置
    logger: {
      dir: process.env.NODE_PROJECT_LOGPATH,
    },
  };

  return config;
};
