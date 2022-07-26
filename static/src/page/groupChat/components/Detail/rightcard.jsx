/* eslint-disable*/
import React, { useState, useEffect, useRef } from 'react'
import { Input, Radio, DatePicker, Table, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { MEMBER_ENUM, initChartsData, initTableData } from './helper'
import { Charts } from '../index'
import moment from 'moment'
import CustomerInfo from '../../../comments/customerInfo'
import './style.less'

function Right({ chartsData, fetchData, tableData, fetchTableData, loading }) {
  const cusTomerInfoRef = useRef(null)

  const { RangePicker } = DatePicker
  const [tab, setTab] = useState('3')
  const [chartsConfig, setChartsConfig] = useState({})
  const [date, setDate] = useState([])
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [tableInfo, setTableInfo] = useState({})
  const [memberName, setMemberName] = useState('')
  const [optionId, setOptionId] = useState('')

  useEffect(() => {
    initData()
  }, [JSON.stringify(chartsData)])

  useEffect(() => {
    initTable()
  }, [JSON.stringify(tableData)])

  const initTable = () => {
    let data = initTableData(tableData)
    setColumns([...data?.columns, columnsMore()])
    setDataSource(data?.dataSource)
    setTableInfo(data?.tableInfo)
  }

  const handelDetail = (data) => {
    setOptionId(data?.customerId || '')
    setTimeout(() => {
      cusTomerInfoRef?.current?.optionInfo(true)
    }, 0)
  }

  const columnsMore = () => {
    return {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (val, allVal) => {
        return (
          <div className="operateBox">{allVal?.infoFlag ? <a onClick={() => handelDetail(allVal)}>详情</a> : '-'}</div>
        )
      },
    }
  }

  const initData = () => {
    let data = initChartsData(chartsData)
    setChartsConfig(data)
  }

  const handelTab = (data) => {
    setTab(data.target.value)
    fetchData &&
      fetchData({
        type: Number(data.target.value),
        startDate: date?.[0] ? moment(date?.[0]).startOf('day').format('x') : null,
        endDate: date?.[1] ? moment(date?.[1]).endOf('day').format('x') : null,
      })
  }

  const handelDate = (data) => {
    setDate(data)
    fetchData &&
      fetchData({
        type: Number(tab),
        startDate: data?.[0] ? moment(date?.[0]).startOf('day').format('x') : null,
        endDate: data?.[1] ? moment(date?.[1]).endOf('day').format('x') : null,
      })
  }

  const handelTable = (options) => {
    fetchTableData &&
      fetchTableData({
        pageNo: options?.current,
        pageSize: options?.pageSize,
      })
  }
  const handelEnter = () => {
    fetchTableData &&
      fetchTableData({
        name: memberName,
        pageSize: 5,
      })
  }
  const onEditChageOption = () => {}
  const renderMain = () => {
    if (loading)
      return (
        <div className={'spinBox'}>
          <Spin />
        </div>
      )
    return (
      <>
        <div className="rightTitle">群成员统计</div>
        <div className="search">
          <Radio.Group
            className="radio-group-zdy"
            onChange={(val) => handelTab(val)}
            value={tab}
            style={{ marginBottom: 8 }}
            buttonStyle="solid"
          >
            {MEMBER_ENUM.map((item) => (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <RangePicker className="date" value={date} onChange={handelDate} />
        </div>
        <div className="line">
          <Charts config={chartsConfig} height="100%" />
        </div>
        <div className="rightTitle">群成员明细</div>
        <div className="input">
          <Input
            suffix={<SearchOutlined />}
            placeholder="请输入要搜索的成员名称"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            onPressEnter={handelEnter}
            onBlur={handelEnter}
          />
        </div>
        <div className="table">
          <Table
            size="small"
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
              total: tableInfo.total,
            }}
            onChange={handelTable}
            // rowKey={(record) => record.fund_code}
          />
          {optionId && (
            <CustomerInfo id={optionId} key={optionId} ref={cusTomerInfoRef} editChange={onEditChageOption} />
          )}
        </div>
      </>
    )
  }

  return <div className="right">{renderMain()}</div>
}

export default Right
