import React, { Component } from 'react'
import { Card, Form, Input, Select, DatePicker, Button, message, Row, Col, Timeline } from 'antd'
import moment from 'moment'
import RsIcon from '@RsIcon'
import InfiniteScroll from '../infiniteScroll'
import Api from './api'

const { Option } = Select

// 跟进方式：1-电话沟通；2-微信沟通；3-短信沟通；4-邮件沟通；5-现场拜访；6-参与活动；7-其他；
const followTypeList = {
  1: '电话沟通',
  2: '微信沟通',
  3: '短信沟通',
  4: '邮件沟通',
  5: '现场拜访',
  6: '参与活动',
  7: '其他',
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    this.getCustomerFollowLogListByCustomerId()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      pageNo: 1,
      pageSize: 20,
      dataList: []
    }
  }

  getCustomerFollowLogListByCustomerId = (isNext) => {
    const { customerId } = this.props
    const { pageNo, pageSize, dataList } = this.state
    Api.getCustomerFollowLogListByCustomerId({
      customerId,
      pageNo: isNext ? pageNo + 1 : pageNo,
      pageSize,
    }).then((res) => {
      const { list, pageCount } = res.data
      this.setState({
        dataList: isNext ? [...dataList, ...list] : list,
        hasMore: pageNo < pageCount,
        pageNo: res.data.pageNo,
      })
    })
  }

  // 添加跟进记录
  saveCustomerFollowLog = (values) => {
    const { followTime } = values
    if (followTime) values.followTime = followTime.valueOf()
    Api.saveCustomerFollowLog(values).then(() => {
      message.success('添加跟进记录成功')
      this.formRef.current.resetFields([
        'followWay',
        'followContent',
        'followTime'
      ])
      this.getCustomerFollowLogListByCustomerId()
    })
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  renderForm = () => {
    const { customerId } = this.props
    return <Form
      onFinish={this.saveCustomerFollowLog}
      labelAlign="left"
      preserve={false}
      ref={this.formRef}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
    >
      <div className="add-follow-log-content">
        <Form.Item initialValue={customerId} name="customerId" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item initialValue="1" name="followWay" label="跟进方式">
              <Select placeholder="请选择">{this.renderFormOption(followTypeList)}</Select>
            </Form.Item></Col>
          <Col span={12}>
            <Form.Item initialValue={moment()} name="followTime" label="日期">
              <DatePicker allowClear={false} placeholder="年/月/日" style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          style={{ display: 'block', marginTop: '20px' }}
          wrapperCol={{ span: 24 }}
          initialValue=""
          name="followContent"
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            const { current } = this.formRef
            if (current) {
              const { followTime } = current.getFieldsValue([
                'followTime',
              ])
              return (
                <div style={{ textAlign: 'right', marginBottom: '16px', marginTop: '8px' }}>
                  <Button type="text" onClick={this.handleChangeAdd}>取消</Button>
                  <Button
                    disabled={!followTime}
                    style={{ marginLeft: '10px' }}
                    type="primary"
                    htmlType="submit"
                  >
                    发布
                  </Button>
                </div>
              )
            }
          }}
        </Form.Item>
      </div>
    </Form>
  }

  // 跟进记录
  renderStepList = () => {
    const { dataList = [] } = this.state
    return dataList.map((v, index) => {
      const { followWay, followTime, followContent, createTime, createName } = v
      return (<>
        {(!index || (moment(followTime).format('YYYYMMDD') != moment(dataList[index - 1].followTime).format('YYYYMMDD'))) ? <div className="bizDayTime">{moment(followTime).format('YYYY-MM-DD')}</div> : ''}
        <Timeline.Item className={index ? '' : 'ant-timeline-item-first'} color={index ? 'gray' : '#0678FF'}>
          <div>
            <div>{followTypeList[followWay]}</div>
            <div>{followContent}</div>
          </div>
          <div>
            <div>创建时间：{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>操作人：{createName}</div>
          </div>
        </Timeline.Item>
      </>
      )
    })
  }

  handleChangeAdd = () => {
    this.setState((state) => ({
      isAdd: !state.isAdd
    }))
  }

  render() {
    const { isAdd, hasMore, dataList } = this.state
    return (
      <Card id="customer-followLog" style={{ borderBottom: '1px solid #E1E8F0', overflow: 'auto', height: '100%' }}>
        {!isAdd && <Button onClick={this.handleChangeAdd} style={{ width: '100%' }}><RsIcon type="icon-tianjia1" />添加跟进记录</Button>}
        {isAdd && this.renderForm()}
        <InfiniteScroll
          dataLength={dataList.length}
          onLoadMoreData={() => this.getCustomerFollowLogListByCustomerId(true)}
          hasMore={hasMore}
          scrollableTargetId="customer-followLog"
        >
          <Timeline className="record-time-line" progressDot current={1} direction="vertical">
            {this.renderStepList()}
          </Timeline>
        </InfiniteScroll>
      </Card>
    )
  }
}

Index.propTypes = {}

export default Index
