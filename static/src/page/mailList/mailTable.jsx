import React, { Component } from 'react'
import { Table, Space, Button, Badge, Select, TreeSelect, Form, Avatar, Radio, Input, Row, Col } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import { isEmpty } from 'lodash'
import CityCascader from '../comments/cityCascader'
import { setValues } from './store/action'
import Api from './store/api'

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    this.staffDirectoryList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { status, userNameOrDepartNameLike, departId, roleId } = this.props
    if (
      status != nextProps.status ||
      userNameOrDepartNameLike != nextProps.userNameOrDepartNameLike ||
      departId != nextProps.departId ||
      roleId != nextProps.roleId
    ) {
      this.setState((state) => ({
        pagination: {
          ...state.pagination,
          current: 1
        }
      }), () => {
        this.staffDirectoryList(nextProps)
      })
    }
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    const { identityList, dataBurning } = this.props
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render: (name, record) => `${name} ${record.mobile}`,
          fixed: 'left',
          width: 220,
        },
        {
          title: '所属部门',
          dataIndex: 'departName',
          key: 'departName',
          width: 220,
        },
        {
          title: '身份',
          dataIndex: 'identityType',
          render: (text) => text && identityList.find((v) => v.value == text).label
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (status) => {
            if (status == 1) return <Badge color="#46C93A" text="已激活" />
            if (status == 2) return <Badge color="#BFBFBF" text="已禁用" />
            if (status == 4) return <Badge color="#6AAEFF" text="未激活" />
            if (status == 5) return <Badge color="#FFBA00" text="已离职" />
            if (status == -1) return <Badge color="#FF4757" text="已删除" />
          },
          width: 200,
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: 200,
        },
        {
          title: '加入时间',
          dataIndex: 'createTime',
          key: 'createTime',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
          width: 250,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 200,
          fixed: 'right',
          render: (_, record) => {
            const { id, status, identityType } = record
            if (status == -1) {
              return <Button type="link">找回</Button>
            }
            return (
              <Space>
                {dataBurning && <Button onClick={() => this.handleUpdateDepart(record)} type="link">
                  部门
                </Button>}
                <Button onClick={() => this.handleEditRole(record)} type="link">
                  角色权限
                </Button>
                <Button type="link" onClick={() => this.handleDeleteRole(id)} danger>
                  删除
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    if (identityType) {
                      if (identityType == 3) {
                        this.setState({
                          fetchUserList: true
                        })
                        this.queryBindMemberIdentityList(1)
                        this.queryBindMemberIdentityList(2)
                      }
                      Api.getMemberIdentity(id).then((res) => {
                        const { leader1, leader2, regionList } = res.data
                        this.handleChangeVisible('绑定', id, identityType)
                        // this.pr
                        this.formRef.current.setFieldsValue({
                          leader1,
                          leader2,
                          regionList: regionList.map((v) => {
                            const { province, city, county, town } = v
                            return `${province}-${city}-${county}-${town}`
                          })
                        })
                      })
                    } else {
                      this.handleChangeVisible('绑定', id, identityType)
                    }
                  }}
                >
                  绑定信息
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
      roleInfo: {},
      selectedRows: [],
      identityType: '1'
    }
  }

  handleEditRole = (roleInfo) => {
    this.setState({
      editVisible: true,
      roleInfo,
    })
  }

  handleChangeVisible = (type, id, identityType) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      clickId: id,
      identityType: identityType || '1'
    }))
  }

  handleUpdateDepart = (roleInfo) => {
    this.setState({
      updateDepartVisible: true,
      roleInfo,
    })
  }

  handleBindingInfo = () => this.formRef.current.validateFields().then((values) => {
    const { identityType, regionList } = values
    if (identityType == 1) {
      values.regionList = regionList.map((v) => {
        const codes = v.split('-')
        return {
          province: codes[0]
        }
      })
    } else if (identityType == 2) {
      values.regionList = regionList.map((v) => {
        const codes = v.split('-')
        return {
          province: codes[0],
          city: codes[1]
        }
      })
    } else if (identityType == 3) {
      values.regionList = regionList.map((v) => {
        const codes = v.split('-')
        return {
          province: codes[0],
          city: codes[1],
          county: codes[2]
        }
      })
    }
    return new Promise((resolve, reject) => {
      Api.bindMemberIdentity(values).then(() => {
        resolve('保存成功')
        this.staffDirectoryList()
      }).catch(() => reject())
    })
  })

  formVlaueChange = (changeValue) => {
    const { fetchUserList } = this.state
    const { identityType } = changeValue
    if (identityType == 3 && !fetchUserList) {
      this.setState({
        fetchUserList: true
      })
      this.queryBindMemberIdentityList(1)
      this.queryBindMemberIdentityList(2)
    }
    if (identityType) {
      this.setState({
        identityType
      })
    }
  }

  queryBindMemberIdentityList = (identityType) => {
    Api.queryBindMemberIdentityList({
      identityType
    }).then((res) => {
      if (identityType == 1) {
        this.setState({
          groupLeader: res.data
        })
      } else {
        this.setState({
          teamLeader: res.data
        })
      }
    })
  }

  renderUserOptions = (data) => data.map((v) => <Option key={v.id} value={v.id}>{v.name}</Option>)

  handleBindingModal = () => {
    const { visible, clickId, groupLeader = [], teamLeader = [], identityType } = this.state
    const { identityList } = this.props
    return <Modal visible={visible} onOk={this.handleBindingInfo} onCancel={this.handleChangeVisible} title="绑定身份信息">
      <Form onValuesChange={this.formVlaueChange} colon={false} preserve={false} ref={this.formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item
          rules={[{
            required: true,
            message: '请选择用户身份'
          }]}
          style={{ alignItems: 'center' }}
          name="identityType"
          label="身份选择"
          initialValue={String(identityType)}
        >
          <Radio.Group options={identityList} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.identityType !== curValues.identityType} style={{ marginBottom: 0 }}>
          {() =>
            // const identityType = getFieldValue('identityType')
            identityType == 3 && <>
              <Form.Item
                rules={[{
                  required: true,
                  message: '请选择关联联络组长'
                }]}
                name="leader1"
                label="关联联络组长"
              >
                <Select showArrow showSearch filterOption={false} placeholder="请选择关联联络组长">
                  {this.renderUserOptions(groupLeader)}
                </Select>
              </Form.Item>
              <Form.Item
                rules={[{
                  required: true,
                  message: '请选择关联后台大组长'
                }]}
                name="leader2"
                label="关联后台大组长"
              >
                <Select showArrow showSearch filterOption={false} placeholder="请选择关联后台大组长">
                  {this.renderUserOptions(teamLeader)}
                </Select>
              </Form.Item>
            </>}
        </Form.Item>
        <Form.List initialValue={['']} name="regionList">
          {(fields, { add, remove }) => <>
            {fields.map((field, index) => <Form.Item key={field.key} style={{ justifyContent: index ? 'end' : 'start' }} label={!index ? '负责区域' : ''}>
              <Row key={field.key} style={{ alignItems: 'center' }}>
                <Col span={22}>
                  <Form.Item
                    rules={[{
                      validator: (_, value) => {
                        if (!value) return Promise.resolve()
                        const codes = value.split('-')
                        if ((identityType == 2 && codes.length == 1) || (identityType == 3 && codes.length < 3)) return Promise.reject(new Error('请选择完整区域'))
                        return Promise.resolve()
                      }
                    }]}
                    {...field}
                    noStyle
                    name={[field.name]}
                  >
                    <CityCascader cityLevel={identityType} />
                  </Form.Item>
                </Col>
                {fields.length > 1 && <Col style={{ display: 'flex', justifyContent: 'center' }} span={2}>
                  <RsIcon type="icon-quxiao" onClick={() => remove(field.name)} />
                </Col>}
              </Row>
            </Form.Item>)}
            <Form.Item style={{ justifyContent: 'end' }}>
              <div className="add-label-buttton" onClick={() => add()}>
                <RsIcon type="icon-tianjia1" />添加
              </div>
            </Form.Item>
          </>}
        </Form.List>
        <Form.Item name="memberId" initialValue={clickId} hidden label="人员id">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }

  handleDeleteRole = (id) => {
    this.setState({
      deleteVisible: true,
      deleteId: id,
    })
  }

  staffDirectoryList = async ({ status, companyId, departId, roleId, userNameOrDepartNameLike } = this.props) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.staffDirectoryList({
      pageNo: current,
      pageSize,
      status,
      companyId,
      departId,
      roleId,
      userNameOrDepartNameLike,
    }).then((res) => {
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
        isLoading: false,
      })
    })
  }

  handleDeleteUser = () => {
    const { deleteId } = this.state
    return new Promise((resolve, reject) => {
      Api.staffDirectoryDeleteUser({
        id: deleteId,
      })
        .then(() => {
          resolve()
          this.handleCancelDelete()
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
          })
          this.staffDirectoryList()
        })
        .catch(() => reject())
    })
  }

  handleCancelDelete = () => {
    this.setState({
      deleteId: null,
      deleteVisible: false,
    })
  }

  renderDeleteModal = () => {
    const { deleteVisible, deleteId } = this.state
    return (
      <Modal
        title="员工删除"
        type="delete"
        onOk={this.handleDeleteUser}
        visible={deleteVisible}
        onCancel={this.handleCancelDelete}
      >
        {`确定删除${deleteId.indexOf(',') >= 0 ? '' : '该'}员工么？`}
      </Modal>
    )
  }

  renderOption = (data) => {
    if (!data || !data.length) return []
    return data.map((v) => <Option key={v.code}>{v.name}</Option>)
  }

  handleSaveRoleMember = () => {
    const { roleInfo, roles, selectedRowKeys } = this.state
    const params = {
      roles: [roles || roleInfo.roleId],
    }
    let apiKey = 'saveRoleMemberRel'
    if (!isEmpty(roleInfo)) {
      params.memberId = roleInfo.id
    } else {
      params.memberIds = selectedRowKeys
      apiKey = 'batchSaveRole'
    }
    return new Promise((resolve, reject) => {
      Api[apiKey](params)
        .then(() => {
          resolve()
          this.handleCancelEditRole()
          this.staffDirectoryList()
        })
        .catch(() => reject())
    })
  }

  handleRoleChange = (roles) => {
    this.setState({
      roles,
    })
  }

  handleCancelEditRole = () => {
    this.setState({
      editVisible: false,
      roleInfo: {},
    })
  }

  renderEditModal = () => {
    const { editVisible, roleInfo } = this.state
    const { roleInfoList } = this.props
    return (
      <Modal
        title="角色权限"
        okText="保存"
        onOk={this.handleSaveRoleMember}
        visible={editVisible}
        onCancel={this.handleCancelEditRole}
      >
        {!isEmpty(roleInfo) && (
          <div style={{ marginBottom: 24 }}>
            <Avatar style={{ marginRight: 8 }} size={32} src={roleInfo.thumbAvatar} />
            {roleInfo.name}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>角色</span>
          <Select
            onChange={this.handleRoleChange}
            style={{ flex: 1, marginLeft: 8 }}
            showArrow
            placeholder="请选择角色"
            defaultValue={roleInfo.roleId}
          >
            {this.renderOption(roleInfoList.filter((v) => v.isDefault != 2))}
          </Select>
        </div>
      </Modal>
    )
  }

  handleUpdateMemberDepart = () => {
    const { roleInfo, selectedRows } = this.state
    return this.formRef.current.validateFields().then((values) => {
      const { newDepartId } = values
      let data = []
      if (isEmpty(roleInfo)) {
        data = selectedRows.map((v) => ({
          relId: v.relId,
          newDepartId,
        }))
      } else {
        const { relId } = roleInfo
        data = [
          {
            relId,
            newDepartId,
          },
        ]
      }
      new Promise((resolve, reject) => {
        Api.batchUpdateMemberDepart({ data })
          .then(() => {
            resolve()
            this.handleCancelUpdateDepart()
            this.staffDirectoryList()
          })
          .catch(() => reject())
      })
    })
  }

  handleCancelUpdateDepart = () => {
    this.setState({
      roleInfo: {},
      updateDepartVisible: false,
    })
  }

  renderEidtDepartModal = () => {
    const { selectTreeData } = this.props
    const { updateDepartVisible, roleInfo } = this.state
    return (
      <Modal
        visible={updateDepartVisible}
        title={isEmpty(roleInfo) ? '批量转移' : '更换部门'}
        okText="保存"
        onOk={this.handleUpdateMemberDepart}
        onCancel={this.handleCancelUpdateDepart}
      >
        <Form preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            initialValue={roleInfo.departId}
            rules={[{ required: true, message: '请选择部门' }]}
            name="newDepartId"
            label="所属部门"
          >
            <TreeSelect
              showSearch
              treeNodeFilterProp="title"
              showArrow
              placeholder="请选择部门"
              treeData={selectTreeData}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleCancelTransfer = () => {
    this.setState({
      transferVisible: false,
    })
  }

  handleTransferAdmin = () => {
    const { selectedRowKeys } = this.state
    return new Promise((resolve, reject) => {
      Api.transferAdmin({
        memberId: selectedRowKeys[0],
      })
        .then(() => {
          resolve()
          this.handleCancelTransfer()
          this.staffDirectoryList()
        })
        .catch(() => reject())
    })
  }

  renderTransferModal = () => {
    const { transferVisible } = this.state
    return (
      <Modal
        visible={transferVisible}
        title="温馨提示"
        cancelButtonProps={{ type: 'text' }}
        okText="确定"
        cancelText="暂时不"
        onOk={this.handleTransferAdmin}
        onCancel={this.handleCancelTransfer}
      >
        超级管理员权限转移后，无法恢复，确定转移超级管理员权限吗？
      </Modal>
    )
  }

  renderSelectInfo = () => {
    const { supertubeId, memberId } = this.props
    const { selectedRows, selectedRowKeys } = this.state
    if (!selectedRows || !selectedRows.length) return null
    const disabled = selectedRows.length > 1 ? true : selectedRows[0].isDefault == 2
    return (
      <div className="select-row-div">
        <span>
          已选中&nbsp;
          {selectedRows.length}
          &nbsp;项
        </span>
        {memberId == supertubeId && (
          <span
            onClick={() => {
              if (disabled) return null
              this.setState({
                transferVisible: true,
              })
            }}
            className={disabled ? 'select-col-div-disabled select-col-div' : 'select-col-div'}
          >
            <RsIcon type="icon-zhuanyi" />
            转移超管
          </span>
        )}
        <span
          onClick={() => {
            this.setState({
              updateDepartVisible: true,
            })
          }}
          className="select-col-div"
        >
          <RsIcon type="icon-zhuanyi" />
          更换部门
        </span>
        <span
          onClick={() => {
            this.setState({
              editVisible: true,
            })
          }}
          className="select-col-div"
        >
          <RsIcon type="icon-kehuguanli" />
          角色
        </span>
        <span onClick={() => this.handleDeleteRole(selectedRowKeys.join(','))} className="select-col-div">
          <RsIcon type="icon-fangqi" />
          删除
        </span>
      </div>
    )
  }

  handleChangeTable = (page) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        ...page
      }
    }), this.staffDirectoryList)
  }

  render() {
    const {
      columns,
      pagination,
      dataSource,
      isLoading,
      deleteVisible,
      editVisible,
      updateDepartVisible,
      transferVisible,
      selectedRowKeys,
      modalType,
      visible
    } = this.state
    const rowSelection = {
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: selectedKeys,
        })
      },
      getCheckboxProps: (record) => ({
        disabled: record.status == -1,
      }),
      selectedRowKeys,
    }
    return (
      <>
        {this.renderSelectInfo()}
        <Table
          scroll={{ x: 'max-content' }}
          loading={isLoading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={pagination}
          onChange={this.handleChangeTable}
          rowKey={(reocrd) => reocrd.id}
        />
        {deleteVisible && this.renderDeleteModal()}
        {editVisible && this.renderEditModal()}
        {updateDepartVisible && this.renderEidtDepartModal()}
        {transferVisible && this.renderTransferModal()}
        {visible && ['绑定'].indexOf(modalType) != -1 && this.handleBindingModal()}
      </>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    status: state.mailList.status,
    actionVisible: state.mailList.actionVisible,
    companyId: state.mailList.companyId,
    userNameOrDepartNameLike: state.mailList.userNameOrDepartNameLike,
    roleId: state.mailList.roleId,
    departId: state.mailList.departId,
    roleInfoList: state.mailList.roleInfoList,
    selectTreeData: state.mailList.selectTreeData,
    supertubeId: state.mailList.supertubeId,
    memberId: state.mailList.memberId,
    identityList: state.mailList.identityList,
    dataBurning: state.mailList.dataBurning,
  }),
  { setValues }
)(Index)
