/* eslint-disable*/

import { cloneDeep } from 'lodash'
import React from 'react'
import moment from 'moment'

export const TOOLTIPTITLE = '开启被删除提醒后，企业员工微信被客户删除时，被删除的员工将收到一条消息提醒'

export const initStaffData = (datas) => {
    let departList = []
    if (!datas || !datas.length) return departList;
    const resultData = [];
    const formaterMemberInfoList = (data) =>
        cloneDeep(data).map((v) => {
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

const TITLEENUM = {
    'customerName': '删除客户',
    'memberName': '员工/部门',
    'bizTime': '删除客户时间',
    'userCreateTime': '添加客户时间',
}


export const initTableData = (data) => {
    const columns = Object.keys(TITLEENUM)?.map((item) => {
        let obj = {
            key: item,
            dataIndex: item,
            title: TITLEENUM?.[item] || ''
        }
        if (item === 'customerName') {
            obj.render = (val, allVal) => <div className='itemBox'>{allVal?.customerAvatar && <img src={allVal?.customerAvatar || ''} />}{val}</div>
        } else if (item === 'bizTime' || item === 'userCreateTime') {
            obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
        } else if (item === 'memberName') {
            obj.render = (val, allVal) => `${val}/${allVal?.mainDepartmentName || ''}`
        }
        return obj;
    })
    const dataSource = data?.map((item) => ({ ...item, key: item?.id || '' }));
    return {
        columns,
        dataSource
    }
}
