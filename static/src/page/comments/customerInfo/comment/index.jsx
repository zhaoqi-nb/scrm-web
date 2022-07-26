import React, { useState } from 'react'
import { Image, Tabs } from 'antd'
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
  const clickItem = (item, type) => {
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
    <div className="flex-box full-h">
      <Tabs className="scrm-tabs borderb" activeKey={tabValue} onChange={tabChange} destroyInactiveTabPane centered>
        <TabPane tab="成员" key={1}>
          {tabValue == 1 ? <ClientList id={info.buildExternalUserid} clickItem={clickItem} type={4} /> : null}
        </TabPane>
        <TabPane tab="群聊" key={2}>
          {tabValue == 2 ? <ClientList id={info.buildExternalUserid} clickItem={clickItem} type={5} /> : null}
        </TabPane>
      </Tabs>
      <div className="flex-box flex1 full  bg-info">
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
