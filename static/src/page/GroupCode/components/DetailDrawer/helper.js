/* eslint-disable*/

export const initSelectData = (codeSelect, groupSelect) => {
    const code = codeSelect?.map((item) => ({ ...item, value: item?.id || '', label: item?.qwName || '' }));
    const group = groupSelect?.map((item) => ({ ...item, value: item?.id || '', label: item?.name || '' }));
    return {
        code,
        group
    }
}


const KEY = {
    qwName: '活码名称',
    joinInCount: '入群客户数',
    leaveCount: '退群客户数',
    netIncreaseCount: '净增客户数'
}

const GROUPKEY = {
    groupName: '群聊名',
    ownerMemberName: '群主',
    joinInCount: '入群客户数',
    leaveCount: '退群客户数',
    netIncreaseCount: '净增客户数'
}

const DATEKEY = {
    theDay: '日期',
    joinInCount: '入群客户数',
    leaveCount: '退群客户数',
    netIncreaseCount: '净增客户数'
}

export const TABS = [
    { key: 'code', title: '按活码' },
    { key: 'date', title: '按日期' },
]
export const BANNER = [
    { key: 'addNum', title: '入群客户数' },
    { key: 'subNum', title: '退群客户数' },
    { key: 'netIncreaseCount', title: '净增群客户数' },
]
export const SELECT = [
    { label: '昨天', value: 'yesterday' },
    { label: '近一周', value: 'week' },
    { label: '近一月', value: 'monthday' },
]

export const CHARTS = [
    { key: 'addNum', title: '入群人数' },
    { key: 'subNum', title: '退群人数' },
]
export const initColumns = (key) => {
    let result = KEY;
    if (key === 'date') {
        result = DATEKEY
    } else if (key === 'group') {
        result = GROUPKEY
    }
    const columns = Object.keys(result)?.map((item) => {
        let obj = {
            key: item,
            dataIndex: item,
            title: result?.[item] || '',
        }
        obj.render = (val) => val ? val : '-'
        return obj
    })
    return {
        columns,
    }
}