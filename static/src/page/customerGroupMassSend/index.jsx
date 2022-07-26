import React, { Component } from 'react'
import { Button, Input, DatePicker } from 'antd'
import RsIcon from '@RsIcon'
import { connect } from 'react-redux'
import moment from 'moment'
import { setValues, resetValues } from './store/action'
import GroupMassSendList from './groupMassSendList'

const { RangePicker } = DatePicker

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() { }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

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

  handleTimeChange = (e) => {
    const param = {
      searchBeginTime: '',
      searchEndTime: ''
    }
    if (e && e[0] && e[1]) {
      param.searchBeginTime = moment(e[0]).valueOf()
      param.searchEndTime = moment(e[1]).valueOf()
    }
    this.props.setValues(param)
  }

  renderEmptyBtn = () => {
    const { type = 2 } = this.props
    return <Button
      type="primary"
      onClick={() => {
        this.props.history.replace(type == 2 ? '/addCustomerGroupMassSend' : '/addCustomerMassSend')
      }}
    >新建群发</Button>
  }

  render() {
    const { name } = this.state
    const { type = 2 } = this.props
    return <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">客户群群发</div>
        {this.renderEmptyBtn()}
      </div>
      <Input
        style={{ margin: '8px 16px 16px 0', width: '266px' }}
        suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
        className="input-search"
        placeholder="请输入要搜索任务名称/任务内容"
        onPressEnter={(e) => this.handleSearch(e.target.value)}
        onChange={(e) => this.handleChangeName(e.target.value)}
      />
      <RangePicker onChange={this.handleTimeChange} placeholder={['发送开始日期', '发送结束日期']} suffixIcon={<RsIcon type="icon-riqi" />} />
      <GroupMassSendList type={type} />
    </>
  }
}

Index.propTypes = {}

export default connect(
  () => ({}),
  { setValues, resetValues }
)(Index)
