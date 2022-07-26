const tabId = "customer"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
  {
    "level": 2,
    "children": [
      {
        "level": 3,
        "resId": "clueManage",
        "resName": "线索管理",
        "resType": resTypes[1],
        tabId,
        "children": [
          {
            "level": 4,
            "resId": "followupClue",
            "resName": "跟进中的线索",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "followupClue" }
          },
          {
            "level": 4,
            "resId": "convertedClue",
            "resName": "已转化的线索",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "convertedClue" }
          },
          {
            "level": 4,
            "resId": "clueHighseas",
            "resName": "线索公海",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "clueHighseas" }
          },
          {
            "level": 4,
            "resId": "highseasConfiguration",
            "resName": "公海配置",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "highseasConfiguration" }
          }
        ]
      },
      {
        "level": 3,
        "resId": "customerManage",
        "resName": "客户管理",
        "resType": resTypes[1],
        tabId,
        "children": [
          {
            "level": 4,
            "resId": "customerList",
            "resName": "客户列表",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "customerList" }
          },
          {
            "level": 4,
            "resId": "groupChat",
            "resName": "企微群聊",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "groupChat" }
          },

          {
            "level": 4,
            "resId": "customerGroup",
            "resName": "客户分群",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "customerGroup" },
            "children": [
              {
                "level": 5,
                "resId": "addCustomerGroup",
                "resName": "创建客户分群",
                "resType": "",
                tabId,
                "resAttr": { "path": "addCustomerGroup" }
              }
            ]
          },
          {
            "level": 4,
            "resId": "customerTag",
            "resName": "客户标签",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "customerLabel" }
          },
          {
            "level": 4,
            "resId": "onJobInherit",
            "resName": "在职继承",
            "resType": "MENU",
            "tabId": "customer",
            "resAttr": { "path": "onJobInherit" },
            "children": [
              {
                "level": 5,
                "resId": "onJobList",
                "resName": "已分配客户",
                "resType": "",
                "tabId": "customer",
                "resAttr": { "path": "onJobList" }
              }
            ]
          },
          {
            "level": 4,
            "resId": "leaveJobInherit",
            "resName": "离职继承",
            "resType": "MENU",
            "tabId": "customer",
            "resAttr": { "path": "leaveJobInherit" },
            "children": [
              {
                "level": 5,
                "resId": "leaveJobList",
                "resName": "已分配离职客户",
                "resType": "",
                "tabId": "customer",
                "resAttr": { "path": "leaveJobList" }
              }
            ]
          },
          {
            "level": 4,
            "resId": "clinetRunOff",
            "resName": "客户流失提醒",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "clinetRunOff" }
          },
          {
            "level": 4,
            "resId": "staffDelete",
            "resName": "员工删人提醒",
            "resType": resTypes[0],
            tabId,
            "resAttr": { "path": "staffDelete" }
          },
          // {
          //   "level": 4,
          //   "resId": "customerAttr",
          //   "resName": "客户属性设置",
          //   "resType": resTypes[0],
          //   "tabId": "customerMan",
          //   "resAttr": { "path": "customerAttr" }
          // }
        ]
      }
    ],
    "resId": "customer",
    "resType": resTypes[0],
    "resName": "客户管理",
    "minName": "客户",
    "resAttr": { "icon": "icon-kehuguanli" }
  }
]
