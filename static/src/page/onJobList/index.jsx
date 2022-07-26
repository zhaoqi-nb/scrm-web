/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react';
import { Table, DatePicker, Input } from 'antd'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'

const columns = [
  {
    "title": "微信昵称",
    "dataIndex": "customerName",
    "algin": "center",
    "render": (text, record) => {
      let textLabel = record.type == 1 ? "微信" : record.corpName
      if (textLabel == null || textLabel == "null") textLabel = ""
      return <p style={{ display: "flex", alignItems: "center", padding: "0", margin: "0" }}>{text || record?.name || ''}
        {textLabel ? <span style={{ color: record.type == 1 ? "#46C93A" : "#FFBA00", marginLeft: "10px" }}>{`@${textLabel}`}</span> : null}
      </p>
    }
  }, {
    "title": "客户备注",
    "dataIndex": "remark",
    "algin": "center"
  }, {
    "title": "原添加人",
    "dataIndex": "handoverMemberName",
    "algin": "center"
  }, {
    "title": "接替成员",
    "dataIndex": "takeoverMemberName",
    "algin": "center"
  }, {
    "title": "接替状态",
    "dataIndex": "takeoverStatus",
    "algin": "center",
    "render": (text) => {
      return text == 1 ? "接替完毕" : text == 2 ? "等待接替" : text == 3 ? "客户拒绝" : text == 4 ? "接替成员客户达到上限" : ""
    }
  }, {
    "title": "划分时间",
    "dataIndex": "transferTimeStr",
    "algin": "center"
  }
]

export default function OnJobList({ location }) {
  const [paramobj, setParamObj] = useState({})
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  //日期参数
  const [dateArr, setDateArr] = useState([])
  //搜索参数
  const [keyword, setKeyword] = useState(null)

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  const { RangePicker } = DatePicker
  useEffect(() => {
    queryAssignedCustomerList()

  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  //请求列表接口
  const queryAssignedCustomerList = useCallback(() => {
    let startDate = null,
      endDate = null;
    if (_.size(dateArr) && !_.isNil(dateArr[0])) {
      startDate = moment(dateArr[0]).format("YYYY-MM-DD")
      endDate = moment(dateArr[1]).format("YYYY-MM-DD")
    }

    setLoading(true)
    Api.queryAssignedCustomerList({
      keyword,
      startDate,
      endDate,
      pageNo: pageInfo?.pageNo,
      pageSize: pageInfo?.pageSize,
      transferType: 1,//查询类型 1 在职 2 离职
      transferStatus: 1 //分配状态 0待分配 1已分配
    }).then((res) => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setLoading(false)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
      }
    })
  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  const changeInputValue = (e) => {
    setKeyword(e.target.value)
  }

  const handleChangeTable = (page) => {
    if (page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.defaultCurrent,
    })
  }


  // (e)=>setKeyword(e.target.value)
  return (
    <div className="onJobList">
      <p className="onJobList-pagetitle">
        已分配客户
      </p>
      <div className="onJobList-search">
        <RangePicker
          style={{ width: "260px", marginRight: "16px" }}
          onChange={setDateArr}
        />
        <Input
          value={keyword}
          style={{ width: "260px" }}
          placeholder="请输入要搜索的微信昵称、成员"
          suffix={<RsIcon type="icon-sousuo" />}
          onChange={changeInputValue}
        // onChange={changeInputValue}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={"customerExternalUserid"}
        size="small"
        onChange={handleChangeTable}
        pagination={{
          className: 'pagination',
          showTotal: (total) => `共${total}条记录`,
          showQuickJumper: true,
          showSizeChanger: true,
          current: pageInfo?.pageNo,
          pageSize: pageInfo?.pageSize,
          defaultCurrent: pageInfo.pageCount,
          total: pageInfo.total
        }}
      />
    </div>
  )
}
