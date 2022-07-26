const tabId = "channelLiveCode"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
  {
    level: 2,
    children: [
      {
        level: 3,
        resId: 'channelCode',
        resName: '引流获客',
        resType: resTypes[1],
        tabId,
        children: [
          {
            level: 3,
            resId: 'friendsWelcome',
            resName: '好友欢迎语',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'friendsWelcome' },
          },
          {
            level: 3,
            resId: 'channelCodeChildren',
            resName: '渠道活码',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'channelLiveCode' },
          },
          {
            level: 3,
            resId: 'groupCode',
            resName: '客户群活码',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'GroupCode' },
            children: [
              {
                level: 4,
                resId: 'CodePage',
                resName: '手机APP',
                resType: resTypes[1],
                tabId: tabId,
                resAttr: { path: 'CodePage' },
              },
              {
                level: 4,
                resId: 'KindCode',
                resName: '新建群活码第一步',
                resType: resTypes[1],
                tabId: tabId,
                resAttr: { path: 'KindCode' },
              },
              {
                level: 4,
                resId: 'TemplateChoose',
                resName: '新建群活码第二步',
                resType: resTypes[1],
                tabId: tabId,
                resAttr: { path: 'TemplateChoose' },
              },
              {
                level: 4,
                resId: 'TemplateSecond',
                resName: '新建群活码第三步',
                resType: resTypes[1],
                tabId: tabId,
                resAttr: { path: 'TemplateSecond' },
              },
            ]
          },

          {
            level: 3,
            resId: 'channelCodeChildrenOption',
            resName: '渠道活码操作',
            resType: resTypes[1],
            tabId,
            resAttr: { path: 'channelLiveCodeOption' },
          },

          {
            level: 3,
            resId: 'friendsWelcomeAdd',
            resName: '好友欢迎语添加',
            resType: resTypes[1],
            tabId,
            resAttr: { path: 'friendsWelcomeAdd' },
          },
          {
            level: 3,
            resId: 'groupWelcome',
            resName: '群欢迎语',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'groupWelcome' },
          },
          {
            level: 3,
            resId: 'groupWelcomeOption',
            resName: '群欢迎语操作',
            resType: resTypes[1],
            tabId,
            resAttr: { path: 'groupWelcomeOption' },
          },
          {
            level: 3,
            resId: 'batchAddFriends',
            resName: '批量加好友',
            resType: resTypes[0],
            tabId,
            resAttr: { path: 'batchAddFriends', padding: '0' },
          },
          {
            "level": 3,
            "resId": "newCustomersLabel",
            "resName": "新客自动拉群",
            "resType": "MENU",
            "tabId": tabId,
            "minName": "新客自动拉群",
            "resAttr": { "path": "newCustomersLabel" },
            "children": [
              {
                "level": 4,
                "resId": 'addNewCustomersLabel',
                "resName": '新建新客自动拉群',
                "resType": resTypes[1],
                "tabId": tabId,
                "resAttr": { path: 'addNewCustomersLabel' },
              },
            ]
          },
          {
            "level": 4,
            "resId": 'regularCustomersLabel',
            "resName": '老客标签建群',
            "resType": resTypes[0],
            "tabId": tabId,
            "resAttr": { path: 'regularCustomersLabel' },
            "children": [
              {
                "level": 4,
                "resId": 'addRegularCustomersLabel',
                "resName": '创建老客标签建群',
                "resType": resTypes[1],
                "tabId": tabId,
                "resAttr": { path: 'addRegularCustomersLabel' },
              },
            ]
          }
        ]
      },
    ],
    resId: 'channelLiveCode',
    resType: resTypes[0],
    resName: '引流获客',
    minName: '引流',
    resAttr: { icon: 'icon-yijicaidan-yinliuhuoke' },
  },
]
