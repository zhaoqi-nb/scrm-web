/* eslint-disable react/jsx-indent */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Tabs, Card, Form, Input, Row, Col, Radio, Select, Descriptions, TreeSelect, DatePicker } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Modal from '@Modal'
import { cloneDeep } from 'lodash'
import { setValues } from './store/action'
import AddFollowuprecord from './addFollowuprecord'
import CityCascader from '../comments/cityCascader'
import Operationrecord from './operationrecord'
import Api from './store/api'
import { patternPhone } from '../../utils/Util'

import './index.less'

const { TabPane } = Tabs
const { Option } = Select

const formFields = [
  'createTime',
  'createId',
  'name',
  'cluesSourceType',
  'cluesChannelsType',
  'companyName',
  'birthday',
  'departName',
  'position',
  'nativePlace',
  'hobbies',
  'cityCodes',
  'contactAddressInfo',
  'remarksDescription',
  'phone',
  'wechat',
  'qq',
  'callPhone',
  'landline',
  'email',
  'countries',
  'industry'
]

const formaterTreeData = (data) => {
  if (!data || !data.length) return []
  return cloneDeep(data).map((v) => {
    const { subDepartList, departName, id, permissionsFlag } = v
    v.key = id
    v.value = id
    v.title = departName
    v.disabled = !permissionsFlag
    if (subDepartList) v.children = formaterTreeData(subDepartList)
    return v
  })
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  modalFormRef = React.createRef(Form)

  componentDidMount() {
    this.queryLakeChoose()
    this.queryAllDepartAndAllMemberAddRoleBoundary()
  }

  queryAllDepartAndAllMemberAddRoleBoundary = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      this.props.setValues({
        departAndAllMember: formaterTreeData(res.data),
      })
    })
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    const { fromType } = this.props
    return {
      isReady: false,
      rightActiveKey: fromType == 'followupClue' ? '1' : '2',
    }
  }

  handleChangeEdit = () => {
    this.setState(
      (state) => ({
        isEdit: !state.isEdit,
      }),
      () => {
        if (!this.state.isEdit) {
          // 取消编辑表单恢复默认值
          this.formRef.current.resetFields(formFields)
        }
      }
    )
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  handleChangeRightKey = (rightActiveKey) => {
    this.setState({
      rightActiveKey,
    })
  }

  queryLakeChoose = () => {
    Api.queryLakeChoose().then((res) => {
      this.props.setValues({
        clueList: res.data.map((v) => ({
          ...v,
          name: v.publicLakeName,
        })),
      })
    })
  }

  updateCluesCustomerInfo = () => {
    this.formRef.current.validateFields().then((values) => {
      const { cityCodes } = values
      if (cityCodes) {
        const cityCodesArr = cityCodes.split('-')
        values.contactProvinces = cityCodesArr[0]
        values.contactCity = cityCodesArr[1]
        values.contactCounty = cityCodesArr[2]
      }
      Api.updateCluesCustomerInfo(values).then((res) => {
        this.handleChangeEdit()
        this.props.setValues({
          clueInfo: res.data.item,
        })
        setTimeout(() => this.formRef.current.resetFields(formFields))
      })
    })
  }

  handleChangeStatus = () => {
    const { clueInfo } = this.props
    this.setState((state) => ({
      isEditStatus: !state.isEditStatus,
      stateFollowStatus: clueInfo.followStatus,
    }))
  }

  manualUpdateCluesProcessed = (id) => {
    const { stateFollowStatus } = this.state
    const { clueInfo } = this.props
    if (!stateFollowStatus || clueInfo.followStatus == stateFollowStatus) {
      this.handleChangeStatus()
      return
    }
    Api.manualUpdateCluesProcessed(id).then(() => {
      this.handleChangeStatus()
      this.props.setValues({
        clueInfo: {
          ...clueInfo,
          followStatus: stateFollowStatus,
        },
      })
    })
  }

  handleChangeFollowStatus = (value) => {
    this.setState({
      stateFollowStatus: value,
    })
  }

  // 删除线索
  handleBatchDeleteClues = () => {
    const { clueInfo, onRefresh, onCancelDrawer } = this.props
    return new Promise((resolve, reject) => {
      Api.batchDeleteClues(clueInfo.id)
        .then(() => {
          resolve()
          onCancelDrawer()
          onRefresh()
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => (
    <Modal
      visible
      onOk={this.handleBatchDeleteClues}
      title="线索删除"
      type="delete"
      onCancel={this.handleChangeVisible}
    >
      是否删除销售线索？删除成功之后，该操作将无法恢复。
    </Modal>
  )

  // 放弃线索
  handleAbandonClues = () => {
    const { onRefresh, onCancelDrawer } = this.props
    return this.modalFormRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.batchAbandonClues(values)
            .then(() => {
              resolve()
              onCancelDrawer()
              onRefresh()
            })
            .catch(() => reject())
        })
    )
  }

  renderAbandonModal = () => {
    const { clueInfo } = this.props
    return (
      <Modal visible onOk={this.handleAbandonClues} title="放弃线索到公海" onCancel={this.handleChangeVisible}>
        <Form preserve={false} ref={this.modalFormRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item rules={[{ max: 500, message: '放弃原因最多500字' }]} name="remark" label="放弃原因">
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 8 }}
              placeholder="请输入放弃原因，长度不要超过500字"
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item initialValue={clueInfo.id} hidden name="cluesIds" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleChangeVisible = (modalType) => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
      modalType,
    }))
  }

  handleConvertToCustomer = () => {
    const { onRefresh, onCancelDrawer } = this.props
    return this.modalFormRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.cluesToCustomer(values)
            .then(() => {
              resolve()
              onCancelDrawer()
              onRefresh()
            })
            .catch(() => reject())
        })
    )
  }

  renderConvertModal = () => {
    const { clueInfo } = this.props
    const { countries, industry, remarksDescription, id, contactAddressInfo, companyName } = clueInfo
    return <Modal onOk={this.handleConvertToCustomer} visible title="转为客户" onCancel={this.handleChangeVisible}>
      <Form
        initialValues={{
          countries: String(countries),
          industry,
          desc: remarksDescription,
          guestName: companyName,
          cluesId: id,
          address: contactAddressInfo
        }}
        preserve={false}
        ref={this.modalFormRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item hidden name="cluesId" label="客户id">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: '请输入客户名称' }]} name="guestName" label="客户名称">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item style={{ alignItems: 'center' }} label="客户类型" name="guestType" initialValue="1">
          <Radio.Group>
            <Radio value="1">意向用户</Radio>
            <Radio value="2">付费客户</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{ alignItems: 'center' }} label="所属地域" name="countries" initialValue="1">
          <Radio.Group>
            <Radio value="1">国内</Radio>
            <Radio value="2">海外</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          style={{ alignItems: 'flex-start' }}
          label="所属国家/城市"
          name="location"
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item style={{ alignItems: 'center' }} label="客户分类" name="guestCategory" initialValue="1">
          <Radio.Group>
            <Radio value="1">一级市场</Radio>
            <Radio value="2">二级市场</Radio>
            <Radio value="3">消费客户</Radio>
            <Radio value="4">综合类</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{ alignItems: 'center' }} label="客户规模" name="guestScale" initialValue="1">
          <Radio.Group>
            <Radio value="1">公募基金</Radio>
            <Radio value="2">私募基金</Radio>
            <Radio value="3">不区分</Radio>
          </Radio.Group>
        </Form.Item>
        <Row>
          <Col span={5} />
          <Col span={19}>
            <Form.Item label="" name="guestScaleSize" initialValue="1">
              <Select>
                <Option value="1">10亿以下</Option>
                <Option value="2">10亿-50亿</Option>
                <Option value="3">50-100亿</Option>
                <Option value="4">100亿+</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="industry" label="行业领域">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="address" label="地址">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="desc"
          label="备注描述"
        >
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  }

  renderExtractModal = () => {
    const { modalVisible } = this.state
    return (
      <Modal visible={modalVisible} onOk={this.handleExtractClues} title="线索提取" onCancel={this.handleChangeVisible}>
        确认要提取线索吗？提取成功之后，请在我跟进中的线索中进行管理
      </Modal>
    )
  }

  // 提取线索
  handleExtractClues = () => {
    const { onCancelDrawer, onRefresh, clueInfo } = this.props
    const { id } = clueInfo
    return new Promise((resolve, reject) => {
      Api.extractClues({
        ids: id,
      })
        .then(() => {
          resolve()
          onCancelDrawer()
          onRefresh()
        })
        .catch(() => reject())
    })
  }

  renderReplaceModal = () => {
    const { modalVisible } = this.state
    const { clueList } = this.props
    const { id } = this.props.clueInfo
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleReplaceCluesLake}
        title="线索更换公海"
        onCancel={this.handleChangeVisible}
      >
        是否将线索转移到其他公海？转移成功之后，该操作将无法恢复。
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.modalFormRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item rules={[{ required: true, message: '请选择公海池' }]} name="publicLakeId" label="选择公海池">
            <Select showSearch optionFilterProp="title">
              {clueList.map((v) => (
                <Option key={v.id} value={v.id} title={v.publicLakeName}>
                  {v.publicLakeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item initialValue={id} style={{ display: 'none' }} name="ids" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleReplaceCluesLake = () =>
    this.modalFormRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          const { onCancelDrawer, onRefresh } = this.props
          Api.replaceCluesLake(values)
            .then(() => {
              resolve()
              onCancelDrawer()
              onRefresh()
            })
            .catch(() => reject())
        })
    )

  // 分配线索
  renderAssignModal = () => {
    const { modalVisible, memberInfoListByDepart = [] } = this.state
    const { departAndAllMember, clueInfo } = this.props
    const { id } = clueInfo
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleAssignCluesLake}
        title="线索分配"
        onCancel={this.handleChangeVisible}
      >
        是否将线索转移给其他负责人？转移成功之后，该操作将无法恢复。
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.modalFormRef}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            rules={[{ required: true, message: '请选择负责人所属部门' }]}
            name="departId"
            label="负责人所属部门"
          >
            <TreeSelect
              onSelect={this.handleTreeSelect}
              showArrow
              placeholder="请选择部门"
              treeData={departAndAllMember}
              showSearch
              treeNodeFilterProp="title"
            />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请选择新负责人' }]} name="memberId" label="新负责人">
            <Select showSearch optionFilterProp="title">
              {memberInfoListByDepart.map((v) => (
                <Option key={v.id} value={v.id} title={v.name}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item initialValue={id} style={{ display: 'none' }} name="ids" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  // 分配线索
  handleAssignCluesLake = () =>
    this.modalFormRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          const { onCancelDrawer, onRefresh } = this.props
          Api.assignClues(values)
            .then(() => {
              resolve()
              onCancelDrawer()
              onRefresh()
            })
            .catch(() => reject())
        })
    )

  handleTreeSelect = (value, node) => {
    this.setState({
      memberInfoListByDepart: node.memberInfoList,
    })
    this.formRef.current.setFieldsValue({
      memberId: '',
    })
  }

  handleExceedingRequest = () => this.modalFormRef.current.validateFields().then((values) => {
    Api.exceedingRequest({
      ...values,
      exceedingTime: moment(values.exceedingTime).valueOf()
    })
  })

  renderExtensionModal = () => {
    const { modalVisible } = this.state
    const { id } = this.props.clueInfo
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleExceedingRequest}
        title="延期申请"
        onCancel={this.handleChangeVisible}
      >
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.modalFormRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item rules={[{ required: true, message: '请选择延期时间' }]} name="exceedingTime" label="延期时间">
            <DatePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入延期理由' }]} name="reason" label="申请理由">
            <Input.TextArea />
          </Form.Item>
          <Form.Item initialValue={id} style={{ display: 'none' }} name="cluesId" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { clueInfo, onCancelDrawer, cluesSourceTypeList, cluesChannelsTypeInfo, followStatusList, onRefresh, fromType } =
      this.props
    const { isEdit, rightActiveKey, isEditStatus, modalVisible, modalType } = this.state
    const {
      expectedRecoveryTime,
      callPhone,
      wechat,
      qq,
      birthday,
      cluesChannelsType,
      cluesSourceType,
      // cluesStatus,
      companyName,
      contactAddressInfo,
      remarksDescription,
      createTime,
      gender,
      name,
      position,
      hobbies,
      createId,
      landline,
      email,
      nativePlace,
      phone,
      contactProvinces,
      contactCounty,
      contactCity,
      departName,
      createUserName,
      // customerAge,
      mainDepartName,
      mainMemberName,
      mainMemberPhone,
      id,
      contactProvincesName,
      contactCityName,
      contactCountyName,
      followStatus,
      countries,
      industry
    } = clueInfo || {}
    return (
      <>
        <Drawer
          closable={false}
          title={<div>线索详情&nbsp;&nbsp;&nbsp;{expectedRecoveryTime && <span className="huishou-box">预计回收时间：{moment(expectedRecoveryTime).format('YYYY-MM-DD HH:mm:ss')}</span>}</div>}
          visible
          width={912}
          destroyOnClose
          onClose={() => {
            onCancelDrawer()
            onRefresh()
          }}
          className="clue-info-drawer"
          extra={
            <RsIcon
              onClick={() => {
                onCancelDrawer()
                onRefresh()
              }}
              style={{ fontSize: '16px', cursor: 'pointer' }}
              type="icon-guanbi"
            />
          }
        >
          <div className="clue-info-drawer-header">
            <Row>
              <Col
                span={24}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* <div className="avatar">
                    <RsIcon type="icon-morentouxiang" />
                  </div> */}
                  <div>
                    {companyName}
                    {/* {customerAge} */}
                  </div>
                </div>
                {fromType == 'followupClue' ? <div className="select-row-div" style={{ marginBottom: 0 }}>
                  <span
                    onClick={() => this.handleChangeVisible('延期申请')}
                    style={{ padding: '0 12px' }}
                    className="select-col-div"
                  >
                    延期申请
                  </span>
                  <span
                    onClick={() => this.handleChangeVisible('转为客户')}
                    style={{ padding: '0 12px' }}
                    className="select-col-div"
                  >
                    转为客户
                  </span>
                  <span
                    onClick={() => this.handleChangeVisible('放弃')}
                    style={{ padding: '0 12px' }}
                    className="select-col-div"
                  >
                    放弃
                  </span>
                  <span
                    onClick={() => this.handleChangeVisible('删除')}
                    style={{ padding: '0 12px' }}
                    className="select-col-div"
                  >
                    删除
                  </span>
                </div> :
                  <div className="select-row-div" style={{ marginBottom: 0 }}>
                    <span
                      onClick={() => this.handleChangeVisible('更换公海池')}
                      className="select-col-div"
                    >
                      <RsIcon type="icon-genghuan" />更换公海池</span>
                    <span onClick={() => this.handleChangeVisible('提取')} className="select-col-div">
                      <RsIcon type="icon-tiqu" />提取</span>
                    <span onClick={() => this.handleChangeVisible('分配')} className="select-col-div">
                      <RsIcon type="icon-fenpei" />分配</span>
                  </div>}
              </Col>
              <Descriptions>
                <Descriptions.Item label="负责人/部门">
                  {mainMemberName}/{mainDepartName}
                </Descriptions.Item>
                <Descriptions.Item label="手机">{mainMemberPhone}</Descriptions.Item>
                <Descriptions.Item style={{ alignItems: 'center' }} label="跟进状态">
                  {!isEditStatus && followStatusList[followStatus]}
                  {isEditStatus && (
                    <>
                      <Select onChange={this.handleChangeFollowStatus} defaultValue="1">
                        <Option value="1">未处理</Option>
                        <Option value="2">已联系</Option>
                      </Select>
                      <RsIcon
                        onClick={this.handleChangeStatus}
                        style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                        type="icon-quxiao"
                      />
                      <RsIcon
                        onClick={() => this.manualUpdateCluesProcessed(id)}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                        type="icon-duihao"
                      />
                    </>
                  )}
                  {followStatus == 1 && !isEditStatus && fromType == 'followupClue' && (
                    <RsIcon style={{ marginLeft: '8px' }} onClick={this.handleChangeStatus} type="icon-bianji" />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Row>
          </div>
          <div style={{ display: 'flex', marginTop: '8px', flex: 1, overflow: 'hidden' }}>
            <Form
              className={isEdit ? 'edit-form' : ''}
              labelAlign="left"
              preserve={false}
              ref={this.formRef}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 17 }}
              initialValues={{
                createTime,
                createId,
                name,
                gender: String(gender),
                cluesSourceType: String(cluesSourceType),
                cluesChannelsType: String(cluesChannelsType),
                companyName,
                birthday,
                departName,
                position,
                nativePlace,
                hobbies,
                cityCodes: `${contactProvinces || ''}-${contactCity || ''}-${contactCounty || ''}`,
                contactAddressInfo,
                remarksDescription,
                phone,
                wechat,
                qq,
                callPhone,
                landline,
                email,
                id,
                countries: String(countries),
                industry
              }}
            >
              <Tabs style={{ width: '600px' }} type="card">
                <TabPane tab="公司资料" key="1" style={{ overflow: 'auto' }}>
                  <Card
                    title="基本信息"
                    extra={
                      !isEdit ? (
                        <RsIcon onClick={this.handleChangeEdit} type="icon-bianji" />
                      ) : (
                          <div className="card-extra-action">
                            <span onClick={this.updateCluesCustomerInfo}>
                              <RsIcon type="icon-baocun" /> 保存
                          </span>
                            <span onClick={this.handleChangeEdit} style={{ marginLeft: '16px' }}>
                              <RsIcon type="icon-quxiao" /> 取消
                          </span>
                          </div>
                        )
                    }
                  >
                    <Row>
                      <Form.Item hidden name="id" label="id">
                        {id}
                      </Form.Item>
                      <Col span={12}>
                        <Form.Item name="createTime" label="创建时间">
                          {createTime && moment(createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="createId" label="创建人">
                          {createUserName}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          rules={[{ max: 50, message: '公司名称长度不能超过50个文字。' }]}
                          name="companyName"
                          label="公司名称"
                        >
                          {isEdit ? <Input /> : companyName}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="来源" name="cluesSourceType">
                          {isEdit ? (
                            <Select placeholder="请选择">{this.renderFormOption(cluesSourceTypeList)}</Select>
                          ) : (
                              cluesSourceTypeList[cluesSourceType]
                            )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="countries" label="国家">
                          {isEdit ? (
                            <Radio.Group>
                              <Radio value="1">国内</Radio>
                              <Radio value="2">海外</Radio>
                            </Radio.Group>
                          ) : countries == 1 ? (
                            '国内'
                          ) : (
                                '海外'
                              )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="来源渠道" name="cluesChannelsType">
                          {isEdit ? (
                            <Select placeholder="请选择">{this.renderFormOption(cluesChannelsTypeInfo)}</Select>
                          ) : (
                              cluesChannelsTypeInfo[cluesChannelsType]
                            )}
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                        <Form.Item name="birthday" label="生日">
                          {isEdit ? <Input /> : birthday}
                        </Form.Item>
                      </Col> */}
                      <Col span={12}>
                        <Form.Item name="industry" label="所属行业">
                          {isEdit ? (
                            <Radio.Group>
                              <Radio value="金融">金融</Radio>
                              <Radio value="消费">消费</Radio>
                              <Radio value="医药">医药</Radio>
                              <Radio value="其他">其他</Radio>
                            </Radio.Group>
                          ) : industry}
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                        <Form.Item name="departName" label="部门">
                          {isEdit ? <Input /> : departName}
                        </Form.Item>
                      </Col> */}
                      <Col span={12}>
                        <Form.Item name="position" label="职位">
                          {isEdit ? <Input /> : position}
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                        <Form.Item name="nativePlace" label="籍贯">
                          {isEdit ? <Input /> : nativePlace}
                        </Form.Item>
                      </Col> */}
                      {/* <Col span={12}>
                        <Form.Item name="hobbies" label="兴趣爱好">
                          {isEdit ? <Input /> : hobbies}
                        </Form.Item>
                      </Col> */}
                      <Col span={24}>
                        {isEdit ? (
                          <Form.Item
                            style={{ alignItems: 'flex-start', marginBottom: 0 }}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 21 }}
                            label="联系地址"
                            shouldUpdate={(prevValues, curValues) => prevValues.countries !== curValues.countries}
                          >
                            {({ getFieldValue }) => {
                              const nextCountries = getFieldValue('countries')
                              return <Row gutter={24}>
                                {nextCountries == 1 && <Col span={14}>
                                  <Form.Item name="cityCodes">
                                    <CityCascader cityLevel={3} />
                                  </Form.Item>
                                </Col>}
                                <Col span={nextCountries == 1 ? 8 : 24}>
                                  <Form.Item name="contactAddressInfo">
                                    <Input />
                                  </Form.Item>
                                </Col>
                              </Row>
                            }}
                          </Form.Item>
                        ) : (
                            <Form.Item
                              labelCol={{ span: 3 }}
                              wrapperCol={{ span: 21 }}
                              name="contactAddressInfo"
                              label="联系地址"
                            >
                              {countries == 1 ? `${contactProvincesName || ''}-${contactCityName || ''}-${contactCountyName || ''}-${contactAddressInfo || ''}` : contactAddressInfo}
                            </Form.Item>
                          )}
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          name="remarksDescription"
                          label="备注描述"
                          style={{ alignItems: isEdit ? 'flex-start' : '' }}
                        >
                          {isEdit ? <Input.TextArea showCount maxLength={500} /> : remarksDescription}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Card title="联系信息">
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          rules={[
                            { max: 50, message: '姓名长度不能超过50个文字。' },
                            { required: isEdit, message: '姓名不能为空' },
                          ]}
                          name="name"
                          label="姓名"
                        >
                          {isEdit ? <Input /> : name}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="phone"
                          rules={[
                            {
                              validator: (_, value) => value ?
                                (patternPhone(value)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error('请输入正确的手机号'))) : Promise.resolve(),
                            },
                          ]}
                          label="手机号码"
                        >
                          {isEdit ? <Input /> : phone}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="wechat" label="微信">
                          {isEdit ? <Input /> : wechat}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="gender" label="性别">
                          {isEdit ? (
                            <Radio.Group>
                              <Radio value="1">先生</Radio>
                              <Radio value="2">女士</Radio>
                            </Radio.Group>
                          ) : gender == 1 ? '先生' : gender == 2 ? '女士' : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="position" label="职位">
                          {isEdit ? <Input /> : position}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="qq" label="QQ">
                          {isEdit ? <Input /> : qq}
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                        <Form.Item name="callPhone" label="来电电话">
                          {isEdit ? <Input /> : callPhone}
                        </Form.Item>
                      </Col> */}
                      <Col span={12}>
                        <Form.Item
                          rules={[
                            {
                              max: 25,
                              message: '电话号码长度不允许超过25位。',
                            },
                          ]}
                          name="landline"
                          label="电话"
                        >
                          {isEdit ? <Input /> : landline}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              type: 'email',
                              message: '请输入正确的邮箱',
                            },
                          ]}
                          label="邮箱"
                        >
                          {isEdit ? <Input /> : email}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
              </Tabs>
            </Form>
            <div>
              <Tabs
                onChange={this.handleChangeRightKey}
                style={{ width: '312px' }}
                activeKey={rightActiveKey}
                type="card"
              >
                {fromType == 'followupClue' && <TabPane tab="跟进记录" key="1">
                  {rightActiveKey == 1 && <AddFollowuprecord cluesId={id} />}
                </TabPane>}
                <TabPane tab="操作记录" key="2">
                  {rightActiveKey == 2 && <Operationrecord cluesId={id} />}
                </TabPane>
                {/* <TabPane tab="线索动态" key="3"> 先不做
              <Card title="线索动态">线索动态</Card>
            </TabPane> */}
              </Tabs>
            </div>
          </div>
        </Drawer>
        {modalVisible && modalType == '放弃' && this.renderAbandonModal()}
        {modalVisible && modalType == '删除' && this.renderDeleteModal()}
        {modalVisible && modalType == '转为客户' && this.renderConvertModal()}
        {modalVisible && modalType == '提取' && this.renderExtractModal()}
        {modalVisible && modalType == '更换公海池' && this.renderReplaceModal()}
        {modalVisible && modalType == '分配' && this.renderAssignModal()}
        {modalVisible && modalType == '延期申请' && this.renderExtensionModal()}
      </>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    clueInfo: state.followupClue.clueInfo,
    cluesSourceTypeList: state.commonLayout.cluesSourceTypeList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    followStatusList: state.commonLayout.followStatusList,
    clueList: state.followupClue.clueList,
    departAndAllMember: state.followupClue.departAndAllMember,
  }),
  { setValues }
)(Index)
