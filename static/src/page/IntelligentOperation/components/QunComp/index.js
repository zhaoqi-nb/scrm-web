import React, { useState, useEffect } from 'react';
import { Table, Divider, Radio } from 'antd'
import Api from '../../service'
import TextComp from '../TextComp'
import Statistic from '../Statistic'

import './index.less'

const list = [
  { title: '已发送成员', value: 35 },
  { title: '未发送成员', value: 35 },
  { title: '已送达客户', value: 35 },
  { title: '未送达客户', value: 35 },
  { title: '接收送达上限', value: 35 },
  { title: '已不是好友', value: 35 },
]

const rl = [
  { name: '全部成员', value: 1 },
  { name: '已发送成员', value: 2 },
  { name: '未发送成员', value: 3 },
  { name: '发送失败', value: 4 },
]

function Index(props) {
  const [radioValue, setRadioValue] = useState(1)
  const { data } = props
  useEffect(() => {
    const init = async () => {
      await Api.getBulkMessageDetail({ id: data?.businessId })
    }
    init()
  }, [])
  const columns = [
    {
      title: '成员',
      dataIndex: '1'
    },
    {
      title: '本次群发客户数',
      dataIndex: '1'
    },
    {
      title: '本次成功客户数',
      dataIndex: '1'
    },
    {
      title: '发送状态',
      dataIndex: '1'
    },
    {
      title: '操作',
      dataIndex: '1'
    },
  ]

  return (<div>
    <h2>群发内容</h2>
    <TextComp text="尊敬的优质用户你好，尊敬的优质用户你好尊敬的优质用户你好，尊敬的优质用户你好!" />
    <TextComp text="尊敬的优质用户你好，尊敬的优质用户你好尊敬的优质用户你好，尊敬的优质用户你好!" />
    <TextComp icon text="尊敬的优质用户你好，尊敬的优敬的优质用户你好!" />
    <div className="space" />
    <h2>执行统计</h2>
    <Divider style={{ margin: '12px 0' }} />
    <Statistic list={list} />
    <Radio.Group value={radioValue} buttonStyle="outline" onChange={(v) => setRadioValue(v.target.value)}>
      {rl.map((item) => (
        <Radio.Button key={item.value} value={item.value}>{item.name}</Radio.Button>
      ))}
    </Radio.Group>
    <div className="space" />
    <div>
      <Table
        // pagination={{
        //   position: ['bottomCenter'],
        //   size: 'small',
        //   className: 'pagination',
        //   showTotal: (total) => `共${total}条记录`,
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   current: tableInfo?.pageNo,
        //   pageSize: tableInfo?.pageSize,
        //   defaultCurrent: tableInfo?.pageCount,
        //   total: tableInfo?.total,
        // }}
        // onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}
        // dataSource={dataSource}
        columns={columns}
      />
    </div>
  </div>)
}

export default Index;
