import React, { Component } from 'react'
import { Table, Space, Button, Avatar, Select, Badge, Tooltip, Input, } from 'antd'
import Modal from '@Modal'
import RsIcon from '@RsIcon'
import ReactEvents from '../../utils/events'
import CustomerInfo from '../comments/customerInfo'
import Api from './store/api'

const sendStatusList = { // 是否有效:1已发送;0未发送,-1发送失败
  1: '已完成发送',
  0: '未完成发送',
  // '-1': '发送失败',
}

const joinGroupType = {
  1: '未进群',
  0: '已进群',
}

const receiveStatusList = {
  1: '已收到邀请',
  0: '未收到邀请',
  2: '客户已不是好友',
  3: '客户接收已达上限',
}

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  cusTomerInfoRef = React.createRef()

  componentDidMount() {
    this.getData()
    ReactEvents.addListener('getData', this.getData)
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
    ReactEvents.removeListener('getData', this.getData)
  }

  getInitialState() {
    return {
      isReady: false,
      dataSource: [],
      memberColumns: [
        {
          title: '执行成员',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
          render: (_, record) => {
            const { avatar, name } = record
            return <>
              {avatar && <Avatar style={{ marginRight: 8 }} size={24} src={avatar} />}
              {name}
            </>
          }
        },
        {
          title: '客户总数',
          dataIndex: 'count',
          width: 150,
        },
        {
          title: '已邀请',
          dataIndex: 'sendCount',
          width: 150,
        },
        {
          title: '进群人数',
          dataIndex: 'jointCount',
          width: 150,
          render: (text, record) => {
            const { sendCount } = record
            if (!sendCount) return 0
            return <div>{text}({(text / sendCount) * 100}%)</div>
          }
        },
        {
          title: '发送状态',
          dataIndex: 'sendStatus',
          width: 120,
          render: (status) => {
            let color = ''
            const text = sendStatusList[status]
            if (status == 0) {
              color = '#E5E6EB'
            } else if (status == 1) {
              color = '#46C93A'
            }
            return <Badge color={color} text={text} />
          }
          // render: (sendStatus) => sendStatusList[sendStatus]
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          fixed: 'right',
          render: (_, record) => {
            const { memberId, sendStatus, sendCount, count } = record
            const callDisabled = sendStatus == -1 || count == sendCount
            return (
              <Space>
                <Button disabled={callDisabled} onClick={() => this.handleChangeVisible('提示', memberId)} type="link">
                  提醒发送
                </Button>
              </Space>
            )
          },
        }
      ],
      customerColumns: [
        {
          title: '客户',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
          render: (_, record) => {
            const { avatar, name } = record
            return <div style={{ width: '150px', display: 'flex' }}>
              {avatar && <Avatar style={{ marginRight: 8, flex: '0 0 40px' }} size={40} src={avatar} />}
              <Tooltip title={<div>{name}</div>}>
                <div className="text-ellipsis" style={{ flex: 1 }}>
                  {name}<br />
                  {name}
                </div>
              </Tooltip>

            </div>
          }
        },
        {
          title: '执行成员',
          dataIndex: 'sendMemberName',
          width: 150,
          render: (_, record) => {
            const { sendMemberName, sendMemberAvatar } = record
            return <>
              <Avatar style={{ marginRight: 8 }} size={24} src={sendMemberAvatar} />
              {sendMemberName}
            </>
          }
        },
        {
          title: '送达状态',
          dataIndex: 'status',
          width: 150,
          render: (text) => receiveStatusList[text]
        },
        {
          title: '是否入群',
          dataIndex: 'joinGroupFlag',
          width: 150,
          render: (status) => {
            let color = ''
            const text = joinGroupType[status]
            if (status == 0) {
              color = '#E5E6EB'
            } else if (status == 1) {
              color = '#46C93A'
            }
            return <Badge color={color} text={text} />
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          fixed: 'right',
          render: (_, record) => {
            const { customerId } = record
            return (
              <Space>
                <Button
                  onClick={() => {
                    this.saveCustomerId(customerId)
                    setTimeout(() => {
                      this.cusTomerInfoRef.current.optionInfo(true)
                    }, 0)
                  }}
                  type="link"
                >
                  客户详情
                </Button>
              </Space>
            )
          },
        }
      ],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 项`,
      },
      loading: false,
    }
  }

  saveCustomerId = (optionId) => {
    this.setState({
      optionId
    })
  }

  getData = () => {
    const { pagination, status, userId, bizCompletionStatus, sendStatus } = this.state
    const { current, pageSize } = pagination
    const { tableType, infoId } = this.props
    const param = {
      pageNo: current,
      pageSize,
      infoId
    }
    let apiKey = ''
    if (tableType == 1) { // 成员
      apiKey = 'memberList'
      param.sendStatus = sendStatus
      param.memberId = userId
    } else { // 客户
      apiKey = 'customerList'
      param.status = status
      param.userId = userId
      param.bizCompletionStatus = bizCompletionStatus
    }
    this.setState({
      loading: true
    })
    Api[apiKey](param).then((res) => {
      const { list, total } = res.data
      this.setState({
        pagination: {
          ...pagination,
          total,
        },
        dataSource: list,
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  handleChangeVisible = (type, id) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      memberId: id
    }))
  }

  // 提示接口
  handleCallMessage = () => {
    const { memberId } = this.state
    const { infoId } = this.props
    return new Promise((resolve, reject) => {
      Api.callMessage({
        memberId,
        id: infoId
      }).then(() => {
        resolve('提示成功')
      }).catch(() => reject())
    })
  }

  renderCallModal = () => {
    const { visible } = this.state
    return <Modal onOk={this.handleCallMessage} visible={visible} onCancel={this.handleChangeVisible} title="提示">
      确认后将会给未发送成员发送提醒通知，是否发送？
    </Modal>
  }

  handleChangeTable = (page) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        ...page
      }
    }), this.getData)
  }

  renderOptions = (data) => Object.keys(data).map((v) => (
    <Option key={v} value={v}>
      {data[v]}
    </Option>
  ))

  handleFilterChange = (code, value) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current: 1
      },
      [code]: value
    }), this.getData)
  }

  renderFilter = () => {
    const { tableType, userList } = this.props
    const { name } = this.state
    return <div style={{ margin: '16px 0' }}>
      {tableType == 2 && <>
        <Input
          style={{ width: '220px' }}
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          placeholder="请输入客户名称、微信昵称"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <Select showSearch allowClear onChange={(value) => this.handleFilterChange('userId', value)} style={{ width: '176px', margin: '0 16px' }} showArrow filterOption={false} placeholder="请选择执行成员">
          {userList.map((v) => <Option key={v.id} value={v.id}>{v.name}</Option>)}
        </Select>
        <Select showSearch allowClear onChange={(value) => this.handleFilterChange('status', value)} style={{ width: '176px', marginRight: '16px' }} showArrow filterOption={false} placeholder="请选择送达状态">
          {this.renderOptions(receiveStatusList)}
        </Select>
        <Select showSearch allowClear onChange={(value) => this.handleFilterChange('bizCompletionStatus', value)} style={{ width: '176px' }} showArrow filterOption={false} placeholder="请选择是否入群">
          {this.renderOptions(joinGroupType)}
        </Select>
      </>}
      {tableType == 1 && <Select showSearch allowClear onChange={(value) => this.handleFilterChange('sendStatus', value)} style={{ width: '176px' }} showArrow filterOption={false} placeholder="请选择送达状态">
        {this.renderOptions(sendStatusList)}
      </Select>}
    </div>
  }

  render() {
    const { dataSource, loading, memberColumns, pagination, customerColumns, visible, modalType, optionId } = this.state
    const { tableType } = this.props // 1 成员详情 2 客户详情
    return <>
      {this.renderFilter()}
      <Table onChange={this.handleChangeTable} loading={loading} scroll={{ x: 'max-content', y: 450 }} columns={tableType == 1 ? memberColumns : customerColumns} pagination={pagination} dataSource={dataSource} />
      {visible && modalType == '提示' && this.renderCallModal()}
      {optionId && <CustomerInfo ref={this.cusTomerInfoRef} id={optionId} key={optionId} />}
    </>
  }
}

Index.propTypes = {}

export default Index
