import React, { Component } from 'react'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  render() {
    return <div className="page-title">线索管理的页面</div>
  }
}

Index.propTypes = {}

export default Index
