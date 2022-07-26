import React from 'react'
import { Tooltip } from 'antd'
import './index.less'

export default function index({ data = [] }) {
    const renderData = () => {
        const result = data?.map((item) => <span className="tags">{item?.name || ''}</span>)
        return result.slice(0, 3);
    }

    return <Tooltip title={data?.map(((item) => item?.name))?.join('、')}>{renderData()}{data?.length > 3 && <font className="ellipsis">...</font>}</Tooltip>
}
