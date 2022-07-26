import React, { Component } from 'react'
import { Form, Input, Select, Button, Radio, DatePicker } from 'antd'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { cloneDeep } from 'lodash'
import { userTreeFormat } from '@util'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Modal from '@Modal'
import DragSortingUpload from '../comments/publicView/upload'
import PhoneView from '../comments/publicView/phoneView'
import Api from './api'

import './index.less'

const disabledDate = (current) => current && current < moment()

const PhoneViewTypes = {
  text: 1,
  img: 2,
  link: 3,
  video: 4,
  file: 5
}

const itemRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectMainGroup = () => {
    Api.getMainGroupDepartTree().then((res) => {
      if (res.retCode == 200) {
        const memberIds = this.formRef.current.getFieldValue('memberIds')
        TRCheckboxModal.show({ treeData: userTreeFormat(res.data, true), value: memberIds ? memberIds.map((v) => v.value) : [], title: '选择群主', titleRender: itemRender, itemRender }).then((result) => {
          const { index } = result
          if (index === 1) {
            this.formRef.current.setFieldsValue({
              memberIds: result.checkedNodes.map((v) => ({
                label: v.label,
                value: v.id
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
      medias: [],
      visible: false
    }
  }

  formVlaueChange = (changeValue, allValues) => {
    if (Object.keys(changeValue)[0] == 'message') {
      this.setState((state) => {
        const { medias } = state
        const isHasText = medias.findIndex((v) => v.fileType == 'text')
        const value = {
          fileType: 'text',
          textValue: allValues.message,
          content: allValues.message,
        }
        if (isHasText > -1) {
          return {
            medias: [value,
              ...medias.filter((v) => v.fileType != 'text')]
          }
        }
        medias.unshift(value)
        return { medias }
      })
    }
  }

  handleSave = (values) => {
    this.setState({
      formValue: values
    })
    this.handleChangeVisible('新建')
  }

  handleChangeVisible = (type) => {
    this.setState((state) => ({
      modalType: type,
      visible: !state.visible
    }))
  }

  transformMedias = (data) => cloneDeep(data).map((v) => ({
    ...v,
    type: PhoneViewTypes[v.fileType],
    content: v.content || v.link
  }))

  onFileChange = (e) => {
    const { medias } = this.state
    const phoneViewList = e.map((v) => ({
      ...v,
      filePath: v.url,
      fileSize: v.fileExactSize
    }))
    if (medias[0] && medias[0].fileType == 'text') { // 存在提示信息
      this.setState({
        medias: [medias[0], ...phoneViewList]
      })
    } else {
      this.setState({
        medias: phoneViewList
      })
    }
  }

  // 保存弹窗确认
  handleSaveMassSend = () => {
    const { medias } = this.state
    const formValue = cloneDeep(this.state.formValue)
    formValue.medias = this.transformMedias(medias)
    formValue.memberIds = formValue.memberIds.map((v) => v.value)
    formValue.sendTime = moment(formValue.sendTime).valueOf()
    return new Promise((resolve, reject) => {
      Api.saveOrUpdate(formValue).then(() => {
        resolve('保存成功')
        this.handleGoBack()
      }).catch(() => reject())
    })
  }

  handleGoBack = () => {
    this.props.history.replace('/customerGroupMassSend')
  }

  renderSaveModal = () => {
    const { formValue, visible } = this.state
    const { memberIds } = formValue
    return <Modal onOk={this.handleSaveMassSend} visible={visible} onCancel={this.handleChangeVisible} title="新建群发提示">
      {memberIds.length > 2 ? `确定为「${memberIds[0].label}、${memberIds[1].label}」等人创建群发任务吗？` : `确定为「${memberIds.map((v) => v.label).join('、')}」创建群发任务吗？`}
    </Modal>
  }

  render() {
    const { medias, visible, modalType } = this.state
    return <div>
      <div className="page-title">新建群群发任务</div>
      <div className="page-label">基础信息</div>
      <Form
        colon={false}
        ref={this.formRef}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', marginBottom: '60px' }}
        onValuesChange={this.formVlaueChange}
        onFinish={this.handleSave}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ width: '700px' }}>
            <Form.Item
              hidden
              initialValue={2}
              name="type"
              label="类型"
            >
              <Input />
            </Form.Item>
            <Form.Item
              rules={[{
                required: true,
                message: '请输入任务名称'
              }]}
              name="name"
              label="任务名称"
            >
              <Input showCount maxLength={20} placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item
              rules={[{
                required: true,
                message: '请选择群主'
              }]}
              name="memberIds"
              label="选择群主"
              extra="提示：群主收到群发任务后，可在企业微信上选择群聊发送群发消息"
            >
              <Select
                placeholder="请选择群主"
                labelInValue
                mode="multiple"
                open={false}
                allowClear
                showArrow
                onClick={this.renderSelectMainGroup}
              />
            </Form.Item>
            <div className="page-label">群群发消息</div>
            <div style={{ margin: '16px 0 24px' }} className="content-tips">
              <RsIcon className="content-tips-icon" type="icon-tishixinxitubiao" />
              <div className="content-tips-text">注意：每位客户每天可以接收1条群发消息，不限企业发布的群发还是个人发布的群发</div>
            </div>
            <Form.Item
              name="message"
              label="群发内容"
              className="textAreaItem"
              rules={[
                {
                  required: true,
                  message: '请输入群发内容',
                },
              ]}
            >
              <Form.Item
                name="message"
                rules={[
                  {
                    required: true,
                    message: '',
                  },
                ]}
              >
                <Input.TextArea
                  showCount
                  autoSize={{ minRows: 10, maxRows: 10 }}
                  placeholder="请输入欢迎语"
                  bordered
                  maxLength={300}
                />
              </Form.Item>
              <div className="pr" style={{ marginTop: '-24px' }}>
                <DragSortingUpload
                  linkType="link2"
                  files={medias.filter((v) => v.fileType != 'text')}
                  onChange={this.onFileChange}
                />
              </div>
            </Form.Item>
            <Form.Item
              rules={[{
                required: true,
                message: '请输入群发类型'
              }]}
              label="群发类型"
              style={{ alignItems: 'baseline' }}
            >
              <Form.Item initialValue={0} name="sendType">
                <Radio.Group>
                  <Radio value={0}>立即发送</Radio>
                  <Radio value={1}>定时发送</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.sendType !== curValues.sendType} style={{ marginBottom: 0 }}>
                {({ getFieldValue }) => {
                  const nextSendType = getFieldValue('sendType')
                  return nextSendType == 1 && <Form.Item name="sendTime" style={{ marginBottom: '8px' }}>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                        format: 'HH:mm',
                        // minuteStep: 10
                      }}
                      disabledDate={disabledDate}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                }}
              </Form.Item>
            </Form.Item>
          </div>
          <PhoneView list={medias} />
        </div>
        <div className="form-affix-button">
          <Button type="text" onClick={this.handleGoBack} style={{ marginRight: '24px' }}>返回</Button>
          <Button htmlType="submit" type="primary">保存群发任务</Button>
        </div>
      </Form>
      {visible && modalType == '新建' && this.renderSaveModal()}
    </div>
  }
}

Index.propTypes = {}

export default Index
