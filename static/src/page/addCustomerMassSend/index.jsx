import React, { Component } from 'react'
import { Form, Input, Select, Button, Radio, DatePicker, Checkbox } from 'antd'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { userTreeFormat } from '@util'
import { cloneDeep } from 'lodash'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Modal from '@Modal'
import DragSortingUpload from '../comments/publicView/upload'
import PhoneView from '../comments/publicView/phoneView'
import CustomTagIndex from '../comments/publicView/customTagNew'
import Api from './api'

import './index.less'

const { RangePicker } = DatePicker
const sexOptions = [
  { label: '全部', value: -1 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '未知', value: 0 }]

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
  renderSelectUser = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        const memberIds = this.formRef.current.getFieldValue('memberIds')
        TRCheckboxModal.show({ treeData: userTreeFormat(res.data), value: memberIds ? memberIds.map((v) => v.value) : [], title: '选择群发账号', titleRender: itemRender, itemRender }).then((result) => {
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
      visible: false,
      preSexList: [0, -1, 1, 2],
      isShowCheckButton: true
    }
  }

  formVlaueChange = (changeValue, allValues) => {
    const changeKey = Object.keys(changeValue)[0]
    const { preSexList } = this.state
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
    } else if (changeKey == 'filter') {
      let newSex = cloneDeep(allValues[changeKey].sex)
      const allIndex = newSex.indexOf(-1)
      if (allIndex > -1 && preSexList.indexOf(-1) == -1) { // 选中全部
        newSex = [0, 1, 2, -1]
      } else if (allIndex == -1 && preSexList.indexOf(-1) > -1) { // 取消选中全部
        newSex = []
      } else if (newSex.indexOf(0) > -1 && newSex.indexOf(1) > -1 && newSex.indexOf(2) > -1) { // 选中除了全部之外的
        newSex = [0, 1, 2, -1]
      } else if (allIndex > -1 && preSexList.indexOf(-1) > -1) { // 取消选中除了全部之外的
        newSex = newSex.filter((v) => v != -1)
      }
      this.setState({
        preSexList: newSex
      })
      this.formRef.current.setFieldsValue({
        filter: {
          sex: newSex
        }
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
    if (formValue.filter) {
      const addTime = formValue.filter.addTime
      formValue.filter.searchBeginTime = addTime ? moment(addTime[0]).valueOf() : ''
      formValue.filter.searchEndTime = addTime ? moment(addTime[1]).valueOf() : ''
      formValue.filter.chooseLabels = formValue.filter.chooseLabels?.tagList?.map((v) => v.id)
      formValue.filter.sex = formValue.filter.sex.join(',')
      delete formValue.filter.addTime
    }
    return new Promise((resolve, reject) => {
      Api.saveOrUpdate(formValue).then(() => {
        resolve('保存成功')
        this.handleGoBack()
      }).catch(() => reject())
    })
  }

  handleGoBack = () => {
    this.props.history.replace('/customerMassSend')
  }

  renderSaveModal = () => {
    const { formValue, visible } = this.state
    const { memberIds } = formValue
    return <Modal onOk={this.handleSaveMassSend} visible={visible} onCancel={this.handleChangeVisible} title="新建群发提示">
      {memberIds.length > 2 ? `确定为「${memberIds[0].label}、${memberIds[1].label}」等人创建群发任务吗？` : `确定为「${memberIds.map((v) => v.label).join('、')}」创建群发任务吗？`}
    </Modal>
  }

  handleCheckCount = (memberIds, filter = {}) => {
    const { sex, addTime, chooseLabels } = filter
    this.setState({
      checkLoading: true
    })
    Api.checkCount({
      memberIds: memberIds.map((v) => v.value),
      chooseLabels: chooseLabels?.tagList.map((v) => v.id),
      sex: sex && sex.join(','),
      searchBeginTime: addTime ? moment(addTime[0]).valueOf() : '',
      searchEndTime: addTime ? moment(addTime[1]).valueOf() : '',
    }).then((res) => {
      this.setState({
        isShowCheckButton: false,
        sendCount: res.data
      })
    }).finally(() => {
      this.setState({
        checkLoading: false,
      })
    })
  }

  renderFilterTypeExtra = (values) => {
    const { filterType, memberIds, filter } = values
    const { checkLoading, isShowCheckButton, sendCount = 0 } = this.state
    return <div className="mass-sned-extra" style={{ lineHeight: '32px' }}>
      将发送消息给「{filterType == 0 ? '全部客户」' : memberIds.length > 3 ? `${cloneDeep(memberIds).splice(0, 3).map((v) => v.label).join('、')}」等人` : `${memberIds.map((v) => v.label).join('、')}」`}的&nbsp;<Button loading={checkLoading} disabled={!memberIds.length} onClick={() => this.handleCheckCount(memberIds, filter)} style={{ padding: 0 }} type="link"><span style={{ textDecoration: 'underline' }}>{isShowCheckButton ? '点击查看' : <span>{sendCount}<RsIcon type="icon-genghuan" />&nbsp;</span>}</span></Button>客户
    </div>
  }

  onCloseCustomTags = (id, tagList) => {
    const newList = tagList.filter((listItem) => id !== listItem.id)
    this.formRef.current.setFieldsValue({
      filter: {
        chooseLabels: { tagList: newList }
      }
    })
  }

  render() {
    const { medias, visible, modalType } = this.state
    return <div>
      <div className="page-title">新建群发任务</div>
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
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <div style={{ width: '700px' }}>
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
              name="memberIds"
              label="选择群发账号"
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
              rules={[{
                required: false,
                message: '请选择群发客户范围'
              }]}
              shouldUpdate
              label="群发客户范围"
              style={{ alignItems: 'baseline' }}
            >
              <Form.Item initialValue={0} name="filterType">
                <Radio.Group>
                  <Radio value={0}>全部客户</Radio>
                  <Radio value={1}>筛选客户</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.filterType !== curValues.filterType} style={{ marginBottom: 0 }}>
                {({ getFieldValue }) => {
                  const nextFilterType = getFieldValue('filterType')
                  return nextFilterType == 1 && <div className="filter-customer-box">
                    <Form.Item preserve={false} initialValue={[-1, 0, 1, 2]} label="客户性别" style={{ alignItems: 'center' }} name={['filter', 'sex']}>
                      <Checkbox.Group options={sexOptions} />
                    </Form.Item>
                    <Form.Item preserve={false} label="添加日期" name={['filter', 'addTime']}>
                      <RangePicker placeholder={['开始日期', '结束日期']} suffixIcon={<RsIcon type="icon-riqi" />} />
                    </Form.Item>
                    <Form.Item preserve={false} label="客户标签">
                      <Form.Item preserve={false} initialValue={{ tagList: [] }} style={{ alignItems: 'center', marginBottom: 0 }} name={['filter', 'chooseLabels']}>
                        <CustomTagIndex>
                          <div className="add-form-btn">
                            <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
                            <div style={{ height: '17px', lineHeight: '17px' }}>添加标签</div>
                          </div>
                        </CustomTagIndex>
                      </Form.Item>
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) => JSON.stringify(prevValues.filter.chooseLabels) !== JSON.stringify(curValues.filter.chooseLabels)}
                        style={{ marginBottom: 0 }}
                      >
                        {() => {
                          const nextChooseLabels = getFieldValue(['filter', 'chooseLabels'])
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

                  </div>
                }}
              </Form.Item>
              <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.filterType !== curValues.filterType || JSON.stringify(prevValues.memberIds) !== JSON.stringify(curValues.memberIds) || JSON.stringify(prevValues.filter) !== JSON.stringify(curValues.filter)} style={{ marginBottom: 0 }}>
                {({ getFieldsValue }) => {
                  const values = getFieldsValue(['memberIds', 'filterType', 'filter'])
                  return <Form.Item style={{ marginBottom: '8px' }}>
                    {this.renderFilterTypeExtra(values)}
                  </Form.Item>
                }}
              </Form.Item>
            </Form.Item>
            <div className="page-label">编辑群发消息</div>
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
