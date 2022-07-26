/* eslint-disable*/
import React, { useState, useEffect, useRef } from 'react'
import { DatePicker, Select, Switch, Tooltip, message, Table } from 'antd'
import { TOOLTIPTITLE, initStaffData, initTableData } from './helper'
import { TRCheckboxModal } from '@Tool/components'
import './index.less'
import Api from './service'
import CustomerInfo from '../comments/customerInfo'
import moment from 'moment'
import { userTreeFormat } from '@/utils/Util'

export default function ClinetRunOff() {
  const cusTomerInfoRef = useRef(null)

  const { RangePicker } = DatePicker;
  const [date, setDate] = useState([])
  const [staffData, setStaffData] = useState([]);
  const [staffValue, setStaffValue] = useState([]);
  const [staffOption, setStaffOption] = useState([]);
  const [switchCheck, setSwitchCheck] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tableInfo, setTableInfo] = useState({});
  const [optionId, setOptionId] = useState('');

  const handelDate = (data) => {
    setDate(data)
    fetchTableData({
      bizTimeStart: moment(data?.[0]).format('YYYY-MM-DD'),
      bizTimeEnd: moment(data?.[1]).format('YYYY-MM-DD'),
      memberIds: staffValue
    })
  }

  const fetchData = async () => {
    const [res, res1] = await Promise.all([Api.getStaffData(), Api.getDeleteStatus()]);
    if (res?.retCode === 200 && res1?.retCode === 200) {
      const data = initStaffData(res?.data || []);
      const departList = userTreeFormat(res?.data || [])

      setStaffData(departList)
      setStaffOption(data?.resultData || [])
      setSwitchCheck(res1?.data?.flag || false)
    }
  }


  const fetchTableData = async (data) => {
    let res = await Api.getTableData({
      bizType: 'customer_flow',
      ...data
    })
    if (res?.retCode === 200) {
      const result = initTableData(res?.data?.list || [])
      setColumns([...result?.columns || [], columnsMore()]);
      setDataSource(result?.dataSource || []);
      setTableInfo(res?.data || {})
    }
  }

  const titleRender = (item) => {
    return <div className='itemBox'>{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
  }

  const handelSelect = async () => {
    const result = await TRCheckboxModal.show({
      treeData: staffData,
      value: staffValue,
      title: '选择员工',
      titleRender,
      itemRender: titleRender
    })
    if (result.index === 1) {
      fetchTableData({
        bizTimeStart: date?.length ? moment(date?.[0]).format('YYYY-MM-DD') : '',
        bizTimeEnd: date?.length ? moment(date?.[1]).format('YYYY-MM-DD') : '',
        memberIds: result?.checkedKeys || []
      })
      setStaffValue(result?.checkedKeys || [])
    }
  }

  const handelDetail = (data) => {
    setOptionId(data?.customerId || '')
    setTimeout(() => {
      cusTomerInfoRef?.current?.optionInfo(true)
    }, 0);
  }

  const columnsMore = () => {
    return {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      width: 400,
      render: (val, allVal) => {
        return <div className='operateBox'>
          <a onClick={() => handelDetail(allVal)}>客户详情</a></div>
      }
    }
  }
  const handelSwitch = async (checked) => {
    setSwitchLoading(true)
    let res = await Api.updateDeleteStatus(checked ? 1 : 0);
    if (res?.retCode === 200) {
      setSwitchCheck(checked)
      setSwitchLoading(false)
    } else {
      message.error(res?.retMsg || '')
    }
  }
  const handelStaff = (data) => {
    fetchTableData({
      bizTimeStart: date?.length ? moment(date?.[0]).format('YYYY-MM-DD') : '',
      bizTimeEnd: date?.length ? moment(date?.[1]).format('YYYY-MM-DD') : '',
      memberIds: data
    })
    setStaffValue(data)
  }
  useEffect(() => {
    fetchData()
    fetchTableData();
  }, []);
  return (
    <div className="clinetContainer">
      <div className="title">客户流失提醒</div>
      <div className="banner">

        <div className="bannerLeft">
          <RangePicker
            value={date}
            onChange={handelDate}
          />
          <Select
            placeholder="请选择员工"
            options={staffOption}
            open={false}
            onClick={handelSelect}
            value={staffValue}
            mode='tags'
            maxTagCount={1}
            showArrow
            onChange={handelStaff}
          />
        </div>
        <div className="bannerRight">
          <div><div>被删除提醒</div><Tooltip title={TOOLTIPTITLE}><span className="question">?</span></Tooltip></div>
          <div>
            <Switch
              checked={switchCheck}
              loading={switchLoading}
              onChange={handelSwitch}
            /></div>
        </div>
      </div>
      <div className="main">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            className: 'pagination',
            showTotal: (total) => `共${total}条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: tableInfo?.pageNo,
            pageSize: tableInfo?.pageSize,
            defaultCurrent: tableInfo.pageCount,
            total: tableInfo.total
          }}
          onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}
        />
        {optionId?.length ? <CustomerInfo id={optionId} key={optionId} ref={cusTomerInfoRef} /> : null}

      </div>
    </div>
  )
}
