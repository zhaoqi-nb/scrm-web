import { Tooltip } from 'antd'
import React from 'react'
import './index.less'

function index({ linkData }) {
  const handelLink = () => {
    window.open(linkData?.linkUrl || '')
  }
  return (
    <div className="linkComp" onClick={handelLink}>
      <Tooltip title={linkData?.linkName || ''}><div className="title">{linkData?.linkName || ''}</div></Tooltip>
      <Tooltip title={linkData?.summary || ''}>
        <div className="describe"><div>{linkData?.summary || ''}</div><div><img src={linkData?.coverUrl || ''} /></div></div>
      </Tooltip>
    </div>
  )
}

export default index
