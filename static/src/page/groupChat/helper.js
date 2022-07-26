/* eslint-disable*/

import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import './index.less'
import { TableTags } from './components'
const TITLEENUM = {
    'name': '群名称',
    'memberVo': '群主',
    'labelVos': '群标签',
    'size': '总人数',
    'customerSize': '客户数',
    'createTime': '创建时间',
}



export const initData = (res, res2, res3) => {
    const result = res?.map((item) => item.labels)
    const results = _.flatten(result)?.map((item) => {
        return { ...item, label: item?.name || '', value: item?.id }
    });

    const columns = Object.keys(TITLEENUM)?.map((item) => {
        let obj = {
            key: item,
            dataIndex: item,
            title: TITLEENUM?.[item] || ''
        }
        if (item === 'memberVo') {
            obj.render = (val) => <div className='imgBox'><img src={val?.avatar} /><span>{val?.name || ''}</span></div>
        } else if (item === 'labelVos') {
            obj.render = (val) => <TableTags data={val} />
        } else if (item === 'createTime') {
            obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
        } else if (item === 'name') {
            obj.render = (val) => val ? val : '未命名群聊'
        }
        return obj
    })
    let resultData = []
    const treeData = res3?.data?.map((item) => {
        const children = item?.memberInfoList?.map((val) => ({
            ...val,
            key: val?.id || '',
            title: val?.name || '',
            value: val?.id,
            label: val?.name || ''
        })) || []
        resultData = [...resultData, ...children]
        return {
            ...item,
            key: item?.id || '',
            title: item?.departName || '',
            value: item?.id,
            children
        }
    }) || []
    const dataSource = res2?.data?.list?.map((item) => ({ ...item, key: item?.id || '' }))
    return {
        results,
        columns,
        dataSource,
        tableInfo: res2?.data || {},
        treeData,
        resultData
    }
}


export function userTreeFormat(datas) {
    let departList = []
    if (!datas || !datas.length) return departList
    const formaterMemberInfoList = (data) =>
        _.cloneDeep(data).map((v) => {
            const { subDepartList, departName, id, memberInfoList, permissionsFlag } = v
            v.key = id
            v.value = id
            v.title = departName
            v.label = departName
            v.disabled = !permissionsFlag
            // 取有权限的部门
            v.children = memberInfoList?.map((val) => ({
                ...val,
                key: val?.id || '',
                title: val?.name || '',
                value: val?.id,
                label: val?.name || '',
                disabled: !permissionsFlag
            })) || []
            if (subDepartList) v.children = v.children.concat(formaterMemberInfoList(subDepartList))
            else v.disabled = v.children.length == 0 // 部门不存在子部门且么有下属人员时不可选
            return v
        })
    departList = formaterMemberInfoList(datas)
    return departList
}