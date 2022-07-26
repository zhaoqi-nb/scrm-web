import React, { useState, useEffect } from 'react'

// antd 组件
import { Select, Tooltip, Radio } from 'antd'

// 公共组件
import RsIcon from '@RsIcon'
import moment from 'moment'
import { uniqBy } from 'lodash'
import { useLocation } from 'react-router-dom'
import SearchSelect from '../../comments/publicView/searchSelect'
import DatePickerDefalut from './DatePickerDefalut'
import PulicTable from '../../comments/publicView/table'
import LineChart from '../../comments/publicView/lineChart'
import Api from '../store/api'

const { Option } = Select

async function fetchUserList(name) {
  const data = {
    pageNo: 1,
    pageSize: 30,
  }
  if (name) {
    data.codeName = name
  }

  return Api.queryList(data).then((res) => {
    if (res.retCode == 200) {
      const { list } = res.data
      return list.map((item) => ({
        label: item.codeName,
        value: item.id,
        members: item.members || [],
      }))
    }
    return []
  })
}

const columns = [
  {
    title: '日期',
    dataIndex: 'title',
    key: 'title',
    width: 120,
    render: (text) => moment(text).format('YYYY-MM-DD'),
  },
  {
    title: '客户总数',
    dataIndex: 'totalCustomer',
    key: 'totalCustomer',
    width: 80,
  },
  {
    title: '新增人数',
    dataIndex: 'newCustomer',
    key: 'newCustomer',
    width: 120,
  },
  {
    title: '流失人数',
    dataIndex: 'unfollowCustomer',
    key: 'unfollowCustomer',
    width: 120,
  },
]
const modeText = {
  1: '扫码添加的客户总数，若客户重复添加将不会重复计数',
  2: '扫码添加的新增客户数，包含流失数据',
  3: '扫码添加后将成员删除的客户数',
}
function DataStatistics() {
  const location = useLocation()
  const [tableColumn, setTableColumn] = useState(columns)

  const [searchObj, setSearchObj] = useState({})
  const [userId, setUserId] = useState([])
  const [mode, setMode] = useState('1')
  const [modeTwo, setModeTwo] = useState('1')
  /** *表格数据** */
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  /** 图表数据* */
  const [chartConfig, setChartConfig] = useState({})

  // 统计数据
  const [dataNumInfo, setDataNumInfo] = useState({})
  const [loadingChart, setLoadingChart] = useState(false)
  // 搜索文本
  const [searchValue, setSearchValue] = useState()
  // 成员列表数据源
  const [userDataSoucre, setUserDataSoucre] = useState([])

  // 时间日期控制
  const [timeValues, setTimeValues] = useState([moment().subtract(8, 'days'), moment().subtract(1, 'days')])

  // 执行状态控制 2 默认执行
  const [carryOutStatus, setCarryOutStatus] = useState(2)

  const getParamData = (data = {}) => {
    const newData = {
      times: timeValues,
      queryType: mode, // 1客户总数 2新增客户数 3流失客户总数
      ...searchObj,
      ...data,
    }
    newData.startTime = moment(newData.times[0]).format('YYYY-MM-DD')
    newData.endTime = moment(newData.times[1]).format('YYYY-MM-DD')
    return newData
  }

  const getCustomerListFn = (param = { listType: modeTwo }, pageNo = 1, pageSize = 10) => {
    const newParam = getParamData(param)
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      ...newParam,
    }
    Api.getCustomerList(data)
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
  const getCustomerOverviewFn = (param) => {
    const data = getParamData(param)
    Api.getCustomerOverview(data)
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
  const getCustomerChartFn = (param) => {
    setLoadingChart(true)
    const data = getParamData(param)
    Api.getCustomerChart(data)
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
    getCustomerOverviewFn(data)
    getCustomerChartFn(data)
    getCustomerListFn(data)
  }

  const getDataFnNo = (data) => {
    getCustomerChartFn(data)
    getCustomerListFn(data)
  }

  /** *
   *1.点击列表数据统计跳转该页面时
   *执行词useEffect
   ** */
  useEffect(() => {
    const param = location.state
    if (param && param.id) {
      setSearchValue([
        {
          label: param.codeName,
          value: param.id,
        },
      ])
      const dataSource = []
      param.members.forEach((memberItem) => {
        dataSource.push({
          label: memberItem.name,
          value: memberItem.memberId,
          memberItem,
        })
      })
      const members = dataSource.map((sourceItem) => sourceItem.value)
      searchObj.members = members

      getData(searchObj)
      // 初始值
      setUserDataSoucre(dataSource)
      setUserId(members)
      setSearchObj({ ...searchObj })
      setCarryOutStatus(1)
    }
  }, [location.state])

  /**
   *
   * 1.点击列表数据统计跳转该页面时 不执行此次getData
   * 2.点击数据统计是执行此处的getData
   * 3. 页面操作活码选项，员工选项调用此处getData
   * * */
  useEffect(() => {
    if (carryOutStatus == 2) {
      getData()
      setCarryOutStatus(2)
    }
  }, [searchObj])

  const pageChange = (page, pageSize) => {
    getCustomerListFn({}, page, pageSize)
  }

  // 选择活码改事件
  const handleChange = (item, option) => {
    // 多选处理注释
    searchObj.codes = item.map((itemObj) => itemObj.value)
    // 单选处理了
    // searchObj.codes = [item.value]
    // 一定要这样写，否则不会触发useEffect

    let dataSource = []
    option.forEach((element) => {
      element.members.forEach((memberItem) => {
        dataSource.push({
          label: memberItem.name,
          value: memberItem.memberId,
          memberItem,
        })
      })
    })
    const members = dataSource.map((sourceItem) => sourceItem.value)
    searchObj.members = members
    dataSource = uniqBy(dataSource, 'value')
    setUserId(members)
    setUserDataSoucre(dataSource)
    setSearchObj({ ...searchObj })
    setSearchValue(item)
  }

  // 时间改变事件
  const onDatePickerChange = (value) => {
    setTimeValues(value)
    getDataFnNo({ times: value })
  }
  // 员工选择操作
  const selectChange = (list) => {
    searchObj.members = list
    setUserId(list)
    setSearchObj({ ...searchObj })
  }
  const handleModeChange = (e) => {
    setMode(e.target.value)
    getCustomerChartFn({ queryType: e.target.value })
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
    getDataFnNo({ times })
  }
  const handleModeTwoChange = (e) => {
    setModeTwo(e.target.value)

    if (e.target.value == 1) {
      columns[0] = {
        title: '日期',
        dataIndex: 'title',
        key: 'title',
        width: 120,
        render: (text) => moment(text).format('YYYY-MM-DD'),
      }
    } else {
      columns[0] = {
        title: '成员',
        dataIndex: 'title',
        key: 'title',
        width: 120,
      }
    }
    setTableColumn(...columns)

    getCustomerListFn({ listType: e.target.value })
  }
  const lineStyle = {
    width: '1px',
    height: '158px',
    border: '1px solid rgba(225, 232, 240, 0.5)',
  }

  const CUSTOMER = {
    1: '客户总数',
    2: '新增客户数',
    3: '流失客户数',
  }

  return (
    <div className="padt24 padb24 flex-box flex-column bg-white" style={{ minWidth: '1140px' }}>
      <div className="flex-box">
        <SearchSelect
          mode="multiple"
          showSearch
          value={searchValue}
          placeholder="全部活码"
          fetchOptions={fetchUserList}
          maxTagCount={1}
          style={{ width: '176px' }}
          onChange={handleChange}
        />
        <div className="flex-box middle-a ml16">
          <Select
            mode="multiple"
            placeholder="请选择成员"
            maxTagCount={1}
            showArrow
            value={userId}
            style={{ width: '352px' }}
            onChange={selectChange}
            options={userDataSoucre}
          />
        </div>
      </div>

      {/* 模块1 */}
      <div className="flex-box middle-a mt16">
        <div
          className="flex-box middle-a flex-between pad36 flex1 radius8 mr24"
          style={{ border: '1px solid rgba(225, 232, 240, 0.5)' }}
        >
          <div className="flex-box middle flex-column flex1">
            <div className="bg-info pad12 radius28">
              <RsIcon type="icon-bianzu1" className="f32" />
            </div>
            <div className="text-title text-bold f36">{dataNumInfo.todayNewCustomer}</div>
            <div className="text-sub1">今日添加客户数（人）</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-box middle flex-column flex1">
            <div className="bg-info pad12 radius28">
              <RsIcon type="icon-a-bianzu1" className="f32" />
            </div>
            <div className="text-title text-bold f36">{dataNumInfo.todayUnfollowCustomer}</div>
            <div className="text-sub1">今日流失客户数（人）</div>
          </div>
        </div>
        <div
          className="flex-box middle-a flex-between pad36 flex1 radius8 mr24"
          style={{ border: '1px solid rgba(225, 232, 240, 0.5)' }}
        >
          <div className="flex-box middle flex-column flex1">
            <div className="bg-info pad12 radius28">
              <RsIcon type="icon-bianzu1" className="f32" />
            </div>
            <div className="text-title text-bold f36">{dataNumInfo.totalCustomer}</div>
            <div className="text-sub1">总添加客户数（人）</div>
          </div>
          <div style={{ ...lineStyle }} />
          <div className="flex-box middle flex-column flex1">
            <div className="bg-info pad12 radius28">
              <RsIcon type="icon-a-bianzu1" className="f32" />
            </div>
            <div className="text-title text-bold f36">{dataNumInfo.totalUnfollowCustomer}</div>
            <div className="text-sub1">总流失客户数（人）</div>
          </div>
        </div>
      </div>

      {/* 模块2 */}
      <div className="flex-box flex-column  mt28">
        <div className=" flex-box middle-a text-title f16 padb28 ">
          数据统计
          <Tooltip
            placement="top"
            title={modeText[mode]}
            overlayInnerStyle={{ color: '#333', fontSize: '12px' }}
            color="#fff"
          >
            <RsIcon type="icon-bangzhu1" className="ml6" />
          </Tooltip>
        </div>

        <div className="flex-box">
          <Select defaultValue={2} onChange={selectTimeChange} style={{ width: '176px' }}>
            <Option value={1}>昨天</Option>
            <Option value={2}>近一周</Option>
            <Option value={3}>近一个月</Option>
          </Select>
          <DatePickerDefalut value={timeValues} className="ml16" onChange={onDatePickerChange} />
        </div>
        <div className="flex-box middle-a mt16">
          <Radio.Group className="radio-group-zdy" onChange={handleModeChange} value={mode}>
            <Radio.Button value="1">客户总数</Radio.Button>
            <Radio.Button value="2">新增客户数</Radio.Button>
            <Radio.Button value="3">流失客户数</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ height: '425px' }} className="flex-box middle mt20 border1">
          {loadingChart ? null : (
            <LineChart
              subtext="客户统计"
              yAxis={{ name: '人数' }}
              title={CUSTOMER[mode]}
              height={425}
              data={chartConfig}
            />
          )}
        </div>
        <div>
          <div className="flex-box middle-a mt28 mb16">
            <Radio.Group className="radio-group-zdy" onChange={handleModeTwoChange} value={modeTwo}>
              <Radio.Button value="1">按日期查看</Radio.Button>
              <Radio.Button value="2">按成员查看</Radio.Button>
            </Radio.Group>
          </div>

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
