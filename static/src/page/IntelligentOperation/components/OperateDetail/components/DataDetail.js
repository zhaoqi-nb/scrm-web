/* eslint-disable*/
/**
 * 数据详情组件
 */
import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Card, Table, Button } from 'antd'
import { Charts } from '@Tool/components'
import { initBarCharts, initLineCharts } from '../helper'
import { Drawer } from '@Tool/components'
// import QunqunComp from '../../QunqunComp'
// import QunComp from '../../QunComp'
import Moments from '../../Moments'
import customerMassSendInfo from '../../customerMassSendInfo'

const actionTypeObj = {
  1: '客户属性判断',
  2: '客户事件判断',
  3: '修改客户属性',
  4: '修改客户标签',
  5: '企业群发任务',
  6: '企微群群发任务',
  7: '企业朋友圈',
  8: '指定日期或事件',
  9: '等待',
}

const compObj = {
  6: customerMassSendInfo,
  5: customerMassSendInfo,
  7: Moments
}

const getActionType = (v) => (actionTypeObj[v])

function DataDetail(props) {
  const [dataSource, setDataSource] = useState([])
  const [tableInfo, setTableInfo] = useState([])
  const [lineChartSeries, setLineChartSeries] = useState({})
  const [barChartSeries, setBarChartSeries] = useState({})

  const handelDetail = async (data) => {
    await Drawer.show({ ...data, title: data?.taskName, width: 800, id: data?.businessId }, compObj[data.actionType])
  }

  const { summary, actionList, doType, fetchTableData, chartTrend = [] } = props
  const columns = [
    { title: '触发动作', dataIndex: 'actionType', render: (text) => getActionType(text) },
    { title: '任务名称', dataIndex: 'taskName', render: (text) => text || '/' },
    { title: '触发条件人次', dataIndex: 'triggerCount', render: (text) => text || 0 },
    { title: '已触达人次', dataIndex: 'deliveryCount', render: (text) => text || 0 },
    { title: '操作', dataIndex: 'edit', render: (text, records) => [5, 6, 7].includes(records?.actionType) ? <Button type="link" onClick={() => handelDetail(records)}>详情</Button> : '-' },
  ]

  useEffect(() => {
    setDataSource(actionList?.list)
    setTableInfo(actionList?.list?.length > 0 ? { ...actionList } : {})
    const BaResult = initBarCharts(Object.values(summary), '111')
    setBarChartSeries(BaResult)

    if (chartTrend?.length > 0) {
      const LineResult = initLineCharts(chartTrend)
      setLineChartSeries(LineResult)
    }
  }, [actionList, chartTrend, summary])

  return (
    <React.Fragment>
      {doType === 1 && <div style={{ marginTop: 16 }}>
        <h1>数据汇总</h1>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="流程进入人次" value={summary?.joinCount || 0} />
            </Col>
            <Col span={8}>
              <Statistic title="触发条件人次" value={summary?.triggerCount || 0} />
            </Col>
            <Col span={8}>
              <Statistic title="已触达人次" value={summary?.deliveryCount || 0} />
            </Col>
          </Row>
        </Card>
      </div>}

      {doType === 2 && <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card bordered={false} title="数据总览">
            <Charts config={barChartSeries} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} title="数据趋势">
            <Charts config={lineChartSeries} />
          </Card>
        </Col>
      </Row>}

      <Card style={{ marginTop: 16 }} bordered={false} title="触发动作完成情况">
        <Table
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            className: 'pagination',
            showTotal: (total) => `共${total}条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: tableInfo?.pageNo,
            pageSize: tableInfo?.pageSize,
            defaultCurrent: tableInfo?.pageCount,
            total: tableInfo?.total,
          }}
          onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}
          dataSource={dataSource}
          columns={columns}
        />
      </Card>
    </React.Fragment>
  )
}

export default DataDetail
