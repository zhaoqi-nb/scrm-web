import React, { Component } from 'react'
import { Form, Input, Radio, message } from 'antd'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import Api from './store/api'
import { dataSourceFormat } from './util'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      groupList: [],
      visible: false,
    }
  }

  handleSaveLabelGroup = () => this.formRef.current.validateFields().then(
    (values) => {
      const { groupInfo } = this.props
      const { groupId } = values
      const { checkedKeys } = this.state
      let apiKey = 'addGroup'
      if (groupId) apiKey = 'updateGroup'
      if (values.scope == 2) {
        if (checkedKeys && checkedKeys.length) values.deptList = checkedKeys
        else values.deptList = groupInfo ? groupInfo.departmentList : null
        if (!values.deptList) {
          message.warn('请选择部门')
          return Promise.reject(new Error('请选择部门'))
        }
      }
      return new Promise((resolve, reject) => {
        Api[apiKey](values)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    }
  )

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectDepart = () => {
    const { checkedKeys } = this.state
    const { groupInfo } = this.props
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        TRCheckboxModal.show({ treeData: dataSourceFormat(res.data), value: checkedKeys || groupInfo?.departmentList?.map((v) => v.id) || [], title: '选择部门' }).then((result) => {
          const { index } = result
          if (index === 1) {
            this.setState({
              checkedKeys: result.checkedKeys,
              checkedNodes: result.checkedNodes,
            })
          }
        })
      }
    })
  }

  renderCreatModal = () => {
    const { checkedNodes } = this.state
    const { groupInfo, groupType, onCancel } = this.props
    const showDepart = checkedNodes || groupInfo?.departmentList || []
    return <Modal
      visible
      width={550}
      onOk={this.handleSaveLabelGroup}
      onCancel={onCancel}
      title={`${groupInfo ? '编辑' : '添加'}分组`}
    >
      <Form preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item initialValue={groupInfo ? groupInfo.groupName : ''} rules={[{ max: 8, message: '分组名称最多8个字' }, { required: true, message: '请输入分组名称' }]} name="groupName" label="分组名称">
          <Input showCount placeholder="请输入" maxLength={8} />
        </Form.Item>
        <Form.Item style={{ alignItems: 'center' }} label="可见范围" name="scope" initialValue={groupInfo ? groupInfo.scope : 1}>
          <Radio.Group>
            <Radio value={1}>辖内全部门可见</Radio>
            <Radio value={2}>部分部门可见</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} shouldUpdate={(prevValues, curValues) => prevValues.scope !== curValues.scope}>
          {({ getFieldValue }) => {
            const scope = getFieldValue('scope')
            return scope == 2 && <Form.Item label="选择可见部门">
              <div onClick={this.renderSelectDepart} className="add-form-btn">
                <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
                <div style={{ height: '17px', lineHeight: '17px' }}>添加部门</div>
              </div>
              {showDepart && showDepart.length > 0 && <div className="select-content">
                {showDepart.map((v) => {
                  const { id, departName } = v
                  return <div className="select-content-label">
                    <span>{departName}</span>
                    <RsIcon
                      style={{ fontSize: '10px' }}
                      onClick={() => {
                        this.setState({
                          checkedNodes: showDepart.filter((item) => item.id != id),
                          checkedKeys: showDepart.filter((item) => item.id != id).map((item) => item.id)
                        })
                      }}
                      type="icon-quxiao"
                    />
                  </div>
                })}
              </div>}
            </Form.Item>
          }}
        </Form.Item>
        <Form.Item name="groupId" initialValue={groupInfo ? groupInfo.groupId : ''} hidden label="分组id">
          <Input />
        </Form.Item>
        <Form.Item name="groupType" initialValue={groupType} hidden label="分组类型">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }

  render() {
    const { visible } = this.props
    return visible ? this.renderCreatModal() : null
  }
}

Index.propTypes = {}

export default Index
