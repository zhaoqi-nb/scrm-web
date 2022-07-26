'user strict'

const fs = require('fs'),
  path = require('path'),
  newMenu = require('./menuData')  // 新的模块 菜单数据

class OperateDataUtil {
  constructor() {
    this.setGlobalData()
  }

  async getJsonData(filePath) {
    return new Promise((resolve, reject) => {
      var file = path.join(__dirname, `./${filePath}.json`)
      //读取json文件
      fs.readFile(file, 'utf-8', function (err, result) {
        if (!err) {
          resolve(JSON.parse(result))
        }
      })
    })
  }

  //分解数据
  decompositionData(datas) {
    let template = {},
      parentRoute = []
    //设置数据
    let setData = (len, value) => {
      let arr = []
      for (let i = 0; i < len; i++) {
        arr.push(parentRoute[i])
      }
      arr.push(value)
      return arr
    }
    //循环数据
    let loop = (arr) => {
      try {
        for (let i = 0, len = arr.length; i < len; i++) {
          let obj = arr[i],
            resAttr = obj.resAttr || {},
            path = resAttr.path,
            children = obj.children,
            resName = obj.resName,
            tabId = obj.tabId,
            resId = obj.resId,
            resType = obj.resType,
            level = obj.level,
            pResId = obj.pResId,
            index = level - 2
          if (resType == 'MENU-HIDE') {
            pResId = parentRoute[parentRoute.length - 1].resId
            // console.log(parentRoute)
          }
          let temp = {
            level,
            resId,
            tabId,
            resName,
            resType,
            resAttr,
            pResId
          }
          //路由缓存
          parentRoute = setData(index, { resId, resName, path })

          if (path && !template[path]) {
            template[path] = Object.assign({}, temp, { route: parentRoute })
          }

          if (children && children.length) {
            loop(children)
          }
        }
      } catch (error) {
        console.log('启动分解数据出错 = ' + error)
      }
    }

    loop(datas)

    return template
  }
  async getTemplateData() {
    let menuData = null,
      pageList = null;
    menuData = newMenu.children
    pageList = this.decompositionData(menuData)
    return {
      menu: menuData,
      pageList,
    }
  }

  // 声明全局变量
  async setGlobalData() {
    let temp = await this.getTemplateData()

    global.MENU = temp.menu
    global.PAGELIST = temp.pageList

    // console.log("结束数据"+ JSON.stringify(global.PAGELIST) );
  }
}

module.exports = OperateDataUtil
