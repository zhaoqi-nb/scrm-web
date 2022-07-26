import React, { Component } from 'react'
import { Space, Button, Progress, Badge, message } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Modal from '@Modal'
import Api from './store/api'
import { setValues } from './store/action'
import CustomerMassSendInfo from '../comments/customerMassSendInfo'
import TablePhoneView from '../comments/publicView/TablePhoneView'
import ConfigTable from '../comments/publicView/table'

const PhoneViewTypes = {
  1: 'text',
  2: 'img',
  3: 'link',
  4: 'video',
  5: 'file',
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState() {
    const { type } = this.props
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '任务名称',
          dataIndex: 'name',
          width: 150,
          fixed: 'left',
        },
        {
          title: '群发内容',
          dataIndex: 'medias',
          width: 220,
          fixed: 'left',
          render: (medias) => this.renderMedias(medias)
        },
        {
          title: '群发类型',
          dataIndex: 'sendType',
          width: 100,
          render: (sendType) => sendType ? '定时发送' : '立即发送'
        },
        {
          title: '群发状态',
          dataIndex: 'status',
          width: 100,
          render: (status) => {
            let color = ''
            let text = ''
            if (status == -1) { // 已取消
              color = '#E5E6EB'
              text = '已取消'
            } else if (status == 0) { // 待发送
              color = '#0678FF'
              text = '待发送'
            } else if (status == 1) { // 已发送
              color = '#46C93A'
              text = '已发送'
            }
            return <Badge color={color} text={text} />
          }
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: type == 2 ? '已发送群主' : '已发送员工',
          dataIndex: 'senMemberCount',
          width: 150,
          render: (text, record) => this.renderProgress(text, record.allMemberCount)
        },
        {
          title: type == 2 ? '已送达群聊' : '已送达客户',
          dataIndex: 'senCusCount',
          width: 150,
          render: (text, record) => this.renderProgress(text, record.allCusCount)
        },
        {
          title: '创建人/所属部门',
          dataIndex: 'creator',
          width: 220,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          fixed: 'right',
          render: (_, record) => {
            const { delLoading } = this.state
            const { id, status, senMemberCount, allMemberCount } = record
            const callDisabled = status == 1 && senMemberCount != allMemberCount
            return (
              <Space>
                <Button disabled={!callDisabled} onClick={() => this.handleChangeVisible('提示', id)} type="link">
                  提醒
                </Button>
                <Button
                  onClick={() => {
                    if (this.state.infoId) {
                      this.setState({
                        infoId: null
                      }, () => {
                        this.setState({
                          infoId: id
                        })
                      })
                    } else {
                      this.setState({
                        infoId: id
                      })
                    }
                  }}
                  type="link"
                >
                  详情
                </Button>
                <Button loading={delLoading} disabled={status != 0} type="link" onClick={() => this.handleDelMessage(id)}>
                  {status == -1 ? '已取消' : '取消'}
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
      }
    }
  }

  handleDelMessage = (id) => {
    this.setState({
      delLoading: true
    })
    Api.delMessage({
      id
    }).then(() => {
      message.success('取消成功')
      this.bulkMessagePage()
    }).finally(() => {
      this.setState({
        delLoading: false
      })
    })
  }

  handleChangeVisible = (type, id) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      massSendId: id
    }))
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

  renderMedias = (medias) => {
    const firstMedia = medias[0]
    return <div className="flex-box flex-column ">
      <div className="text-ellipsis2 full-w" style={{ maxWidth: '200px' }}>
        {this.renderFirstScript(firstMedia)}
      </div>
      <TablePhoneView files={this.transformMedias(medias)} />
    </div>
  }

  transformMedias = (data) => data.map((v) => ({
    ...v,
    fileType: PhoneViewTypes[v.type],
    textValue: v.content,
    url: v.filePath,
    link: v.content, // 链接为content
    fileExactSize: v.fileSize
  }))

  renderFirstScript = (data) => {
    const { type, fileName, content } = data
    if ([1, 3].indexOf(type) > -1) {
      return <div>
        【消息1】：{content}
      </div>
    }
    if (type == 2) {
      return <div>
        【图片】
        {fileName}
      </div>
    } if ([4, 5].indexOf(type) > -1) {
      return <div>
        【文件】
        {fileName}
      </div>
    }
  }

  renderProgress = (text, allData) => <div>
    <Progress strokeColor="#0678FF" percent={allData == 0 ? 0 : (text / allData) * 100} showInfo={false} />
    {text}/{allData}
  </div>

  componentDidMount() {
    this.bulkMessagePage()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { searchEndTime, searchBeginTime, name } = this.props
    if (
      searchEndTime != nextProps.searchEndTime ||
      searchBeginTime != nextProps.searchBeginTime ||
      name != nextProps.name
    ) {
      this.setState((state) => ({
        pagination: {
          ...state.pagination,
          current: 1
        }
      }), () => {
        this.bulkMessagePage(nextProps)
      })
    }
  }

  componentWillUnmount() { }

  bulkMessagePage = ({ searchBeginTime, searchEndTime, name, type } = this.props) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.bulkMessagePage({
      pageNo: current,
      pageSize,
      searchBeginTime,
      searchEndTime,
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

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.backstageSearchDoingCluesList)
  }

  renderCallModal = () => {
    const { visible } = this.state
    const { type } = this.props
    return <Modal onOk={this.handleCallMessage} visible={visible} onCancel={this.handleChangeVisible} title="提示">
      确认后将给所有未发送{type == 1 ? '成员' : '群主'}发送提醒通知，是否发送？
    </Modal>
  }

  render() {
    const { columns, pagination, dataSource, isLoading, visible, modalType, infoId } = this.state
    return (<>
      <ConfigTable
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pageChange={this.handleChangeTable}
        pagination={pagination}
        rowKey={(record) => record.id}
      />
      {visible && modalType == '提示' && this.renderCallModal()}
      {infoId && <CustomerMassSendInfo id={infoId} />}
    </>)
  }
}

export default connect(
  (state) => ({
    searchBeginTime: state.customerGroupMassSend.searchBeginTime,
    searchEndTime: state.customerGroupMassSend.searchEndTime,
    name: state.customerGroupMassSend.name,
  }),
  { setValues }
)(Index)
