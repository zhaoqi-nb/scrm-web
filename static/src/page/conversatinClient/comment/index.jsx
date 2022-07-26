import React, { useState } from 'react'
import { Image, Tabs } from 'antd'
import RsIcon from '@RsIcon'
import ClientList from './clientList'
import RecordList from './recordList'

const { TabPane } = Tabs
function ClientInfo(props) {
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
    console.log(item, type, '------')

    // searchUserId 查询会话列表的全部id
    setItemInfo({ ...item, searchUserId: info.buildExternalUserid, type })
  }
  const customizeRenderEmpty = () => (
    <div className="padt80 middle-a full-w" style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>暂无数据</p>
    </div>
  )
  return (
    <div className="flex-box full over-hidden">
      <div className="flex-box flex-column padt14" style={{ width: '272px' }}>
        <div className="flex-box middle-a padl24 padb12" style={{ borderBottom: '1px solid #E1E8F0' }}>
          {renderImg(info.customerAvator)}
          {info.customerName}
          {[1, 2].indexOf(info.customerType) > -1 && (
            <div className="customer-type">@{info.customerType == 1 ? '微信' : info.customerCorpName}</div>
          )}
        </div>
        <Tabs activeKey={tabValue} onChange={tabChange} destroyInactiveTabPane centered>
          <TabPane tab="成员" key={1} className="full">
            {tabValue == 1 ? <ClientList id={info.buildExternalUserid} clickItem={clickItem} type={4} /> : null}
          </TabPane>
          <TabPane tab="群聊" key={2} className="full">
            {tabValue == 2 ? <ClientList id={info.buildExternalUserid} clickItem={clickItem} type={5} /> : null}
          </TabPane>
        </Tabs>
      </div>
      <div className="flex-box flex1 full border1 padt14">
        {itemInfo.searchUserId && itemInfo.type ? (
          <RecordList key={tabValue} itemInfo={itemInfo} />
        ) : (
          customizeRenderEmpty()
        )}
      </div>
    </div>
  )
}
export default ClientInfo
