import React, { Component } from 'react'
import { Card, Timeline } from 'antd'
import moment from 'moment'
import InfiniteScroll from '../infiniteScroll'
import Api from './api'

// 类型：添加好友-customer_add；删除好友-customer_del；客户流失-customer_flow；加入群聊-chat_group_add；退出群聊-chat_group_quit；标签新增-label_create；标签移除-label_del；
const bizTypeList = {
  customer_add: '添加好友',
  customer_del: '删除好友',
  customer_flow: '客户流失',
  chat_group_add: '加入群聊',
  chat_group_quit: '退出群聊',
  label_create: '标签新增',
  label_del: '标签移除',
  radar_open_event: '打开素材',
  radar_open_read: '阅读素材',
}

const materialTypeLIst = {
  0: '文件',
  1: '文章',
  2: '图片',
  3: '视频',
  4: '表单',
  5: '链接',
  6: '文本',
  7: '小程序',
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getCustomerEventListByCustomerId()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      pageNo: 1,
      pageSize: 20,
      hasMore: true,
      dataList: []
    }
  }

  getCustomerEventListByCustomerId = (isNext) => {
    const { pageNo, pageSize, dataList } = this.state
    const { customerId } = this.props
    Api.getCustomerEventListByCustomerId({
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

  renderBizContent = (type, data, labelJsonMap, record) => {
    const { customerName, memberName, groupName, groupManagerName } = data ? JSON.parse(data) : {}
    const { fileName, shareLocation, doThisCount, eventContinuedTime, materialType } = record
    const shaerMemberName = record.memberName
    const shaerCustomerName = record.customerName
    switch (type) {
      case 'customer_add':
        return `客户【${customerName}】添加了【${memberName}】为好友`
      case 'customer_del':
        return `员工【${memberName}】把【${customerName}】从好友中删除`
      case 'customer_flow':
        return `客户【${customerName}】删除了员工【${memberName}】`
      case 'chat_group_add':
        return `客户【${customerName}】加入了【${groupManagerName}】的客户群【${groupName}】`
      case 'chat_group_quit':
        return `客户【${customerName}】退出了【${groupManagerName}】的客户群【${groupName}】`
      case 'label_create':
        return `员工【${memberName}】为客户【${customerName}】添加了：${labelJsonMap.map((v) => `【${v.name}】`)}标签`
      case 'label_del':
        return `员工【${memberName}】移除了客户【${customerName}】的${labelJsonMap.map((v) => `【${v.name}】`)}标签`
      case 'radar_open_event':
        return `客户【${shaerCustomerName}】打开了员工【${shaerMemberName}】在【侧边栏-${shareLocation}】里发送的【${materialTypeLIst[materialType]}】「${fileName}」，累计打开${doThisCount}次`
      case 'radar_open_read': // 阅读素材
        return `客户【${shaerCustomerName}】打开了员工【${shaerMemberName}】在【侧边栏-${shareLocation}】里发送的【${materialTypeLIst[materialType]}】「${fileName}」,本次阅读时常为为${Math.floor(eventContinuedTime / 60000)}分${Math.round((eventContinuedTime % 60000) / 1000)}秒，累计打开次数${doThisCount}次`
      default:
        null
    }
  }

  renderStepList = () => {
    const { dataList = [] } = this.state
    return dataList.map((v, index) => {
      const { bizType, bizDayTime, bizTime, bizContent, labelJsonMap } = v
      return (<>
        {(!index || (bizDayTime != dataList[index - 1].bizDayTime)) ? <div className="bizDayTime">{bizDayTime}</div> : ''}
        <Timeline.Item className={index ? '' : 'ant-timeline-item-first'} color={index ? 'gray' : '#0678FF'}>
          <div>{moment(bizTime).format('HH:mm:ss')}</div>
          <div>
            <div>{bizTypeList[bizType]}</div>
            <div>{this.renderBizContent(bizType, bizContent || '', labelJsonMap || [], v)}</div>
          </div>
        </Timeline.Item>
      </>
      )
    })
  }

  render() {
    const { dataList, hasMore } = this.state
    return (
      <Card id="customer-eventList" style={{ borderBottom: '1px solid #E1E8F0', height: '100%', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={dataList.length}
          onLoadMoreData={() => this.getCustomerEventListByCustomerId(true)}
          hasMore={hasMore}
          scrollableTargetId="customer-eventList"
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
