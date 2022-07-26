import React, { useState, useEffect } from 'react'

import { Tabs } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import TabeleIndex from './comments/tableIndex'
import DataStatisTics from './comments/dataStatistics'

const { TabPane } = Tabs

function ChannelLiveTable() {
  const history = useHistory()
  const location = useLocation()
  const [tabValue, setTabValue] = useState('1')

  const tabChange = (value) => {
    history.push({
      pathname: '/channelLiveCode',
      state: { tabKey: value },
    })
  }

  useEffect(() => {
    if (location.state && location.state.tabKey) {
      setTabValue(`${location.state.tabKey}`)
    }
  }, [location.state])

  return (
    <Tabs className="scrm-tabs" activeKey={tabValue} onChange={tabChange}>
      <TabPane tab="渠道活码" key={1}>
        <div>{tabValue == 1 ? <TabeleIndex /> : null}</div>
      </TabPane>
      <TabPane tab="数据统计" key={2}>
        <div>{tabValue == 2 ? <DataStatisTics /> : null}</div>
      </TabPane>
    </Tabs>
  )
}

export default ChannelLiveTable
