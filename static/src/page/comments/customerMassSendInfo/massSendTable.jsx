import React, { Component } from 'react'
import { Table, Space, Button, Radio, Tooltip, Avatar, Select } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Modal from '@Modal'
import debounce from 'lodash/debounce'
import CustomerInfo from '../customerInfo'
import Api from './api'

const radioTypeOptions = {
  1: [{ label: '全部成员', value: '' }, { label: '已发送成员', value: '1' }, { label: '未发送成员', value: '0' }, { label: '发送失败', value: '-1' }],
  2: [{ label: '全部客户', value: '' }, { label: '已送达', value: '1' }, { label: '未送达', value: '0' }, { label: '接收达到上限', value: '3' }, { label: '已不是好友', value: '2' }],
}

const sendStatusList = { // 是否有效:1已发送;0未发送,-1发送失败
  1: '已发送',
  0: '未发送',
  '-1': '发送失败',
}

const receiveStatusList = { // 是否有效:1已发送;0未发送,-1发送失败
  1: '已送达',
  0: '未送达',
  2: '已不是好友',
}

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    this.handleSearchUser = debounce(this.handleSearchUser, 800)
  }

  cusTomerInfoRef = React.createRef()

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      dataSource: [],
      memberColumns: [
        {
          title: '成员',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
          render: (_, record) => {
            const { avatar, name } = record
            return <>
              <Avatar style={{ marginRight: 8 }} size={24} src={avatar} />
              {name}
            </>
          }
        },
        {
          title: '本次群发客户数',
          dataIndex: 'count',
          width: 150,
        },
        {
          title: '已发送客户数',
          dataIndex: 'sendCount',
          width: 150,
        },
        {
          title: '发送状态',
          dataIndex: 'sendStatus',
          width: 120,
          render: (sendStatus) => sendStatusList[sendStatus]
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
          title: '客户昵称',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
          render: (_, record) => {
            const { avatar, name, type } = record
            return <>
              {avatar && <Avatar style={{ marginRight: 8 }} size={24} src={avatar} />}
              {name}
              {[1, 2].indexOf(type) > -1 && <div className="customer-type">@{type == 1 ? '微信' : ''}</div>}
            </>
          }
        },
        {
          title: '发送人',
          dataIndex: 'sendMemberName',
          width: 150,
        },
        {
          title: '客户接收状态',
          dataIndex: 'status',
          width: 150,
          render: (text) => receiveStatusList[text]
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
      radioValue: ''
    }
  }

  saveCustomerId = (optionId) => {
    this.setState({
      optionId
    })
  }

  getData = () => {
    const { pagination, radioValue, userId } = this.state
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
      param.sendStatus = radioValue
      param.memberId = userId
    } else { // 客户
      apiKey = 'customerList'
      param.status = radioValue
      param.userId = userId
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

  handleRadioChange = ({ target: { value } }) => {
    const { pagination } = this.state
    this.setState({
      radioValue: value,
      pagination: {
        ...pagination,
        current: 1,
      },
    }, this.getData)
  }

  renderTipTitle = () => {
    const { tableType } = this.props
    return tableType == 1 ?
      <div>
        <p>已发送成员：已点击任务【发送】的员工数量</p>
        <p>未发送成员：未点击任务【发送】的员工数量</p>
        <p>发送失败：已点击发送，但因客户不是好友导致发送失败或因客户已经收到其他群发消息导致发送失败的员工数量</p>
      </div> :
      <div>
        <p>已送达：客户已收到消息</p>
        <p>未送达：员工没有点击发送，客户没有收到消息</p>
        <p>客户接收达到上限：员工已点发送，但客户当日接收到消息达上限</p>
        <p>员工已点发送：但已经不是好友关系</p>
      </div>
  }

  handleSearchUser = (e) => {
    if (!e) return
    let apiKey = '' // 搜索客户
    const { tableType } = this.props
    if (tableType == 1) apiKey = 'searchMemberByName' // 客户搜索
    else apiKey = 'searchCustomerByName'
    Api[apiKey]({
      customerName: e,
      pageNo: 1,
      pageSize: 1000,
      name: e
    }).then((res) => {
      this.setState({
        userList: res.data.list || res.data || []
      })
    })
  }

  handleUserChange = (userId) => {
    const { pagination } = this.state
    this.setState({
      pagination: {
        ...pagination,
        current: 1,
      },
      userId
    }, this.getData)
  }

  renderFiler = () => {
    const { tableType } = this.props // 1 成员详情 2 客户详情
    const { userList = [] } = this.state
    return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Radio.Group onChange={this.handleRadioChange} defaultValue="" optionType="button" options={radioTypeOptions[tableType]} style={{ margin: '16px 0' }} />
        <Tooltip title={this.renderTipTitle}>
          <QuestionCircleOutlined style={{ fontSize: '14px', marginLeft: 8 }} />
        </Tooltip>
      </div>
      <div>
        <Select onChange={this.handleUserChange} filterOption={false} style={{ width: '200px' }} placeholder={tableType == 1 ? '员工姓名' : '请输入客户昵称'} onSearch={this.handleSearchUser} showSearch showArrow>
          {userList.map((v) => <Option value={v.externalUserid || v.id} key={v.id}>{v.name}</Option>)}
        </Select>
      </div>
    </div>
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

  render() {
    const { dataSource, loading, memberColumns, pagination, customerColumns, visible, modalType, optionId } = this.state
    const { tableType } = this.props // 1 成员详情 2 客户详情
    return <>
      {this.renderFiler()}
      <Table onChange={this.handleChangeTable} loading={loading} scroll={{ x: 'max-content', y: 300 }} columns={tableType == 1 ? memberColumns : customerColumns} pagination={pagination} dataSource={dataSource} />
      {visible && modalType == '提示' && this.renderCallModal()}
      {optionId && <CustomerInfo ref={this.cusTomerInfoRef} id={optionId} key={optionId} />}
    </>
  }
}

Index.propTypes = {}

export default Index
