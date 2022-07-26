import React, { Component } from 'react'
import Header from '../header'
import Menu from '../menu'
import TabCard from './TabCard'
import EmptyPage from '../../emptyPage'

import '../index.less'

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
    const { location } = this.props
    return (
      <div className="symbol">
        <Header />
        {location.pathname == '/emptyPage' ? <EmptyPage /> : <div className="contentWrapper">
          <Menu pathname={location.pathname} />
          <TabCard pathname={location.pathname} />
        </div>}
      </div>
    )
  }
}

Index.propTypes = {}

export default React.memo(Index)
