import React from 'react'
import { Image, message } from 'antd'
import './index.less'
import RsIcon from '@RsIcon'
import moment from 'moment'

function ChatRecord(props) {
  const { list = [], sessionSaveId = '' } = props
  const getItemData = (data, type) => {
    let item = {}
    try {
      item = JSON.parse(data.msgContent)

      if (type == 'all') {
        delete data.msgContent
        item = { ...item, ...data }
      }
    } catch (error) {
      item = data
    }

    return item
  }
  // 文件解析失败的，// 消息解析失败
  const renderNullMeassage = (type) => {
    if (type == 'message') {
      return (
        <div className="flex-column bg-white pad8 radius4 flex-between">
          <div className="text-sub1">未知消息类型</div>
          <RsIcon type="icon-tishixinxitubiao" className="f20 text-waring" />
        </div>
      )
    }
    // 文件类型和消息类型太多，先分开 后续可能会有其他类型参数进来
    return (
      <div className="flex-box bg-white pad8 radius4 flex-between">
        <div className="text-sub1">文件努力加载中请稍后重试</div>
        <RsIcon type="icon-tishixinxitubiao" className="f20 text-waring" />
      </div>
    )
  }

  const renderImg = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    if (item.materialUrl) {
      return (
        <div className="bg-white flex-box middle-a padl4" style={{ minHeight: '35px' }}>
          {item.materialUrl ? <Image width={120} src={item.materialUrl} /> : '图片路径无效'}
        </div>
      )
    }
    return renderNullMeassage('image')
  }
  const openFile = (url) => {
    if (url) {
      window.open(url)
    } else {
      message.error('打开文件链接不可为空')
    }
  }
  const renderVideo = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    if (!(item && item.materialUrl)) {
      return null
    }
    return (
      <div
        className="videDiv flex-box middle"
        onClick={() => {
          openFile(item.materialUrl)
        }}
      >
        <RsIcon type="icon-shipin1" className="f30" />
      </div>
    )
  }

  const renderFile = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    if (!(item && item.fileName)) {
      return null
    }
    const fileNameList = item.fileName.split('.')
    const typeObj = {
      pdf: 'icon-pdf',
      doc: 'icon-word',
      docx: 'icon-word',
      xlsx: 'icon-excel',
      xls: 'icon-excel',
      pptx: 'icon-ppt',
      ppt: 'icon-ppt',
    }

    let typeText = 'icon-tongyongwenjianleixing'
    const typekey = fileNameList[1] ? fileNameList[1].toLowerCase() : 'nullKey'
    if (typekey && typeObj[typekey]) {
      typeText = typeObj[typekey]
    }

    return (
      <div
        className="flex-box middle-a bg-white pad8"
        onClick={() => {
          openFile(item.materialUrl)
        }}
      >
        <div className="flex-box flex1 flex-column padr16">
          <div className="text-ellipsis2 text-sub">{fileNameList[0]}</div>
          <div className="text-sub1"> {(item.fileExactSize / 1024 / 1024).toFixed(2)}M</div>
        </div>
        <div style={{ width: '30px' }}>
          <RsIcon type={typeText} className="f30" />
        </div>
      </div>
    )
  }

  const renderLink = (data) => {
    const item = getItemData(data)
    const url = item.image_url || ''

    return (
      <div
        className="wrapper flex-column bg-white pad8 radius4"
        style={{ width: '239px', maxHeight: '112px', minHeight: '88px' }}
      >
        <div className="text-bold">{item.title}</div>
        {url ? (
          <div className="box">
            <div className="floatImg">
              <Image width={20} src={url} preview={false} />
            </div>
            {item.description}
          </div>
        ) : (
          <div className="box">{item.description}</div>
        )}
      </div>
    )
  }
  const emojiToStr = (str) => {
    // 将表情转换为字符
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
    str = str.replace(patt, (char) => {
      let H
      let L
      let code
      if (char.length === 2) {
        H = char.charCodeAt(0) // 取出高位
        L = char.charCodeAt(1) // 取出低位
        code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00 // 转换算法
        return `&#${code};`
      }
      return char
    })
    return str
  }
  const renderMessage = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    return (
      <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '266px' }}>
        <div>{emojiToStr(item.content)}</div>
      </div>
    )
  }
  const renderRedpacket = (data) => {
    const item = getItemData(data)
    return (
      <div className="bg-redpacket flex-column  pad8 radius4" style={{ width: '229px', height: '88px' }}>
        <div className="flex-box ">
          <RsIcon type="icon-ppt" className="f40 ml4" />
          <div className="text-white f12 pad12">恭喜发财大吉大利{item.wish}</div>
        </div>
        <div className="pa text-white" style={{ bottom: '4px', left: '10px' }}>
          微信红包
        </div>
      </div>
    )
  }
  // 名片
  const renderCard = (data) => {
    const item = getItemData(data)
    return (
      <div className="bg-white pr pad8" style={{ width: '239px', height: '88px' }}>
        <div className="flex-box ">
          <Image src={item.userAvatar} width={44} height={44} />
          <div className="flex-column ml12">
            <div className="text-title text-bold mb12">{item.username}</div>
            <div className="text-sub">{item.corpname}</div>
          </div>
        </div>

        <div className="pa text-sub1" style={{ bottom: '4px' }}>
          企业微信名称片
        </div>
      </div>
    )
  }
  // 撤回消息
  const renderRevoke = () => (
    <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '266px' }}>
      <div>这是一个撤回的消息</div>
    </div>
  )
  // 语音消息
  const renderVoice = (data, objDataType, directionValue) => {
    const item = getItemData(data, objDataType)
    return (
      <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '266px' }}>
        <div>
          <RsIcon type="icon-saying" className="f30" />
          {item.play_length}
        </div>
        {directionValue == 'left' ? (
          <div className="flex-box middle-a ">
            <RsIcon type="icon-saying" className="f20" />
            <div className="padl6"> {item.play_lengt}“</div>
          </div>
        ) : (
          <div className="flex-box middle-a">
            <div className="padr6"> {item.play_lengt}“</div>
            <RsIcon type="icon-saying" style={{ transform: 'rotate(180deg)' }} className="f20" />
          </div>
        )}
      </div>
    )
  }

  // 图文消息
  const renderNews = (data) => {
    const item = getItemData(data)
    return (
      <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '266px' }}>
        <div>{emojiToStr(item.content)}</div>
      </div>
    )
  }
  const renderEmotion = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    return (
      <div className="flex-column bg-white pad8 radius4">
        {item.imageUrl ? (
          <Image url={item.imageUrl} width={item.width} height={item.height} />
        ) : (
          <div className="text-sub1">表情图片路径未获取成功</div>
        )}
      </div>
    )
  }
  const renderLocation = (data) => {
    const item = getItemData(data)
    return (
      <div className="flex-column bg-white pr pad8" style={{ width: '239px', height: '88px' }}>
        <div className="flex-box ">
          <div className="flex-column ml12">
            <div className="text-title text-bold mb12">{item.title}</div>
            <div className="text-sub text-ellipsis" title={item.address}>
              {item.address}
            </div>
          </div>
        </div>

        <div className="pa text-sub1" style={{ bottom: '4px' }}>
          位置信息
        </div>
      </div>
    )
  }
  // 在线文档消息
  const renderDocmsg = (data, objDataType) => {
    const item = getItemData(data, objDataType)
    return (
      <div className="bg-white pr pad8 " style={{ width: '239px', height: '73px' }}>
        <div className="flex-box flex-between ">
          <div className="flex-column ml12">
            <div className="text-title text-bold f14">{item.title}</div>
            <div className="text-sub1">{item.doc_creato}</div>
          </div>

          <RsIcon type="icon-tongyongwenjianleixing" className="f30 mt15" />
        </div>
        {/* <div className="pa text-sub1" style={{ bottom: '2px' }}>
          在线文档
        </div> */}
      </div>
    )
  }
  const renderWeapp = (data) => {
    const item = getItemData(data)
    //     msgtype 消息为：weapp。String类型
    // title 消息标题。String类型
    // description 消息描述。String类型
    // username 用户名称。String类型
    // displayname 小程序名称。String类型
    return (
      <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '266px' }}>
        <div className="text-bold">{item.description}</div>
        <div className="text-title text-bold">{item.title}</div>
        <Image src={require('./imgage/weapp.png')} />

        <div className=" text-sub1 mt10">微信小程序</div>
      </div>
    )
  }
  // directionValue left right 左右
  // 验证 all==objDataType/2
  const ItemConent = (item, directionValue) => {
    switch (item.msgType) {
      case 'file':
        return renderFile(item, 'all')
      case 'image':
        return renderImg(item, 'all')
      case 'video':
        return renderVideo(item, 'all')
      case 'link':
        return renderLink(item)
      case 'text':
        return renderMessage(item, 'all')
      case 'external_redpacket': // 红包
        return renderRedpacket(item)
      case 'redpacket': // 红包
        return renderRedpacket(item)
      case 'location': // 位置信息
        return renderLocation(item)
      case 'card': // 名片
        return renderCard(item)
      case 'revoke': // 撤回消息
        return renderRevoke(item)
      case 'Voice': // 语音
        return renderVoice(item, 'all', directionValue)
      case 'emotion': // 表情
        return renderEmotion(item, 'all')
      case 'news':
        return renderNews(item)
      case 'docmsg': // 在线文档
        return renderDocmsg(item, 'all')
      case 'weapp': // 小程序
        return renderWeapp(item)
      default:
        return renderNullMeassage('message')
    }
  }
  const renderFromavator = (nodeData) => {
    if (nodeData.fromAvatar) {
      return <Image rootClassName="mr5 radius11" src={nodeData.fromAvatar} preview={false} width={22} height={22} />
    }

    return <RsIcon type="icon-morentouxiang" className="f20" />
  }
  const rendeLeftOrRinght = (item, index) => {
    if (item.showType == 'right') {
      return (
        <div className="flex-box mt16 flex-end tr" key={index} tagType={item.msgType}>
          <div className="flex-columon mb26">
            <div className={`itemPanel right pr arrow-${item.msgType}`}>
              {ItemConent(item)}
              {sessionSaveId && sessionSaveId == item.id && (
                <div className="bg-waring pa text-white f12 text-ellipsis" style={{ left: 0, bottom: '-26px' }}>
                  敏感预警
                </div>
              )}
            </div>
            <div className="text-sub1 f12 m3">{moment(item.getTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>

          {/* 头像绘制 */}
          <div className="ml12 mt5">{renderFromavator(item, 'right')}</div>
        </div>
      )
    }
    return (
      <div className="flex-box mt16" key={index} tagType={item.msgType}>
        <div className="mr12 mt5">{renderFromavator(item)}</div>
        <div className="flex-columon">
          <div className={`itemPanel left pr arrow-${item.msgType}`}>{ItemConent(item, 'left')}</div>
          <div className="text-sub1 f12 m3">{moment(item.getTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    )
  }

  const listConent = () => list.map((item, index) => rendeLeftOrRinght(item, index))

  return <div className="full">{listConent()}</div>
}

export default ChatRecord
