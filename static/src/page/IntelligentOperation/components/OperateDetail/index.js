import React from 'react';
import { Divider, Button, Modal } from 'antd'
import moment from 'moment'
import Tabs from './components/Tabs'
import { getStatusBadge, LIUCHENG } from '../../helper'
import { getJurisdiction } from './helper'

import './index.less'

function OperateDetail(props) {
  const { data, onPress } = props;
  const { createMember } = data
  const momentFormat = (val, format) => moment(val).format(format)

  const handelOpen = () => {
    data?.handelOpen(data)
    onPress({ index: 0 })
  }

  const handelPause = () => {
    data?.handelPause(data)
    onPress({ index: 0 })
  }

  const handelEdit = () => {
    onPress({ index: 0 })
    data?.handelEdit(data)
  }

  const handelDelete = () => {
    Modal.confirm({
      content: '确定删除该计划？',
      title: '提示',
      onOk: async () => {
        onPress({ index: 0 })
        data?.handelDelete(data)
      },
      onCancel: () => { },
    })
  }

  return (
    <div className="operateDetailWrapper">
      <div className="headerWrapper">
        <div className="header mb10">
          <span className="title">{data?.operatingTitle}</span>
          {getStatusBadge(data.operatingStatus)}
          {data?.haveEdit && <div className="butWrapper">
            {/* 计划状态：1-草稿；2-未开始；3-进行中；4-暂停；5-已结束； */}
            {[1].includes(data?.operatingStatus) && <Button size="middle" onClick={() => handelEdit()}>编辑</Button>}
            {[1, 2, 4].includes(data?.operatingStatus) && <Button size="middle" onClick={() => handelOpen()}>开启</Button>}
            {[3].includes(data?.operatingStatus) && <Button size="middle" onClick={() => handelPause()}>暂停</Button>}
            {[1, 2, 3, 4, 5].includes(data?.operatingStatus) && <Button size="middle" onClick={() => handelDelete()}>删除</Button>}
          </div>}
        </div>
        <div className="mb10">
          {LIUCHENG[data.doType]}
          <Divider type="vertical" />
          {data.doType == 1 && `在${momentFormat(data.doStartTime, 'YYYY/MM/DD')} 的 ${data.doSendTimeInfo} 执行流程`}
          {data.doType == 2 && `在${momentFormat(data.doStartTime, 'YYYY/MM/DD')}至 ${momentFormat(data.doEndTime, 'YYYY/MM/DD')}期间内的 每天 ${data.doSendTimeInfo} 执行流程`}
        </div>
        <div>
          {`${createMember?.name} 创建于 ${momentFormat(data.createTime, 'YYYY/MM/DD HH:mm')}`}
          <span className="agent">{getJurisdiction(data?.permissionsFlag, data?.permissionsType)}</span>
        </div>
      </div>
      <Tabs data={data} />
    </div>
  )
}

export default OperateDetail;
