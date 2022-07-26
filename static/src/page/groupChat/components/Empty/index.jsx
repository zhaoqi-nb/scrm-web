import React from 'react'
import { Empty } from 'antd'
import EmptyImage from '../../../image/empty.png'
import './index.less'

function index({ description }) {
    return (
      <div className="container">
        <Empty
          image={EmptyImage}
          description={description}
        />
      </div>
    )
}

export default index
