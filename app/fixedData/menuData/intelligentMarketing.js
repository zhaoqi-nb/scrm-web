const tabId = "intelligentMarketing"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
  {
    "level": 2,
    "children": [
      {
        "level": 3,
        "resId": "IntelligentOperation",
        "resName": "智能运营",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "智能运营",
        "resAttr": { "path": "IntelligentOperation", padding: '0' },
        "children": [
          {
            "level": 4,
            "resId": 'AddIntelligent',
            "resName": '新建客户群群发',
            "resType": resTypes[1],
            "tabId": tabId,
            "resAttr": { path: 'AddIntelligent', padding: '0' },
          },
        ]
      },
      {
        "level": 3,
        "resId": "friendFission",
        "resName": "好友裂变",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "好友裂变",
        "resAttr": { "path": "friendFission", tabType: 'dev' },
      },
      {
        "level": 3,
        "resId": "groupFission",
        "resName": "群裂变",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "群裂变",
        "resAttr": { "path": "groupFission", tabType: 'dev' },
      },
      // {
      //   "level": 3,
      //   "resId": "coupon",
      //   "resName": "优惠券",
      //   "resType": resTypes[0],
      //   "tabId": tabId,
      //   "minName": "优惠券",
      //   "resAttr": { "path": "coupon", tabType: 'dev' },
      // },
      // {
      //   "level": 3,
      //   "resId": "redEnvelopeActivity",
      //   "resName": "红包活动",
      //   "resType": resTypes[0],
      //   "tabId": tabId,
      //   "minName": "红包活动",
      //   "resAttr": { "path": "redEnvelopeActivity", tabType: 'dev' },
      // },
      {
        "level": 3,
        "resId": "luckyDraw",
        "resName": "抽奖活动",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "抽奖活动",
        "resAttr": { "path": "luckyDraw", tabType: 'dev' },
      },
      {
        "level": 3,
        "resId": "pullNewLeaderboard",
        "resName": "拉新排行榜",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "拉新排行榜",
        "resAttr": { "path": "pullNewLeaderboard", tabType: 'dev' },
      },
      {
        "level": 3,
        "resId": "pullNewIncentives",
        "resName": "拉新激励",
        "resType": resTypes[0],
        "tabId": tabId,
        "minName": "拉新激励",
        "resAttr": { "path": "pullNewIncentives", tabType: 'dev' },
      },
    ],
    "resId": tabId,
    "resName": "智能营销",
    "resType": resTypes[0],
    "minName": "营销",
    "resAttr": { "icon": "icon-yijicaidan-zhinengyingxiao" }
  },
]