import React, { Component } from 'react'
import { Tree, Spin } from 'antd'
import { connect } from 'react-redux'
import Modal from '@Modal'
import { setValues } from './store/action'
import Api from './store/api'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    Promise.all([this.queryEnableEMenu(), this.getPermissionInfoByRole()]).then((res) => {
      const treeData = res[0]
      const checkedKeys = []
      const expandedKeys = []
      const defaultCheckedKeys = res[1]
      const getCheckedKeys = (data) => {
        if (!data || !data.length) return
        data.forEach((v) => {
          const { children, id } = v
          if (children && children.length) {
            expandedKeys.push(id)
            getCheckedKeys(children)
          } else if (defaultCheckedKeys.indexOf(id) >= 0) checkedKeys.push(id)
        })
      }
      getCheckedKeys(treeData)
      this.setState({
        treeData,
        checkedKeys,
        // isReady: true,
        expandedKeys,
        loading: false,
      })
    })
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      treeData: [],
      checkedKeys: [],
      expandedKeys: [],
      loading: true,
    }
  }

  queryEnableEMenu = async () => {
    const result = await Api.queryEnableEMenu()
    if (result.retCode == 200 && result.data) {
      return this.formaterTreeData(result.data)
    }
    return []
  }

  getPermissionInfoByRole = async ({ roleId } = this.props) => {
    const result = await Api.getPermissionInfoByRole({ roleId })
    if (result.retCode == 200 && result.data) {
      const checkedKeys = Object.keys(result.data)
      return checkedKeys.filter((v) => result.data[v] == 1)
    }
    return []
  }

  formaterTreeData = (data, ids = []) => {
    if (!data || !data.length) return []
    return data.map((v) => {
      const { nodes, name, id } = v
      v.key = id
      v.title = name
      v.parentIds = ids
      const parentIds = [...ids, id]
      if (nodes) v.children = this.formaterTreeData(nodes, parentIds)
      return v
    })
  }

  handleCancelVisible = () => {
    this.props.setValues({
      actionVisible: false,
      roleId: null,
    })
  }

  getChoose = () => {
    const { treeData, checkedKeys } = this.state
    const choose = {}
    const getChooseId = (data) => {
      if (!data || !data.length) return
      data.forEach((v) => {
        const { children, id, parentIds } = v
        if (checkedKeys.indexOf(id) >= 0) {
          choose[id] = 1
          parentIds.forEach((item) => {
            choose[item] = 1
          })
        } else {
          choose[id] = 0
        }
        if (children) getChooseId(children)
      })
    }
    getChooseId(treeData)
    return choose
  }

  handleSaveRolePermissionInfo = () => {
    const { roleId } = this.props
    const choose = this.getChoose()
    return new Promise((resolve, reject) => {
      Api.saveRolePermissionInfo({
        roleId,
        choose,
      })
        .then(() => {
          resolve()
          this.props.setValues({
            roleId: null,
            actionVisible: false,
          })
        })
        .catch(() => reject())
    })
  }

  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
    })
  }

  handleSelect = (keys, e) => {
    const { children, expanded, id, checked, parentId } = e.node
    let { checkedKeys, expandedKeys } = this.state
    const childrenIds = [id]
    const getChildrenId = (data) => {
      if (!data || !data.length) return
      data.forEach((v) => {
        if (v.children.length) getChildrenId(v.children)
        else childrenIds.push(v.id)
      })
    }
    if (children.length) {
      if (expanded) expandedKeys = expandedKeys.filter((v) => v != id)
      else expandedKeys = [...expandedKeys, id]
    }
    getChildrenId(children)
    if (checked) {
      // 已经选中，再次点击时取消勾选
      if (!children.length) childrenIds.push(parentId)
      checkedKeys = checkedKeys.filter((v) => childrenIds.indexOf(v) == -1)
    } else {
      checkedKeys = [...checkedKeys, ...childrenIds]
    }
    this.setState({
      checkedKeys,
      expandedKeys,
    })
  }

  handleExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    })
  }

  render() {
    const { actionVisible } = this.props
    const { treeData, checkedKeys, expandedKeys, loading } = this.state
    // if (!isReady) return null
    return (
      <Modal
        title="后台权限"
        onOk={this.handleSaveRolePermissionInfo}
        onCancel={this.handleCancelVisible}
        visible={actionVisible}
        okText="保存"
      >
        <Spin spinning={loading}>
          <Tree
            className="action-permission-tree"
            checkable
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            expandedKeys={expandedKeys}
            selectedKeys={[]}
            onExpand={this.handleExpand}
            onSelect={this.handleSelect}
          />
        </Spin>
      </Modal>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    actionVisible: state.rolePermissions.actionVisible,
    roleId: state.rolePermissions.roleId,
  }),
  { setValues }
)(Index)
