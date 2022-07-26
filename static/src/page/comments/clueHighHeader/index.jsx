import React, { Component } from 'react'
import { Button, Select, Form, Radio, Input, Row, Col } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import { setValues } from '../../store/action'
import CityCascader from '../cityCascader'
import { patternPhone } from '../../../utils/Util'
import ReactEvents from '../../../utils/events'
import Api from './api'

import './index.less'

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    this.getMemberList()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      type: 'blur',
      allUserList: []
    }
  }

  getMemberList = () => {
    Api.getMemberList().then((res) => {
      this.setState({
        allUserList: res.data?.list || []
      })
    })
  }

  handleBlur = () => {
    this.setState({
      type: 'blur',
    })
  }

  renderOption = () => {
    const { dataList } = this.props
    if (!dataList || !dataList.length) return null
    return dataList.map((v) => <Option value={v.id}>{v.name}</Option>)
  }

  handleClick = () => {
    this.setState((state) => ({
      type: state.type == 'blur' ? 'focus' : 'blur',
    }))
  }

  handleSelectChange = (value) => {
    const { code } = this.props
    this.props.setValues({
      [code]: value,
    })
  }

  handleCreateClues = () => {
    this.setState({
      visible: true,
      modalType: '新增',
    })
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  handleSaveClues = () => this.formRef.current.validateFields().then((values) => {
    const { code } = this.props
    const { cityCodes } = values
    if (cityCodes) {
      const cityCodesArr = cityCodes.split('-')
      values.contactProvinces = cityCodesArr[0]
      values.contactCity = cityCodesArr[1]
      values.contactCounty = cityCodesArr[2]
    }
    let apiKey = 'addDataFormCluesList'
    if (code == 'headerClueId') apiKey = 'addDataFormPublicLake'
    return new Promise((resolve, reject) => {
      Api[apiKey](values)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

  handleCancelVisible = () => {
    this.setState({
      visible: false,
      modalType: '',
      isExpand: false
    }, () => {
      if (ReactEvents._events.fetchList) {
        ReactEvents.emit('fetchList')
      }
    })
  }

  renderCreateModal = () => {
    const { visible, isExpand, allUserList } = this.state
    const { cluesSourceTypeList, cluesChannelsTypeInfo } = this.props
    return (
      <Modal
        onCancel={this.handleCancelVisible}
        onOk={this.handleSaveClues}
        okText="保存"
        title="新增线索"
        visible={visible}
        width={600}
      >
        <Form colon={false} preserve={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelAlign="right" ref={this.formRef}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: '姓名不能为空' },
              { max: 50, message: '姓名长度不能超过50个文字。' },
            ]}
            label="姓名"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item style={{ alignItems: 'center' }} label="性别" name="gender" initialValue="1">
            <Radio.Group>
              <Radio value="1">先生</Radio>
              <Radio value="2">女士</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            rules={[{
              required: true,
              message: '请选择线索来源'
            }]}
            label="来源"
            name="cluesSourceType"
          >
            <Select placeholder="请选择">{this.renderFormOption(cluesSourceTypeList)}</Select>
          </Form.Item>
          <Form.Item
            noStyle
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: 0 }}
            shouldUpdate={(prevValues, curValues) => prevValues.cluesSourceType !== curValues.cluesSourceType}
          >
            {({ getFieldValue }) => {
              const nextCluesSourceType = getFieldValue('cluesSourceType')
              return nextCluesSourceType == 4 && <Form.Item
                label="介绍人"
                rules={[
                  { required: true, message: '请选择介绍人' },
                ]}
                name="introducer"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Select placeholder="请选择" showSearch allowClear showArrow filterOption>
                  {allUserList.map((v) => <Option value={v.name} key={v.name}>{v.name}</Option>)}
                </Select>
              </Form.Item>
            }}
          </Form.Item>
          <Form.Item
            rules={[{
              required: true,
              message: '请选择线索来源渠道'
            }]}
            hidden
            label="来源渠道"
            name="cluesChannelsType"
            initialValue="5"
          >
            <Select placeholder="请选择">{this.renderFormOption(cluesChannelsTypeInfo)}</Select>
          </Form.Item>
          <Form.Item
            name="companyName"
            rules={[
              { required: true, message: '公司不能为空' },
              { max: 50, message: '公司名称长度不能超过50个文字。' },
            ]}
            label="公司名称"
          >
            <Input placeholder="请输入" />
          </Form.Item>
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
            label="手机号"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: '请选择国家' },
            ]}
            style={{ alignItems: 'center' }}
            label="国家"
            name="countries"
            initialValue="1"
          >
            <Radio.Group>
              <Radio value="1">国内</Radio>
              <Radio value="2">海外</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            style={{ alignItems: 'flex-start', marginBottom: 0 }}
            label="联系地址"
            shouldUpdate={(prevValues, curValues) => prevValues.countries !== curValues.countries}
          >
            {({ getFieldValue }) => {
              const nextCountries = getFieldValue('countries')
              return <Row gutter={24}>
                {nextCountries == 1 && <Col span={14}>
                  <Form.Item
                    rules={[
                      { required: false, message: '请选择城市' },
                    ]}
                    name="cityCodes"
                  >
                    <CityCascader />
                  </Form.Item>
                </Col>}
                <Col span={nextCountries == 1 ? 8 : 24}>
                  <Form.Item
                    rules={[
                      { required: false, message: '请输入联系地址' },
                    ]}
                    name="contactAddressInfo"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            }}
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: '请选择行业领域' },
            ]}
            style={{ alignItems: 'center' }}
            name="industry"
            label="行业领域"
          >
            <Radio.Group>
              <Radio value="金融">金融</Radio>
              <Radio value="消费">消费</Radio>
              <Radio value="医药">医药</Radio>
              <Radio value="其他">其他</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item hidden name="landline" label="电话">
            <Input placeholder="请输入" />
          </Form.Item>
          <div style={{ display: isExpand ? 'block' : 'none' }}>
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
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="wechat" label="微信号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="position" label="职位">
              <Input placeholder="请输入" />
            </Form.Item>
            {/* <Form.Item name="industry" label="行业领域">
              <Input placeholder="请输入" />
            </Form.Item> */}
            <Form.Item
              name="remarksDescription"
              label="备注描述"
            >
              <Input.TextArea showCount maxLength={500} />
            </Form.Item>
          </div>
          <span className="expand-span" onClick={this.handleChangeExpand}>{!isExpand ? '填写更多信息' : '收起'}</span>
        </Form>
      </Modal>
    )
  }

  handleChangeExpand = () => {
    this.setState((state) => ({
      isExpand: !state.isExpand
    }))
  }

  render() {
    const { type, visible, modalType } = this.state
    const { code } = this.props
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Select
            onBlur={this.handleBlur}
            suffixIcon={
              type == 'blur' ? <RsIcon type="icon-tianchongxiajiantou" /> : <RsIcon type="icon-tianchongshangjiantou" />
            }
            dropdownMatchSelectWidth={false}
            onClick={this.handleClick}
            defaultValue=""
            bordered={false}
            className="page-title-select"
            onChange={this.handleSelectChange}
            open={type != 'blur'}
          >
            <Option value="">全部线索</Option>
            {this.renderOption()}
          </Select>
          {code != 'convertedClue' && <div>
            <Button onClick={this.handleCreateClues} type="primary">
              新增线索
            </Button>
            {/* <Button style={{ marginLeft: '8px' }}>导入线索</Button> */}
          </div>}
        </div>
        {visible && modalType == '新增' && this.renderCreateModal()}
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    cluesSourceTypeList: state.commonLayout.cluesSourceTypeList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
  }),
  { setValues }
)(Index)
