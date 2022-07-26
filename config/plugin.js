module.exports = {
  // template
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  // redis cache
  // redis: {
  //   enable: true,
  //   package: 'egg-redis',
  // },
  // Print log
  logrotator: {
    enable: true,
    package: 'egg-logrotator',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  httpProxy: {
    enable: false,
    package: 'egg-http-proxy',
  },
};
