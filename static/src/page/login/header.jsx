import React, { Component } from 'react'
import { Button } from 'antd'

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
    }
  }

  render() {
    return <div className="login-header">
      <div className="login-header-name">燃数SCRM</div>
      <Button style={{ fontSize: '14px' }} type="link">立即注册</Button>
    </div>
  }
}

Index.propTypes = {}

export default Index
