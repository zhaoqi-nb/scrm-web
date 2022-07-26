import React, { Component } from 'react'
import { Dropdown, Menu, Divider } from 'antd'
import RsIcon from '@RsIcon'
import { getMenuTree } from '@util'

import './index.less'

const jiantouStyle = {
  fontSize: '12px',
  color: '#0678ff',
}

const isProduct = process.env.NODE_ENV == 'production'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.initData()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      userInfo: null,
      dropDownVisible: false,
      allSystemList: [
        {
          code: 'SCRM',
          title: 'SCRM系统',
          href: 'javascript:void(0);',
        },
        {
          code: 'CRM',
          title: 'CRM系统',
          href: isProduct ? 'https://crm.databurning.com/systemjump' : ' http://172.24.24.5:7015/systemjump',
        },
      ],
    }
  }

  initData = () => {
    const { userInfo } = getMenuTree(MENUDATA)
    this.setState({ isReady: true, userInfo })
  }

  renderLoginMenu = () => (
    <Menu style={{ width: '114px' }}>
      <Menu.Item>
        <RsIcon style={{ marginRight: '8px' }} type="icon-tuichudenglu" />
        <a href="/doLogout">退出</a>
      </Menu.Item>
    </Menu>
  )

  visibleChange = (visible) => {
    this.setState({ dropDownVisible: visible })
  }

  getMenu = () => {
    const { allSystemList, userInfo } = this.state
    const { accessToken, memberId } = userInfo || {}
    return (
      <Menu defaultSelectedKeys={['SCRM']}>
        {allSystemList.map((item) => {
          const { code, title, href } = item
          return (
            <Menu.Item key={code}>
              <a href={code == 'CRM' ? `${href}?accessToken=${accessToken}&sysUserId=${memberId}` : href}>{title}</a>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  render() {
    const { isReady, userInfo, dropDownVisible } = this.state
    if (!isReady) return null
    const { dataBurning, avatar, userName } = userInfo || {}
    return (
      <div className="header-container">
        <div className="header-left">
          <a href="/">
            <img src={require('../../image/logo.png')} alt="logo" className="logo" />
          </a>
          {dataBurning && <>
            <Divider type="vertical" />
            <Dropdown
              onVisibleChange={this.visibleChange}
              style={{ width: 192 }}
              trigger={['click']}
              overlay={this.getMenu()}
            >
              <div className="system-button">
                <div className="system-name">SCRM系统</div>
                <div className="system-jiantou">
                  {dropDownVisible ? (
                    <RsIcon type="icon-tianchongshangjiantou" style={jiantouStyle} />
                  ) :
                    (
                      <RsIcon type="icon-tianchongxiajiantou" style={jiantouStyle} />
                    )}
                </div>
              </div>
            </Dropdown>
          </>}
        </div>
        <div className="header-right">
          <div className="user-avatar">
            <Dropdown overlay={this.renderLoginMenu()} overlayClassName="user-avatar-overlay">
              <div style={{ cursor: 'pointer' }}>
                <img
                  style={{ width: 32, height: 32, borderRadius: 4, marginRight: '16px' }}
                  src={avatar || require('../../image/user.png')}
                />
                {userName || ''}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}

Index.propTypes = {}

export default Index
