/* eslint-disable*/
import React, { Component } from 'react'
import { Form, Radio, DatePicker, Row, Col, TimePicker, Affix, Select, Button, message } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'
import lodash from 'lodash'
import GroupTable from './groupTable'
import SelectCustom from '../../../comments/screensCustomSj'

import './index.less'

const { RangePicker } = DatePicker;
const { Option } = Select

const tips = {
  1: '主要用于创建单次执行的任务计划，固定时间发送。',
  2: '主要用于创建重复执行的任务计划，每个周期固定的一个或多个时间点发送。',
  3: '当客户属性或行为动作满足设定条件时，即实时对其进行个性化触达。',
}

const iconStyle = {
  marginRight: '8px'
}

const weekList = [{
  value: 1,
  name: '周一'
}, {
  value: 2,
  name: '周二'
}, {
  value: 3,
  name: '周三'
}, {
  value: 4,
  name: '周四'
}, {
  value: 5,
  name: '周五'
}, {
  value: 6,
  name: '周六'
}, {
  value: 7,
  name: '周日'
}]

const customerType = [{
  value: 0,
  name: '全部客户'
}, {
  value: 2,
  name: '基于客户群组'
}, {
  value: 1,
  name: '基于自定义属性'
}]

// 周期类型
const periodicType = [{
  value: 1,
  name: '每天'
}, {
  value: 2,
  name: '每周'
}, {
  value: 3,
  name: '每月'
}]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)
  fetchData() {
    const { data } = this.props
    const screens = data?.screens?.map((item) => {
      if (item.valueType == 4) {
        return { ...item, value: moment(item.value) }
      }
      return { ...item }
    })
    this.formRef.current.setFieldsValue({
      ...data,
      screens,
      // actionType: this.props.data.actionType,
      // doType: this.props.data.doType,
      time: [moment(data.doStartTime), data.doEndTime ? moment(data.doEndTime) : ''],
      doSendTimeInfo: data.doSendTimeInfo ? moment(data.doSendTimeInfo, 'HH:mm') : '',
      doStartTime: moment(data.doStartTime),
      doSendTimeInfo1: data.doSendTimeInfo1 ? moment(data.doSendTimeInfo1, 'HH:mm') : data.doSendTimeInfo ? moment(data.doSendTimeInfo, 'HH:mm') : '',
    })
    this.setState({
      customerGroupId: [data.customerGroupId]
    })
  }
  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      customerGroupId: []
    }
  }

  initData() {
    const data = Array.from({ length: 31 }, (_, index) => ({ label: index + 1, value: index + 1 }));
    return data;
  }

  disabledDate = (current) => current && current < moment().endOf('day')

  renderSelectOption = (data) => data.map((v) => <Option value={v.value} key={v.value}>{v.name}</Option>)

  // 单次型
  renderSingleType = () => {
    const { a } = this.state

    return <>
      <Form.Item label="执行时间" className="labelTitle">
        <Row gutter={12} className="middle-a">
          <Col>在</Col>
          <Col>
            <Form.Item name="doStartTime" style={{ marginBottom: 0 }} rules={[
              { required: true, message: '日期不能为空' },
            ]}>
              <DatePicker />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item preserve={false} name="doSendTimeInfo" style={{ marginBottom: 0 }} rules={[
              { required: true, message: '日期不能为空' },
            ]}>
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col>执行流程</Col>
        </Row>
      </Form.Item>
      {/* <Divider /> */}
    </>
  }

  // 周期型
  renderPeriodicType = () => {
    const { a } = this.state
    return <Form.Item label="执行时间">
      <Row gutter={12} className="middle-a">
        <Col>在</Col>
        <Col>
          <Form.Item name="time" rules={[
            { required: true, message: '日期不能为空' },
          ]} style={{ marginBottom: 0 }}>
            <RangePicker disabledDate={this.disabledDate} />
          </Form.Item>
        </Col>
        <Col>期间内的</Col>
        <Col>
          <Form.Item name="cycleType" initialValue={1} style={{ marginBottom: 0 }}>
            <Select style={{ width: '80px' }}>
              {this.renderSelectOption(periodicType)}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.cycleType !== curValues.cycleType}>
            {({ getFieldValue }) => {
              const newxtPeriodicType = getFieldValue('cycleType');
              return newxtPeriodicType != 1 && <Form.Item preserve={false} name="cycleTime" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择日期" style={{ width: '80px' }}>
                  {this.renderSelectOption(newxtPeriodicType == 3 ? this.initData() : weekList)}
                </Select>
              </Form.Item>
            }}
          </Form.Item>
        </Col>
        <Col>
          <Form.Item preserve={false} name="doSendTimeInfo1" style={{ marginBottom: 0 }} rules={[
            { required: true, message: '日期不能为空' },
          ]}>
            <TimePicker format="HH:mm" style={{ width: '80px' }} />
          </Form.Item>
        </Col>
        <Col>执行流程</Col>
      </Row>
    </Form.Item>
  }
  handelChange = (val) => {
    this.setState({
      customerGroupId: val
    })
  }
  // 基于客户
  renderCustomerBased = () => {
    const { a, customerGroupId } = this.state
    return <>
      <Form.Item name="attributeType" initialValue={0}>
        <Select placeholder="请选择" style={{ width: '200px' }}>
          {this.renderSelectOption(customerType)}
        </Select>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.attributeType !== curValues.attributeType}>
        {({ getFieldValue }) => {
          const nextType = getFieldValue('attributeType')
          return <>
            {nextType == 2 && <GroupTable onChange={this.handelChange} customerGroupId={customerGroupId} />}
            {nextType == 1 && <Form.Item><SelectCustom formRef={this.formRef} /></Form.Item>}
          </>
        }}
      </Form.Item>
    </>
  }

  handleSave = (value) => {
    let obj = lodash.cloneDeep(value);
    if (obj.attributeType == 2 && !(this.state.customerGroupId?.[0])) {
      message.error('群组不能为空');
      return;
    }
    if (obj.doType != '1') {
      obj.doStartTime = moment(obj.time?.[0]).valueOf()
      obj.doEndTime = moment(obj.time?.[1]).valueOf();
    }
    obj.doStartTime = moment(obj.doStartTime).valueOf()
    obj.doSendTimeInfo = obj.doSendTimeInfo ? moment(obj.doSendTimeInfo).format('HH:mm') : moment(obj.doSendTimeInfo1).format('HH:mm')
    obj.customerGroupId = this.state.customerGroupId?.[0] || ''

    this.props.onPress({ index: 1, obj })
  }

  render() {
    const { doType = 1 } = this.state
    return <div className='processSettingsBox'><Form onFinish={this.handleSave} layout="vertical" ref={this.formRef}>
      <Form.Item name="doType" initialValue={1} extra={tips[doType]} label="流程类型" className="labelTitle">
        <Radio.Group className="process-radio-group" onChange={(e) => this.setState({ doType: e.target.value })}>
          <Radio.Button value={1}><RsIcon style={iconStyle} type="icon-danquxunhuan" />单次型</Radio.Button>
          <Radio.Button value={2}><RsIcon style={iconStyle} type="icon-riqi" />周期型</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.doType !== curValues.doType} style={{ marginBottom: 0 }}>
        {({ getFieldValue }) => {
          const nextType = getFieldValue('doType')
          return <>
            {nextType == 1 && this.renderSingleType()}
            {nextType == 2 && this.renderPeriodicType()}
          </>
        }}
      </Form.Item>
      <Form.Item name="actionType" label="目标客户" initialValue={1} className="labelTitle">
        <Radio.Group>
          <Radio value={1}>基于客户</Radio>
          <Radio value={2}>基于事件</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.actionType !== curValues.actionType} style={{ marginBottom: 0 }}>
        {({ getFieldValue }) => {
          const nextType = getFieldValue('actionType')
          return <>
            {nextType == 1 && this.renderCustomerBased()}
            {nextType == 2 && <Form.Item>
              <SelectCustom selectType="event" />
            </Form.Item>}
          </>
        }}
      </Form.Item>
      {this.props.data?.renderCode === 'readOnly' ? null : <Form.Item className='lastItem' >
        <Button style={{ marginRight: '5px', border: 'none', color: 'black', outline: 'none' }} onClick={() => this.props.onPress({ index: 0 })}>取消</Button>
        <Button htmlType="submit" type="primary">保存</Button>
      </Form.Item>}


      {/* <div className="page-label">流程类型</div>
      <div className="page-label">执行时间</div>
      <div className="page-label">流程类型</div> */}
    </Form>
    </div>
  }
}

Index.propTypes = {}

export default Index
