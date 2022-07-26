import React, { Component } from 'react'
import { message, Tooltip } from 'antd'
import { Base64 } from 'js-base64'
import RsIcon from '@RsIcon'
import { getMenuTree } from '@util'
import ReactEvents from '../../../utils/events'
import Api from './store/api'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.initData()
    ReactEvents.addListener('handleGetPageInfo', this.handleGetPageInfo)
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { pathname } = this.props
  //   const nextPathname = nextProps.pathname
  //   const currentPathname = pathname
  //   if (nextPathname != currentPathname) {
  //     this.handleGetPageInfo(nextPathname)
  //   }
  // }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      topMenu: null,
      selectedKeys: [],
      openKeys: [],
      secondMenuExpanded: true,
      firstMenuExpanded: true,
    }
  }

  handleGetPageInfo = async (nextPathname) => {
    const currentPathname = this.props.pathname.replace(/\//g, '')
    const path = nextPathname.replace(/\//g, '')
    const result = await Api.getPageInfo({
      path,
    })

    if (result.retCode == 200 && result.data) {
      const { pageInfo, menuList } = result.data
      const prevMenuData = getMenuTree(MENUDATA)
      if (menuList.indexOf(currentPathname) == -1 && menuList.indexOf(path) == -1) { // 无当前页面的权限且无要跳转的页面
        window.location.reload()
      } else if (menuList.indexOf(path) >= 0) {
        window.PAGETITLE = pageInfo.resName
        document.title = pageInfo.resName
        setTimeout(() => {
          ReactEvents.emit('pushUrlToLocalStorage', {
            pathname: nextPathname
          })
        }, 10)
      } else {
        delete result.data.pageInfo
        // if (prevMenuData.pageInfo.tabId != pageInfo.tabId) delete result.data.leftMenu
        message.warning('您暂时无权限查看此页面')
        setTimeout(() => {
          ReactEvents.emit('pushUrlToLocalStorage', {
            pathname: nextPathname,
            isNotPushRouter: true
          })
        }, 10)
      }

      const menuData = {
        ...prevMenuData,
        ...result.data,
      }
      window.MENUDATA = Base64.encode(JSON.stringify(menuData))
      this.initData()
    }
  }

  initData = () => {
    const { tempMenu, pageInfo } = getMenuTree(MENUDATA)
    const secondSelectKey = pageInfo.pResId ? pageInfo.pResId.toString() : pageInfo.resId.toString()
    this.setState({
      secondSelectKey,
      isReady: true,
      tempMenu
    })
  }

  renderMenu = (item, menuLevel = 1) => {
    const { secondSelectKey } = this.state
    const { resAttr = {}, redirect, resName, resId, resType, children, pResId } = item
    const menuState = item.menuState == undefined
    let { path, } = resAttr
    const { tabType } = resAttr
    const menuIcon = resAttr.icon
    if (redirect) path = `/${redirect}`
    else path = `/${path}`
    const idEdv = tabType == 'dev'
    return <>
      {idEdv ? <Tooltip title="敬请期待"><div className={`${menuLevel == 1 ? 'menu-wrapper-first' : 'menu-wrapper-second'} ${secondSelectKey == (pResId || resId) ? 'menu-wrapper-select' : ''} ${idEdv ? 'dev-menu' : ''}`}>
        {menuIcon ? <RsIcon className="menu-icon" type={menuIcon} /> : ''}
        <span className="subMenu menu-text" style={{ paddingLeft: 0 }}>
          {/* <RsIcon type="icon-jinxingzhong" /> */}
          {resName}
        </span>
      </div></Tooltip> : !(resType != 'MENU' || !menuState) && <div onClick={() => menuLevel != 1 && this.handleClickMenu(path)} className={`${menuLevel == 1 ? 'menu-wrapper-first' : 'menu-wrapper-second'} ${secondSelectKey == (pResId || resId) ? 'menu-wrapper-select' : ''}`}>
        {menuIcon ? <RsIcon className="menu-icon" type={menuIcon} /> : ''}
        <span className="subMenu menu-text" style={{ paddingLeft: 0 }}>
          {resName}
        </span>
      </div>}
      {children && children.length && <>
        {children.map((v) => this.renderMenu(v, menuLevel + 1))}
      </>}
    </>
  }

  handleClickMenu = (path) => {
    if (path) {
      this.handleGetPageInfo(path)
    }
  }

  render() {
    const {
      isReady,
      tempMenu = []
    } = this.state
    if (!isReady) return null
    return <div className="new-menu">
      {tempMenu.map((item) => this.renderMenu(item))}
    </div>
  }
}

Index.defaultProps = {
  ifFixExpanded: true,
}

export default Index
