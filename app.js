const moment = require('moment');
const path = require('path');
const getSize = require('get-folder-size');
const MenuOperate = require('./app/fixedData/util');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
    // Server is listening.
    // 设置 启动项目版本
    getSize(path.join(__dirname, 'app'), /\/view\/|\/upload\//, (err, size) => {
      if (err) { throw err; }
      this.app.config.systemVersion = `${this.app.config.systemCode}-${moment().format('YYYYMMDD')}-${size}`;
    });
    // eslint-disable-next-line no-new
    new MenuOperate();
  }
}

module.exports = AppBootHook;
