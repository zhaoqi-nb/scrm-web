import React, { useState } from 'react'

import { Tabs } from 'antd'

import TableIndex from './comments/tableIndex'
import TableTwo from './comments/tableTwo'

const { TabPane } = Tabs

function ConversatinRiskRecord() {
  const [tabValue, setTabValue] = useState('1')

  const tabChange = (value) => {
    setTabValue(value)
  }

  return (
    <Tabs activeKey={tabValue} onChange={tabChange}>
      <TabPane tab="敏感词" key="1">
        <div>{tabValue == 1 ? <TableIndex /> : null}</div>
      </TabPane>
      <TabPane tab="敏感行为" key="2">
        <div>{tabValue == 2 ? <TableTwo /> : null}</div>
      </TabPane>
    </Tabs>
  )
}

export default ConversatinRiskRecord
