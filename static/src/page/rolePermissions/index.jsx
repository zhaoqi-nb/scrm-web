import React, { Component } from 'react'
import { Button, Input, Form } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import RoleList from './roleList'
import { setValues } from './store/action'
import Api from './store/api'

const formaterTreeData = (data) => {
  if (!data || !data.length) return []
  return data.map((v) => {
    const { subDepartList, departName, id } = v
    v.key = id
    v.value = id
    v.title = departName
    if (subDepartList) v.children = formaterTreeData(subDepartList)
    return v
  })
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef()

  componentDidMount() {
    Api.queryDepartListByCompanyId().then((res) => {
      if (res.retCode == 200) {
        this.props.setValues({
          departList: formaterTreeData(res.data),
        })
      }
    })
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      name: '',
    }
  }

  handleSearch = (name) => {
    this.props.setValues({
      name,
    })
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleCreateModal = () => {
    this.props.setValues({
      createVisible: true,
    })
  }

  handleCancelModal = () => {
    this.props.setValues({
      roleInfo: {},
      createVisible: false,
      isEdit: false
    })
  }

  handleSaveRoleInfo = () => {
    const { isEdit } = this.props
    return this.formRef.current.validateFields().then((values) => {
      let apiKey = 'saveRoleInfo'
      if (isEdit) apiKey = 'updateRoleInfo'
      return new Promise((resolve, reject) => {
        Api[apiKey]({
          ...values,
        })
          .then(() => {
            resolve()
            this.props.setValues({
              isRefresh: true,
              isEdit: false,
            })
            this.handleCancelModal()
          })
          .catch(() => reject())
      })
    })
  }

  renderCreateModal = () => {
    const { roleInfo, createVisible } = this.props
    return (
      <Modal
        title={`${roleInfo.name ? '编辑' : '创建'}角色`}
        visible={createVisible}
        onOk={this.handleSaveRoleInfo}
        onCancel={this.handleCancelModal}
        okText="保存"
      >
        <Form ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            initialValue={roleInfo.name}
            name="name"
            label="角色名称"
            rules={[
              { required: true, message: '请输入角色名称' },
              { max: 20, message: '角色名称最长为20个字符' },
            ]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item style={{ marginBottom: '0' }} initialValue={roleInfo.remark} label="角色备注" name="remark">
            <Input.TextArea placeholder="请输入角色备注信息" />
          </Form.Item>
          <Form.Item hidden initialValue={roleInfo.id} name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { name } = this.state
    const { createVisible } = this.props
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="page-title">角色权限</div>
          <Button type="primary" onClick={this.handleCreateModal}>
            创建角色
          </Button>
        </div>
        <Input
          style={{ margin: '8px 0 16px', width: '176px' }}
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          placeholder="请输入角色名称"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <RoleList />
        {createVisible && this.renderCreateModal()}
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    createVisible: state.rolePermissions.createVisible,
    roleInfo: state.rolePermissions.roleInfo,
    isEdit: state.rolePermissions.isEdit,
  }),
  { setValues }
)(Index)
