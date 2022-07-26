/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Input, DatePicker, TimePicker, Button, Select, InputNumber, message } from 'antd';
import moment from 'moment'

export default function DateTime({ data, onPress }) {
  const { renderKey, editData = {}, code } = data;
  const [inputValue, setInputValue] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')
  const [numberValue, setNumberValue] = useState(0)
  const [type, setType] = useState(undefined)
  useEffect(() => {
    initData()
  }, [])

  const initData = () => {
    if (code === 'edit') {
      setDateValue(moment(editData?.doDate))
      setTimeValue(moment(`${editData?.doDate} ${editData?.doTime}`))
      setInputValue(editData?.operatingTitle || '')
      setType(editData?.doWaitType)
      setNumberValue(editData?.doWait || 0)
    }
  }
  const FORMAT = 'HH:mm'
  const SELECTOPTIONS = [{ label: '小时', value: 2 }, { label: '分钟', value: 1 }, { label: '天', value: 3 }]
  const handelInput = (e) => {
    setInputValue(e.target.value)
  }
  const handelDate = (e) => {
    setDateValue(e)
  }
  const handelTime = (e) => {
    setTimeValue(e)
  }
  const handelNumber = (e) => {
    setNumberValue(e)
  }

  const handelSave = () => {
    if ((dateValue && timeValue) || (renderKey && type)) {
      onPress({
        index: 1,
        doActionType: renderKey == 'wait' ? 2 : 1,
        code: data?.renderKey || '',
        doWait: numberValue, // 延迟多少
        doWaitType: type, // 延迟类型 时-分-秒
        doDate: moment(dateValue).format('YYYY-MM-DD'), // 指定日期
        doTime: moment(timeValue).format('HH:mm'), // 指定时间
        operatingTitle: inputValue // 流程节点备注
      })
    } else {
      message.error(`${renderKey === 'wait' ? '等待时间设置不能为空' : '制定日期设置不能为空'}`)
    }
  }

  const handelCancel = () => {
    onPress({ index: 0 })
  }

  const renderBottom = () => {
    if (renderKey === 'wait') {
      return <>
        <div className="dateTitle" >等待时间设置</div>
        <div className="dateBottom">
          <div>延迟</div>
          <div><InputNumber value={numberValue} onChange={handelNumber} placeholder="请输入" /></div>
          <div>
            <Select options={SELECTOPTIONS} placeholder="请选择" value={type} onChange={(e) => setType(e)} />
          </div>
          <div>后执行下一流程节点</div>
        </div>
      </>
    }
    return <>
      <div className="dateTitle">指定日期设置</div>
      <div className="dateBottom">
        <div>在</div>
        <div><DatePicker value={dateValue} onChange={handelDate} /></div>
        <div><TimePicker
          format={FORMAT}
          value={timeValue}
          onChange={handelTime}
        /></div>
        <div>执行下一流程节点</div>
      </div>
    </>
  }
  return (
    <div className="DateTime">
      <div className="dateTitle">流程借点备注</div>
      <div className="dateSecond"><Input placeholder="请输入备注名称" showCount maxLength={30} value={inputValue} onChange={handelInput} /></div>
      {renderBottom()}
      {
        data?.renderCode === 'readOnly' ? null : <div className="dateLast">
          <Button className="cancelBtn" onClick={handelCancel}>取消</Button>
          <Button type="primary" onClick={handelSave}>保存</Button>
        </div>
      }
    </div>
  )
}
