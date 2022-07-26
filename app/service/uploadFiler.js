'use strict';

const fs = require('fs'),
  path = require('path'),
  awaitWriteStream = require('await-stream-ready').write,
  sendToWormhole = require('stream-wormhole'),
  FormData = require('form-data'),
  fetch = require("node-fetch"),
  Service = require('egg').Service;

class uploadFiler extends Service {
  async filer(ctx, config, url) {
    const stream = await ctx.getFileStream(),
      uploadDir = config.uploadDir;
    const form = new FormData(); // new formdata实例
    let filePaths = [];
    const type = stream.fields.type
    if (stream != null) {
      //文件生成绝对路径
      const filePath = path.join(uploadDir, stream.filename);
      filePaths.push(filePath);
      //生成一个文件写入文件流
      const writeStream = fs.createWriteStream(filePath);
      try {
        //异步把文件流写入
        await awaitWriteStream(stream.pipe(writeStream));
      } catch (err) {
        //如果出现错误，关闭管道
        await sendToWormhole(stream);
        throw err;
      }
      const file = fs.createReadStream(filePath)
      form.append('file', file); // 把文件加入到formdata实例中
      if (type) form.append('type', type); // 把文件加入到formdata实例中
    }
    form.maxDataSize = Infinity;
    let json = await this.upload(config, url, form, filePaths);
    this.unlink(filePaths);
    return json;
  }

  async upload(config, url, form, filePaths) {
    const { ctx } = this;
    const userInfo = ctx.service.userService.getUserTockenCookie() || {};
    const accessToken = userInfo.accessToken
    return new Promise((resolve, reject) => {
      fetch(config.API_DOMAIN.API_URL + url, {
        method: 'POST', body: form, headers: {
          authentication: accessToken
        }
      })
        .then(function (res) {
          return res.json()
        }).then(function (json) {
          resolve(json)
        }).catch((err) => {
          reject()
          this.unlink(filePaths);
          console.log(err, 1111)
        });
    });
  }

  async unlink(arr) {
    arr.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('delete ok');
        }
      })
    });
  }

  writeFiles(filePath, dataBuffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, dataBuffer, async function (err) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(1);
      })
    })
  }
}

module.exports = uploadFiler;