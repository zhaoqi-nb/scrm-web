import React, { Component } from 'react'
import { Input } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import { setValues } from './store/action'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() { }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      name: '',
    }
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleSearch = (keyword) => {
    this.props.setValues({
      keyword,
    })
  }

  render() {
    const { name } = this.state
    return (
      <div style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center' }}>
        <Input
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '240px' }}
          placeholder="请输入要搜索的素材标题"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  () => ({}),
  { setValues }
)(Index)
