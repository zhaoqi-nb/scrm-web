module.exports = () => {
  const config = {
    envVariable: 'prod',
    // api path
    API_DOMAIN: {
      API_URL: 'https://scrm.databurning.com/gateway/',
    },
    cors: {
      origin: (ctx) => ctx.get('origin'),
      credentials: true,
      allowMethods: 'GET,POST',
    },
    customLogger: {
      scheduleLogger: {
        file: process.env.NODE_SCHEDULELOGGER,
      },
    },
    fixedData: {},
    // 日志配置
    logger: {
      dir: process.env.NODE_PROJECT_LOGPATH,
    },
  };

  return config;
};
