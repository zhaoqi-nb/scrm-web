// 获取错误代码
function getErrorCode(type) {
  let code = 0;
  let retMsg = '服务异常';
  let data = {};
  switch (type) {
    // login error //重新登录
    case 'LOGIN_ERROR': code = '405'; break;
    // user auth error
    case 'AUTH_ERROR': code = '505'; break;
    // 认证错误次数过多
    case 'AUTH_COUNT_ERROR': code = '200', retMsg = '', data = 506; break;
    // 认证出错
    case 'AUTH_SIGN_ERROR': code = '507', retMsg = '验证出错，请刷新页面重试!'; break;
    // param error
    case 'PARAM_ERROR': code = '500'; break;
    case 'SERVICE_ERROR': code = '404', retMsg = '服务器未知异常';; break;
  }
  return {
    code,
    data,
    retMsg,
  };
}

module.exports = { getErrorCode };
