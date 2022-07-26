import React, { Component } from 'react'
import { Card, Timeline } from 'antd'
import moment from 'moment'
import Api from './store/api'

// 0：创建; 1：编辑; 2：跟进线索（手动修改为已跟进）;3：回收线索;4：提取线索;5：分配线索;6：线索转人;7：转化客户;8：放弃线索;9：更换公海;10：删除线索
const operationTypeList = {
  0: '创建',
  1: '编辑',
  2: '跟进线索（手动修改为已跟进）',
  3: '回收线索',
  4: '提取线索',
  5: '分配线索',
  6: '线索转人',
  7: '转化客户',
  8: '放弃线索',
  9: '更换公海',
  10: '删除线索',
  11: '延期申请',
  12: '审批通过',
  13: '审批驳回',
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getCluesListByCluesId()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  getCluesListByCluesId = () => {
    const { cluesId } = this.props
    Api.getCluesListByCluesId(cluesId).then((res) => {
      this.setState({
        dataList: res.data,
      })
    })
  }

  renderStepList = () => {
    const { dataList = [] } = this.state
    return dataList.map((v, index) => {
      const { remarks, operationType, createTime, createName } = v
      return (
        <Timeline.Item color={index ? 'gray' : '#0678FF'}>
          <div>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div>
            <div>{remarks}</div>
            <div>操作项：{operationTypeList[operationType]}</div>
            <div>操作人：{createName}</div>
          </div>
        </Timeline.Item>
      )
    })
  }

  render() {
    return (
      <Card style={{ borderBottom: '1px solid #E1E8F0', height: '100%', overflow: 'auto' }}>
        <Timeline className="record-time-line" progressDot current={1} direction="vertical">
          {this.renderStepList()}
        </Timeline>
      </Card>
    )
  }
}

Index.propTypes = {}

export default Index
