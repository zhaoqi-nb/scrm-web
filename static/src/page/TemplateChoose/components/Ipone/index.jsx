import React from 'react'
import RsIcon from '@RsIcon'
import phoneBg from '../../../comments/publicView/phoneView/imgage/phoneBg.png'
import './index.less'
import Code from '../../../image/code.png'

export default function Ipone({ type, guidance = '1111' }) {
  const TEMPLATE = {
    0: 'https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/1%402x.png',
    1: 'https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/2%402x.png'
  }
  return (
    <div className="iponeContainer">
      <img src={phoneBg} />
      <div className="top">
        <img src={TEMPLATE[type]} />
        <div className="guidance">{guidance}</div>
      </div>
      <div className="bottomIpone">
        <div>
          <img src={Code} />
        </div>
        <div className="remain">
          <RsIcon type="icon-dianji" className="hand" />长按识别二维码，加入群聊
        </div>
      </div>
    </div>
  )
}
