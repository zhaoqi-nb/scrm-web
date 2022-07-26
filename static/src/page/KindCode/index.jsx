import React, { useState } from 'react'
import { Button } from 'antd'
import './index.less'
import RsIcon from '@RsIcon'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as action from '../GroupCode/store/action-type';

export default function KindCode() {
  const [checkIndex, setCheckIndex] = useState(0);
  const history = useHistory()
  const dispatch = useDispatch()

  const DATA = [
    { title: '永久码', value: '基于企业微信群活码，一次配置永久有效，方便管理', icon: 'icon-yongjiuma' },
    { title: '7天码', value: '7天有效，限时入群，营销活动场景必备工具', icon: 'icon-a-7tianma' },
  ]

  const handelCheck = (_index) => {
    setCheckIndex(_index)
  }

  const renderMain = () => DATA?.map((item, index) => (
    <div
      className={`listBox ${checkIndex === index ? 'select' : ''}`}
      onClick={() => handelCheck(index)}
      key={index}
    >
      {
        index == 0 ?
          <><div className="sanjiao" />
            <div className="tuijian">推荐</div>
          </> : null
      }
      <div className="top">
        <div className="result">
          <RsIcon type={item?.icon || ''} />
        </div>
      </div>
      <div className="title">{item?.title || ''}</div>
      <div className="last">
        {item?.value || ''}
      </div>
    </div>
  ))

  const handelNext = () => {
    dispatch({
      type: action.SETEDIT,
      value: { edit: {}, type: checkIndex == 0 ? '2' : '1' }
    })
    history.push('/TemplateChoose')
  }

  const handelCancel = () => {
    history.push('/GroupCode')
  }

  return (
    <div className="kindContainer">
      <div className="title">
        新建客户群活码
      </div>
      <div className="main">
        {renderMain()}
      </div>
      <div className="bottom">
        <Button onClick={handelCancel}>返回</Button>
        <Button type="primary" onClick={handelNext}>下一步</Button>
      </div>
    </div>
  )
}
