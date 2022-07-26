module.exports = () => {
  const config = {
    envVariable: 'test',
    // api path
    API_DOMAIN: {
      API_URL: 'http://testscrm.databurning.com/gateway/',
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
    // httpProxy: {
    //     '/api/specialAnalysis': {
    //         target: 'http://touyan_pingyi.databurning.com',
    //         pathRewrite: { '^/api/specialAnalysis': '/api/specialAnalysis' }
    //     },
    //     '/public/dist': {
    //         target: 'http://touyan_pingyi.databurning.com',
    //         pathRewrite: { '^/public/dist': '/public/dist' }
    //     }
    // }
  };

  return config;
};
