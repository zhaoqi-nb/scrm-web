import React, { Component } from 'react'

import '../index.less'

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
    const { children } = this.props
    const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child))
    return childrenWithProps
  }
}

Index.propTypes = {
  // children: PropTypes.element.isRequired
}

export default Index
