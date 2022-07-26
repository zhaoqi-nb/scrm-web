/* eslint-disable*/
import React from 'react'
import { Tabs } from 'antd';
import { TYPENUM } from './helper'
import './index.less'
import { TemplateLibrary } from './components'

export default function MaterialLibrary() {
  const { TabPane } = Tabs;

  const renderTabs = () => TYPENUM?.map((item) => (
    <TabPane tab={item?.name || ''} key={item?.key || ''}>
      <TemplateLibrary checkKey={item?.key || 0} />
    </TabPane>
  ))
  const handelTabs = () => {

  }
  return (
    <div className="materialLibrary">
      <Tabs defaultActiveKey="0" onChange={handelTabs}>
        {renderTabs()}
      </Tabs>
    </div>
  )
}
