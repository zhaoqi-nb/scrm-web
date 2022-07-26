import React, { useState } from 'react'
import { Image, Tabs } from 'antd'
import RsIcon from '@RsIcon'
import ClientList from '../../conversatinClient/comment/clientList'
import RecordList from '../../conversatinClient/comment/recordList'

const { TabPane } = Tabs
function StallInfo(props) {
  const { info } = props
  const [tabValue, setTabValue] = useState('1')
  const [itemInfo, setItemInfo] = useState({})
  //   useEffect(() => {
  //     useState('1')
  //   }, [info])

  const tabChange = (value) => {
    setTabValue(value)
  }
  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius4" src={url} preview={false} width={30} height={30} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }
  const clickItem = (item, type) => {
    // console.log(item, type, '------')

    // searchUserId 查询会话列表的全部id
    setItemInfo({ ...item, searchUserId: info.userId, type })
  }
  const customizeRenderEmpty = () => (
    <div className="padt80 middle-a full-w" style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>暂无数据</p>
    </div>
  )
  const renderOpenState = (text) => {
    if (text == 1) {
      return (
        <div className="flex-box middle-a padr24">
          <div className="bg-success mr10 radius4" style={{ width: '8px', height: '8px' }} /> 开启
        </div>
      )
    }
    return (
      <div className="flex-box middle-a padr24">
        <div className="bg-tip2 mr10 radius4" style={{ width: '8px', height: '8px' }} /> 关闭
      </div>
    )
  }
  return (
    <div className="flex-box full over-hidden">
      <div className="flex-box flex-column padt14" style={{ width: '272px' }}>
        <div
          className="flex-box middle-a full-w  flex-between padl24 padb12"
          style={{ borderBottom: '1px solid #E1E8F0' }}
        >
          <div>
            {renderImg(info.avatar)}
            {info.name}
          </div>
          <div>{renderOpenState(info.openState)}</div>
        </div>

        <Tabs activeKey={tabValue} onChange={tabChange} destroyInactiveTabPane centered>
          <TabPane tab="客户" key={1} className="full">
            {tabValue == 1 ? <ClientList id={info.userId} clickItem={clickItem} type={2} /> : null}
          </TabPane>
          <TabPane tab="群聊" key={2} className="full">
            {tabValue == 2 ? <ClientList id={info.userId} clickItem={clickItem} type={3} /> : null}
          </TabPane>
        </Tabs>
      </div>
      <div className="flex-box flex1 full border1 padt14">
        {itemInfo.searchUserId && itemInfo.type ? <RecordList itemInfo={itemInfo} /> : customizeRenderEmpty()}
      </div>
    </div>
  )
}
export default StallInfo
