/* eslint-disable*/

import moment from 'moment'
import React from 'react'
import './index.less'
import RsIcon from '@RsIcon'

export const BANNER = [
    { key: '', title: '全部', icon: <RsIcon type='icon-xingzhuang' /> },
    { key: 2, title: '未开始', icon: <RsIcon type='icon-naozhong' /> },
    { key: 3, title: '进行中', icon: <RsIcon type='icon-jinhangzhong' /> },
    { key: 4, title: '暂停中', icon: <RsIcon type='icon-zanting' /> },
    { key: 5, title: '已结束', icon: <RsIcon type='icon-wancheng-' /> },
    { key: 1, title: '草稿', icon: <RsIcon type='icon-dingdan' /> },
]
// title: '2022年整年用户追踪计划',
//     flowType: 0, // 流程进入类型 0->单次型 1->周期型 2->实时型
//         triggerNum: 355, // 触发总人次
//             fissionName: '李雪亮', // 裂变员工名字
//                 fissionPhoto: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5WuibhBQHXzCoiaHmu9CSiaYsZbMp20lwl4Ir1yFPGporWg/0', // 裂变员工头像
//                     createTime: '1655968203842', // 创建时间
//                         flowState: 0, // 流程状态 0->未开始 1->进行中 2->暂停中 3->已结束 4->草稿
const COLUMNS = {
    operatingTitle: '营销计划标题',
    doType: '流程进入类型',
    totalTriggerNum: '触发总人次',
    operatingStatus: '流程进入状态',
    createMember: '创建人',
    createTime: '创建时间',
    updateMember: '修改人',
    updateTime: '修改时间',
}
// 1-草稿；2-未开始；3-进行中；4-暂停；5-已结束；6-删除；

export const LIUCHENG = {
    1: '单次型',
    2: '周期型',
    3: '定时型'
}

const STATUS = {
    1: { color: '#BFBFBF', title: '草稿' },
    2: { color: '#0678FF', title: '未开始' },
    3: { color: '#46C93A', title: '进行中' },
    4: { color: '#FFBA00', title: '暂停中' },
    5: { color: '#FF4757', title: '已结束' },
}

export const initColumns = () => Object.keys(COLUMNS)?.map((item) => {
    const obj = {
        key: item,
        dataIndex: item,
        title: COLUMNS[item]
    }
    if (item === 'createTime' || item === 'updateTime') {
        obj.render = (val) => moment(Number(val)).format('YYYY/MM/DD HH:mm')
    } else if (item === 'updateMember') {
        obj.render = (val, allVal) => <div>{val?.name || ""}</div>
    } else if (item === 'createMember') {
        obj.render = (val, allVal) => <div>{val?.name || ''}</div>
    } else if (item === 'doType') {
        obj.render = (val) => LIUCHENG[val]
    } else if (item === 'operatingStatus') {
        obj.render = (val) => <div><span className='circle' style={{ background: STATUS[val]?.color || '' }}></span>{STATUS[val]?.title || ''}</div>
    }
    return obj
})

export const getStatusBadge = (val) => (
    <span><span className='circle' style={{ background: STATUS[val]?.color || '' }}></span>{STATUS[val]?.title || ''}</span>
)
