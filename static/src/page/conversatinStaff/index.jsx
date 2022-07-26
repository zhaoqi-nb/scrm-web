import React, { useState, useEffect } from 'react'
import { Select, Image, Drawer, Space } from 'antd'
import RsIcon from '@RsIcon'
// import { useHistory } from 'react-router-dom'
// import moment from 'moment'
import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'
import StaffSelect from '../comments/publicView/staffSelect'
import Api from './store/api'
import StallInfo from './comment/index'

const { Option } = Select
const optionsList = [
  { label: '已开启', selectValue: '1' },
  { label: '已停用', selectValue: '0' },
]

// 客户列表
function ConversatinStaff() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [openState, setOpenState] = useState('')
  const [userId, setUserId] = useState([])
  const [optionDataRow, setOptionDataRow] = useState({})

  const [drawerVisible, setDrawerVisible] = useState(false)

  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
    }
    data.openState = openState
    if (userId && userId.length > 0) {
      data.searchUserIds = userId.map((item) => item.id)
    }
    Api.queryList(data)
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

  const pageChange = (page, pageSize) => {
    getData(page, pageSize)
  }

  useEffect(() => {
    getData()
  }, [userId, openState])

  const selectChange = (list) => {
    setUserId(list)
  }

  const renderOption = () =>
    optionsList.map((item) => (
      <Option key={item.selectValue} value={item.selectValue}>
        {item.label}
      </Option>
    ))

  //   const title1 = (
  //     <div className="flex-box middle-a">
  //       群总数
  //       <Tooltip
  //         placement="top"
  //         title="只记录当前成员为群主的数据"
  //         overlayInnerStyle={{ color: '#333', fontSize: '12px' }}
  //         color="#fff"
  //       >
  //         <RsIcon type="icon-bangzhu1" />
  //       </Tooltip>
  //     </div>
  //   )
  const optionButtonList = [
    {
      label: '详情',
      clickFN: (data) => {
        setOptionDataRow(data)
        setDrawerVisible(true)
      },
    },
  ]

  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius11" src={url} preview={false} width={22} height={22} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }

  const columns = [
    {
      title: '成员名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text, data) => (
        <div className="flex-box">
          {renderImg(data.avatar)}
          {text}
        </div>
      ),
    },
    {
      title: '存档状态',
      dataIndex: 'openState',
      key: 'openState',
      render: (text) => {
        if (text == 1) {
          return (
            <div className="flex-box middle-a" style={{ width: '120px' }}>
              <div className="bg-success mr10 radius4" style={{ width: '8px', height: '8px' }} /> 开启
            </div>
          )
        }
        return (
          <div className="flex-box middle-a" style={{ width: '120px' }}>
            <div className="bg-tip2 mr10 radius4" style={{ width: '8px', height: '8px' }} /> 关闭
          </div>
        )
      },
    },
    {
      title: '已同意存档客户',
      dataIndex: 'customerCount',
      key: 'customerCount',
    },
    {
      title: '今日客户会话',
      dataIndex: 'todaySessionCount',
      key: 'todaySessionCount',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 200,
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
  ]
  const handleChangeCode = (value) => {
    setOpenState(value)
  }

  const onClose = () => {
    setDrawerVisible(false)
  }

  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">员工存档</div>
        </div>

        <div className="flex-box middle-a full-w">
          <div className="flex-box middle-a">
            <StaffSelect
              placeholder="请选择成员"
              onStaffChange={(e) => {
                selectChange(e)
              }}
              list={userId}
            />
          </div>
          <div className="ml24">
            <Select onChange={handleChangeCode} allowClear style={{ width: '200px' }} placeholder="请选择存档状态">
              {renderOption()}
            </Select>
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
        title="存档详情"
        placement="right"
        width={912}
        closable={false}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ padding: '0px' }}
        extra={
          <Space>
            <RsIcon onClick={onClose} type="icon-guanbi " className="f18" />
          </Space>
        }
      >
        {drawerVisible ? <StallInfo info={optionDataRow} /> : null}
      </Drawer>
    </div>
  )
}

export default ConversatinStaff
