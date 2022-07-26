import React, { useState, useEffect } from 'react'

// antd 组件
import { Select, Radio } from 'antd'

// 公共组件
import RsIcon from '@RsIcon'
import moment from 'moment'

import DatePickerDefalut from '../comments/publicView/DatePickerDefalut'
import PulicTable from '../comments/publicView/table'
import LineChart from '../comments/publicView/lineChart'
import Api from './store/api'

const { Option } = Select

const tableColumn = [
  {
    title: '成员',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '客户总数',
    dataIndex: 'totalCustomer',
    key: 'totalCustomer',
  },
  {
    title: '微信客户',
    dataIndex: 'totalWxCustomer',
    key: 'totalWxCustomer',
  },
  {
    title: '新增微信客户',
    dataIndex: 'newWxCustomer',
    key: 'newWxCustomer',
  },
  {
    title: '企微流失客户',
    dataIndex: 'followQwCustomer',
    key: 'followQwCustomer',
  },
  {
    title: '企微群聊',
    dataIndex: 'groupChatNum',
    key: 'groupChatNum',
  },
  {
    title: '群聊消息总数',
    dataIndex: 'groupChatMsgNum',
    key: 'groupChatMsgNum',
  },
]

function DataStatistics() {
  // const location = useLocation()
  // const [tableColumn, setTableColumn] = useState(columns)

  // const [searchObj, setSearchObj] = useState({})
  // const [userId, setUserId] = useState([])
  const [mode, setMode] = useState('1')
  // const [modeTwo, setModeTwo] = useState('1')
  /** *表格数据** */
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  /** 图表数据* */
  const [chartConfig, setChartConfig] = useState({})

  // 统计数据
  const [dataNumInfo, setDataNumInfo] = useState({})
  const [loadingChart, setLoadingChart] = useState(false)
  // // 搜索文本
  // const [searchValue, setSearchValue] = useState()
  // // 成员列表数据源
  // const [userDataSoucre, setUserDataSoucre] = useState([])

  // 时间日期控制
  const [timeValues, setTimeValues] = useState([moment().subtract(8, 'days'), moment().subtract(1, 'days')])
  const [timeValues2, setTimeValues2] = useState([moment().subtract(15, 'days'), moment().subtract(1, 'days')])
  // // 执行状态控制 2 默认执行
  // const [carryOutStatus, setCarryOutStatus] = useState(2)

  const getParamData = (data = {}) => {
    const newData = {
      times: timeValues,
      times2: timeValues2,
      queryType: mode, // 1客户总数 2新增客户数 3流失客户总数
      // ...searchObj,
      ...data,
    }
    newData.startDate = moment(newData.times[0]).format('YYYY-MM-DD')
    newData.endDate = moment(newData.times[1]).format('YYYY-MM-DD')
    newData.startDate2 = moment(newData.times2[0]).format('YYYY-MM-DD')
    newData.endDate2 = moment(newData.times2[1]).format('YYYY-MM-DD')
    return newData
  }

  const getStatisticDetailListFn = (param, pageNo = 1, pageSize = 10) => {
    const newParam = getParamData(param)
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      queryType: newParam.queryType,
      startDate: newParam.startDate2,
      endDate: newParam.endDate2,
    }
    Api.getStatisticDetailList(data)
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          setDataList(list)
          setPagination({ ...pagination, total, pageNo, pageSize })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const getStatisticInfoFn = (param) => {
    const data = getParamData(param)
    Api.getStatisticInfo({
      startDate: data.startDate,
      endDate: data.endDate,
    })
      .then((res) => {
        if (res.retCode == 200) {
          setDataNumInfo(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  // 图标数据处理
  const getStatisticChartFn = (param) => {
    setLoadingChart(true)
    const data = getParamData(param)
    Api.getStatisticChart({
      queryType: data.queryType,
      startDate: data.startDate2,
      endDate: data.endDate2,
    })
      .then((res) => {
        if (res.retCode == 200) {
          const charData = [[], []]
          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              charData[0].push(item.xaxis)
              charData[1].push(item.yaxis)
            })
          }
          setChartConfig([...charData])
        }
      })
      .finally(() => {
        setLoadingChart(false)
      })
  }
  const getData = (data = {}) => {
    // 数字数据
    getStatisticInfoFn(data)
    getStatisticChartFn(data)
    getStatisticDetailListFn(data)
  }

  const getDataFnNo = (data) => {
    getStatisticChartFn(data)
    getStatisticDetailListFn(data)
  }

  /**
   *
   * 1.点击列表数据统计跳转该页面时 不执行此次getData
   * 2.点击数据统计是执行此处的getData
   * 3. 页面操作活码选项，员工选项调用此处getData
   * * */
  useEffect(() => {
    getData()
  }, [])

  const pageChange = (page, pageSize) => {
    getStatisticDetailListFn({}, page, pageSize)
  }

  // 时间改变事件
  const onDatePickerChange = (value) => {
    setTimeValues(value)
    getStatisticInfoFn({ times: value })
  }

  const onDatePickerChange2 = (value) => {
    setTimeValues2(value)
    getDataFnNo({ times: value })
  }

  const handleModeChange = (e) => {
    setMode(e.target.value)
    getDataFnNo({ queryType: e.target.value })
  }
  const selectTimeChange = (value) => {
    let times = []
    if (value == 1) {
      times = [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
    } else if (value == 2) {
      times = [moment().subtract(8, 'days'), moment().subtract(1, 'days')]
    } else if (value == 3) {
      times = [moment().subtract(1, 'month'), moment().subtract(1, 'days')]
    }
    setTimeValues([...times])
    getStatisticInfoFn({ times })
  }
  const lineStyle = {
    width: '1px',
    height: '60px',
    border: '1px solid #F4F4F5',
  }
  const subtext = {
    1: '微信客户',
    2: '新增微信客户',
    3: '企微流失客户',
    4: '入群客户',
    5: '退群客户',
  }
  return (
    <div className="ml-24 flex-box flex-column" style={{ minWidth: '1140px' }}>
      <div className="text-title f18 bg-white padl24 padt16">客户统计</div>
      <div className="flex-box flex-between padl24 padt16 bg-info">
        <div className=" flex-box middle-a text-title f16">客户数据统计</div>

        <div className="flex-box padr24">
          <Select defaultValue={2} onChange={selectTimeChange} style={{ width: '176px' }}>
            <Option value={1}>昨天</Option>
            <Option value={2}>近一周</Option>
            <Option value={3}>近一个月</Option>
          </Select>
          <DatePickerDefalut value={timeValues} className="ml16" onChange={onDatePickerChange} />
        </div>
      </div>
      {/* 模块1 */}
      <div className="flex-box middle-a flex-between padr24 padl24 padb20 padt12  bg-info">
        <div className="flex-box middle bg-white pad24 mr16">
          <div className="bg-info pad10 radius28 mr12">
            <div style={{ border: '1px dashed red' }}>
              <RsIcon type="icon-bianzu1" className="f28" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-title f24 ">{dataNumInfo.totalCustomerCount}</div>
            <div className="text-sub1 f12 mt20">客户总数</div>
          </div>
        </div>
        <div className="flex-box middle bg-white flex-between pad24 flex1">
          <div className="flex-column middle flex1 alignC">
            <div className="text-title f24 ">{dataNumInfo.wxCustomerCount}</div>
            <div className="text-sub1 f12 mt20 ">微信客户</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-column middle flex1 alignC">
            <div className="text-title f24 ">{dataNumInfo.newAddWxCustomerCount}</div>
            <div className="text-sub1 f12 mt20">新增微信客户</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-column middle flex1 alignC">
            <div className="text-title f24 ">{dataNumInfo.companyChatGroupNum}</div>
            <div className="text-sub1 f12 mt20">企微群聊数</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-column middle flex1 alignC">
            <div className="text-title f24 ">{dataNumInfo.joinGroupNum}</div>
            <div className="text-sub1 f12 mt20">入群数</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-column middle flex1 alignC">
            <div className="text-title f24 ">{dataNumInfo.outGroupNum}</div>
            <div className="text-sub1 f12 mt20">退群数</div>
          </div>
        </div>
      </div>
      {/* 模块2 */}
      <div className="flex-box flex-column  mt28 pad24">
        <div className=" flex-box middle-a text-title f16 padb28 ">趋势</div>

        <div className="flex-box middle-a mt16">
          <Radio.Group className="radio-group-zdy" onChange={handleModeChange} value={mode}>
            <Radio.Button value="1">微信客户</Radio.Button>
            <Radio.Button value="2">新增微信客户</Radio.Button>
            <Radio.Button value="3">企微流失客户</Radio.Button>
            <Radio.Button value="4">入群客户</Radio.Button>
            <Radio.Button value="5">退群客户</Radio.Button>
          </Radio.Group>
          <DatePickerDefalut value={timeValues2} className="ml16" onChange={onDatePickerChange2} />
        </div>
        <div style={{ height: '425px' }} className="flex-box middle border1 mt20">
          {loadingChart ? null : <LineChart subtext={subtext[mode]} height={425} data={chartConfig} />}
        </div>
        <div className=" flex-box middle-a text-title f16 padb28 padt30 ">明细</div>
        <div>
          <PulicTable
            columns={tableColumn}
            loading={loading}
            pagination={pagination}
            dataSource={dataList}
            pageChange={pageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default DataStatistics
