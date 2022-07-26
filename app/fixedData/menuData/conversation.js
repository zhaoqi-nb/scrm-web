const tabId = "conversation"
const resTypes = ['MENU', 'MENU-HIDE']
module.exports = [
    {
        level: 2,
        children: [
            {
                level: 3,
                resId: 'conversations',
                resName: '风控设置',
                resType: resTypes[1],
                tabId,
                children: [
                    {
                        level: 3,
                        resId: 'conversatinClient',
                        resName: '客户存档',
                        resType: resTypes[0],
                        tabId,
                        resAttr: { path: 'conversatinClient' },
                    },
                    {
                        level: 3,
                        resId: 'conversatinStaff',
                        resName: '员工存档',
                        resType: resTypes[0],
                        tabId,
                        resAttr: { path: 'conversatinStaff' },
                    },
                    {
                        level: 3,
                        resId: 'conversatinRiskRecord',
                        resName: '风控记录',
                        resType: resTypes[0],
                        tabId,
                        resAttr: { path: 'conversatinRiskRecord' },
                    },

                    {
                        level: 3,
                        resId: 'conversatinSensitiveSet',
                        resName: '敏感词设置',
                        resType: resTypes[0],
                        tabId,
                        resAttr: { path: 'conversatinSensitiveSet' },
                    },
                    {
                        level: 3,
                        resId: 'conversatinSensitiveOptionSet',
                        resName: '添加敏感词',
                        resType: resTypes[1],
                        tabId,
                        resAttr: { path: 'conversatinSensitiveOptionSet' },
                    },
                    {
                        level: 3,
                        resId: 'conversatinBehaviorSet',
                        resName: '敏感行为设置',
                        resType: resTypes[0],
                        tabId,
                        resAttr: { path: 'converSatinBehaviorSet' },
                    },

                ]
            },
        ],
        resId: tabId,
        resType: resTypes[0],
        resName: '会话存档',
        minName: '会话存档',
        resAttr: { icon: 'icon-yijicaidan-huihuacundang' },
    },
]
