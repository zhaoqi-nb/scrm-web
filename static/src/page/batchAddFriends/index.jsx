import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd'
import BatchGet from './batchGet'
import DataStatistics from './dataStatistics'
import './index.less'

const { TabPane } = Tabs
export default function OnJobList() {
  const [tabValue, tabChange] = useState('1')
  const [radioValue, setRadioValue] = useState('0')

  useEffect(() => {

  }, [])

  return (
    <div className="onJobList">
      <Tabs className="scrm-tabs batch-add-friends-tabs" activeKey={tabValue} onChange={tabChange} destroyInactiveTabPane>
        <TabPane tab="批量获客" key="1" />
        <TabPane tab="数据统计" key="2" />
      </Tabs>
      {tabValue == 1 ? <BatchGet radioValue={radioValue} setRadioValue={setRadioValue} /> : <DataStatistics tabChange={tabChange} setRadioValue={setRadioValue} />}
    </div>
  )
}
