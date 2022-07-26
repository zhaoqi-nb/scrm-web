import React, { useState, useEffect } from 'react'

// antd 组件
import { Select, Radio, Tooltip, Image, Spin } from 'antd'

// 公共组件
import RsIcon from '@RsIcon'
import moment from 'moment'

import DatePickerDefalut from '../comments/publicView/DatePickerDefalut'
import PulicTable from '../comments/publicView/table'
import LineChart from '../comments/publicView/lineChart'
import StaffSelect from '../comments/publicView/staffSelect'
import Api from './store/api'

const { Option } = Select
const renderImg = (nodeData) => {
  if (nodeData.thumbAvatar) {
    return <Image rootClassName="mr5 radius11" src={nodeData.thumbAvatar} preview={false} width={22} height={22} />
  }

  return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
}
const tableColumn = [
  {
    title: '成员',
    dataIndex: 'qwUserName',
    key: 'qwUserName',
    width: 120,
    render: (text, rowData) => (
      <div className="flex-box">
        {renderImg(rowData)} <div className="ml6">{text}</div>
      </div>
    ),
  },
  {
    title: '发起好友申请',
    dataIndex: 'applyCount',
    key: 'applyCount',
  },
  {
    title: '成员会话总数',
    dataIndex: 'customerChatCount',
    key: 'customerChatCount',
  },
  {
    title: '发送消息数',
    dataIndex: 'messageCount',
    key: 'messageCount',
  },
  {
    title: '已回复聊天占比',
    dataIndex: 'replyChatRatio',
    key: 'replyChatRatio',
  },
  {
    title: '平均首次回复时长',
    dataIndex: 'replyAvgDuration',
    key: 'replyAvgDuration',
  },
]

function DataStatistics() {
  const [mode, setMode] = useState('1')
  /** *表格数据** */
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  /** 图表数据* */
  const [chartConfig, setChartConfig] = useState({})

  // 统计数据
  const [dataNumInfo, setDataNumInfo] = useState({})
  const [loadingChart, setLoadingChart] = useState(false)
  const [unitText, setUnitText] = useState('')

  // 时间日期控制
  const [timeValues, setTimeValues] = useState([moment().subtract(8, 'days'), moment().subtract(1, 'days')])
  const [timeValues2, setTimeValues2] = useState([moment().subtract(8, 'days'), moment().subtract(1, 'days')])

  // 选择员工
  const [userId, setUserId] = useState([])

  const getParamData = (data = {}) => {
    const userIds = userId.map((item) => item.userId)
    const newData = {
      times: timeValues,
      times2: timeValues2,
      queryType: mode,
      userIds,

      // ...searchObj,
      ...data,
    }
    newData.startDate = moment(newData.times[0]).valueOf()
    newData.endDate = moment(newData.times[1]).valueOf()
    newData.startDate2 = moment(newData.times2[0]).valueOf()
    newData.endDate2 = moment(newData.times2[1]).valueOf()
    return newData
  }

  const getStatisticDetailListFn = (param, pageNo = 1, pageSize = 10) => {
    const newParam = getParamData(param)
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      userIds: newParam.userIds,
      startTime: newParam.startDate2,
      endTime: newParam.endDate2,
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
      startTime: data.startDate,
      endTime: data.endDate,
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
    const keyObj = {
      1: 'applyCount',
      2: 'customerChatCount',
      3: 'messageCount',
      4: 'replyChatRatio',
      5: 'replyAvgDuration',
    }
    const unitTextObj = {
      1: '',
      2: '',
      3: '',
      4: '百分比/%',
      5: '秒/S',
    }
    setUnitText('')
    Api.getStatisticChart({
      userIds: data.userIds,
      startTime: data.startDate2,
      endTime: data.endDate2,
    })
      .then((res) => {
        if (res.retCode == 200) {
          const charData = [[], []]
          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              charData[0].push(item.reportDateStr)
              let value = item[keyObj[data.queryType]]
              if (data.queryType == 5) {
                value = Number(moment(item.replyAvgDuration).format('X'))
              }
              if (data.queryType == 4) {
                value = Number(item.replyChatRatio.replace('%', ''))
              }
              if (value > 0) {
                setUnitText(unitTextObj[data.queryType])
              }
              charData[1].push(value)
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
  // 选中员工改变数据值
  const selectChange = (list) => {
    setUserId(list)
    // // 查询条件赋值格式化号了传递进去
    const userIds = list.map((item) => item.userId)
    getDataFnNo({ userIds })
  }
  // 时间改变事件
  const onDatePickerChange = (value) => {
    setTimeValues(value)
    getStatisticInfoFn({ times: value })
  }

  const onDatePickerChange2 = (value) => {
    setTimeValues2(value)
    getDataFnNo({ times2: value })
  }
  const selectTimeChange2 = (value) => {
    let times = []
    if (value == 1) {
      times = [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
    } else if (value == 2) {
      times = [moment().subtract(8, 'days'), moment().subtract(1, 'days')]
    } else if (value == 3) {
      times = [moment().subtract(1, 'month'), moment().subtract(1, 'days')]
    }
    setTimeValues2([...times])
    getDataFnNo({ times2: times })
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

  const subtext = {
    1: '发起好友申请',
    2: '会话总数',
    3: '发送消息数',
    4: '已回复占比',
    5: '平均首次回复时长',
  }
  return (
    <div className="ml-24 flex-box flex-column" style={{ minWidth: '1140px' }}>
      <div className="text-title f18 bg-white padl24 padt16">成员统计</div>
      <div className="flex-box flex-between padl24 padt16 bg-info">
        <div className=" flex-box middle-a text-title f16">联系客户数据</div>

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
        <div className="flex-box middle bg-white pad24 mr16 flex4">
          <div className="bg-info pad10 radius28 mr12">
            <div>
              <RsIcon type="icon-shujutongji-xiangkehufaqihaoyoushenqing" className="f24 text-link" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-sub1 f12 flex-box middle-a">
              <div className="text-nowrap">向客户发起好友申请</div>
              <Tooltip placement="top" title="成员想客户发起好友申请次数">
                <RsIcon type="icon-bangzhu1" className="ml3" />
              </Tooltip>
            </div>

            <div className="text-title f24">{dataNumInfo.applyCount}</div>
          </div>
        </div>
        <div className="flex-box middle bg-white pad24 mr16 flex4">
          <div className="bg-info pad10 radius28 mr12">
            <div>
              <RsIcon type="icon-shujutongji-huihuazongshu" className="f24 text-link" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-sub1 f12 flex-box middle-a">
              <div className="text-nowrap">会话总数</div>
              <Tooltip placement="top" title="成员有主动发送过消息的单聊总数">
                <RsIcon type="icon-bangzhu1" className="ml3" />
              </Tooltip>
            </div>

            <div className="text-title f24">{dataNumInfo.customerChatCount}</div>
          </div>
        </div>
        <div className="flex-box middle bg-white pad24 mr16 flex5">
          <div className="bg-info pad10 radius28 mr12">
            <div>
              <RsIcon type="icon-shujutongji-fasongxiaoxishu" className="f24 text-link" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-sub1 f12 flex-box middle-a">
              <div className="text-nowrap">发送消息数(条)</div>
              <Tooltip placement="top" title="成员在单聊中发送的消息总数">
                <RsIcon type="icon-bangzhu1" className="ml3" />
              </Tooltip>
            </div>

            <div className="text-title f24">{dataNumInfo.messageCount}</div>
          </div>
        </div>
        <div className="flex-box middle bg-white pad24 mr16 flex5">
          <div className="bg-info pad10 radius28 mr12">
            <div>
              <RsIcon type="icon-shujutongji-yihuifuzhanbi" className="f24 text-link" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-sub1 f12 flex-box middle-a">
              <div className="text-nowrap">已回复占比</div>
              <Tooltip
                placement="top"
                title="客户主动发起聊天后，成员在一个自然日内有回复过消息的聊天数÷客户主动发起的聊天数比例"
              >
                <RsIcon type="icon-bangzhu1" className="ml3" />
              </Tooltip>
            </div>

            <div className="text-title f24">{dataNumInfo.replyChatRatio}</div>
          </div>
        </div>
        <div className="flex-box middle bg-white pad24 mr16 flex5">
          <div className="bg-info pad10 radius28 mr12">
            <div>
              <RsIcon type="icon-shujutongji-pingjunshoucihuifushichang" className="f24 text-link" />
            </div>
          </div>
          <div className="flex-column alignC">
            <div className="text-sub1 f12 flex-box middle-a">
              <div className="text-nowrap">平均首次回复时长</div>
              <Tooltip
                placement="top"
                title="客户主动发起聊天后，成员在一个自然日内首次回复的时长间隔为首次回复时长，所有聊天的首次回复总时长/已回复的聊天总数即为平均首次回复时长"
              >
                <RsIcon type="icon-bangzhu1" className="ml3" />
              </Tooltip>
            </div>

            <div className="text-title f24">{dataNumInfo.replyAvgDuration}</div>
          </div>
        </div>
      </div>
      {/* 模块2 */}
      <div className="flex-box flex-column  mt28 pad24">
        <div className=" flex-box middle-a text-title f16 padb28 ">趋势</div>

        <div className="flex-box middle-a mt16">
          <Radio.Group className="radio-group-zdy" onChange={handleModeChange} value={mode}>
            <Radio.Button value="1">发起好友申请</Radio.Button>
            <Radio.Button value="2">会话总数</Radio.Button>
            <Radio.Button value="3">发送消息数</Radio.Button>
            <Radio.Button value="4">已回复占比</Radio.Button>
            <Radio.Button value="5">平均首次回复时长</Radio.Button>
          </Radio.Group>
          <Select defaultValue={2} onChange={selectTimeChange2} className="ml16" style={{ width: '176px' }}>
            <Option value={1}>昨天</Option>
            <Option value={2}>近一周</Option>
            <Option value={3}>近一个月</Option>
          </Select>
          <DatePickerDefalut value={timeValues2} className="ml16" onChange={onDatePickerChange2} />
          <StaffSelect
            onStaffChange={(e) => {
              selectChange(e)
            }}
            list={userId}
            placeholder="全部成员"
            className="ml16"
            style={{ minWidth: '176px' }}
          />
        </div>
        <div style={{ height: '425px' }} className="flex-box middle border1 mt20">
          {loadingChart ? (
            <Spin spinning={loadingChart} tip="数据加载中" />
          ) : (
            <LineChart subtext={subtext[mode]} height={425} yAxis={{ name: unitText }} data={chartConfig} />
            )}
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
