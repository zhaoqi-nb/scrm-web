import React, { Component } from 'react'
import { Tabs, Menu, Form, Input, Button } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import Api from './store/api'
import { setValues, resetValues } from './store/action'
import LabelList from './labelList'

import './index.less'

const { TabPane } = Tabs;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    this.queryLabelGroupList()
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
      modalType: ''
    }
  }

  queryLabelGroupList = (isNotUpdate) => {
    Api.queryLabelGroupList().then((res) => {
      this.setState({
        groupList: res.data
      })
      if (res.data && res.data.length && !isNotUpdate) {
        this.props.setValues({
          groupId: res.data[0].id,
          groupName: res.data[0].name,
        })
      }
    })
  }

  handleChangeVisible = (type, labelGroupInfo) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible,
      labelGroupInfo
    }))
  }

  handleChangeGroupId = (groupId, groupName) => {
    this.props.setValues({
      groupId,
      groupName
    })
  }

  renderGroupList = (groupList) => {
    const { groupId } = this.props
    if (!groupList.length) return null
    return <Menu className="group-list-menu" selectedKeys={groupId}>
      {groupList.map((v) => {
        const { id, name } = v
        return <Menu.Item onClick={() => this.handleChangeGroupId(id, name)} key={id}>
          <div>{name}</div>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="menu-item-anticon"
          >
            <RsIcon onClick={() => this.handleChangeVisible('编辑', v)} type="icon-bianji1" />
            <RsIcon onClick={() => this.handleChangeVisible('删除', v)} type="icon-shanchu" />
          </div>
        </Menu.Item>
      })}
    </Menu>
  }

  handleSaveLabelGroup = () => this.formRef.current.validateFields().then(
    (values) => {
      const { id } = values
      let apiKey = 'saveLabelGroup'
      if (id) apiKey = 'updateLabelGroup'
      return new Promise((resolve, reject) => {
        Api[apiKey](values)
          .then(() => {
            resolve()
            this.queryLabelGroupList(this.props.groupId)
          })
          .catch(() => reject())
      })
    }
  )

  renderCreatModal = () => {
    const { labelGroupInfo, visible } = this.state
    return <Modal visible={visible} onOk={this.handleSaveLabelGroup} onCancel={this.handleChangeVisible} title={`${labelGroupInfo ? '编辑' : '添加'}标签组`}>
      <Form preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item initialValue={labelGroupInfo ? labelGroupInfo.name : ''} rules={[{ max: 15, message: '标签组名称最多15字' }, { required: true, message: '请输入标签组名称' }]} name="name" label="标签组名称">
          <Input showCount placeholder="请输入" maxLength={15} />
        </Form.Item>
        <Form.Item initialValue={labelGroupInfo ? labelGroupInfo.colorValue : '#76A6F1'} name="colorValue" hidden label="标签组颜色">
          <Input />
        </Form.Item>
        <Form.Item name="id" initialValue={labelGroupInfo ? labelGroupInfo.id : ''} hidden label="标签组id">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }

  handleDeleteLabelGroup = () => {
    const { labelGroupInfo: { id } } = this.state
    return new Promise((resolve, reject) => {
      Api.removeLabelGroup(id)
        .then(() => {
          resolve()
          this.queryLabelGroupList(id != this.props.groupId)
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => {
    const { visible } = this.state
    return <Modal onOk={this.handleDeleteLabelGroup} visible={visible} type="delete" onCancel={this.handleChangeVisible} title="删除提示">
      确认删除此标签组？删除后，已添加到客户信息的标签也一起删除。
    </Modal>
  }

  handleSyncTagData = () => {
    this.setState({
      syncLoading: true
    })
    Api.syncTagData().finally(() => {
      this.setState({
        syncLoading: false
      })
    })
  }

  render() {
    const { groupList, visible, modalType, syncLoading } = this.state
    return <>
      <Tabs tabBarExtraContent={<Button loading={syncLoading} onClick={this.handleSyncTagData}>更新标签</Button>} className="customer-label-tabs scrm-tabs" defaultActiveKey="1">
        <TabPane tab="企微标签" key="1" />
      </Tabs>
      <div className="customer-label-content">
        <div className="content-left">
          <div className="content-left-top">
            <div>标签分组（{groupList.length}）</div>
            <RsIcon onClick={() => this.handleChangeVisible('新增')} type="icon-tianjia" />
          </div>
          {this.renderGroupList(groupList)}
        </div>
        <div style={{ flex: 1, padding: '12px' }}><LabelList /></div>
      </div>
      {visible && ['编辑', '新增'].indexOf(modalType) != -1 && this.renderCreatModal()}
      {visible && modalType == '删除' && this.renderDeleteModal()}
    </>
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    groupId: state.customerLabel.groupId,
  }),
  { setValues, resetValues }
)(Index)
