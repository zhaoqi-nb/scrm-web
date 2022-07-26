import React, { useState, useEffect } from 'react'

import RsIcon from '@RsIcon'
import { Input, Image } from 'antd'
import moment from 'moment'
import Api from '../store/api'
import ChatRecord from '../../comments/publicView/chatRecord'
import ScrollList from '../../comments/publicView/scrollListAll'
import DatePickerDefalut from '../../comments/publicView/DatePickerDefalut'

function RecordList(props) {
  const { itemInfo } = props
  const [dataList, setDataList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [searchKey, setSearchKey] = useState('')
  const [countInfo, setCountInfo] = useState({})
  // 时间日期控制
  const [timeValues, setTimeValues] = useState([])
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
  const getChatCount = () => {
    let searchById = ''
    if (itemInfo.type == 2 || itemInfo.type == 4) {
      searchById = itemInfo.toUserId
    } else if (itemInfo.type == 3 || itemInfo.type == 5) {
      searchById = itemInfo.toId
    }
    const param = {
      fromUserId: itemInfo.searchUserId,
      searchById,
      userChatType: itemInfo.type,
    }
    Api.getChatCount(param).then((res) => {
      if (res.retCode == 200) {
        setCountInfo(res.data || {})
      }
    })
  }

  useEffect(() => {
    getDataList({ pageNo: 1 })
    getChatCount()
  }, [itemInfo])

  const handleSearchEvent = () => {
    getDataList({
      searchContent: searchKey,
      pageNo: 1,
    })
    // 重置页面
    setPageNo(1)
  }
  const handleChangeName = (value) => {
    setSearchKey(value)
  }

  // 时间搜索
  const onDatePickerChange = (value) => {
    setTimeValues(value)
    getDataList({ searchStartTime: moment(value[0]).valueOf(), searchEndTime: moment(value[1]).valueOf(), pageNo: 1 })
    // 重置页面
    setPageNo(1)
  }
  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius4" src={url} preview={false} width={30} height={30} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }
  const renderTitle = () => {
    // // 2、员工--外部联系人 3、员工--群聊列表 4、客户--员工单聊 5、客户--群聊
    if (itemInfo.type == '2' || itemInfo.type == '4') {
      return (
        <div className="flex-box middle">
          {renderImg(itemInfo.toUserAvator)} <span className="text-title f14 text-bold"> {itemInfo.toUserName}</span>
        </div>
      )
    }
    if (itemInfo.type == 3 || itemInfo.type == 5) {
      return (
        <div className="flex-box middle">
          <div className="bg-success mr8 radius4" style={{ width: '30px', height: '30px' }}>
            <RsIcon type="icon-kehuguanli" className="f30 mr5 text-white" />
          </div>
          <span className="text-title f14 text-bold"> {itemInfo.toName || '无群数据'} </span>
        </div>
      )
    }
  }
  const customizeRenderEmpty = () => (
    <div className="padt80 middle-a full-w" style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>暂无数据</p>
    </div>
  )

  return (
    <div className="full over-hidden flex-box flex-column ">
      <div className="flex-box flex-between padl24 padr24">
        {renderTitle()}
        {itemInfo.toUserId || itemInfo.toId ? (
          <div className="flex-box">
            <div className="text-sub padl24">
              消息总数:<span className="text-title">{countInfo.toCount}</span>
            </div>
            <div className="text-sub padl24">
              发送消息:<span className="text-title">{countInfo.fromCount}</span>
            </div>
            <div className="text-sub padl24">
              接收消息:<span className="text-title">{countInfo.allCount}</span>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="flex-box middle-a padt16 padb16 padl24 padr24">
        <DatePickerDefalut value={timeValues} className="mr16" onChange={onDatePickerChange} />
        <Input
          suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '200px' }}
          placeholder="请输入要搜索的聊天内容"
          onPressEnter={() => handleSearchEvent()}
          onChange={(e) => handleChangeName(e.target.value)}
        />
      </div>

      <div className="full over-y bg-info padl24 padr24" id="scrollableDiv">
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
    </div>
  )
}
export default RecordList
