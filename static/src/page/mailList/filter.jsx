import React, { Component } from 'react'
import { Input, Select } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import { setValues } from './store/action'
import Api from './store/api'

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getRoleInfoList()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getRoleInfoList = async () => {
    const result = await Api.getRoleInfoList()
    const a = []
    a.find
    if (result.retCode == 200 && result.data) {
      this.props.setValues({
        roleInfoList: result.data.map((v) => ({
          code: v.id,
          name: v.name,
          isDefault: v.isDefault,
        })),
        supertubeId: result.data.find((v) => v.isDefault == 2).id,
      })
    }
  }

  getInitialState() {
    return {
      isReady: false,
      name: '',
    }
  }

  renderOption = (data) => {
    if (!data || !data.length) return []
    return data.map((v) => <Option value={v.code || v.value} key={v.code || v.value}>{v.name || v.label}</Option>)
  }

  handleChange = (code, value) => {
    this.props.setValues({
      [code]: value,
    })
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleSearch = (userNameOrDepartNameLike) => {
    this.props.setValues({
      userNameOrDepartNameLike,
    })
  }

  render() {
    const { name } = this.state
    const { statusOptions, roleInfoList, identityList } = this.props
    return (
      <div style={{ margin: '8px 0 16px' }}>
        <Input
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '200px' }}
          placeholder="请输入部门/成员姓名"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <div style={{ display: 'inline-block', marginLeft: '16px' }}>
          <span>状态</span>
          <Select
            style={{ width: '132px', marginLeft: 8 }}
            showArrow
            allowClear
            defaultValue={[]}
            placeholder="请选择状态"
            onChange={(value) => this.handleChange('status', value)}
          >
            {this.renderOption(statusOptions)}
          </Select>
        </div>
        <div style={{ display: 'inline-block', marginLeft: '16px' }}>
          <span>角色</span>
          <Select
            style={{ width: '132px', marginLeft: 8 }}
            showArrow
            allowClear
            defaultValue={[]}
            placeholder="请选择角色"
            onChange={(value) => this.handleChange('roleId', value)}
          >
            {this.renderOption([{ code: '', name: '全部' }, ...roleInfoList])}
          </Select>
        </div>
        <div style={{ display: 'inline-block', marginLeft: '16px' }}>
          <span>身份选择</span>
          <Select
            style={{ width: '132px', marginLeft: 8 }}
            showArrow
            allowClear
            defaultValue={[]}
            placeholder="请选择身份"
            onChange={(value) => this.handleChange('identityType', value)}
          >
            {this.renderOption([{ code: '', name: '全部' }, ...identityList])}
          </Select>
        </div>
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    statusOptions: state.mailList.statusOptions,
    roleInfoList: state.mailList.roleInfoList,
    identityList: state.mailList.identityList,
  }),
  { setValues }
)(Index)
