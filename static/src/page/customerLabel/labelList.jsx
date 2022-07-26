/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Row, Col, Space, message } from 'antd'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
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
      columns: [{
        title: '标签名',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 180,
        render: (_, record) => <Space>
          <Button onClick={() => this.handleChangeVisible('编辑', record)} type="link">
            编辑
          </Button>
          <Button onClick={() => this.handleChangeVisible('删除', record)} type="link">
            删除
          </Button>
        </Space>
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
    this.queryLabelList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { groupId } = this.props
    if (
      groupId != nextProps.groupId
    ) {
      this.queryLabelList(nextProps)
    }
  }

  componentWillUnmount() {
  }

  queryLabelList = ({ groupId } = this.props) => {
    if (!groupId) return
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.queryLabelList({
      pageNo: current,
      pageSize,
      groupId,
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
    }), this.queryLabelList)
  }

  handleChangeVisible = (type, labelInfo) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      labelInfo
    }))
  }

  handleSaveLabels = () => this.formRef.current.validateFields().then(
    (values) => new Promise((resolve, reject) => {
      let param = values
      let apiKey = 'saveLabels'
      if (values.labels[0].id) {
        apiKey = 'updateLabel'
        param = values.labels[0]
        if (!param.name) {
          message.warning('标签名称不得为空')
          reject()
          return
        }
      } else {
        param.labels = param.labels.filter((v) => v.name)
        if (!param.labels.length) {
          message.warning('标签名称不得为空')
          reject()
          return
        }
      }
      Api[apiKey](param)
        .then(() => {
          resolve()
          this.queryLabelList()
        })
        .catch(() => reject())
    })
  )

  renderAddModal = () => {
    const { labelInfo, visible } = this.state
    const { groupId } = this.props
    return <Modal visible={visible} onOk={this.handleSaveLabels} onCancel={this.handleChangeVisible} title={`${labelInfo ? '编辑' : '添加'}标签`}>
      <Form colon={false} preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.List initialValue={[labelInfo ? { name: labelInfo.name, id: labelInfo.id } : { name: '' }]} name="labels">
          {(fields, { add, remove }) => <>
            {fields.map((field, index) => <Form.Item key={field.key} style={{ justifyContent: index ? 'end' : 'start' }} label={!index ? '标签名称' : ''}>
              <Row key={field.key} style={{ alignItems: 'center' }}>
                <Col span={22}>
                  <Form.Item {...field} noStyle name={[field.name, 'name']}>
                    <Input placeholder="请输入" showCount maxLength={15} />
                  </Form.Item>
                </Col>
                {!labelInfo && fields.length > 1 && <Col style={{ display: 'flex', justifyContent: 'center' }} span={2}>
                  <RsIcon type="icon-quxiao" onClick={() => remove(field.name)} />
                </Col>}
              </Row>
            </Form.Item>)}
            {!labelInfo && <Form.Item style={{ justifyContent: 'end' }}>
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

  // 删除标签
  handleDeleteLabel = () => {
    const { labelInfo: { id } } = this.state
    return new Promise((resolve, reject) => {
      Api.removeLabel(id)
        .then(() => {
          resolve()
          this.queryLabelList()
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => {
    const { visible } = this.state
    return <Modal type="delete" onOk={this.handleDeleteLabel} visible={visible} onCancel={this.handleChangeVisible} title="删除提示">
      确认删除此标签？删除后，已添加到客户信息的标签也一起删除。
    </Modal>
  }

  handleSortChange = (newData) => {
    Api.batchSortLabel({
      labels: newData.map((v) => ({
        id: v.id,
        sort: v.sort
      }))
    }).then(() => {
      this.queryLabelList()
    })
  }

  render() {
    const { columns, pagination, dataSource, isLoading, modalType, visible } = this.state
    const { groupName } = this.props
    return <>
      <div className="label-tips">
        <RsIcon type="icon-tishixinxitubiao" />
        企微标签： 由企业统一配置，配置后会同步至企业微信后台
      </div>
      <div className="group-name">
        <div>{groupName}</div>
        <Button onClick={() => this.handleChangeVisible('新增')}>添加标签</Button>
      </div>
      <ConfigTable
        pageChange={this.handleChangeTable}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={(record) => record.id}
        sortConfig={{
          isSort: false,
          sortKey: 'id',
          onSort: this.handleSortChange
        }}
      />
      {visible && ['编辑', '新增'].indexOf(modalType) != -1 && this.renderAddModal()}
      {visible && modalType == '删除' && this.renderDeleteModal()}
    </>
  }
}

export default connect(
  (state) => ({
    groupId: state.customerLabel.groupId,
    groupName: state.customerLabel.groupName,
  }),
  { setValues }
)(Index)
