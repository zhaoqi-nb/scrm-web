import RsIcon from '@RsIcon'

export const MENU = [
    {
        title: '条件判断',
        key: '1',
        background: '#F0F7FF',
        children: [
            { key: 2, parentKey: 1, title: '客户属性判断', icon: <RsIcon type="icon-kehuxinxiguanli" /> },
            { key: 3, parentKey: 1, title: '客户事件判断', icon: <RsIcon type="icon-kehuguanli1" /> }
        ]
    },
    {
        title: '动作触发',
        key: '2',
        background: '#FFFBF0',
        children: [
            {
                key: 4, parentKey: 2, title: '修改客户属性', icon: <RsIcon type="icon-kehudingdan" />
            },
            {
                key: 5, parentKey: 2, title: '修改客户标签', icon: <RsIcon type="icon-biaoqian1" />
            }, {
                key: 6, parentKey: 2, title: '企微群发任务', icon: <RsIcon type="icon-Frame" />
            }, {
                key: 7, parentKey: 2, title: '企微群群发任务', icon: <RsIcon type="icon-kehuzonglan" />
            }, {
                key: 8, parentKey: 2, title: '企业朋友圈任务', icon: <RsIcon type="icon-pengyouquan" />
            }]
    },
    {
        title: '流程控制',
        key: '3',
        background: '#F4FCF3',
        children: [{
            key: 9,
            parentKey: 3,
            title: '指定日期或事件',
            icon: <RsIcon type="icon-riliriqi" />
        }, {
            key: 10,
            parentKey: 3,
            title: '等待',
            icon: <RsIcon type="icon-dengdaiyunhang-2" />
        }]
    },
]
