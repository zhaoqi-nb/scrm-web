import React, { Component } from 'react'
import { Drawer, Spin, Tabs } from 'antd'
import RsIcon from '@RsIcon'
import MassSendTable from './massSendTable'
import Api from './store/api'
import ReactEvents from '../../utils/events'

import './index.less'

const { TabPane } = Tabs

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.oldCustomerBuildGroupIndex()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      massSendInfo: {},
      visible: true,
      activeKey: 2
    }
  }

  // 数据概览
  oldCustomerBuildGroupIndex = () => {
    const { id } = this.props
    this.setState({
      loading: true
    })
    Api.oldCustomerBuildGroupIndex({
      id
    }).then((res) => {
      this.setState({
        dataOverview: res.data
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  renderDataView = () => {
    const { dataOverview = {} } = this.state
    const { memberSendCount, memberUnSendCount, userSendCount, userUnSendCount, completeCount, unCompleteCount, totalCount } = dataOverview
    return <div className="data-overview-box">
      <div className="data-overview-box-left">
        <div>
          <RsIcon style={{ fontSize: '36px' }} type="icon-bianzu1" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div className="data-overview-label">客户总数</div>
          <div className="data-overview-number">{totalCount}</div>
        </div>
      </div>
      <div className="data-overview-box-right">
        <div className="right-item right-item-border">
          <div className="data-overview-label">已入群客户</div>
          <div className="data-overview-number">{completeCount}</div>
        </div>
        <div className="right-item right-item-border">
          <div className="data-overview-label">未入群客户</div>
          <div className="data-overview-number">{unCompleteCount}</div>
        </div>
        <div className="right-item right-item-border">
          <div className="data-overview-label">已邀请客户</div>
          <div className="data-overview-number">{userSendCount}</div>
        </div>
        <div className="right-item right-item-border">
          <div className="data-overview-label">未邀请客户</div>
          <div className="data-overview-number">{userUnSendCount}</div>
        </div>
        <div className="right-item right-item-border">
          <div className="data-overview-label">完成发送成员</div>
          <div className="data-overview-number">{memberSendCount}</div>
        </div>
        <div className="right-item">
          <div className="data-overview-label">未完成发送成员</div>
          <div className="data-overview-number">{memberUnSendCount}</div>
        </div>
      </div>
    </div>
  }

  activeKeyChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }

  renderInfoTable = () => {
    const { activeKey } = this.state
    const { id, userList } = this.props
    return <Tabs destroyInactiveTabPane onChange={this.activeKeyChange} activeKey={String(activeKey)} className="info-table-tabs scrm-tabs">
      <TabPane tab="客户详情" key="2">
        {activeKey == 2 && <MassSendTable userList={userList} infoId={id} tableType={activeKey} />}
      </TabPane>
      <TabPane tab="成员详情" key="1">
        {activeKey == 1 && <MassSendTable userList={userList} infoId={id} tableType={activeKey} />}
      </TabPane>
    </Tabs>
  }

  handleRefreshData = () => {
    this.oldCustomerBuildGroupIndex()
    ReactEvents.emit('getData')
  }

  render() {
    const { visible, loading } = this.state
    return <Drawer
      closable={false}
      title="任务详情"
      visible={visible}
      width={912}
      onClose={() => {
        this.setState({
          visible: false
        })
      }}
      className="regular-info-drawer"
      extra={
        <RsIcon
          onClick={() => {
            this.setState({
              visible: false
            })
          }}
          style={{ fontSize: '16px', cursor: 'pointer' }}
          type="icon-guanbi"
        />
      }
    >
      <Spin spinning={loading}>
        <div className="refresh-box">
          <div onClick={this.handleRefreshData} className="refresh-btn">
            <RsIcon style={{ fontSize: '16px', marginRight: 8 }} type="icon-genghuan" />
            同步数据
          </div>
        </div>
        {this.renderDataView()}
        <div style={{ background: '#fff', padding: '24px' }}>
          {this.renderInfoTable()}
        </div>
      </Spin>
    </Drawer>
  }
}

Index.propTypes = {}

export default Index
