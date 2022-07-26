/* eslint-disable*/

import moment from 'moment'
import React from 'react'
import './index.less'
import Video from '../../../image/video.png'
import RsIcon from '@RsIcon'
import { LinkComp } from '../index'
import { Tooltip } from 'antd'


const TABLE_ENUM = {
    title: { title: '素材标题', },
    content: { title: '素材内容' },
    updateTime: { title: '修改时间' },
    createTime: { title: '创建时间' },
    creator: { title: '创建人/所属部门' }
}

const FILE_TYPE = {
    0: 'icon-word',
    1: 'icon-excel',
    2: 'icon-word',
    3: 'icon-pdf'
}
export const initTableData = (data, globalData) => {

    const { tabsKey } = globalData
    let result = []
    result = Object.keys(TABLE_ENUM)?.map((item) => {
        const obj = {
            key: item,
            dataIndex: item,
            title: TABLE_ENUM?.[item]?.title || ''
        };
        if (item === 'createTime' || item === 'updateTime') {
            obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
        }
        if (item === 'content') {
            obj.width = 300
            if (tabsKey === '2') {
                obj.width = 150
                obj.render = (val, allVal) => <div className='imgBox1' onClick={() => window.open(allVal?.bgImg)}>
                    <img src={allVal?.bgImg || ''} />
                    <Tooltip title={allVal?.fileName || ''}><span className='imgText'>{allVal?.fileName || ''}</span></Tooltip>
                </div>
            } else if (tabsKey === '3') {
                obj.width = 150
                obj.render = (val, allVal) => <div className='imgBox1' onClick={() => window.open(allVal?.fileUrl)}>
                    <RsIcon type="icon-shipin1" className="icon" />
                    <img src={Video} />
                    <Tooltip title={allVal?.fileName}><div className='videoBox'>{allVal?.fileName || ''}</div></Tooltip>
                </div>
            } else if (tabsKey === '0') {
                obj.width = 150
                obj.render = (val, allVal) => <div className='imgBox1' onClick={() => window.open(allVal?.fileUrl)}>
                    <div><RsIcon type={FILE_TYPE[allVal?.fileType || 3]} className="f30" /></div>
                    <Tooltip title={allVal?.fileName || ''}><div className='fileBox'>{allVal?.fileName || ''}</div></Tooltip>
                </div>
            } else if (tabsKey === '5') {
                obj.render = (val, allVal) => <LinkComp linkData={allVal} />
            } else if (tabsKey === '6') {
                obj.width = 200
                obj.render = (val, allVal) => <Tooltip title={val}><div className='textBox'>{val}</div></Tooltip>
            }
        }
        return obj
    })

    const dataSource = data?.list?.map((item) => ({ ...item, key: item?.id || '' }))
    return {
        columns: result,
        dataSource
    };
    console.log(list, 'data')
}
