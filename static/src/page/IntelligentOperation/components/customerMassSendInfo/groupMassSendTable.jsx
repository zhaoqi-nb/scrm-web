import React, { Component } from 'react'
import { Table, Space, Button, Avatar, Radio } from 'antd'
import Modal from '@Modal'
import moment from 'moment'
import Api from './api'

const sendStatusList = {
  // 是否有效:1已发送;0未发送,-1发送失败
  1: '已发送',
  0: '未发送',
  '-1': '发送失败',
}

const receiveStatusList = {
  // 是否有效:1已发送;0未发送,-1发送失败
  1: '已送达',
  0: '未送达',
  2: '已不是好友',
}

const radioTypeOptions = [
  { label: '全部成员', value: '' },
  { label: '已发送成员', value: '1' },
  { label: '未发送成员', value: '0' },
]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

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
      groupLeaderColumns: [
        {
          title: '群主',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
          render: (_, record) => {
            const { name } = record
            return (
              <>
                {/* <Avatar style={{ marginRight: 8 }} size={24} src={avatar} /> */}
                {name}
              </>
            )
          },
        },
        {
          title: '本次群发群聊总数',
          dataIndex: 'count',
          width: 150,
        },
        {
          title: '已发送群聊数',
          dataIndex: 'sendCount',
          width: 150,
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '发送状态',
          dataIndex: 'sendStatus',
          width: 120,
          render: (sendStatus) => sendStatusList[sendStatus],
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
        },
      ],
      groupColumns: [
        {
          title: '群聊名称',
          dataIndex: 'groupName',
          width: 150,
          fixed: 'left',
        },
        {
          title: '群主',
          dataIndex: 'sendMemberName',
          width: 150,
          render: (_, record) => {
            const { sendMemberName, sendMemberAvatar } = record
            return (
              <>
                <Avatar style={{ marginRight: 8 }} size={24} src={sendMemberAvatar} />
                {sendMemberName}
              </>
            )
          },
        },
        {
          title: '群创建时间',
          dataIndex: 'groupCreateTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '消息发送状态',
          dataIndex: 'status',
          width: 100,
          render: (status) => receiveStatusList[status],
        },
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
      radioValue: '',
      loading: false,
    }
  }

  handleRadioChange = (v) => {
    const { pagination } = this.state
    this.setState(
      {
        radioValue: v?.target?.value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
      this.getData
    )
  }

  getData = () => {
    const { pagination, radioValue } = this.state
    const { current, pageSize } = pagination
    const { tableType, infoId } = this.props
    const param = {
      pageNo: current,
      pageSize,
      infoId,
      sendStatus: radioValue,
    }
    // let apiKey = ''
    if (tableType == 1) {
      // 群主
      // apiKey = 'memberList'
    } else {
      // 群
      // apiKey = 'getGroupList'
    }
    this.setState({
      loading: true,
    })
    Api.memberList(param)
      .then((res) => {
        const { list, total } = res.data
        this.setState({
          pagination: {
            ...pagination,
            total,
          },
          dataSource: list,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  handleChangeVisible = (type, id) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      memberId: id,
    }))
  }

  // 提示接口
  handleCallMessage = () => {
    const { memberId } = this.state
    const { infoId } = this.props
    return new Promise((resolve, reject) => {
      Api.callMessage({
        memberId,
        id: infoId,
      })
        .then(() => {
          resolve('提示成功')
        })
        .catch(() => reject())
    })
  }

  renderFiler = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Radio.Group
          onChange={this.handleRadioChange}
          optionType="button"
          options={radioTypeOptions}
          style={{ margin: '16px 0' }}
          value={this.state.radioValue}
        />
      </div>
    </div>
  )

  renderCallModal = () => {
    const { visible } = this.state
    return (
      <Modal onOk={this.handleCallMessage} visible={visible} onCancel={this.handleChangeVisible} title="提示">
        确认后将会给未发送群主发送提醒通知，是否发送？
      </Modal>
    )
  }

  handleChangeTable = (page) => {
    this.setState(
      (state) => ({
        pagination: {
          ...state.pagination,
          ...page,
        },
      }),
      this.getData
    )
  }

  render() {
    const { dataSource, loading, groupLeaderColumns, pagination, groupColumns, visible, modalType } = this.state
    const { tableType } = this.props // 1 群主 2 群
    return (
      <>
        {this.renderFiler()}
        <Table
          onChange={this.handleChangeTable}
          loading={loading}
          scroll={{ x: 'max-content', y: 300 }}
          columns={tableType == 1 ? groupLeaderColumns : groupColumns}
          pagination={pagination}
          dataSource={dataSource}
        />
        {visible && modalType == '提示' && this.renderCallModal()}
      </>
    )
  }
}

Index.propTypes = {}

export default Index
