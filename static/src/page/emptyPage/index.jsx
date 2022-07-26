import React, { Component } from 'react'
import { Empty } from 'antd'

export default class Index extends Component {
  componentDidMount() { }

  render() {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Empty style={{ color: 'rgba(0,0,0,.8)', fontSize: '16px' }} description="您暂无菜单权限，请联系管理员" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
  }
}
