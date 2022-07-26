import React from 'react'
import { Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
/** *
 *  scrollableDiv 外部容器的Div 固定高度
 *  endMessage 没有更多数据时上拉到底部会显示需要hasMore 为false
 *  downRefresh 是否开启下拉刷新，
 *  上拉时触发next,相当于底部的距离 scrollThreshold 默认是0.8，您可以设置自己的值，比如200px，则会按照 100%-200px，显然，随着滚动区域越来越高，100%越来越大，200固定不变，意味着越往后您越要上拉的更接近底部才会触发next
 *  用户上拉或者下拉 达到阈值时用于加载更多数据 requestList
 *  pullDownToRefreshContent未达到下拉阈值显示的内容
 *  releaseToRefreshContent达到下拉阈值显示的内容
 *
 *
 * * */
function ScrollList({
  requestList,
  itemRener,
  dataList,
  scrollableDiv,
  downRefresh = false,
  hasMore = false,
  scrollThreshold = 0.8,
  ...resProps
}) {
  const endMessage = () => {
    const { endRender } = resProps
    if (endRender) {
      return <div>{endRender()}</div>
    }
    return (
      <div className="flex-box middle">
        <div className="text-sub1">您好,我是有底线的</div>
      </div>
    )
  }
  const renderItem = (item, index) => {
    if (itemRener) {
      return <div>{itemRener(item, index)}</div>
    }
    return <div>请传递自定义的itemRener</div>
  }
  const renderList = () => dataList.map((item, index) => renderItem(item, index))
  return (
    <InfiniteScroll
      {...resProps}
      dataLength={dataList.length}
      next={() => {
        requestList('down')
      }}
      className="full"
      hasMore={hasMore}
      endMessage={endMessage}
      scrollThreshold={scrollThreshold}
      pullDownToRefresh={downRefresh}
      refreshFunction={() => {
        requestList('up')
      }}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      scrollableTarget={scrollableDiv}
    >
      {resProps.children ? resProps.children : renderList()}
    </InfiniteScroll>
  )
}

export default ScrollList
