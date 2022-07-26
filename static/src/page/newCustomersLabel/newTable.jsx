import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Space, Tag, Image, Tooltip } from 'antd'
import moment from 'moment'
import Modal from '@Modal'
import RsIcon from '@RsIcon'
import { exportFile } from '@util'
import Api from './store/api'
import ConfigTable from '../comments/publicView/table'
import NewCustomersInfo from './newCustomersInfo'
import { setValues } from './store/action'

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
          title: '二维码',
          dataIndex: 'qrCodeUrl',
          fixed: 'left',
          render: (text) => <Image width={48} src={text} />,
          width: 80,
        },
        {
          title: '二维码名称',
          dataIndex: 'codeName',
          fixed: 'left',
          render: (text) => <Tooltip title={text}><div style={{ width: '120px' }} className="text-ellipsis">{text}</div></Tooltip>
        },
        {
          title: '使用成员',
          dataIndex: 'members',
          render: (items) => (
            <div className="box-clamp-2">
              {[...items].slice(0, 5).map((item) => (
                <div style={{ display: 'inline-block', marginBottom: 8 }} className="flex-box f14 middle-a mr14">
                  <Tag className="flex-box middle-a" icon={<RsIcon type="icon-bianzu" className="f16" />}>{item.name}</Tag>
                </div>
              ))}
              {items.length > 5 ? `等共${items.length}人` : null}
            </div>
          ),
          width: 350,
        },
        {
          title: '标签',
          dataIndex: 'labels',
          width: 350,
          render: (labels = []) => (
            <Tooltip title={labels.map((item) => (
              <Tag style={{ marginBottom: 5 }}>{item.labelName}</Tag>
            ))}
            >
              <div className="box-clamp-2">
                {labels.map((item) => (
                  <Tag style={{ marginBottom: 5 }}>{item.labelName}</Tag>
                ))}
              </div>
            </Tooltip>
          ),
        },
        {
          title: '群聊',
          dataIndex: 'groupList',
          width: 350,
          render: (groupList) => (
            <div className="box-clamp-2">
              {groupList?.map((item) => (
                <Tag style={{ marginBottom: 5 }}>{item.groupName}</Tag>
              ))}
            </div>
          ),
        },
        {
          title: '添加好友数',
          dataIndex: 'scanAddNum',
          width: 120,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 250,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '创建人/所属部门',
          dataIndex: 'createName',
          render: (text, record) => `${text}/${record.deptName}`
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          fixed: 'right',
          render: (_, record) => {
            const { id, qrCodeUrl } = record
            return (
              <Space>
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
                >详情</Button>
                <Button
                  onClick={() => {
                    exportFile(qrCodeUrl)
                  }}
                  type="link"
                >下载</Button>
                <Button
                  onClick={() => {
                    this.props.history.replace(`/addNewCustomersLabel?id=${id}`)
                  }}
                  type="link"
                >
                  编辑
                </Button>
                <Button onClick={() => this.handleChangeVisible('删除', id)} danger type="link">删除</Button>
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
    this.queryList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { codeName, checkedUserKeys } = this.props
    const { pagination } = this.state
    if (codeName != nextProps.codeName || JSON.stringify(checkedUserKeys) != JSON.stringify(nextProps.checkedUserKeys)) {
      this.setState({
        pagination: {
          ...pagination,
          current: 1
        }
      }, () => {
        this.queryList(nextProps)
      })
    }
  }

  componentWillUnmount() {
  }

  handleChangeVisible = (type, id) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      clickId: id
    }))
  }

  queryList = ({ codeName, checkedUserKeys } = this.props) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.queryList({
      pageNo: current,
      pageSize,
      codeName,
      memberIds: checkedUserKeys
      // createId
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

  handleDelNewCustomers = () => {
    const { clickId, pagination } = this.state
    return new Promise((resolve, reject) => {
      Api.delById(clickId)
        .then(() => {
          resolve('删除成功')
          this.setState({
            pagination: {
              ...pagination,
              current: 1
            }
          }, this.queryList)
        })
        .catch(() => reject())
    })
  }

  renderDelModal = () => {
    const { visible } = this.state
    return <Modal type="delete" onOk={this.handleDelNewCustomers} visible={visible} onCancel={this.handleChangeVisible} title="提示">
      删除后不可恢复，确定删除嘛？
    </Modal>
  }

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.queryList)
  }

  render() {
    const { columns, pagination, dataSource, isLoading, visible, modalType, infoId } = this.state
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
      {visible && modalType == '删除' && this.renderDelModal()}
      {infoId && <NewCustomersInfo id={infoId} />}
    </>
  }
}

export default connect(
  (state) => ({
    codeName: state.newCustomersLabel.codeName,
    checkedUserKeys: state.newCustomersLabel.checkedUserKeys,
  }),
  { setValues }
)(withRouter(Index))
