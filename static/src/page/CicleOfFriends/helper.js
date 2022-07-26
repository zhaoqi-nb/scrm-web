/* eslint-disable*/

import { cloneDeep } from 'lodash'
import moment from 'moment'
import React from 'react';
import { Image, Tooltip } from 'antd'
import Video from '../image/video.png'
import RsIcon from '@RsIcon'



import './index.less'
export const BANNER = [
    { title: '企业发表', main: '企业统一创，由成员确认后发表的内容，每位客户的朋友圈每个月最多展示4条' },
    { title: '个人发表', main: '成员自己创建并发表的内容，每位客户的朋友圈每天最多展示3条' },
]
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
export const FRIEND_SELECT = [
    // { label: '个人类型', value: 2 },
    { label: '企业类型', value: 1 },
]

const COLUMNS = {
    friendCircleName: '任务名称',
    attachmentType: '消息内容',
    sendType: '发布方式',
    friendCircleType: '朋友圈类型',
    doSendCount: '已发表成员',
    notDoSendCount: '未发表成员',
    createMemberName: '创建人',
    createTime: '创建时间',
}
export const CIRCLE_TYPE = {
    1: '企业发表',
    2: '个人发表'
}
export const SEND_TYPE = {
    1: '立即发送',
    2: '指定时间'
}

const renderMain = (val, allVal) => {
    const fileData = allVal?.fileList?.[0] || {}
    if (val == 4) {
        return <Tooltip title={allVal?.textContent || ''}>{allVal?.textContent || ''}</Tooltip>
    } else if (val == 1) {
        return <div className='fileImg'><Image
            style={{ width: '60px', height: '60px' }}
            src={fileData?.fileUrl || ''} /> <Tooltip title={fileData?.fileName || ''}><div className='fileTitle'>{fileData?.fileName || ''}</div></Tooltip></div>
    } else if (val == 3) {
        return fileData?.materialTitle || '-'
    } else {
        return <div className='fileImg'>
            <RsIcon type="icon-shipin1" className="icon" />
            <img
                style={{ width: '60px', height: '60px' }}
                src={Video} /> <Tooltip title={fileData?.fileName || ''}><div className='fileTitle'>{fileData?.fileName || ''}</div></Tooltip></div>
    }
}
export const initColumns = (data) => {
    const columns = Object.keys(COLUMNS)?.map((item) => {
        const obj = {
            key: item,
            dataIndex: item,
            title: COLUMNS?.[item] || ''
        }
        if (item === 'createTime') {
            obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
        } else if (item === 'friendCircleType') {
            obj.render = (val) => CIRCLE_TYPE?.[val] || ''
        } else if (item === 'sendType') {
            obj.render = (val) => SEND_TYPE?.[val] || ''
        } else if (item === 'createMemberName') {
            obj.render = (val, allVal) => <div>
                <img
                    style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }}
                    src={allVal?.createMemberAvatar || ''}
                />{val}</div>
        } else if (item === 'attachmentType') {
            obj.render = renderMain
        }
        return obj
    })
    const dataSource = data?.map((item) => ({ ...item, key: item?.id || '' }));
    return {
        columns,
        dataSource
    }
}
