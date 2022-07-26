const tabId = "customerOperations"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
  {
    "level": 2,
    "children": [
      {
        "level": 3,
        "resId": "materialLibrary",
        "resName": "素材库",
        "resType": "MENU",
        "tabId": tabId,
        "minName": "通讯录",
        "resAttr": { "path": "materialLibrary" },
        "children": [
          {
            "level": 4,
            "resId": 'addMaterial',
            "resName": '新建素材',
            "resType": resTypes[1],
            "tabId": tabId,
            "resAttr": { path: 'addMaterial' },
          },
        ]
      },
      {
        "level": 3,
        "resId": "scriptLibrary",
        "resName": "话术库",
        "resType": "MENU",
        "tabId": tabId,
        "minName": "话术库",
        "resAttr": { "path": "scriptLibrary" },
        "children": [
          {
            "level": 4,
            "resId": 'addEnterpriseScript',
            "resName": '新建企业话术',
            "resType": resTypes[1],
            "tabId": tabId,
            "resAttr": { path: 'addEnterpriseScript' },
          },
        ]
      },
      {
        "level": 3,
        "resId": "customerMassSend",
        "resName": "客户群发",
        "resType": "MENU",
        "tabId": tabId,
        "minName": "客户群发",
        "resAttr": { "path": "customerMassSend" },
        "children": [
          {
            "level": 4,
            "resId": 'addCustomerMassSend',
            "resName": '新建客户群发',
            "resType": resTypes[1],
            "tabId": tabId,
            "pResId": 'customerMassSend',
            "resAttr": { path: 'addCustomerMassSend' },
          },
        ]
      },
      {
        "level": 3,
        "resId": "customerGroupMassSend",
        "resName": "客户群群发",
        "resType": "MENU",
        "tabId": tabId,
        "minName": "客户群群发",
        "resAttr": { "path": "customerGroupMassSend" },
        "children": [
          {
            "level": 4,
            "resId": 'addCustomerGroupMassSend',
            "resName": '新建客户群群发',
            "resType": resTypes[1],
            "tabId": tabId,
            "resAttr": { path: 'addCustomerGroupMassSend' },
          },
        ]
      },
      {
        level: 3,
        resId: 'CicleOfFriends',
        resName: '朋友圈管理',
        resType: resTypes[0],
        tabId,
        resAttr: { path: 'CicleOfFriends' },
        children: [
          {
            "level": 4,
            "resId": 'AddFriendCircle',
            "resName": '发布企业朋友圈',
            "resType": resTypes[1],
            "tabId": tabId,
            "resAttr": { path: 'AddFriendCircle' },
          },
        ]
      },
    ],
    "resId": tabId,
    "resName": "客户运营",
    "resType": "MENU",
    "minName": "运营",
    "resAttr": { "icon": "icon-yijicaidan-kehuyunying" }
  },
]