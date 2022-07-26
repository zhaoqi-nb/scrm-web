import React, { Component } from 'react'
import { Tabs, Menu, Select } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { dataSourceFormat } from './util'
import Api from './store/api'
import AddGroup from './addGroup'
import { setValues, resetValues } from './store/action'
import Filter from './filter'
import LabelList from './scriptLibraryList'

import './index.less'

const { TabPane } = Tabs;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectDepart = () => {
    const { checkedDepartKeys } = this.props
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        TRCheckboxModal.show({ treeData: dataSourceFormat(res.data), value: checkedDepartKeys, title: '选择群主' }).then((result) => {
          if (result.index === 1) {
            this.props.setValues({
              checkedDepartKeys: result.checkedKeys,
              checkedDepartOptions: result.checkedNodes,
            })
            // handelInput(result?.checkedKeys || [], 'ownerMemberIds')
          }
        })
      }
    })
  }

  componentDidMount() {
    this.findGroup()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { checkedDepartKeys } = this.props
    if (
      JSON.stringify(checkedDepartKeys) != JSON.stringify(nextProps.checkedDepartKeys)
    ) {
      this.findGroup(false, nextProps)
    }
  }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      groupList: [],
      visible: false,
      modalType: '',
      groupType: 1
    }
  }

  findGroup = (isNotUpdate, { checkedDepartKeys } = this.props) => {
    const { groupType } = this.state
    Api.findGroup({
      groupType,
      departIdList: checkedDepartKeys
    }).then((res) => {
      this.setState({
        groupList: res.data.list
      })
      if (res.data && res.data.list.length && !isNotUpdate) {
        this.props.setValues({
          groupId: res.data.list[0].groupId,
          propsGroupInfo: res.data.list[0]
        })
      }
    })
  }

  handleChangeVisible = (type, groupInfo) => {
    if (type == '编辑') {
      Api.getGroup({
        groupId: groupInfo.groupId
      }).then((res) => {
        this.setState((state) => ({
          groupInfo: res.data,
          modalType: type,
          visible: !state.visible,
        }))
      })
    } else {
      this.setState((state) => ({
        modalType: type,
        visible: !state.visible,
        groupInfo
      }))
    }
  }

  handleChangeGroupId = (groupId) => {
    Api.getGroup({
      groupId
    }).then((res) => {
      this.props.setValues({
        groupId,
        propsGroupInfo: res.data
      })
    })
  }

  renderGroupList = (groupList) => {
    const { groupId } = this.props
    const { groupType } = this.state
    if (!groupList.length) return null
    return <Menu className="group-list-menu" selectedKeys={String(groupId)}>
      {groupList.map((v) => {
        const { groupName, defaultFlag } = v
        return <Menu.Item onClick={() => this.handleChangeGroupId(v.groupId)} key={v.groupId}>
          <div>{groupName}</div>
          {!defaultFlag && groupType != 3 && <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="menu-item-anticon"
          >
            <RsIcon onClick={() => this.handleChangeVisible('编辑', v)} type="icon-bianji1" />
            <RsIcon onClick={() => this.handleChangeVisible('删除', v)} type="icon-shanchu" />
          </div>}
        </Menu.Item>
      })}
    </Menu>
  }

  // 删除话术分组
  handleDeleteLabelGroup = () => {
    const { groupInfo: { groupId } } = this.state
    return new Promise((resolve, reject) => {
      Api.deleteGroup({
        groupId
      })
        .then(() => {
          resolve()
          this.findGroup(groupId != this.props.groupId)
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => {
    const { visible } = this.state
    return <Modal onOk={this.handleDeleteLabelGroup} visible={visible} type="delete" onCancel={this.handleChangeVisible} title="删除提示">
      删除分组后，分组里面的素材将都被删除，确定删除吗？
    </Modal>
  }

  handleChangeDepart = (value) => {
    this.props.setValues({
      checkedDepartOptions: value.map((v) => ({
        key: v.value,
        title: v.label
      })),
      checkedDepartKeys: value.map((v) => v.value)
    })
  }

  handleChangeGroupType = (groupType) => {
    this.props.setValues({
      groupId: null
    })
    this.setState({
      groupType
    }, this.findGroup)
  }

  render() {
    const { groupList, visible, modalType, groupType, groupInfo } = this.state
    const { checkedDepartOptions, groupId } = this.props
    const isEnterprise = groupType == 1
    return <div className="scriptLibrary">
      <Tabs className="scrm-tabs script-library-tabs" onChange={this.handleChangeGroupType} defaultActiveKey={groupType}>
        <TabPane tab="企业话术" key="1" />
        {/* <TabPane tab="团队话术" key="2" /> */}
        <TabPane tab="个人话术" key="3" />
      </Tabs>
      <div className="customer-label-content">
        <div className="content-left">
          {isEnterprise && <Select
            onClick={this.renderSelectDepart}
            open={false}
            style={{ width: '100%' }}
            value={checkedDepartOptions.map((v) => ({
              value: v.key,
              label: v.title
            }))}
            labelInValue
            mode="tags"
            maxTagCount={2}
            onChange={this.handleChangeDepart}
            placeholder="选择部门"
            allowClear
          />}
          <div className="content-left-top">
            <div>全部分组（{groupList.length}）</div>
            {isEnterprise && <RsIcon onClick={() => this.handleChangeVisible('新增')} type="icon-tianjia" />}
          </div>
          {this.renderGroupList(groupList)}
        </div>
        <div style={{ flex: 1, padding: '12px', width: '0' }}>
          <Filter />
          <LabelList {...this.props} groupType={groupType} />
        </div>
      </div>
      {visible && ['编辑', '新增'].indexOf(modalType) != -1 && <AddGroup
        visible={visible}
        groupInfo={groupInfo}
        onCancel={() => {
          if (modalType == '编辑' && groupInfo && groupInfo.groupId == groupId) {
            this.handleChangeGroupId(groupId)
          }
          this.findGroup(true)
          this.handleChangeVisible()
        }}
        groupType={groupType}
      />}
      {visible && modalType == '删除' && this.renderDeleteModal()}
    </div>
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    groupId: state.scriptLibrary.groupId,
    checkedDepartKeys: state.scriptLibrary.checkedDepartKeys,
    checkedDepartOptions: state.scriptLibrary.checkedDepartOptions,
  }),
  { setValues, resetValues }
)(Index)
