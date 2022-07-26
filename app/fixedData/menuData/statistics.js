const tabId = "statistics"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
  {
    level: 2,
    children: [
      {
        level: 3,
        resId: 'statisticsSet',
        resName: '风控设置',
        resType: resTypes[1],
        tabId,
        children: [
          {
            level: 3,
            resId: 'Overview',
            resName: '数据概览',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'Overview', padding: '0' },
          },
          {
            level: 3,
            resId: 'statisticsCustomer',
            resName: '客户统计',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'statisticsCustomer' },
          },
          {
            level: 3,
            resId: 'statisticsMember',
            resName: '成员统计',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'statisticsMember' },
          }

        ]
      },
      // {
      //   "level": 3,
      //   "resId": "salesFunnelAnalysis",
      //   "resName": "销售漏斗分析",
      //   "resType": resTypes[0],
      //   "tabId": tabId,
      //   "minName": "销售漏斗分析",
      //   "resAttr": { "path": "salesFunnelAnalysis", tabType: 'dev' },
      // },
      {
        "level": 3,
        "resId": "employeeFollowup",
        "resName": "员工跟进分析",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "员工跟进分析",
        "resAttr": { "path": "employeeFollowup", tabType: 'dev' },
      },
      {
        "level": 3,
        "resId": "contentInteraction",
        "resName": "内容互动分析",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "内容互动分析",
        "resAttr": { "path": "contentInteraction", tabType: 'dev' },
      },
    ],
    resId: tabId,
    resType: resTypes[0],
    resName: '数据统计',
    minName: '数据统计',
    resAttr: { icon: 'icon-yijicaidan-shujutongji' },
  },
]
