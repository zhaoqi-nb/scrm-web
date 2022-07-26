import React, { Component } from 'react'
// import { Button } from 'antd'
import HighseasList from './highseasList'

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
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="page-title">公海配置</div>
          {/* <Button type="primary">新增线索公海</Button> */}
        </div>
        <HighseasList />
      </div>
    )
  }
}

Index.propTypes = {}

export default Index
