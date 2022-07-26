// 1:普通客户;2:意向客户;3:成交客户;4:多次成交;5:无效
const userStageList = {
    1: '普通客户',
    2: '意向客户',
    3: '成交客户',
    4: '多次成交',
    //   5: '无效',
}

// 1：未成交:2：已成交:3：多次成交:4：已到期
const dealFlagList = {
    1: '未成交',
    2: '已成交',
    3: '多次成交',
    4: '已到期',
}
// 11 广告投放、12渠道活码、13营销素材、14运营活动、15渠道代理、16公司资源、17转介绍、18个人开发、19其他
// 11 - 官网、12 - App、13 - 客户中心（系统 / 自建）、14 - 百度营销、15 - 巨量引擎、16 - 腾讯广点通、17 - 企业微信、18 - 微信公众号（粉丝数据）、19 - 微信小程序、20 - 微信客服、21 - 有赞、22 - 抖店

const sourceList = {
    11: '官网',
    12: 'App',
    13: '客户中心（系统/自建',
    14: '百度营销',
    15: '巨量引擎',
    16: '腾讯广点通',
    17: '企业微信',
    18: '微信公众号',
    19: '微信小程序',
    20: '微信客服',
    21: '有赞',
    22: '抖店',
}

const educationList = {
    1: '高中及以下',
    2: '大专',
    3: '本科',
    4: '硕士',
    5: '博士/博士后',
}
const incomeList = {
    1: '10万以下',
    2: '10-30万',
    3: '30-50万',
    4: '50-100万',
    5: '100万以上',
}
// 性别
const genderList = {
    1: '男',
    2: '女',
}
// obj的key是后台给的字段不要瞎写
const optionListObj = {
    dealFlag: dealFlagList,
    userStage: userStageList,
    source: sourceList,
    gender: genderList,
    education: educationList,
    income: incomeList,
}
// 用于显示值
function getFormaterValue(key, value) {
    const returnObj = optionListObj[key] || {}
    if (key == 'gender' && !value) {
        return '未知'
    }
    return returnObj[value]
}
export {
    optionListObj,
    getFormaterValue
}
