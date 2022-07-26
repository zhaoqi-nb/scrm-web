import React, { useState, useEffect } from 'react'
import { Input, Drawer, Space, Radio } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'
import PulicTable from '../../comments/publicView/table'
import TableDropDown from '../../comments/publicView/tableDropDown'
import Api from '../store/api'
import DatePickerDefalut from '../../comments/publicView/DatePickerDefalut'
import RecordList from './recordList'

function TableIndex() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState('7')
  const [keyWord, setkeyWord] = useState()

  const [optionData, setOptionData] = useState('')

  // 时间日期控制
  const [timeValues, setTimeValues] = useState([moment().subtract(8, 'days'), moment().subtract(1, 'days')])

  const getData = (param = {}, pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      ...param,
    }
    Api.getSensitiveTriggerRecord(data)
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
  const getParamData = (data) => {
    const param = {
      times: timeValues,
      keyWord,
      ...data,
    }
    param.startDate = moment(param.times[0]).valueOf()
    param.endDate = moment(param.times[1]).valueOf()
    param.triggerRecordUserIds = []
    delete param.times
    getData(param)
  }
  const pageChange = (page, pageSize) => {
    getParamData({}, page, pageSize)
  }

  useEffect(() => {
    getParamData()
  }, [])

  const handleModeChange = (e) => {
    const { value } = e.target
    let times = []
    if (value == 7) {
      times = [moment().subtract(8, 'days'), moment().subtract(1, 'days')]
    } else if (value == 30) {
      times = [moment().subtract(1, 'month'), moment().subtract(1, 'days')]
    }
    setTimeValues([...times])
    getParamData({ times })
    setMode(value)
  }
  // 时间改变事件
  const onDatePickerChange = (value) => {
    setTimeValues(value)
    getParamData({ times: value })
  }

  const optionButtonList = [
    {
      label: '定位聊天',
      clickFN: (data) => {
        setOptionData(data)
        setTitle(`${data.triggerUserName}聊天记录`)
        setDrawerVisible(true)
      },
    },
  ]

  const columns = [
    {
      title: '敏感词',
      dataIndex: 'sensitiveWord',
      key: 'sensitiveWord',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '聊天方式',
      dataIndex: 'messageType',
      key: 'messageType',
      render: (text) => {
        if (text == 1) {
          return '单聊'
        }
        return '群聊'
      },
    },
    {
      title: '触发人',
      dataIndex: 'triggerUserName',
      key: 'triggerUserName',
      render: (text, data) => {
        const className = data.triggerUserType == 2 ? 'bg-primary' : 'bg-success'
        const typetext = data.triggerUserType == 2 ? '客户' : '成员'
        return (
          <div className="flex-box">
            <div className={`${className} padl6 padr6 text-white radius3 mr12 f12`}>{typetext}</div>
            <div>{text}</div>
          </div>
        )
      },
    },
    {
      title: '触发时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 220,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
  ]
  const handleSearchEvent = () => {
    getParamData({ keyWord })
  }
  const handleChangeName = (value) => {
    setkeyWord(value)
  }
  const onClose = () => {
    setDrawerVisible(false)
  }
  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">敏感行为</div>
        </div>
        <div className="flex-box middle-a full-w">
          <div>
            <Input
              suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
              className="input-search"
              style={{ width: '240px' }}
              placeholder="请输入要搜索的渠道活码"
              onPressEnter={() => handleSearchEvent()}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </div>

          <div className="flex-box middle-a">
            <DatePickerDefalut value={timeValues} className="ml16" onChange={onDatePickerChange} />
          </div>
          <div className="flex-box middle-a ml16">
            <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio.Button value="7">近7天</Radio.Button>
              <Radio.Button value="30">近30天</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
      <PulicTable
        columns={columns}
        loading={loading}
        pagination={pagination}
        dataSource={dataList}
        pageChange={pageChange}
      />
      <Drawer
        title={title}
        placement="right"
        width={413}
        closable={false}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: '0px', paddingRight: '0px' }}
        extra={
          <Space>
            <RsIcon onClick={onClose} type="icon-guanbi " className="f18" />
          </Space>
        }
      >
        {drawerVisible ? <RecordList id={optionData.id} fromId={optionData.triggerUserId} /> : null}
      </Drawer>
    </div>
  )
}

export default TableIndex
