import React, { useState, useEffect } from 'react'
import { Input, message, Modal, Image, Drawer, Space, Button, Avatar } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory } from 'react-router-dom'
import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'
// import StaffSelect from '../comments/publicView/staffSelect'
import ClientInfo from './comment/index'
import Api from './store/api'
// 客户列表
function ConversatinClient() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [codeName, setcodeName] = useState('')
  const [showInfo, setShowInfo] = useState(true)
  // const [userId, setUserId] = useState([])
  const [visible, setVisible] = useState(false)
  const [optionDataRow, setOptionDataRow] = useState({})
  const [drawerVisible, setDrawerVisible] = useState(false)

  const getData = (param = {}, pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      ...param,
    }
    // if (userId && userId.length > 0) {
    //   data.memberIds = userId.map((item) => item.id)
    // }
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
  const getParamData = (data) => {
    const param = {
      searchContent: codeName,
      ...data,
    }
    getData(param)
  }
  const pageChange = (page, pageSize) => {
    getData({}, page, pageSize)
  }

  useEffect(() => {
    Api.getCongfig().then((res) => {
      if (res.retCode == 200 && res.data?.sessionsaveSecret) {
        setShowInfo(false)
        getParamData()
      } else {
        setShowInfo(true)
      }
    })
  }, [])

  const handleSearchEvent = () => {
    getParamData({ searchContent: codeName })
  }
  const handleChangeName = (value) => {
    setcodeName(value)
  }
  // const selectChange = (list) => {
  //   setUserId(list)
  // }

  const deleteData = (id) => {
    Api.deleteData({ id })
      .then((res) => {
        if (res.retCode == 200) {
          message.success('操作成功')
          getData()
        } else {
          message.error(res.retMsg)
        }
      })
      .finally(() => {
        setVisible(false)
      })
  }
  const handleOk = () => {
    if (optionDataRow.id) deleteData(optionDataRow.id)
  }
  const optionButtonList = [
    {
      label: '详情',
      clickFN: (data) => {
        setOptionDataRow(data)
        setDrawerVisible(true)
      },
    },
  ]

  /** 页面渲染处理* */
  const history = useHistory() // 路由处理

  const goConversationEmpower = () => {
    history.push({ pathname: '/conversationEmpower', state: { back: true } })
  }

  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius11" src={url} preview={false} width={22} height={22} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }

  const columns = [
    {
      title: '成员名称',
      dataIndex: 'customerName',
      key: 'customerName',
      // width: 120,
      render: (text, record) => {
        const { customerAvator, customerType, customerCorpName } = record
        return (
          <>
            <Avatar style={{ marginRight: '8px' }} src={customerAvator} size={24} />
            {text}
            {[1, 2].indexOf(customerType) > -1 && (
              <div className="customer-type">@{customerType == 1 ? '微信' : customerCorpName}</div>
            )}
          </>
        )
      },
    },
    {
      title: '已加企微成员',
      dataIndex: 'sessionRelationInUserList',
      key: 'sessionRelationInUserList',
      render: (items) =>
        items && items.length && items.slice ? (
          <div className="flex-box">
            {items.slice(0, 5).map((item) => (
              <div className="flex-box f14 middle-a mr14">
                {renderImg(item.avatar)} {item.name}
              </div>
            ))}
            {items.length > 5 ? `等共${items.length}人` : null}
          </div>
        ) : null,
    },
    {
      title: '消息总数',
      dataIndex: 'msgCount',
      key: 'msgCount',
    },
    {
      title: '今日消息数',
      dataIndex: 'todayMsgCount',
      key: 'todayMsgCount',
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

  const onClose = () => {
    setDrawerVisible(false)
  }
  // const renderRowInfo = () => <div>111</div>
  const renderList = () => (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">客户存档</div>
        </div>
        <div className="flex-box middle-a full-w">
          <div>
            <Input
              suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
              className="input-search"
              style={{ width: '240px' }}
              placeholder="请输入要搜索的客户微信昵称"
              onPressEnter={() => handleSearchEvent()}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </div>

          {/* <div className="flex-box middle-a ml24">
              <div className="mr8">使用员工:</div>
              <StaffSelect onStaffChange={selectChange} list={[]} />
            </div> */}
        </div>
      </div>
      <PulicTable
        columns={columns}
        loading={loading}
        pagination={pagination}
        dataSource={dataList}
        pageChange={pageChange}
      />

      <Modal
        title="删除提示框"
        onCancel={() => {
          setVisible(false)
        }}
        visible={visible}
        onOk={handleOk}
        okText="删除"
        okButtonProps={{ danger: true }}
      >
        <p>删除后已投放活码也将失效，确认删除吗？</p>
      </Modal>
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
        {drawerVisible ? <ClientInfo info={optionDataRow} /> : null}
      </Drawer>
    </div>
  )
  const rendInfo = () => (
    <div className="full flex-box middle flex-column">
      <Image src={require('./image/showInfo.png')} preview={false} width={276} />
      <div className="mt36">
        企业会话内容存档为企业微信官方提供的增值服务，可获取企业授权成员和客户的会话内容，
        <br />
        通过会话的合理监管，帮助企业提高客户沟通效率、服务标准，对客户沟通流程合规化管理
      </div>
      <Button
        type="primary"
        onClick={() => {
          goConversationEmpower()
        }}
        className="mt24"
      >
        会话存档授权
      </Button>
    </div>
  )
  return <div className="full">{showInfo ? rendInfo() : renderList()}</div>
}

export default ConversatinClient
