module.exports = [
  {
    "level": 2,
    "children": [
      // {
      //   "level": 3,
      //   "resId": "enterprise_wechat",
      //   "resName": "企业微信对接",
      //   "tabId": "system_settings",
      //   "resType": "MENU",
      //   "minName": "企微",
      //   "children": [
      //     {
      //       "level": 4,
      //       "resId": "enterprise_wechat_test",
      //       "resName": "企业微信对接三级2323",
      //       "resType": "MENU",
      //       "tabId": "system_settings",
      //       "resAttr": { "path": "enterpriseWechat" },
      //       "minName": "三级"
      //     }
      //   ]
      // },
      {
        "level": 3,
        "resId": "mailList",
        "resName": "员工通讯录",
        "resType": "MENU",
        "tabId": "system_settings",
        "minName": "通讯录",
        "resAttr": { "path": "mailList" }
      },
      {
        "level": 3,
        "resId": "rolePermissions",
        "resName": "角色权限",
        "tabId": "system_settings",
        "resType": "MENU",
        "minName": "权限",
        "resAttr": { "path": "rolePermissions" }
      },
      {
        "level": 3,
        "resId": "officialAccount",
        "resName": "公众号对接",
        "tabId": "system_settings",
        "resType": "MENU",
        "minName": "权限",
        "resAttr": { "path": "officialAccount" }
      },
      {
        "level": 3,
        "resId": "conversationEmpower",
        "resName": "会话存档授权",
        "tabId": "system_settings",
        "resType": "MENU",
        "minName": "存档授权",
        "resAttr": { "path": "conversationEmpower" }
      }
    ],
    "resId": "system_settings",
    "resName": "系统设置",
    "resType": "MENU",
    "minName": "系统",
    "resAttr": { "icon": "icon-shezhi" }
  }
]