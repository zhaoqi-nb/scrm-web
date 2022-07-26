import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Space, message, Tooltip } from 'antd'
import moment from 'moment'
import Modal from '@Modal'
import Avatar from 'antd/lib/avatar/avatar'
import Api from './store/api'
import ConfigTable from '../comments/publicView/table'
import { setValues } from './store/action'
import RegularInfo from './regularInfo'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '任务名称',
          dataIndex: 'name',
          width: 200,
          fixed: 'left'
        },
        {
          title: '群活码',
          dataIndex: 'groupCodeName',
          // width: 200,
          fixed: 'left',
        },
        {
          title: '执行成员',
          dataIndex: 'memberVos',
          render: (text) => {
            if (!text) return null
            const title = text.map((v) => <div style={{ marginRight: '12px', marginBottom: 8 }}><Avatar style={{ marginRight: '8px' }} size={24} src={v.avatar} />{v.name}</div>)
            if (text.length < 3) return <div style={{ display: 'flex' }}>{title}</div>
            return <Tooltip title={<div style={{ display: 'flex', flexWrap: 'wrap' }}>{title}</div>}>
              <div style={{ display: 'flex', cursor: 'pointer' }}>
                <div style={{ marginRight: '12px' }}><Avatar style={{ marginRight: '8px' }} size={24} src={text[0].avatar} />{text[0].name}</div>
                <div style={{ marginRight: '12px' }}><Avatar style={{ marginRight: '8px' }} size={24} src={text[1].avatar} />{text[1].name}</div>
                <div style={{ fontWeight: 500, color: '#262626' }}> ...</div>
              </div>
            </Tooltip>
          }
        },
        {
          title: '已发送成员',
          dataIndex: 'senMemberCount',
        },
        {
          title: '未发送成员',
          dataIndex: 'allMemberCount',
          render: (text, record) => text - record.senMemberCount
        },
        {
          title: '已邀请客户',
          dataIndex: 'allCusCount',
        },
        {
          title: '已入群用户',
          dataIndex: 'senCusCount',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '创建人/所属部门',
          dataIndex: 'creator',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          fixed: 'right',
          render: (_, record) => {
            const { delLoading } = this.state
            const { id, status, senMemberCount, allMemberCount, memberVos } = record
            const callDisabled = status == 1 && senMemberCount != allMemberCount
            return (
              <Space>
                <Button disabled={!callDisabled} onClick={() => this.handleChangeVisible('提示', id)} type="link">
                  提醒发送
                </Button>
                <Button
                  onClick={() => {
                    if (this.state.infoId) {
                      this.setState({
                        infoId: null,
                        memberVos: []
                      }, () => {
                        this.setState({
                          infoId: id,
                          memberVos
                        })
                      })
                    } else {
                      this.setState({
                        infoId: id,
                        memberVos
                      })
                    }
                  }}
                  type="link"
                >
                  详情
                </Button>
                <Button danger loading={delLoading} type="link" onClick={() => this.handleDelMessage(id)}>
                  删除
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
      dataVisible: false,
      roleDataAuthInfo: {},
      isDepartLoading: true,
    }
  }

  componentDidMount() {
    this.bulkMessagePage()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { name } = this.props
    const { pagination } = this.state
    if (name != nextProps.name) {
      this.setState({
        pagination: {
          ...pagination,
          pageSize: pagination.pageSize,
          current: 1
        }
      }, () => {
        this.bulkMessagePage(nextProps)
      })
    }
  }

  componentWillUnmount() {
  }

  handleChangeVisible = (type, id) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      massSendId: id
    }))
  }

  bulkMessagePage = ({ name, type = 3 } = this.props) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.bulkMessagePage({
      pageNo: current,
      pageSize,
      name,
      type
    })
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          this.setState({
            pagination: {
              ...pagination,
              total,
            },
            dataSource: list,
          })
        }
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        })
      })
  }

  handleDelMessage = (id) => {
    this.setState({
      delLoading: true
    })
    Api.delMessage({
      id
    }).then(() => {
      message.success('删除成功')
      this.setState((state) => ({
        pagination: {
          ...state.pagination,
          current: 1
        }
      }), this.bulkMessagePage)
    }).finally(() => {
      this.setState({
        delLoading: false
      })
    })
  }

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.bulkMessagePage)
  }

  // 提示接口
  handleCallMessage = () => {
    const { massSendId } = this.state
    return new Promise((resolve, reject) => {
      Api.callMessage({
        id: massSendId
      }).then(() => {
        resolve('提示成功')
      }).catch(() => reject())
    })
  }

  renderCallModal = () => {
    const { visible } = this.state
    return <Modal onOk={this.handleCallMessage} visible={visible} onCancel={this.handleChangeVisible} title="提示">
      确认后将给所有未发送成员发送提醒通知，是否发送？
    </Modal>
  }

  render() {
    const { columns, pagination, dataSource, isLoading, visible, modalType, infoId, memberVos } = this.state
    return <>
      <ConfigTable
        pageChange={this.handleChangeTable}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        // emptyText="暂无相关数据，快去创建吧！"
        rowKey={(record) => record.id}
      />
      {visible && modalType == '提示' && this.renderCallModal()}
      {infoId && <RegularInfo userList={memberVos} id={infoId} />}
    </>
  }
}

export default connect(
  (state) => ({
    name: state.regularCustomersLabel.name,
  }),
  { setValues }
)(Index)
