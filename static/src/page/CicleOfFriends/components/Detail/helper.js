import React from 'react'

export const DESCRIBE = [
    { key: 'friendCircleName', title: '任务名称' },
    { key: 'friendCircleType', title: '朋友圈类型' },
    { key: 'sendType', title: '发布方式' },
    { key: 'createMemberName', title: '创建人' },
    { key: 'createTime', title: '创建时间' },
]
export const BANNER = [
    { key: 'shouldDoSendCount', title: '全部执行成员' },
    { key: 'doSendCount', title: '已发布成员' },
    { key: 'notDoSendCount', title: '未发布成员' },
]

export const OPTIONS = [
    { label: '全部执行成员', value: '' },
    { label: '已发布成员', value: 1 },
    { label: '未发布成员', value: 0 },
]

const COLUMNS = {
    memberName: '成员',
    publishStatus: '成员发表状态'
}

const STATUS = {
    1: { color: '#46C93A', title: '已发布' },
    0: { color: '#E5E6EB', title: '未发布' },
}
export const initColumns = (data) => {
    const dataSource = data?.map((item) => ({ ...item, key: item?.id }))
    const columns = Object.keys(COLUMNS).map((item) => {
        const obj = {
            key: item,
            dataIndex: item,
            title: COLUMNS?.[item] || ''
        }
        if (item === 'memberName') {
            obj.render = (val, allVal) => <>
              <img
                src={allVal?.memberAvatar || ''}
                style={{ width: '20px', height: '20px', marginRight: '5px', borderRadius: '50%' }}
              />
              {val}
            </>
        } else if (item === 'publishStatus') {
            obj.render = (val) => <> <span
              style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: STATUS[val]?.color || '',
                    display: 'inline-block',
                    marginRight: '5px'
                }}
            /> {STATUS[val]?.title || ''}</>
        }
        return obj
    })
    return {
        dataSource,
        columns
    }
}
