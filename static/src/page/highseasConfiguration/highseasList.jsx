/* eslint-disable no-shadow */
import React, { Component } from 'react'
import { Space, Button, Table, Form, Input, Select, InputNumber } from 'antd'
import { connect } from 'react-redux'
import Modal from '@Modal'
import { isEmpty } from 'lodash'
import { setValues } from './store/action'
import Api from './store/api'

import './index.less'

const { Option } = Select

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
          title: '线索公海名称',
          dataIndex: 'publicLakeName',
          width: 200,
          fixed: 'left',
        },
        {
          title: '关联部门',
          dataIndex: 'departId',
          width: 150,
          render: () => '-',
        },
        {
          title: '新线索回收时间/分钟',
          dataIndex: 'newCluesNotFollowUp',
          width: 220,
        },
        {
          title: '分配领取线索回收时间/工作日',
          dataIndex: 'distributeCluesNotFollowUp',
          width: 220,
        },
        {
          title: '已跟进线索回收时间/工作日',
          dataIndex: 'doingCluesNotFollowUp',
          width: 220,
        },
        {
          title: '启用/禁用',
          dataIndex: 'openFlag',
          render: (openFlag) => (openFlag ? '启用' : '禁用'),
          width: 150,
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          render: (_, record) => (
            <Space>
              <Button onClick={() => this.handleHighSeas(record)} type="link">
                编辑
              </Button>
            </Space>
          ),
          fixed: 'right',
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
      dataVisible: false,
      roleDataAuthInfo: {},
      isDepartLoading: true,
    }
  }

  componentDidMount() {
    this.queryList()
  }

  queryList = () => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.queryList({
      pageNo: current,
      pageSize,
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

  handleChangeTable = (page) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        ...page
      }
    }), this.queryList)
  }

  handleHighSeas = (highSeasInfo) => {
    this.setState({
      highSeasInfo,
      visible: true,
    })
  }

  handleCancelModal = () => {
    this.setState({
      highSeasInfo: {},
      visible: false,
    })
  }

  handleSaveHighSeas = () =>
    this.formRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.update(values)
            .then(() => {
              resolve()
              this.queryList()
            })
            .catch(() => reject())
        })
    )

  renderModal = () => {
    const { highSeasInfo, visible } = this.state
    const {
      publicLakeName,
      id,
      includePrivateCluesFlag,
      haveCluesMax,
      privateCluesNotConvertCustomer,
      doingCluesNotFollowUp,
      distributeCluesNotFollowUp,
      newCluesNotFollowUp,
      openFlag,
    } = highSeasInfo || {}
    return (
      <Modal
        title={isEmpty(highSeasInfo) ? '新增线索公海' : '编辑线索公海'}
        onOk={this.handleSaveHighSeas}
        onCancel={this.handleCancelModal}
        visible={visible}
        width={568}
      >
        <Form
          preserve={false}
          ref={this.formRef}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          className="highSeasInfo-form"
          labelAlign="left"
        >
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[
              { required: true, message: '公海名称不可为空' },
              { max: 25, message: '输入长度在25个文字以内。' },
            ]}
            initialValue={publicLakeName}
            name="publicLakeName"
            label="公海名称"
          >
            <Input />
          </Form.Item>
          <div className="highSeasInfo-form-configure">
            <span className="configure-tips">公海执行规则</span>
            <div>
              <span className="configure-label">新线索</span>
              <Form.Item
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const privateCluesNotConvertCustomer = getFieldValue('privateCluesNotConvertCustomer')
                    if (privateCluesNotConvertCustomer < (value / 24 / 60)) {
                      return Promise.reject('规则1的时间不能超过规则4的时间');
                    }
                    return Promise.resolve();
                  },
                })]}
                initialValue={newCluesNotFollowUp}
                name="newCluesNotFollowUp"
                label=""
              >
                <InputNumber min={1} precision={0} />
              </Form.Item>
              <span className="configure-suffix">分钟</span>
              <span className="configure-tips">不添加跟进记录，将自动回收至线索公海。</span>
            </div>
            <div>
              <span className="configure-label">他人分配或自己领取的线索</span>
              <Form.Item
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const privateCluesNotConvertCustomer = getFieldValue('privateCluesNotConvertCustomer')
                    if (privateCluesNotConvertCustomer < value) {
                      return Promise.reject('规则2的时间不能超过规则4的时间');
                    }
                    return Promise.resolve();
                  },
                })]}
                initialValue={distributeCluesNotFollowUp}
                name="distributeCluesNotFollowUp"
                label=""
              >
                <InputNumber min={1} precision={0} />
              </Form.Item>
              <span className="configure-suffix">工作日</span>
              <span className="configure-tips">不添加跟进记录，将自动回收至线索公海。</span>
            </div>
            <div>
              <span className="configure-label">已跟进线索</span>
              <Form.Item
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const privateCluesNotConvertCustomer = getFieldValue('privateCluesNotConvertCustomer')
                    if (privateCluesNotConvertCustomer < value) {
                      return Promise.reject('规则3的时间不能超过规则4的时间');
                    }
                    return Promise.resolve();
                  },
                })]}
                initialValue={doingCluesNotFollowUp}
                name="doingCluesNotFollowUp"
                label=""
              >
                <InputNumber min={1} precision={0} />
              </Form.Item>
              <span className="configure-suffix">工作日</span>
              <span className="configure-tips">不添加跟进记录，将自动回收至线索公海。</span>
            </div>
            <div>
              <span className="configure-label">个人线索</span>
              <Form.Item
                rules={[({ getFieldsValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const values = getFieldsValue(['distributeCluesNotFollowUp', 'newCluesNotFollowUp', 'doingCluesNotFollowUp'])
                    const { distributeCluesNotFollowUp, newCluesNotFollowUp, doingCluesNotFollowUp } = values
                    const maxTime = Math.max(distributeCluesNotFollowUp, newCluesNotFollowUp / 24 / 60, doingCluesNotFollowUp)
                    if (maxTime > value) {
                      return Promise.reject('规则1~3的时间不能超过规则4的时间');
                    }
                    return Promise.resolve();
                  },
                })]}
                initialValue={privateCluesNotConvertCustomer}
                name="privateCluesNotConvertCustomer"
                label=""
              >
                <InputNumber min={1} precision={0} />
              </Form.Item>
              <span className="configure-suffix">工作日</span>
              <span className="configure-tips">不转化为客户，将自动回收至线索公海。</span>
            </div>
            <div>
              <span className="configure-label">个人最多拥有的线索为</span>
              <Form.Item initialValue={haveCluesMax} name="haveCluesMax" label="">
                <InputNumber min={1} precision={0} />
              </Form.Item>
              <span className="configure-suffix">条</span>
              <Form.Item
                style={{ width: '132px', marginRight: '8px' }}
                initialValue={includePrivateCluesFlag || 0}
                name="includePrivateCluesFlag"
                label=""
              >
                <Select>
                  <Option value={0}>不包含</Option>
                  <Option value={1}>包含</Option>
                </Select>
              </Form.Item>
              <span className="configure-tips">自己创建的线索。</span>
            </div>
          </div>

          <Form.Item initialValue={id} hidden name="id" label="">
            <Input />
          </Form.Item>
          <Form.Item initialValue={openFlag || 1} hidden name="openFlag" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { columns, pagination, dataSource, isLoading, visible } = this.state
    return (
      <>
        <Table
          onChange={this.handleChangeTable}
          scroll={{ x: 'max-content' }}
          loading={isLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
        />
        {visible && this.renderModal()}
      </>
    )
  }
}

export default connect(() => ({}), { setValues })(Index)
