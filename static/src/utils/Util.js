/* eslint-disable no-unreachable */
import { cloneDeep } from 'lodash'

const { Base64 } = require('js-base64')
const crypto = require('crypto')
/**
 * @aes192加密模块
 * @param str string 要加密的字符串
 * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
 * @retrun string 加密后的字符串
 * */
export function getEncData(str) {
  try {
    const secret = 'rs_scrm_user'
    const cipher = crypto.createCipher('aes192', secret) // 设置加密类型 和 要使用的加密密钥
    let enc = cipher.update(str, 'utf8', 'hex') // 编码方式从utf-8转为hex;
    enc += cipher.final('hex') // 编码方式从转为hex;
    return enc // 返回加密后的字符串
  } catch (error) {
    return null
  }
}

export function getMenuTree(menu) {
  if (!menu) return null

  menu = Base64.decode(menu)
  if (!menu) return null
  try {
    menu = JSON.parse(menu)
  } catch (error) {
    return null
  }
  return menu
}

/**
 * 获取本地缓存数据
 * @param {*} key
 */
export function getLocalStorage(key) {
  if (!window.localStorage) {
    return false
  }
  // 主逻辑业务
  const storage = window.localStorage
  return storage.getItem(key)
}

// get url param
export function GetQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    const result = decodeURI(r[2])
    if (/.*[\u4e00-\u9fa5]+.*$/.test(result)) return result
    return unescape(r[2])
  }
  return null
}

// 加密参数
export function encodeUrl(obj) {
  if (!obj) return
  return Base64.encode(JSON.stringify(obj))
}

// 解密参数
export function decodeUrl(str) {
  if (!str) return
  let urlParam = null
  const limitParam = GetQueryString(str)
  if (limitParam) urlParam = JSON.parse(Base64.decode(limitParam))
  return urlParam
}

/**
 * 手机号正则匹配
 * @param {*} str
 */
export function patternPhone(str) {
  if (!str) return false
  const pattern = '^1[34578]\\d{9}$'
  const reg = new RegExp(pattern)
  if (reg.test(str)) return true
  return false
}
/**
 * 邮箱匹配
 * @param {*} str
 */
export function patternEimal(str) {
  // return true
  if (!str) return false
  const pattern = '^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
  const reg = new RegExp(pattern)
  if (reg.test(str)) return true
  return false
}

// 有回调的下载
export function exportFileCall(url, callback) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  const timer = setInterval(() => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      // Check if loading is complete
      if (iframeDoc.readyState == 'complete' || iframeDoc.readyState == 'interactive') {
        callback && callback(iframeDoc.readyState)
        clearInterval(timer)
        return
      }
    } catch (err) {
      // 下载文件失败会抛出异常
      clearInterval(timer)
      callback && callback('err')
    }
  }, 500)
}

// 点击copy vlalue 是拷贝的内容
export function copyText(value) {
  const transfer = document.createElement('input')
  document.body.appendChild(transfer)
  transfer.value = value // 这里表示想要复制的内容
  transfer.focus()
  transfer.select()
  if (document.execCommand('copy')) {
    // 判断是否支持document.execCommand('copy')       document.execCommand('copy');
  }
  transfer.blur()
  document.body.removeChild(transfer)
}

/**
 * 根据文件url获取文件名
 * @param url 文件url
 */
function getFileName(url) {
  const num = url.lastIndexOf('/') + 1
  let fileName = url.substring(num)
  // 把参数和文件名分割开
  fileName = decodeURI(fileName.split('?')[0])
  return fileName
}

// 下载
export function exportFile(url) {
  /**
   * URL方式保存文件到本地
   * @param data 文件的blob数据
   * @param name 文件名
   */
  function saveAs(data, name) {
    const urlObject = window.URL || window.webkitURL || window
    const export_blob = new Blob([data])
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    save_link.href = urlObject.createObjectURL(export_blob)
    save_link.download = name
    save_link.click()
  }
  url = url.replace(/\\/g, '/')
  const xhr = new XMLHttpRequest()

  if (url.indexOf('?') == -1) {
    // 又丑又长防止重名
    url = `${url}?timestamptmdtmdtmdtmdtmdtmdtmdtmd=${new Date().getTime()}`;
  } else {
    url = `${url}&timestamptmdtmdtmdtmdtmdtmdtmdtmd=${new Date().getTime()}`;
  }
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  // xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 获取文件blob数据并保存
      const fileName = getFileName(url)
      saveAs(xhr.response, fileName)
    }
  }

  xhr.send()
}

// 下载
export function exportFileAll(url) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('src', url)
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
}
export function userTreeFormat(datas, noPermissions) {
  let departList = []
  if (!datas || !datas.length) return departList
  const formaterMemberInfoList = (data) =>
    cloneDeep(data).map((v) => {
      const { subDepartList, departName, id, memberInfoList, permissionsFlag } = v
      v.key = id
      v.value = id
      v.title = departName
      v.label = departName
      v.disabled = noPermissions ? false : !permissionsFlag
      // 取有权限的部门
      v.children =
        memberInfoList?.map((val) => ({
          ...val,
          key: val?.id || '',
          title: val?.name || '',
          value: val?.id,
          label: val?.name || '',
          disabled: noPermissions ? false : !permissionsFlag,
        })) || []
      if (subDepartList) v.children = v.children.concat(formaterMemberInfoList(subDepartList))
      else v.disabled = v.children.length == 0 // 部门不存在子部门且么有下属人员时不可选
      return v
    })
  departList = formaterMemberInfoList(datas)
  return departList
}
