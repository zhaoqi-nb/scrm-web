import React, { Component } from 'react'
import { Card, Timeline } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import ReactEvents from '../../utils/events'
import Api from './store/api'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    ReactEvents.addListener('getFollowLogListByCluesId', this.getFollowLogListByCluesId)
    this.getFollowLogListByCluesId()
  }

  componentWillUnmount() {
    ReactEvents.removeListener('getFollowLogListByCluesId', this.getFollowLogListByCluesId)
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  getFollowLogListByCluesId = () => {
    const { cluesId } = this.props
    Api.getFollowLogListByCluesId(cluesId).then((res) => {
      this.setState({
        dataList: res.data,
      })
    })
  }

  renderStepList = () => {
    const { followTypeList } = this.props
    const { dataList = [] } = this.state
    return dataList.map((v, index) => {
      const { followType, createTime, followContent, followStartTime, followEndTime, nextFollowTime, createName } = v
      return (
        <Timeline.Item color={index ? 'gray' : '#0678FF'}>
          <div style={{ flex: 1 }}>
            <div>
              <div>{createName}</div>
              <div>添加时间：{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              <div>跟进时间：{moment(followStartTime).format('YYYY-MM-DD')} - {moment(followEndTime).format('YYYY-MM-DD')}</div>
            </div>
            <div>跟进方式：{followTypeList[followType]}</div>
            <div>跟进内容：{followContent}</div>
            <div style={{ color: '#FF0000' }}>下次跟进时间：{moment(nextFollowTime).format('YYYY-MM-DD')}</div>
          </div>
        </Timeline.Item>
      )
    })
  }

  render() {
    return (
      <Card style={{ borderBottom: '1px solid #E1E8F0', height: '100%', overflow: 'auto', padding: 0 }}>
        <Timeline className="record-time-line" progressDot current={1} direction="vertical">
          {this.renderStepList()}
        </Timeline>
      </Card>
    )
  }
}

Index.propTypes = {}

export default connect((state) => ({
  followTypeList: state.followupClue.followTypeList,
}))(Index)
