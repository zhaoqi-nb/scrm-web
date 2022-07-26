import React, { useState, useEffect } from 'react';
import { Table, Divider, Radio, Button, message } from 'antd'
import Api from '../../service'
import TextComp from '../TextComp'
import Statistic from '../Statistic'

import './index.less'

const rl = [
  { name: '全部成员', value: '' },
  { name: '已发布', value: 1 },
  { name: '未发布', value: 0 },
]

function Index(props) {
  const [radioValue, setRadioValue] = useState('')
  const [initData, setInitData] = useState({})
  const [tableData, setTableData] = useState({})
  const { data } = props

  useEffect(() => {
    const init = async () => {
      const res = await Api.getFriendCircleInfoById(data?.businessId)
      const tableDataRes = await Api.getDetailTableData({ friendCircleId: data?.businessId, pageSize: 5, publishStatus: radioValue })
      if (res?.retCode === 200) {
        setInitData({ ...res?.data })
      } else {
        setInitData({})
      }
      if (tableDataRes?.retCode === 200) {
        setTableData({ ...tableDataRes?.data })
      } else {
        setTableData({})
      }
    }
    init()
  }, [])

  const getLookList = () => ([
    { title: '全部执行成员', value: initData?.shouldDoSendCount },
    { title: '已发布成员', value: initData?.doSendCount },
    { title: '未发布成员', value: initData?.notDoSendCount },
    { title: '可见客户', value: initData?.estimateNumber },
  ])

  const getRemind = async () => {
    const res = await Api.getRemind(data?.businessId)
    if (res?.retCode === 200) {
      message.success('提醒成功')
    } else {
      message.error(res?.retMsg)
    }
  }

  const columns = [
    {
      title: '成员',
      dataIndex: 'memberName'
    },
    {
      title: '获得点赞',
      dataIndex: '1'
    },
    {
      title: '获得评论',
      dataIndex: '12'
    },
    {
      title: '发布时间',
      dataIndex: 'createTime'
    },
    {
      title: '发送状态',
      dataIndex: 'publishStatus'
    },
    {
      title: '操作',
      dataIndex: 'edit',
      render: (text, records) => (
        records?.publishStatus === 0 ? <Button type="link" onClick={() => getRemind()}>提醒发布</Button> : '-'
      )
    },
  ]

  const fetchTableData = async (v) => {
    const res = await Api.getDetailTableData({ friendCircleId: data?.businessId, pageSize: v?.pageSize, publishStatus: radioValue, pageNo: v?.pageNo })
    if (res?.retCode === 200) {
      setTableData({ ...res?.data })
    } else {
      setTableData({})
    }
  }

  useEffect(() => {
    fetchTableData({ pageSize: 5, pageNo: 1 })
  }, [radioValue])

  return (<div>
    <h2>朋友圈内容</h2>
    <TextComp bigImg={initData?.fileList} text={initData?.textContent} />
    <div className="space" />
    <h2>执行统计</h2>
    <Divider style={{ margin: '12px 0' }} />
    <Statistic list={getLookList()} />
    <Radio.Group value={radioValue} buttonStyle="outline" onChange={(v) => setRadioValue(v.target.value)}>
      {rl.map((item) => (
        <Radio.Button key={item.value} value={item.value}>{item.name}</Radio.Button>
      ))}
    </Radio.Group>
    <div className="space" />
    <div>
      <Table
        pagination={{
          position: ['bottomCenter'],
          size: 'small',
          className: 'pagination',
          showTotal: (total) => `共${total}条记录`,
          showQuickJumper: true,
          showSizeChanger: true,
          current: tableData?.pageNo,
          pageSize: tableData?.pageSize,
          defaultCurrent: tableData?.pageCount,
          total: tableData?.total,
        }}
        onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}
        dataSource={tableData?.list}
        columns={columns}
      />
    </div>
  </div>)
}

export default Index;
