import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Input, Select, DatePicker, Button, message } from 'antd'
import RsIcon from '@RsIcon'
import ReactEvents from '../../utils/events'
import FollowuprecordList from './followuprecordList'
import Api from './store/api'

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() { }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  handleAddFollowuprecord = (values) => {
    this.setState({
      loading: true
    })
    const { followEndTime, followStartTime, nextFollowTime } = values
    if (followEndTime) values.followEndTime = followEndTime.valueOf()
    if (followStartTime) values.followStartTime = followStartTime.valueOf()
    if (nextFollowTime) values.nextFollowTime = nextFollowTime.valueOf()
    Api.addFollowLog(values).then(() => {
      message.success('发布成功')
      this.formRef.current.resetFields([
        'followType',
        'followStartTime',
        'followEndTime',
        'followContent',
        'nextFollowTime',
      ])
      ReactEvents.emit('getFollowLogListByCluesId')
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  render() {
    const { followTypeList, cluesId } = this.props
    const { loading } = this.state
    return (
      <Card style={{ borderBottom: '1px solid #E1E8F0', overflow: 'auto', height: '100%' }}>
        <Form
          onFinish={this.handleAddFollowuprecord}
          labelAlign="left"
          preserve={false}
          ref={this.formRef}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <Form.Item initialValue={cluesId} name="cluesId" hidden>
            <Input />
          </Form.Item>
          <Form.Item initialValue="1" name="followType" label="跟进方式">
            <Select placeholder="请选择">{this.renderFormOption(followTypeList)}</Select>
          </Form.Item>
          <Form.Item name="followStartTime" label="开始时间">
            <DatePicker placeholder="年/月/日" style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
          </Form.Item>
          <Form.Item name="followEndTime" label="结束时间">
            <DatePicker placeholder="年/月/日" style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
          </Form.Item>
          <Form.Item noStyle>
            <Form.Item
              style={{ display: 'block' }}
              wrapperCol={{ span: 24 }}
              initialValue=""
              name="followContent"
              label="跟进内容"
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
            </Form.Item>
            {/* <div>
              <Popover>常用语</Popover>
              <Divider type="vertical" />
              <RsIcon type="icon-tupian" />
            </div> */}
          </Form.Item>
          <Form.Item style={{ marginTop: '8px' }} name="nextFollowTime" label="下次跟进时间">
            <DatePicker placeholder="年/月/日" style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => {
              const { current } = this.formRef
              if (current) {
                const { nextFollowTime, followStartTime, followEndTime } = current.getFieldsValue([
                  'nextFollowTime',
                  'followStartTime',
                  'followEndTime',
                ])
                return (
                  <Button
                    loading={loading}
                    disabled={!(nextFollowTime && followStartTime && followEndTime)}
                    style={{ marginBottom: '16px', width: '100%', marginTop: '8px' }}
                    type="primary"
                    htmlType="submit"
                  >
                    发布
                  </Button>
                )
              }
            }}
          </Form.Item>
        </Form>
        <FollowuprecordList cluesId={cluesId} />
      </Card>
    )
  }
}

Index.propTypes = {}

export default connect((state) => ({
  followTypeList: state.followupClue.followTypeList,
}))(Index)
