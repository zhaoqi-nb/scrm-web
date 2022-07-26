/*
 * @FileDescription    : default egg config
 * @Author             : lin.li@fengjr.com
 * @Date               : 2018-05-15 14:06:00
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: yyyy-09-Mo 05:30:31
 */

const APPNAME = 'databurning-scrm-web';
const APPKEY = 'rs_scrm_user';
const PERMISSIONKEY = 'rs_scrm_premission';
const PATH = require('path');

module.exports = (appInfo) => {
  // app config
  const config = {
    mode: 'file', // 启用 file 模式

    env: 'local',
    // app name
    name: APPNAME,
    // system code
    systemCode: APPNAME,
    // 系统每次上线会生成唯一版本标记，用来做强制校验
    systemVersion: '',
    // cookie key
    cookieKey: {
      // 用户登录相关 memberId + 浏览器信息 + IP + 登录时间
      userToken: APPKEY,
      // 页面用户行为信息 dashboard
      userBehavior: 'rs_ub_token',
      permissionToken: PERMISSIONKEY
    },
    // api url config
    API_URL: '',
    // base path
    baseDir: __dirname,
    // upload file path
    uploadDir: PATH.join(appInfo.baseDir, 'app/upload/'),
    // Session and Cookie key
    keys: APPKEY,
    // Session maximum effective time
    maxAge: 86400000,
    // template
    view: {
      root: [PATH.join(appInfo.baseDir, 'app/view')].join(','),
      cache: true,
      mapping: {
        '.nj': 'nunjucks',
        '.xml': 'nunjucks',
      },
      defaultViewEngine: 'nunjucks',
      defaultExtension: '.nj',
    },
    // app cluster config
    cluster: {
      listen: {
        port: 7023,
      },
    },
    httpclient: {
      request: {
        // default timeout of request
        timeout: 1200 * 1000,
      },
      httpAgent: {
        timeout: 1200 * 1000,
      },
    },
    // redis cache config
    redis: {
      agent: true,
      // 过期时间（单位秒）-- 6小时
      expire: 60 * 60 * 6,
    },
    security: {
      xframe: {
        enable: true,
      },
      csrf: {
        enable: false,
        headerName: 'authentication',
      },
    },
    multipart: {
      fileSize: '100mb',
      // will append to whilelist
      fileExtensions: [
        '.xlsx', '.xls', '.gif', '.png', '.jpg', '.jpeg', '.cad', '.pdf', '.doc', '.docx', '.ppt', '.pptx', 'avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob'
      ]
    },
    // log config
    logger: {
      level: 'DEBUG',
      consoleLevel: 'DEBUG',
      // 应用日志
      appLogName: `${APPNAME}.log`,
      // 框架内核、插件日志
      coreLogName: `${APPNAME}-core.log`,
      // agent 进程日志
      agentLogName: `${APPNAME}-agent.log`,
      // error 日志
      errorLogName: `${APPNAME}.err`,
    },
    // log partition config
    logrotator: {
      maxDays: 10,
    },
    static: {
      prefix: '/public/',
      dir: PATH.join(appInfo.baseDir, 'app/public'),
      gzip: true,
      // support lazy load
      dynamic: true,
      preload: true,
      buffer: true,
      maxAge: 86400,
      maxFiles: 1000,
    },
    middleware: ['recordLog'],
    recordLog: {
      enable: true,
      ignore(ctx) {
        const { path } = ctx;
        const ignoreList = ['/api/wxAuth/waitToSubscribe'];
        return ignoreList.indexOf(path) !== -1;
      },
    },
    notfound: {
      pageUrl: '/login',
    },
    bodyParser: {
      enable: true,
      encoding: 'utf8',
      formLimit: '1mb',
      jsonLimit: '1mb',
      strict: true,
      queryString: {
        arrayLimit: 100,
        depth: 5,
        parameterLimit: 1000,
      },
      enableTypes: ['json', 'form', 'text'],
      extendTypes: {
        text: ['text/xml', 'application/xml'],
      },
    },
    onerror: {
      all(err, ctx) {
        // 在此处定义针对所有响应类型的错误处理方法
        // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
        ctx.body = '发生未知错误';
        ctx.status = 500;
      },
    },
    noNeedLoginPages: [{
      path: 'officialAccountForm'
    }, {
      path: 'CodePage',
      title: '客户群详情',
      pageDes: '活动进行中，扫码入群领取专属福利～'
    }]
  };
  return config;
};
