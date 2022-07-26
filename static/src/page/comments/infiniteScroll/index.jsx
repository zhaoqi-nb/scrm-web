import React, { Component } from 'react'
import { Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  render() {
    const { children, dataLength, onLoadMoreData, hasMore, scrollableTargetId } = this.props
    const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child))
    return <InfiniteScroll
      dataLength={dataLength}
      next={onLoadMoreData}
      hasMore={hasMore}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      scrollableTarget={scrollableTargetId}
    >
      {childrenWithProps}
    </InfiniteScroll>
  }
}

Index.propTypes = {}

export default Index
