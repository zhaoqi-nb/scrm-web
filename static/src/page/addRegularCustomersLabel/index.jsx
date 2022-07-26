/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Form, Input, Select, Affix, Button, Radio, DatePicker, Switch, Row, Col, Divider, Checkbox, message } from 'antd'
import TRCheckboxModal from '@Public/TRCheckboxModal'
import { cloneDeep } from 'lodash'
import { userTreeFormat } from '@util'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Modal from '@Modal'
import CustomTagIndex from '../comments/publicView/customTagNew'
import GroupSelect from '../comments/groupSelect'

import Api from './api'

import './index.less'

const { RangePicker } = DatePicker
const sexOptions = [
  { label: '全部', value: -1 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '未知', value: 0 }]

const labelOptions = [
  { label: '包含以下所有标签', value: -1 },
  { label: '包含以下任意标签', value: 1 }]

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
    formValue.memberIds = formValue.memberIds?.map((v) => v.value)
    if (formValue.filterType) {
      const addTime = formValue.filter.addTime
      formValue.filter.searchBeginTime = addTime ? moment(addTime[0]).valueOf() : ''
      formValue.filter.searchEndTime = addTime ? moment(addTime[1]).valueOf() : ''
      delete formValue.filter.addTime
      const chooseLabels = formValue.filter.chooseLabels?.tagList?.map((v) => v.id)
      if (formValue.filter.notIncluded) { // 选中不包含
        formValue.filter.unChooseLabels = formValue.filter.unChooseLabels?.tagList?.map((v) => v.id)
      } else delete formValue.filter.unChooseLabels
      if (formValue.filter.labelType == 1) { // 包含任意标签
        formValue.filter.containLabels = chooseLabels
        delete formValue.filter.chooseLabels
      } else {
        formValue.filter.chooseLabels = chooseLabels
      }
    }
    formValue.groupCode = formValue.groupCode.id
    formValue.groupFilterType = formValue.groupFilterType ? 1 : 0
    formValue.medias = [{
      type: 1,
      content: formValue.message
    }]
    this.setState({
      saveLoading: true
    })
    Api.saveOrUpdate(formValue).then(() => {
      message.success('保存成功')
      this.handleGoBack()
    }).finally(() => {
      this.setState({
        saveLoading: false
      })
    })
    // return new Promise((resolve, reject) => {
    //   Api.saveOrUpdate(formValue).then(() => {
    //     resolve('保存成功')
    //   }).catch(() => reject())
    // })
  }

  handleGoBack = () => {
    this.props.history.replace('/regularCustomersLabel')
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
      filter: {
        chooseLabels: { tagList: newList }
      }
    })
  }

  onCloseNoCustomTags = (id, tagList) => {
    const newList = tagList.filter((listItem) => id !== listItem.id)
    this.formRef.current.setFieldsValue({
      filter: {
        unChooseLabels: { tagList: newList }
      }
    })
  }

  handleCheckCount = (values) => {
    const { filter, filterType, memberFilterType, memberIds } = values

    this.setState({
      checkLoading: true
    })
    const params = {
      memberFilterType,
      filterType
    }
    if (memberFilterType) { // 筛选客户
      params.memberIds = memberIds.map((v) => v.value)
    }
    if (filterType) {
      const { sex, addTime, notIncluded, unChooseLabels, labelType } = filter
      const chooseLabels = filter.chooseLabels?.tagList?.map((v) => v.id)
      params.searchBeginTime = addTime ? moment(addTime[0]).valueOf() : ''
      params.searchEndTime = addTime ? moment(addTime[1]).valueOf() : ''
      params.sex = sex
      if (labelType == 1) { // 包含任意标签
        params.containLabels = chooseLabels
      } else {
        params.chooseLabels = chooseLabels
      }
      if (notIncluded) { // 选中不包含
        params.unChooseLabels = unChooseLabels?.tagList?.map((v) => v.id)
      }
    }
    Api.checkCount(params).then((res) => {
      this.setState({
        sendCount: res.data
      })
    }).finally(() => {
      this.setState({
        checkLoading: false,
      })
    })
  }

  render() {
    const { visible, modalType, checkLoading, sendCount, saveLoading } = this.state
    return <div className="add-regular-label">
      <div className="page-title">创建任务</div>
      <div style={{ margin: '0 0 16px 0' }} className="content-tips">
        <RsIcon className="content-tips-icon" type="icon-tishixinxitubiao" />
        <div className="content-tips-text">每个客户每天仅能够接收来自同一企业的1次群发消息，如客户已经收到其他企业群发消息，则该任务的邀请加群消息将不会发送给客户</div>
      </div>
      <div className="page-label">基础信息</div>
      <Form
        colon={false}
        labelAlign="right"
        ref={this.formRef}
        className="regular-form-label-fix"
        // labelCol={{ span: 3 }}
        wrapperCol={{ span: 16 }}
        style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', marginBottom: '60px' }}
        onFinish={this.handleSave}
      >
        <Form.Item
          hidden
          initialValue={3} // 老客标签建群
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
        <Form.Item shouldUpdate label="执行成员" style={{ alignItems: 'baseline' }}>
          <Form.Item style={{ marginBottom: '8px' }} initialValue={0} name="memberFilterType">
            <Radio.Group>
              <Radio value={0}>全部成员</Radio>
              <Radio value={1}>指定成员</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.memberFilterType !== curValues.memberFilterType} style={{ marginBottom: 0 }}>
            {({ getFieldValue }) => {
              const nextFilterType = getFieldValue('memberFilterType')
              return nextFilterType == 1 && <Form.Item
                rules={[{
                  required: true,
                  message: '选择执行成员'
                }]}
                name="memberIds"
                initialValue={[]}
              >
                <Select
                  placeholder="请选择成员"
                  labelInValue
                  mode="multiple"
                  open={false}
                  showArrow
                  onClick={this.renderSelectUser}
                />
              </Form.Item>
            }}
          </Form.Item>
        </Form.Item>
        <div className="page-label">客户范围</div>
        <Form.Item
          rules={[{
            required: false,
            message: '请选择群发客户范围'
          }]}
          shouldUpdate
          label="群发客户范围"
          style={{ alignItems: 'baseline' }}
        >
          <Form.Item style={{ marginBottom: 8 }} initialValue={0} name="filterType">
            <Radio.Group>
              <Radio value={0}>全部客户</Radio>
              <Radio value={1}>筛选客户</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.filterType !== curValues.filterType} style={{ marginBottom: 0 }}>
            {({ getFieldValue }) => {
              const nextFilterType = getFieldValue('filterType')
              return nextFilterType == 1 && <div className="filter-customer-box">
                <Form.Item preserve={false} initialValue={-1} label="客户性别" style={{ alignItems: 'center' }} name={['filter', 'sex']}>
                  <Radio.Group options={sexOptions} />
                </Form.Item>
                <Form.Item preserve={false} label="添加日期" name={['filter', 'addTime']}>
                  <RangePicker placeholder={['开始日期', '结束日期']} suffixIcon={<RsIcon type="icon-riqi" />} />
                </Form.Item>
                <Form.Item style={{ alignItems: 'baseline' }} label="客户标签">
                  <Form.Item preserve={false} initialValue={-1} name={['filter', 'labelType']}>
                    <Radio.Group options={labelOptions} />
                  </Form.Item>
                  <div style={{ background: '#fff', borderRadius: '4px', border: '1px solid #e1e8f0' }}>
                    <Form.Item preserve={false} initialValue={{ tagList: [] }} label="" style={{ alignItems: 'center', marginBottom: 0 }} name={['filter', 'chooseLabels']}>
                      <CustomTagIndex>
                        <div className="add-label-btn">
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
                          <div style={{ background: '#fff', borderTop: '1px solid #e1e8f0', marginTop: 0, borderRadius: 0 }} className="select-content">
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
                  </div>
                  <Form.Item valuePropName="checked" style={{ margin: '20px 0' }} initialValue={false} preserve={false} name={['filter', 'notIncluded']}>
                    {/* <Checkbox.Group> */}
                    <Checkbox value={1}>且不包含以下标签</Checkbox>
                    {/* </Checkbox.Group> */}
                  </Form.Item>
                  <div style={{ background: '#fff', borderRadius: '4px', border: '1px solid #e1e8f0' }}>
                    <Form.Item preserve={false} initialValue={{ tagList: [] }} label="" style={{ alignItems: 'center', marginBottom: 0 }} name={['filter', 'unChooseLabels']}>
                      <CustomTagIndex>
                        <div className="add-label-btn">
                          <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
                          <div style={{ height: '17px', lineHeight: '17px' }}>添加标签</div>
                        </div>
                      </CustomTagIndex>
                    </Form.Item>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) => JSON.stringify(prevValues.filter.unChooseLabels) !== JSON.stringify(curValues.filter.unChooseLabels)}
                      style={{ marginBottom: 0 }}
                    >
                      {() => {
                        const nextChooseLabels = getFieldValue(['filter', 'unChooseLabels'])
                        const tagList = nextChooseLabels.tagList
                        return tagList && tagList.length > 0 && <Form.Item>
                          <div style={{ background: '#fff', borderTop: '1px solid #e1e8f0', marginTop: 0, borderRadius: 0 }} className="select-content">
                            {tagList.map((v) => {
                              const { name, id } = v
                              return <div className="select-content-label">
                                <span>{name}</span>
                                <RsIcon
                                  onClick={() => this.onCloseNoCustomTags(id, tagList)}
                                  style={{ fontSize: '10px' }}
                                  type="icon-quxiao"
                                />
                              </div>
                            })}
                          </div>
                        </Form.Item>
                      }}
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>
            }}
          </Form.Item>
        </Form.Item>
        <div className="page-label">消息内容</div>
        <Form.Item
          name="message"
          label="加群引导语"
          className="textAreaItem"
          rules={[
            {
              required: true,
              message: '请添加加群引导语',
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
          label="选择群聊"
          name="groupCode"
        >
          <GroupSelect />
        </Form.Item>
        <Form.Item
          label="过滤客户"
          style={{ alignItems: 'baseline' }}
        >
          <Row>
            <Col>
              <Form.Item style={{ marginBottom: 0 }} valuePropName="checked" initialValue name="groupFilterType">
                <Switch />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: 8, color: '#84888C' }}>
              开启后已在群聊中的好友将不会收到邀请
            </Col>
          </Row>
        </Form.Item>
        <Divider style={{ margin: '8px 0' }} />
        <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.filterType !== curValues.filterType || JSON.stringify(prevValues.memberIds) !== JSON.stringify(curValues.memberIds) || prevValues.memberFilterType !== curValues.memberFilterType || JSON.stringify(prevValues.filter) !== JSON.stringify(curValues.filter)} style={{ marginBottom: 0 }}>
          {({ getFieldsValue }) => {
            const values = getFieldsValue(['memberIds', 'filterType', 'filter', 'memberFilterType'])
            const { memberFilterType, memberIds } = values
            return <Form.Item style={{ marginBottom: '8px' }}>
              预计邀请数<Button loading={checkLoading} disabled={memberFilterType && !(memberIds && memberIds.length)} onClick={() => this.handleCheckCount(values)} type="link">{sendCount >= 0 ? <>{sendCount}<RsIcon style={{ marginLeft: '8px' }} type="icon-genghuan" /></> : '点击计算'}</Button>当邀请的客户总数，大于设置的群聊总人数上限时，请添加更多群聊避免遇到客户收到入群邀请但无法进群的情况
            </Form.Item>
          }}
        </Form.Item>
        <div className="form-affix-button">
          <Button onClick={this.handleGoBack} style={{ marginRight: '24px' }} type="text">返回</Button>
          <Button loading={saveLoading} htmlType="submit" type="primary">提交</Button>
        </div>
      </Form>
      {visible && modalType == '新建' && this.renderSaveModal()}
    </div>
  }
}

Index.propTypes = {}

export default Index
