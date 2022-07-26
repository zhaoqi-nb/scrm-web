import React, { Component } from 'react'
import { Form, Input, Button, Switch, Row, Col, message, Spin } from 'antd'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { cloneDeep } from 'lodash'
import { userTreeFormat } from '@util'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import { GetQueryString } from '../../utils/Util'
import CustomTagIndex from '../comments/publicView/customTagNew'
import GroupSelect from '../comments/groupSelect'

import Api from './api'

import './index.less'

const itemRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    const id = GetQueryString('id')
    if (id) this.getDetail(id)
    else {
      this.setState({
        loading: false
      })
    }
  }

  getDetail = (id) => {
    this.setState({
      loading: true
    })
    Api.getDetail(id).then((res) => {
      const { members, codeName, friendCheck, welcomeMessageInfo, activityCodeId, groupActivityCodeUrl, groupActivityCodeName, groupActivityCodeType, labels } = res.data
      this.formRef.current.setFieldsValue({
        members: members.map((v) => ({
          name: v.name,
          memberId: v.memberId,
          qywxUserId: v.qywxUserId
        })),
        codeName,
        friendCheck,
        welcomeMessageInfo: {
          message: welcomeMessageInfo.message
        },
        activityCodeId: {
          id: activityCodeId,
          qrCodeUrl: groupActivityCodeUrl,
          groupCodeName: groupActivityCodeName,
          groupCodeType: groupActivityCodeType
        },
        id,
        labels: {
          tagList: labels.map((v) => ({
            ...v,
            id: v.labelId,
            name: v.labelName
          }))
        }
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectUser = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        const members = this.formRef.current.getFieldValue('members')
        TRCheckboxModal.show({ treeData: userTreeFormat(res.data), value: members ? members.map((v) => v.memberId) : [], title: '选择群发账号', titleRender: itemRender, itemRender }).then((result) => {
          const { index } = result
          if (index === 1) {
            this.formRef.current.setFieldsValue({
              members: result.checkedNodes.map((v) => ({
                name: v.label,
                memberId: v.id,
                qywxUserId: v.userId
              })),
            })
          }
        })
      }
    })
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      visible: false,
      isShowCheckButton: true,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 项`,
      },
      sendCount: -1
    }
  }

  handleSave = (values) => {
    this.setState({
      formValue: values
    }, this.handleSaveMassSend)
    // this.handleChangeVisible('新建')
  }

  handleChangeVisible = (type) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible
    }))
  }

  // 保存弹窗确认
  handleSaveMassSend = () => {
    const formValue = cloneDeep(this.state.formValue)
    formValue.activityCodeId = formValue.activityCodeId.id
    formValue.friendCheck = formValue.friendCheck ? 1 : 0
    formValue.labels = formValue.labels?.tagList?.map((v) => ({
      labelId: v.id,
      labelGroupId: v.labelGroupId
    }))
    this.setState({
      saveLoading: true
    })
    let apiKey = ''
    if (formValue.id) apiKey = 'updateNewCustomers'
    else apiKey = 'saveNewCustomers'
    Api[apiKey](formValue).then(() => {
      message.success('保存成功')
      this.handleGoBack()
    }).finally(() => {
      this.setState({
        saveLoading: false
      })
    })
  }

  handleGoBack = () => {
    this.props.history.replace('/newCustomersLabel')
  }

  renderSaveModal = () => {
    const { formValue, visible } = this.state
    const { memberIds } = formValue
    return <Modal onOk={this.handleSaveMassSend} visible={visible} onCancel={this.handleChangeVisible} title="新建群发提示">
      {memberIds.length > 2 ? `确定为「${memberIds[0].label}、${memberIds[1].label}」等人创建群发任务吗？` : `确定为「${memberIds.map((v) => v.label).join('、')}」创建群发任务吗？`}
    </Modal>
  }

  onCloseCustomTags = (id, tagList) => {
    const newList = tagList.filter((listItem) => id !== listItem.id)
    this.formRef.current.setFieldsValue({
      labels: { tagList: newList }
    })
  }

  render() {
    const { visible, modalType, saveLoading, loading } = this.state
    return <Spin spinning={loading}>
      <div className="page-title">新客自动拉群</div>
      <Form
        colon={false}
        labelAlign="right"
        ref={this.formRef}
        // labelCol={{ span: 3 }}
        className="new-customers-form-label-fix"
        wrapperCol={{ span: 16 }}
        style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', marginBottom: '60px' }}
        onFinish={this.handleSave}
      >
        <Form.Item hidden name="id" label="id">
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{
            required: true,
            message: '请输入二维码名称'
          }]}
          name="codeName"
          label="二维码名称"
        >
          <Input showCount maxLength={20} placeholder="请输入二维码名称" />
        </Form.Item>
        <Form.Item
          rules={[{
            required: true,
            message: '请输入使用成员'
          },
          {
            max: 100,
            message: '使用员工最多可选100人',
            type: 'array'
          }]}
          label="使用成员"
          name="members"
        >
          <Form.Item style={{ marginBottom: 0 }}>
            <div onClick={this.renderSelectUser} className="add-form-btn">
              <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
              <div style={{ height: '17px', lineHeight: '17px' }}>选择成员</div>
            </div>
          </Form.Item>
          <Form.Item shouldUpdate={(prevValues, curValues) => JSON.stringify(prevValues.members) !== JSON.stringify(curValues.members)} style={{ marginBottom: 0 }}>
            {({ getFieldValue }) => {
              const nextMembers = getFieldValue('members')
              return nextMembers && nextMembers.length > 0 && <div className="select-content">
                {nextMembers.map((v) => {
                  const { memberId, name } = v
                  return <div className="select-content-label">
                    <span>{name}</span>
                    <RsIcon
                      style={{ fontSize: '10px' }}
                      onClick={() => {
                        const newMembers = nextMembers.filter((item) => item.memberId != memberId)
                        this.formRef.current.setFieldsValue({
                          members: newMembers
                        })
                      }}
                      type="icon-quxiao"
                    />
                  </div>
                })}
              </div>
            }}
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="自动通过好友"
          style={{ alignItems: 'baseline' }}
        >
          <Row>
            <Col>
              <Form.Item style={{ marginBottom: 0 }} valuePropName="checked" initialValue name="friendCheck">
                <Switch />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: 8, color: '#84888C' }}>
              开启后，客户添加时，无需经过确认自动成为好友
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="新客户标签">
          <Form.Item initialValue={{ tagList: [] }} style={{ alignItems: 'center', marginBottom: 0 }} name="labels">
            <CustomTagIndex>
              <div className="add-form-btn">
                <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
                <div style={{ height: '17px', lineHeight: '17px' }}>添加标签</div>
              </div>
            </CustomTagIndex>
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevValues, curValues) => JSON.stringify(prevValues.labels) !== JSON.stringify(curValues.labels)}
            style={{ marginBottom: 0 }}
          >
            {({ getFieldValue }) => {
              const nextChooseLabels = getFieldValue('labels')
              const tagList = nextChooseLabels.tagList
              return tagList && tagList.length > 0 && <Form.Item>
                <div className="select-content">
                  {tagList.map((v) => {
                    const { name, id } = v
                    return <div className="select-content-label">
                      <span>{name}</span>
                      <RsIcon
                        onClick={() => this.onCloseCustomTags(id, tagList)}
                        style={{ fontSize: '10px' }}
                        type="icon-quxiao"
                      />
                    </div>
                  })}
                </div>
              </Form.Item>
            }}
          </Form.Item>
        </Form.Item>
        <Form.Item
          name={['welcomeMessageInfo', 'message']}
          label="入群引导语"
          className="textAreaItem"
          rules={[
            {
              required: true,
              message: '请添加入群引导语',
            },
          ]}
        >
          <Input.TextArea
            showCount
            autoSize={{ minRows: 10, maxRows: 10 }}
            placeholder="例：入群即可获得优惠券，快扫描下面的二维码加入我们吧！"
            bordered
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: '请选择群聊',
            },
          ]}
          label="选择群活码"
          name="activityCodeId"
        >
          <GroupSelect />
        </Form.Item>
        <div className="form-affix-button">
          <Button onClick={this.handleGoBack} style={{ marginRight: '24px' }} type="text">返回</Button>
          <Button loading={saveLoading} htmlType="submit" type="primary">提交</Button>
        </div>
      </Form>
      {visible && modalType == '新建' && this.renderSaveModal()}
    </Spin>
  }
}

Index.propTypes = {}

export default Index
