import React, { useState, useEffect } from 'react'
import { Image } from 'antd'
import './index.less'
import RsIcon from '@RsIcon'

function PhoneView(props) {
  const { list = [], messageValue = '' } = props
  const [fileList, setFileList] = useState([])
  useEffect(() => {
    setFileList(list)
  }, [list])

  const renderImg = (item) => <Image width={120} src={item.url} />
  const renderVideo = (item) => {
    if (!(item && item.fileName)) {
      return null
    }
    return (
      <div className="videDiv flex-box middle">
        <RsIcon type="icon-shipin1" className="f30" />
      </div>
    )
  }

  const renderFile = (item) => {
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
    }

    let typeText = 'icon-tongyongwenjianleixing'
    const typekey = fileNameList[1] ? fileNameList[1].toLowerCase() : 'nullKey'
    if (typekey && typeObj[typekey]) {
      typeText = typeObj[typekey]
    }

    return (
      <div className="flex-box middle-a bg-white pad8">
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
  const renderLink = (item) => {
    const url = item.imgData && item.imgData.url
    return (
      <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '155px', height: '89px' }}>
        <div className="text-bold">{item.linkTitle}</div>
        {url ? (
          <div className="box">
            <div className="floatImg">
              <Image width={20} src={url} />
            </div>
            {item.linkDesc}
          </div>
        ) : (
          <div className="box">{item.linkDesc || item.link}</div>
        )}
      </div>
    )
  }

  const renderTetx = (item) =>
    item.textValue && (
      <div className="wrapper bg-white pad8 radius4 flex-column" style={{ width: '155px' }}>
        <div className="box1" dangerouslySetInnerHTML={{ __html: item.textValue.replace(/\n/g, '<br>') }} />
      </div>
    )

  const ItemConent = (item) => {
    switch (item.fileType) {
      case 'file':
        return renderFile(item)
      case 'img':
        return renderImg(item)
      case 'video':
        return renderVideo(item)
      case 'link':
        return renderLink(item)
      case 'text':
        return renderTetx(item)
      default:
        null
    }
  }
  const listConent = () =>
    fileList.map((item, index) => (
      <div className="flex-box mt16 " key={index}>
        <div className="mr4">
          <RsIcon type="icon-morentouxiang" className="f18" />
        </div>
        {ItemConent(item)}
      </div>
    ))

  return (
    <div className="conentDiv">
      <div className="conentPanel pad20 over-y">
        {messageValue ? (
          <div className="flex-box mt16 ">
            <div className="mr4">
              <RsIcon type="icon-morentouxiang" className="f18" />
            </div>
            <div className="wrapper flex-column bg-white pad8 radius4" style={{ width: '155px' }}>
              <div className="box1">{messageValue}</div>
            </div>
          </div>
        ) : null}

        {listConent()}
      </div>
    </div>
  )
}

export default PhoneView
