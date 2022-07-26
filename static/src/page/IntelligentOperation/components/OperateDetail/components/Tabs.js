import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux'
import { Tabs } from 'antd'
import Api from '../../../service'
import DataDetail from './DataDetail'
import ProcessConfig from './ProcessConfig'

const { TabPane } = Tabs;

function MyTabs(props) {
  const { data } = props
  const [activeKey, setActiveKey] = useState('1')
  const [chartTrend, setChartTrend] = useState({})
  const [summary, setSummary] = useState({})
  const [actionList, setActionList] = useState([])
  // const reducer = useSelector((state) => state.IntelligentOperation);
  const onChange = (v) => {
    setActiveKey(v)
  }

  const fetchTableDataFun = async (v) => {
    const res = await Api.getQueryActionList({ smartMarketingId: data.id, pageNo: v?.pageNo, pageSize: v?.pageSize })
    if (res.retCode === 200) {
      setActionList({ ...res?.data })
    }
  }

  useEffect(() => {
    const initData = async () => {
      const chartTrendData = await Api.getDataChartTrend({ smartMarketingId: data.id })
      const summaryData = await Api.getDataSummary({ smartMarketingId: data.id })
      const actionListData = await Api.getQueryActionList({ smartMarketingId: data.id, pageNo: 1, pageSize: 15 })
      if (chartTrendData?.retCode === 200) {
        setChartTrend(chartTrendData?.data)
      } else {
        setChartTrend({})
      }
      if (summaryData?.retCode === 200) {
        setSummary(summaryData?.data)
      } else {
        setSummary({})
      }
      if (actionListData?.retCode === 200) {
        setActionList(actionListData?.data)
      } else {
        setActionList({})
      }
    }
    initData()
  }, [])

  return (
    <Tabs
      tabBarStyle={{ background: '#fff', margin: '0 -24px', padding: '0 24px', position: 'sticky', top: -24, zIndex: 9 }}
      style={{ marginTop: 16 }}
      activeKey={activeKey}
      onChange={onChange}
    >
      <TabPane tab="数据详情" key="1">
        <DataDetail
          chartTrend={chartTrend}
          summary={summary}
          actionList={actionList}
          doType={data?.doType}
          fetchTableData={(v) => fetchTableDataFun(v)}
        />
      </TabPane>
      <TabPane tab="流程配置" key="2">
        <ProcessConfig data={data} />
      </TabPane>
    </Tabs>
  )
}

export default MyTabs;
