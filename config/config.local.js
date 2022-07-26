const PATH = require('path');

module.exports = (appInfo) => {
  const config = {
    envVariable: 'local',
    // api path
    API_DOMAIN: {
      API_URL: 'http://testscrm.databurning.com/gateway/'
    },
    // redis cache config
    redis: {
      client: {
        host: '172.19.228.122',
      },
    },
    cors: {
      credentials: true,
      allowMethods: 'GET,POST',
    },
    customLogger: {
      scheduleLogger: {
        // consoleLevel: 'NONE',
        file: PATH.join(appInfo.baseDir, 'logs', 'egg-schedule.log'),
      },
    },
    fixedData: {},
    // log config
    logger: {
      dir: PATH.join(appInfo.baseDir, './logs/'),
    },
  };

  return config;
};
