// 群发
import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { userTreeFormat } from '@util'
import { cloneDeep } from 'lodash'
import DragSortingUpload from '../../../comments/publicView/upload'
import Api from '../../service'

import './index.less'

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
    const { data: { drawerData = {} } } = this.props
    this.setState({
      medias: drawerData.medias || [],
    })
    this.formRef.current.setFieldsValue(drawerData)
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectUser = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        const memberIds = this.formRef.current.getFieldValue('memberId')
        TRCheckboxModal.show({ treeData: userTreeFormat(res.data), value: memberIds ? memberIds.map((v) => v.value) : [], title: '选择群发账号', titleRender: itemRender, itemRender }).then((result) => {
          const { index } = result
          if (index === 1) {
            this.formRef.current.setFieldsValue({
              memberId: result.checkedNodes.map((v) => ({
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
    }
  }

  formVlaueChange = (changeValue, allValues) => {
    const changeKey = Object.keys(changeValue)[0]
    if (changeKey == 'message') {
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
  handleSaveMassSend = (values) => {
    const { medias } = this.state
    const formValue = cloneDeep(values)
    formValue.medias = this.transformMedias(medias);
    formValue.memberIds = formValue?.memberId?.map((item) => item?.value);
    // formValue.memberIds = formValue?.memberIds?.map((item) => item?.value || '')
    // formValue.memberIds = formValue.memberIds.map((v) => v.value)
    this.props.onPress({ index: 1, ...formValue })
  }

  render() {
    const { medias } = this.state
    return <div>
      <Form
        colon={false}
        layout="vertical"
        ref={this.formRef}
        style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', marginBottom: '60px' }}
        onValuesChange={this.formVlaueChange}
        onFinish={this.handleSaveMassSend}
      >
        <Form.Item
          name="operatingTitle"
          label="流程节点备注"
        >
          <Input showCount maxLength={30} placeholder="请输入流程节点备注" />
        </Form.Item>
        <div className="page-label">编辑群发消息</div>
        <Form.Item
          hidden
          initialValue={1}
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
            message: '选择群发账号'
          }]}
          name="memberId"
          label="执行成员"
          initialValue={[]}
        >
          <Select
            placeholder="请选择"
            labelInValue
            mode="multiple"
            open={false}
            allowClear
            showArrow
            onClick={this.renderSelectUser}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label={<div>群发内容&nbsp;&nbsp;&nbsp;<span style={{ color: '#8C8C8C' }}>注意：每位客户每天可以接收1条群发消息，不限企业发布的群发还是个人发布的群发</span></div>}
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
        {
          this.props.data?.renderCode === 'readOnly' ? null : <div className="draw-form-affix-button">
            <Button htmlType="submit" type="primary">保存</Button>
          </div>
        }
      </Form>
    </div>
  }
}

Index.propTypes = {}

export default Index
