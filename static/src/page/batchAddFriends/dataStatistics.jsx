/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button } from 'antd'
import StaffSelect from '../comments/publicView/staffSelect'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'

export default function DataStatistics(props) {
  const [overviewInfo, setOverviewInfo] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  //下拉参数
  const [sysUserId, setSysUserId] = useState([])

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  useEffect(() => {
    Api.overviewList().then(res => {
      if (res.retCode == 200) {
        let list = [
          { name: "导入客户数", value: _.get(res, "data.total") },
          { name: "待添加客户", value: _.get(res, "data.waitAdd") },
          { name: "待通过客户数", value: _.get(res, "data.waitAccept") },
          { name: "已添加总客户数", value: _.get(res, "data.accept") },
          { name: "添加完成率", value: _.get(res, "data.addRatio") }
        ]
        setOverviewInfo(list)

      }
    })
  }, [])
  useEffect(() => [
    memberList()
  ], [pageInfo.pageNo, pageInfo.pageSize, sysUserId])

  //list
  const memberList = useCallback(() => {
    setLoading(true)
    Api.memberList({
      memberId: sysUserId.map(item => item.userId).join(",") || null,
      pageNo: pageInfo.pageNo,
      pageSize: pageInfo.pageSize,
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.total')
        })
        setLoading(false)
      }
    })
  }, [pageInfo.pageNo, pageInfo.pageSize, sysUserId])
  const selectChange = (list) => {
    setSysUserId(list)
  }

  //分页
  const handleChangeTable = (page) => {
    if (page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.total,
    })
  }

  const columns = [
    {
      title: "成员",
      dataIndex: "memberName",
      algin: "center",
      width: 140,
      fixed: "left"
    }, {
      title: "分配客户总数",
      dataIndex: "total",
      algin: "center",
      width: 140,
      fixed: "left"
    }, {
      title: "待添加客户总数",
      dataIndex: "waitAdd",
      algin: "center"
    }, {
      title: "待通过客户总数",
      dataIndex: "waitAccept",
      algin: "center"
    }, {
      title: "已添加客户总数",
      dataIndex: "accept",
      algin: "center"
    }, {
      title: "添加完成率",
      dataIndex: "addRatio",
      algin: "center"
    }
  ]

  return (
    <div className="dataStatistics">
      <div className="dataStatistics-header">数据分析</div>
      <div className="dataStatistics-info">
        <p className="dataStatistics-header" style={{ marginBottom: 0 }}>数据总览</p>
        <div className="dataStatistics-info-dl">
          {
            overviewInfo.map((item, index) => {
              return <dl>
                <dt><img src={
                  index == 0 ? require("./images/one.png") : index == 1 ? require("./images/two.png") : index == 2 ? require("./images/three.png") : index == 3 ? require("./images/four.png") : require("./images/five.png")
                } style={{ cursor: "pointer" }} onClick={() => {
                  if (index == 4) index = "0"
                  props.setRadioValue(String(index))
                  props.tabChange("1")
                }} /></dt>
                <dd>
                  <p className="dataStatistics-info-dl-name">{item.name}</p>
                  <p className="dataStatistics-info-dl-value">{item.value}</p>
                </dd>
              </dl>
            })
          }
        </div>
      </div>
      <div>
        <p className="dataStatistics-header" style={{ marginBottom: 0 }}>成员添加情况</p>
        <div style={{ margin: '0 24px' }}><StaffSelect onStaffChange={selectChange} list={sysUserId} /></div>
        <Table
          style={{ margin: '16px 24px 0' }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 'max-content' }}
          onChange={handleChangeTable}
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
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
    </div>
  )
}
