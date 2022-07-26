import React, { Component } from 'react'
import { Table, Space, Button, Radio, TreeSelect, Spin, message } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Modal from '@Modal'
import { setValues, resetValues } from './store/action'
import Api from './store/api'
import ActionPermissionModal from './actionPermissionModal'

const { SHOW_PARENT } = TreeSelect

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.queryList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { name, isRefresh } = this.props
    if (name != nextProps.name || isRefresh != nextProps.isRefresh) {
      this.setState((state) => ({
        pagination: {
          ...state.pagination,
          current: 1
        }
      }), () => {
        this.queryList(nextProps)
      })
    }
  }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '角色姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '角色备注',
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          title: '创建人',
          dataIndex: 'create',
          key: 'create',
        },
        {
          title: '默认角色',
          dataIndex: 'isDefault',
          key: 'isDefault',
          render: (text) => (text == 0 ? '否' : '是'),
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '权限',
          dataIndex: 'permission',
          key: 'permission',
          render: (_, record) => {
            const { isDefault, id } = record
            if (isDefault == 2) return '全部权限'
            return (
              <Space>
                <Button onClick={() => this.handleChangeActionModal(id)} type="link">
                  后台权限
                </Button>
                {/* <Button type="link">侧边栏权限</Button> */}
                <Button type="link" onClick={() => this.handleChangeDataModal(id)}>
                  数据权限
                </Button>
              </Space>
            )
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => {
            const { id, isDefault } = record
            return (
              <Space>
                <Button onClick={() => this.handleEditRole(record)} type="link">
                  编辑
                </Button>
                <Button disabled={isDefault == 2} type="link" onClick={() => this.handleChangeDeleteVisible(id)} danger>
                  删除
                </Button>
              </Space>
            )
          },
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

  handleChangeTable = (page) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        ...page
      }
    }), this.queryList)
  }

  handleEditRole = (roleInfo) => {
    this.props.setValues({
      createVisible: true,
      roleInfo,
      isEdit: true,
    })
  }

  handleChangeDeleteVisible = (id) => {
    this.setState({
      deleteId: id,
      deleteVisible: true,
    })
  }

  // 数据权限弹窗
  handleChangeDataModal = (id) => {
    this.setState({
      dataVisible: true,
      dataRoleId: id,
    })
    // 获取已经保存的数据权限
    Api.getByRoleId({
      roleId: id,
    })
      .then((res) => {
        if (res.retCode == 200) {
          this.setState({
            roleDataAuthInfo: res.data || {},
          })
        }
      })
      .finally(() => {
        this.setState({
          isDepartLoading: false,
        })
      })
  }

  handleChangeActionModal = (id) => {
    this.props.setValues({
      actionVisible: true,
      roleId: id,
    })
  }

  handleCancelDelete = () => {
    this.setState({
      deleteId: null,
      deleteVisible: false,
    })
  }

  renderDeleteModal = () => {
    const { deleteVisible } = this.state
    return (
      <Modal
        title="角色删除"
        onOk={this.deleteByKey}
        visible={deleteVisible}
        type="delete"
        onCancel={this.handleCancelDelete}
      >
        角色删除将不能恢复，确认删除吗？
      </Modal>
    )
  }

  deleteByKey = () => {
    const { deleteId } = this.state
    return new Promise((resolve, reject) => {
      Api.deleteByKey(deleteId)
        .then(() => {
          resolve()
          this.handleCancelDelete()
          this.queryList()
        })
        .catch(() => reject())
    })
  }

  handleRadioChange = (e) => {
    this.setState({
      type: e.target.value,
    })
  }

  handleDataCancel = () => {
    this.setState({
      dataVisible: false,
      dataRoleId: null,
      type: null,
      roleDataAuthInfo: {},
    })
  }

  handleTreeChange = (value) => {
    this.setState({
      fixDepartIds: value,
    })
  }

  handleSaveRoleDataInfo = () => {
    const { dataRoleId, type, roleDataAuthInfo, fixDepartIds } = this.state
    const saveType = type || roleDataAuthInfo.type || 1
    const saveDepartIds = fixDepartIds ? fixDepartIds.join(',') : roleDataAuthInfo.fixDepartIds
    if (saveType == 5 && !saveDepartIds) {
      message.warning('请选择指定部门')
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      Api.saveRoleDataAuthInfo({
        roleId: dataRoleId,
        type: saveType,
        fixDepartIds: saveDepartIds,
      })
        .then(() => {
          resolve()
          this.handleDataCancel()
        })
        .catch(() => {
          reject()
        })
    })
  }

  // 数据权限弹窗
  renderDataModal = () => {
    const { dataVisible, type, roleDataAuthInfo, isDepartLoading, fixDepartIds } = this.state
    const { departList } = this.props
    return (
      <Modal
        okText="保存"
        onCancel={this.handleDataCancel}
        title="数据权限"
        visible={dataVisible}
        onOk={this.handleSaveRoleDataInfo}
      >
        <Spin spinning={isDepartLoading}>
          <Radio.Group value={type || roleDataAuthInfo.type || 1} onChange={this.handleRadioChange}>
            <Radio value={1}>全部</Radio>
            <Radio value={3}>同部门和子部门</Radio>
            <Radio value={2}>同部门</Radio>
            <Radio value={4}>自己</Radio>
            <div style={{ marginTop: '10px' }}>
              <Radio value={5}>指定部门</Radio>
              {(type || roleDataAuthInfo.type) == 5 && <TreeSelect
                showArrow
                showCheckedStrategy={SHOW_PARENT}
                allowClear
                placeholder="请选择部门"
                style={{ minWidth: '200px', marginLeft: '10px' }}
                treeCheckable
                showSearch
                treeNodeFilterProp="title"
                treeData={departList}
                value={fixDepartIds || (roleDataAuthInfo.fixDepartIds ? roleDataAuthInfo.fixDepartIds.split(',') : [])}
                onChange={this.handleTreeChange}
              />}
            </div>
          </Radio.Group>
        </Spin>
      </Modal>
    )
  }

  queryList = ({ name } = this.props) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.queryList({
      pageNo: current,
      pageSize,
      name,
    })
      .then((result) => {
        const { list, total } = result.data
        this.setState({
          pagination: {
            ...pagination,
            total,
          },
          dataSource: list,
        })
      })
      .finally(() => {
        this.props.setValues({
          isRefresh: false
        })
        this.setState({
          isLoading: false,
        })
      })
  }

  render() {
    const { columns, pagination, dataSource, isLoading, deleteVisible, dataVisible } = this.state
    const { actionVisible } = this.props
    return (
      <>
        <Table
          // scroll={{ x: 'max-content' }}
          loading={isLoading}
          columns={columns}
          onChange={this.handleChangeTable}
          dataSource={dataSource}
          pagination={pagination}
        />
        {actionVisible && <ActionPermissionModal />}
        {deleteVisible && this.renderDeleteModal()}
        {dataVisible && this.renderDataModal()}
      </>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    name: state.rolePermissions.name,
    isRefresh: state.rolePermissions.isRefresh,
    actionVisible: state.rolePermissions.actionVisible,
    departList: state.rolePermissions.departList,
  }),
  {
    setValues,
    resetValues
  }
)(Index)
