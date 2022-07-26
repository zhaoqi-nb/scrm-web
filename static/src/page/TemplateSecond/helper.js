/* eslint-disable*/
import React from 'react'
import { TableTags } from '@Tool/components'
import './index.less'
import _ from 'lodash'
import moment from 'moment'

const TITLE = {
    qwName: '企业微信群活码名称',
    groupList: '群聊',
    flag: '状态'
}

const SEVEM_TITLE = {
    qwName: '群名称',
    size: '群人数',
    upperLimit: '扫码入群人数上限',
    flag: '状态',
    failureTime: '群二维码失效时间'
}

const COLOR = {
    0: { title: '未启用', color: '#0678FF' },
    1: { title: '拉人中', color: '#46C93A' },
    2: { title: '已停用', color: '#E5E6EB' },
}
export const initColumns = (data, type) => {
    let columns = []
    const resultObj = type == 1 ? SEVEM_TITLE : TITLE
    columns = Object.keys(resultObj)?.map((item) => {
        let obj = {
            code: item,
            title: <span style={{ fontSize: '12px' }}> {resultObj[item]}</span>,
        }
        if (item === 'groupList') {
            obj.width = 500;
            obj.render = (val) => <TableTags data={val} />
        } else if (item === 'flag') {
            obj.width = 200
            obj.render = (val) => <div><span className='circle' style={{ background: COLOR[val]?.color || '' }}></span>{COLOR[val]?.title || ''}</div>
        } else if (item === 'failureTime') {
            obj.render = (val) => moment(val).format('YYYY-MM-DD')
        } else {
            obj.render = (val) => val ? val : ''
        }
        return obj
    })
    const dataSource = data?.map((item) => {
        const groupList = item?.groupList?.map((item) => ({ ...item, name: item?.groupName || '', id: item?.groupId }))
        return {
            ...item,
            groupList
        }
    })
    return {
        columns,
        dataSource
    }
}

export const initStaffData = (datas) => {
    let departList = []
    if (!datas || !datas.length) return departList;
    const resultData = [];
    const formaterMemberInfoList = (data) =>
        _.cloneDeep(data).map((v) => {
            const { memberInfoList, name, departName, id, qywxDepartName } = v
            v.key = id
            v.value = id
            v.title = departName || name || qywxDepartName
            v.label = departName || name || qywxDepartName
            if (name) {
                resultData.push(v);
            }
            // v.disabled = !permissionsFlag
            if (memberInfoList) v.children = formaterMemberInfoList(memberInfoList)
            // else v.children = []
            return v
        })
    departList = formaterMemberInfoList(datas)
    return { departList, resultData }
}

export const initOperate = (type) => {
    if (type == 0) {
        return (
            <>
                <a>编辑</a>
                <a>删除</a>
            </>
        )
    } else if (type == 1) {
        return <>
            <a>停用</a>
            <a style={{ color: 'black' }}>-</a>
        </>
    } else {
        return <>
            <a style={{ color: 'black' }}>-</a>
            <a style={{ color: 'black' }}>-</a>
        </>
    }
}