import React, { useState } from 'react';
import { Table, Divider, Radio } from 'antd'
import TextComp from '../TextComp'
import Statistic from '../Statistic'

import './index.less'

const list = [
  { title: '已发送群主', value: 35 },
  { title: '未发送群主', value: 35 },
  { title: '已送达群聊', value: 35 },
  { title: '未送达群聊', value: 35 },
]

const rl = [
  { name: '全部成员', value: 1 },
  { name: '已发送', value: 2 },
  { name: '未发送', value: 3 },
]

function Index() {
  const [radioValue, setRadioValue] = useState(1)
  // const { data } = props

  const columns = [
    {
      title: '群主成员',
      dataIndex: '1'
    },
    {
      title: '本次群发群聊数',
      dataIndex: '1'
    },
    {
      title: '本次成功群聊数',
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
      <Table columns={columns} />
    </div>
  </div>)
}

export default Index;
