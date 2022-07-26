import React, { Component } from 'react'
import { Button, Input, Select } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import { userTreeFormat } from '@util'
import { TRCheckboxModal } from '@Tool/components'
import { setValues, resetValues } from './store/action'
import Api from './store/api'
import NewTable from './newTable'

import './index.less'

const itemRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
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

  // eslint-disable-next-line react/no-unused-class-component-methods
  renderSelectUser = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        const { checkedUserKeys } = this.props
        TRCheckboxModal.show({ treeData: userTreeFormat(res.data), value: checkedUserKeys, title: '选择创建人', titleRender: itemRender, itemRender }).then((result) => {
          const { index, checkedNodes, checkedKeys } = result
          if (index === 1) {
            this.props.setValues({
              checkedUserKeys: checkedKeys,
              checkedUserLabel: checkedNodes.map((v) => ({
                value: v.value,
                label: v.label
              })),
            })
          }
        })
      }
    })
  }

  renderEmptyBtn = () => <Button
    type="primary"
    onClick={() => {
      this.props.history.replace('/addNewCustomersLabel')
    }}
  >新建自动拉群</Button>

  handleSearch = (name) => {
    this.props.setValues({
      codeName: name,
    })
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleChangeUser = (value) => {
    this.props.setValues({
      checkedUserLabel: value,
      checkedUserKeys: value.map((v) => v.value)
    })
  }

  render() {
    const { name } = this.state
    const { checkedUserLabel } = this.props
    return <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">新客自动拉群</div>
        {this.renderEmptyBtn()}
      </div>
      <Input
        style={{ margin: '16px 0' }}
        suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
        className="input-search list-page-input"
        placeholder="请输入要搜索的二维码名称，回车搜索"
        onPressEnter={(e) => this.handleSearch(e.target.value)}
        onChange={(e) => this.handleChangeName(e.target.value)}
      />
      <Select
        placeholder="请选择创建人"
        open={false}
        allowClear
        onFocus={this.renderSelectUser}
        onChange={this.handleChangeUser}
        mode="tags"
        maxTagCount={2}
        showArrow
        className="list-page-select"
        value={checkedUserLabel}
        style={{ marginLeft: '16px' }}
        labelInValue
      />
      <NewTable />
    </>
  }
}

Index.propTypes = {}

export default connect(
  ({ newCustomersLabel }) => ({
    checkedUserLabel: newCustomersLabel.checkedUserLabel,
    checkedUserKeys: newCustomersLabel.checkedUserKeys,
  }),
  { setValues, resetValues }
)(Index)
