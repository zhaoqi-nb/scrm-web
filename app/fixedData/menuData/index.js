/**
 * 菜单排序林野提供，
 * 菜单图标已经全部上传iconfont 开发时注意顺序会图标
 * 引流获客、客户管理、客户运营、智能营销、会话存档、数据统计、个人中心、系统设置
 * 如有疑问咨询 xianhu.zheng
*/

// 引流获客
const channelLiveCode = require('./channelLiveCode.js')
// 客户管理
const customerManagement = require('./customerManagement')
// 客户运营
const customerOperations = require('./customerOperations')
// 智能营销
const intelligentMarketing = require('./intelligentMarketing')

// 会话存档
const conversation = require('./conversation')
//数据统计
const statistics = require('./statistics')
//个人中心 

// 系统设置
const systemSettings = require('./systemSettings')





module.exports = {
    children: [...channelLiveCode, ...customerManagement, ...customerOperations, ...intelligentMarketing, ...conversation, ...statistics, ...systemSettings]
}
