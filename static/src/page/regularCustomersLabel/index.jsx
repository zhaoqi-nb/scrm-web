import React, { Component } from 'react'
import { Button, Input, message } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import { setValues, resetValues } from './store/action'
import Api from './store/api'
import RegularTable from './regularTable'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getMemberSwitchStatus()
  }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      isShowTips: 0
    }
  }

  getMemberSwitchStatus = () => {
    Api.getMemberSwitchStatus().then((res) => {
      this.setState({
        isShowTips: res.data.bulkGroupSendRemind
      })
    })
  }

  renderEmptyBtn = () => <Button
    type="primary"
    onClick={() => {
      this.props.history.replace('/addRegularCustomersLabel')
    }}
  >创建任务</Button>

  handleSearch = (name) => {
    this.props.setValues({
      name,
    })
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleCloseTips = () => {
    Api.closeTips({
      bulkGroupSendRemind: 0
    }).then(() => {
      this.setState({
        isShowTips: 0
      })
      message.success('关闭成功')
    })
  }

  render() {
    const { name, isShowTips } = this.state
    return <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">老客标签建群</div>
        {this.renderEmptyBtn()}
      </div>
      {isShowTips > 0 && <div className="regular-customers-account-content">
        <RsIcon className="regular-customers-account-tips" type="icon-tishixinxitubiao" />
        <div className="content-text">
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0 }}>
            <div className="content-tips">温馨提示：</div>
            <Button onClick={this.handleCloseTips} type="link">不再提示</Button>
          </p>
          <div>1. 标签建群功能可以给指定标签内的客户一键发送群邀请，管理员在后台创建任务后，企业成员将收到【邀请客户入群】的群发通知</div>
          <div>2. 群发内容为入群引导语+群二维码，成员确认发送后，即可群发给满足条件的客户</div>
          <div>3. 发送群邀请时还可以过滤客户，不给已在群内的客户发送群邀请</div>
        </div>
      </div>}
      <Input
        style={{ margin: '16px 0', width: '266px' }}
        suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
        className="input-search"
        placeholder="请输入要搜索任务名称/任务内容"
        onPressEnter={(e) => this.handleSearch(e.target.value)}
        onChange={(e) => this.handleChangeName(e.target.value)}
      />
      <RegularTable />
    </>
  }
}

Index.propTypes = {}

export default connect(
  () => ({}),
  { setValues, resetValues }
)(Index)
