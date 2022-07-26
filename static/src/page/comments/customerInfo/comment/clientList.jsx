import React, { useState, useEffect } from 'react'
import { Image } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'

import Api from '../api'
import ScrollList from '../../publicView/scrollListAll'

function ClientList(props) {
  const { clickItem } = props
  const [dataList, setDataList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [firstEnd, setFirstEnd] = useState(true)
  const getDataList = (param = {}) => {
    if (loading) {
      return
    }
    setLoading(true)
    const newParam = {
      fromUserId: props.id,
      userChatType: props.type,
      pageNo,
      pageSize: 20,
      ...param,
    }
    Api.getChatListByUserId(newParam)
      .then((res) => {
        if (res.retCode == 200) {
          const { list = [], totalCount = 0 } = res.data || {}
          if (firstEnd) {
            // 第一次执行选择一个默认的操作
            clickItem && clickItem(list[0] || {}, props.type)
            setFirstEnd(false)
          }
          // 外部传递的pageNo是1
          if (param.pageNo == 1) {
            setDataList([...list])
          } else {
            setDataList([...dataList, ...list])
          }

          if (list.length == 0 || (totalCount && totalCount < param.pageSize * pageNo)) {
            setHasMore(false)
          }
        }
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
  // type == 1、员工--内部联系人 2、员工--外部联系人 3、员工--群聊列表 4、客户--员工单聊 5、客户--群聊
  // type == 1暂时用不到
  useEffect(() => {
    getDataList()
  }, [props.id])

  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius4" src={url} preview={false} width={30} height={30} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }
  const onItemClick = (item, index) => {
    // 重复点击无效
    if (activeIndex != index) {
      setActiveIndex(index)
      clickItem && clickItem(item, props.type)
    }
  }
  const itemRener = (item, index) => {
    let activeClassName = ''
    if (activeIndex == index) {
      activeClassName = 'bg-info'
    }
    if (props.type == 2 || props.type == 4) {
      return (
        <div
          className={`flex-box flex-column borderb-1 padl12 padr12 padt8 padb8 ${activeClassName}`}
          onClick={() => {
            onItemClick(item, index)
          }}
        >
          <div className="flex-box  flex-between">
            <div className="flex-box middle">
              {renderImg(item.toUserAvator)}
              <div className="text-title f14 text-bold text-ellipsis2" title={item.toUserName}>
                {item.toUserName}
              </div>
              {[1, 2].indexOf(item.crmUserType) > -1 && (
                <div className="customer-type">@{item.crmUserType == 1 ? '微信' : item.crmUserCorpName}</div>
              )}
            </div>
            {item.permitStatus != 1 && (
              <div
                style={{ background: 'rgba(255, 108, 121, 0.15)', height: '18px', lineHeight: '18px' }}
                className="text-waring pad3"
              >
                不同意
              </div>
            )}
          </div>
          <div className="flex-box flex-between padt8 text-sub1">
            <span>今日消息数:{item.todayMsgCount}</span>
            <span>{moment(item.lastMessageTime).format('YYYY-MM-DD ')}</span>
          </div>
        </div>
      )
    }
    if (props.type == 3 || props.type == 5) {
      return (
        <div
          className={`flex-box flex-column borderb-1 padl12 padr12 padt8 padb8 ${activeClassName}`}
          onClick={() => {
            onItemClick(item, index)
          }}
        >
          <div className="flex-box  flex-between">
            <div className="flex-box middle">
              <div className="bg-success mr8 radius4" style={{ width: '30px', height: '30px' }}>
                <RsIcon type="icon-kehuguanli" className="f30 mr5 text-white" />
              </div>
              <span className="text-title f12 text-ellipsis2" title={item.toName}>
                {' '}
                {item.toName}
              </span>
            </div>
            {item.outType != 1 && (
              <div style={{ background: 'rgba(255, 108, 121, 0.15)' }} className="text-waring pad3">
                已退出群聊
              </div>
            )}
          </div>
          <div className="flex-box flex-between padt8 text-sub1">
            <span>今日消息数:{item.todayMsgCount}</span>
            <span>{moment(item.lastMessageTime).format('YYYY-MM-DD')}</span>
          </div>
        </div>
      )
    }
  }
  const customizeRenderEmpty = () => (
    <div className="padt80" style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>暂无数据</p>
    </div>
  )

  return (
    <div className="full-h over-y padb20 flex1" id="scrollableDiv" style={{ width: '190px' }}>
      {dataList.length == 0 ? (
        customizeRenderEmpty()
      ) : (
        <ScrollList
          requestList={requestList}
          dataList={dataList}
          itemRener={itemRener}
          hasMore={hasMore}
          scrollableDiv="scrollableDiv"
        />
      )}
    </div>
  )
}
export default ClientList
