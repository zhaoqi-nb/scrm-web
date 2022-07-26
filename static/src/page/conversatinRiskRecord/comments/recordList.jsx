import React, { useState, useEffect } from 'react'

import Api from '../store/api'
import ChatRecord from '../../comments/publicView/chatRecord'
import ScrollList from '../../comments/publicView/scrollListAll'

function RecordList(props) {
  const { fromId } = props
  const [dataList, setDataList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const getDataList = (param = {}) => {
    if (loading) {
      return
    }
    setLoading(true)

    param.pageSize = 20
    Api.querySessionSaveList(param)
      .then((res) => {
        if (res.retCode == 200) {
          let list = res.data || []
          list = list.map((item) => {
            const newItem = {
              ...item,
              showType: fromId == item.from ? 'right' : 'left',
            }

            return newItem
          })
          setDataList([...dataList, ...list])
          if (param.contextDirection == 'down') {
            if (list.length == 0 || list.length < param.pageSize) {
              setHasMore(false)
            }
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const requestList = (type) => {
    let id = dataList[0]?.id
    if (type == 'down') {
      id = dataList[dataList.length - 1].id
    }
    getDataList({ sessionSaveId: id, contextDirection: type })
  }

  useEffect(() => {
    getDataList({ sessionSaveId: props.id })
  }, [props.id])

  return (
    <div className="full over-y padb20" id="scrollableDiv">
      <ScrollList
        requestList={requestList}
        dataList={dataList}
        downRefresh
        pullDownToRefreshThreshold={50}
        hasMore={hasMore}
        scrollableDiv="scrollableDiv"
      >
        {/* <div>{dataList.map((item) => item.id)}</div> */}
        <ChatRecord list={dataList} sessionSaveId={props.id} />
      </ScrollList>
    </div>
  )
}
export default RecordList
