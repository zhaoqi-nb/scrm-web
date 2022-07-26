import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Row, Col, Space, Divider, Tooltip } from 'antd'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import moment from 'moment'
import TablePhoneView from '../comments/publicView/TablePhoneView'
import Api from './store/api'
import ConfigTable from '../comments/publicView/table'
import { setValues } from './store/action'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  getInitialState() {
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '话术标题',
          dataIndex: 'title',
          width: 150,
          fixed: 'left'
        },
        {
          title: '话术内容',
          dataIndex: 'detailInfoList',
          width: 300,
          fixed: 'left',
          render: (text, rowData) => {
            const files = rowData.detailInfoList ? rowData.detailInfoList.map((v) => {
              const { type } = v
              const content = JSON.parse(v.content)
              if (type == 'img') {
                return {
                  url: content.url,
                  fileType: type,
                  fileName: content.name
                }
              } if (type == 'text') {
                return {
                  textValue: content.content,
                  fileType: type
                }
              } return null
            }).filter((v) => v) : []
            return (
              <div className="flex-box flex-column ">
                <div className="text-ellipsis2 full-w" style={{ maxWidth: '200px' }}>
                  {this.renderFirstScript(files[0])}
                </div>
                <TablePhoneView files={files} />
              </div>
            )
          },
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '创建人/所属部门',
          dataIndex: 'createName',
          render: (text, record) => `${text}/${record.createDeptName}`
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          fixed: 'right',
          render: (_, record) => {
            const { termId } = record
            return <Space>
              <Button
                onClick={() => {
                  this.props.history.replace(`/addEnterpriseScript?termId=${termId}`)
                }}
                type="link"
              >
                编辑
              </Button>
              <Button onClick={() => this.handleChangeVisible('删除', record)} type="link">
                删除
              </Button>
            </Space>
          }
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
    this.findTermInfo()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { groupId, groupType, keyword } = this.props
    const { pagination } = this.state
    if (
      groupId != nextProps.groupId ||
      groupType != nextProps.groupType ||
      keyword != nextProps.keyword
    ) {
      this.setState({
        pagination: {
          ...pagination,
          pageSize: pagination.pageSize
        }
      }, () => {
        this.findTermInfo(nextProps)
      })
    }
  }

  componentWillUnmount() {
  }

  renderFirstScript = (data) => {
    const { fileType, textValue, fileName } = data
    if (fileType == 'text') return textValue
    if (fileType == 'img') {
      return <div>
        【图片】
        {fileName}
      </div>
    }
  }

  findTermInfo = ({ groupId, keyword, groupType } = this.props) => {
    if (!groupId) return
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.findTermInfo({
      pageNo: current,
      pageSize,
      groupId,
      keyword,
      groupType
    })
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
    }), this.findTermInfo)
  }

  handleChangeVisible = (type, termInfo) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      termInfo
    }))
  }

  handleSaveLabels = () => this.formRef.current.validateFields().then(
    (values) => new Promise((resolve, reject) => {
      let param = values
      let apiKey = 'saveLabels'
      if (values.labels[0].id) {
        apiKey = 'updateLabel'
        param = values.labels[0]
      }
      Api[apiKey](param)
        .then(() => {
          resolve()
          this.findTermInfo()
        })
        .catch(() => reject())
    })
  )

  renderAddModal = () => {
    const { termInfo, visible } = this.state
    const { groupId } = this.props
    return <Modal visible={visible} onOk={this.handleSaveLabels} onCancel={this.handleChangeVisible} title={`${termInfo ? '编辑' : '添加'}标签`}>
      <Form preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.List initialValue={[termInfo ? { name: termInfo.name, id: termInfo.id } : { name: '' }]} name="labels">
          {(fields, { add, remove }) => <>
            {fields.map((field, index) => <Form.Item style={{ justifyContent: index ? 'end' : 'start' }} label={!index ? '标签名称' : ''}>
              <Row style={{ alignItems: 'center' }}>
                <Col span={22}>
                  <Form.Item {...field} noStyle name={[field.name, 'name']}>
                    <Input placeholder="请输入" showCount maxLength={15} />
                  </Form.Item>
                </Col>
                {!termInfo && fields.length > 0 && <Col style={{ display: 'flex', justifyContent: 'center' }} span={2}>
                  <RsIcon type="icon-quxiao" onClick={() => remove(field.name)} />
                </Col>}
              </Row>
            </Form.Item>)}
            {!termInfo && <Form.Item style={{ justifyContent: 'end' }}>
              <div className="add-label-buttton" onClick={() => add()}>
                <RsIcon type="icon-tianjia1" />添加标签
              </div>
            </Form.Item>}
          </>}
        </Form.List>
        <Form.Item name="id" initialValue={groupId} hidden label="标签组id">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }

  // 删除分组
  deleteTermInfo = () => {
    const { termInfo } = this.state
    return new Promise((resolve, reject) => {
      Api.deleteTermInfo({
        termId: termInfo.termId
      })
        .then(() => {
          resolve()
          this.findTermInfo()
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => {
    const { visible } = this.state
    return <Modal type="delete" onOk={this.deleteTermInfo} visible={visible} onCancel={this.handleChangeVisible} title="删除提示">
      确定要删除当前话术内容吗？删除后，数据将无法恢复！
    </Modal>
  }

  renderDepartTitle = (data) => data.map((v) => v.departName).join('、')

  renderEmptyBtn = () => {
    const { propsGroupInfo, groupId } = this.props
    const { groupName } = propsGroupInfo
    return <Button
      type="primary"
      onClick={() => {
        this.props.history.replace(`/addEnterpriseScript?groupId=${groupId}&groupName=${groupName}`)
      }}
    >新建企业话术</Button>
  }

  render() {
    const { columns, pagination, dataSource, isLoading, modalType, visible } = this.state
    const { propsGroupInfo, groupType } = this.props
    const { groupName, scope, departmentList } = propsGroupInfo
    const isEnterprise = groupType == 1
    return <>
      <div className="group-name">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="group-font-weight">{groupName}</div>
          <Divider style={{ borderLeft: '1px solid #E1E8F0' }} type="vertical" />
          <div>共：<span className="group-font-weight">{pagination.total}</span> 条</div>
          {scope == 2 && <>
            <Divider style={{ borderLeft: '1px solid #E1E8F0' }} type="vertical" />
            <div style={{ display: 'inline-block' }}>可用部门：</div>
            <div style={{ display: 'inline-block', maxWidth: 500 }} className="group-font-weight text-ellipsis"><Tooltip title={() => this.renderDepartTitle(departmentList)}>{this.renderDepartTitle(departmentList)}</Tooltip></div>
          </>}
        </div>
        {isEnterprise && this.renderEmptyBtn()}
      </div>
      <ConfigTable
        pageChange={this.handleChangeTable}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        emptyText={isEnterprise ? '暂无相关数据，快去创建吧！' : ''}
        rowKey={(record) => record.id}
        renderEmptyBtn={isEnterprise ? this.renderEmptyBtn : ''}
      />
      {visible && ['编辑', '新增'].indexOf(modalType) != -1 && this.renderAddModal()}
      {visible && modalType == '删除' && this.renderDeleteModal()}
    </>
  }
}

export default connect(
  (state) => ({
    groupId: state.scriptLibrary.groupId,
    propsGroupInfo: state.scriptLibrary.propsGroupInfo,
    keyword: state.scriptLibrary.keyword,
  }),
  { setValues }
)(Index)
