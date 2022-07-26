import React, { Component } from 'react'
import CustomerGroupMassSend from '../customerGroupMassSend'

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
    return <CustomerGroupMassSend {...this.props} type={1} />
  }
}

Index.propTypes = {}

export default Index
