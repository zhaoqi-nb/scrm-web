import React, { useState, useEffect } from 'react'
import { Image } from 'antd'
import Api from '../api'
import ChatRecord from '../../publicView/chatRecord'
import ScrollList from '../../publicView/scrollListAll'

function RecordList(props) {
  const { itemInfo } = props
  const [dataList, setDataList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const getDataList = (param = {}) => {
    if (loading) {
      return
    }
    // 2、员工--外部联系人 3、员工--群聊列表 4、客户--员工单聊 5、客户--群聊
    let searchById = ''
    if (itemInfo.type == 2 || itemInfo.type == 4) {
      searchById = itemInfo.toUserId
    } else if (itemInfo.type == 3 || itemInfo.type == 5) {
      searchById = itemInfo.toId
    }
    if (!searchById) {
      return false
    }
    const newParam = {
      pageNo,
      pageSize: 20,
      searchById, // 二级id
      searchUserId: itemInfo.searchUserId, // 一级id
      searchChatType: itemInfo.type,
      ...param,
    }

    setLoading(true)

    param.pageSize = 20
    Api.querySessionSaveList(newParam)
      .then((res) => {
        if (res.retCode == 200) {
          let list = res.data || []
          list = list.map((item) => {
            const newItem = {
              ...item,
              showType: itemInfo.searchUserId == item.from ? 'right' : 'left',
            }
            return newItem
          })
          if (param.pageNo == 1) {
            setDataList([...list])
          } else {
            setDataList([...dataList, ...list])
          }
          if (list.length == 0 || list.length < newParam.pageSize) {
            setHasMore(false)
          }
        }
      })
      .catch(() => {
        setHasMore(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const requestList = (type) => {
    if (type == 'down') {
      const newPageNo = pageNo + 1
      setPageNo(newPageNo)
      getDataList({ pageNo: newPageNo })
    }
  }
  // const getChatCount = () => {
  //   let searchById = ''
  //   if (itemInfo.type == 2 || itemInfo.type == 4) {
  //     searchById = itemInfo.toUserId
  //   } else if (itemInfo.type == 3 || itemInfo.type == 5) {
  //     searchById = itemInfo.toId
  //   }
  //   const param = {
  //     fromUserId: itemInfo.searchUserId,
  //     searchById,
  //     userChatType: itemInfo.type,
  //   }
  //   Api.getChatCount(param).then((res) => {
  //     if (res.retCode == 200) {
  //       setCountInfo(res.data || {})
  //     }
  //   })
  // }

  useEffect(() => {
    getDataList({ pageNo: 1 })
    // getChatCount()
  }, [itemInfo])

  const customizeRenderEmpty = () => (
    <div className="padt80 middle-a full-w" style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>暂无数据</p>
    </div>
  )

  return (
    <div className="full over-y bg-info padl12 padr12" id="scrollableDiv">
      {dataList.length == 0 || !(itemInfo.toUserId || itemInfo.toId) ? (
        customizeRenderEmpty()
      ) : (
        <ScrollList
          requestList={requestList}
          dataList={dataList}
          downRefresh={false}
          pullDownToRefreshThreshold={50}
          hasMore={hasMore}
          scrollableDiv="scrollableDiv"
        >
          <ChatRecord list={dataList} />
        </ScrollList>
      )}
    </div>
  )
}
export default RecordList
