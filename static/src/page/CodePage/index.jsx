/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Api from './service'
import './index.less'
import RsIcon from '@RsIcon'
import useRem from './userRem'

export default function CodePage() {
  const [detailData, setDetailData] = useState({});
  const history = useHistory()
  const remSize = useRem(1920)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    const urlSuffix = history?.location?.search.split('?id=')?.[1]
    const res = await Api.getDeital(urlSuffix);
    if (res?.retCode === 200) {
      setDetailData(res?.data || {})
    }
  }
  return (
    <div className='iponeContainer'>
      <div className="top" style={{
        position: 'relative'
      }}>
        <img src={detailData?.stencil || ''} />
        {detailData?.introduction || ''}
      </div>
      <div className="bottom">
        <div className="imgBox">
          <img src={detailData?.qrcodeUrl || ''} />
        </div>
        <div className="titleBox">
          <RsIcon type='icon-dianji' className='hand' />长按识别二维码，加入群聊
        </div>
      </div>
    </div>
  )
}
