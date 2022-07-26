import React, { Component } from 'react'
import { Switch, withRouter } from 'react-router-dom'
import { Tabs } from 'antd'
import RsIcon from '@RsIcon'
import { cloneDeep } from 'lodash'
import { getLocalStorage, getMenuTree } from '@util'
import Router from '../../router'
import ReactEvents from '../../../utils/events'

import '../index.less'

const { TabPane } = Tabs

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    ReactEvents.addListener('pushUrlToLocalStorage', this.pushUrlToLocalStorage)
    this.pushUrlToLocalStorage()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
    ReactEvents.removeListener('pushUrlToLocalStorage', this.pushUrlToLocalStorage)
  }

  getInitialState() {
    return {
      isReady: false,
      urlList: [],
    }
  }

  UNSAFE_componentWillReceiveProps(nextPorps) {
    const { pathname } = nextPorps.location
    if (pathname != this.props.location.pathname) {
      this.pushUrlToLocalStorage({ pathname, isNotPushRouter: true, location: nextPorps.location })
    }
  }

  pushUrlToLocalStorage = ({ pathname, isNotPushRouter, location = this.props.location, } = this.props) => {
    const { menuList, userInfo: { memberId }, pageInfo: { resAttr } } = getMenuTree(MENUDATA)
    const localStorageKey = `${memberId}_urlList`
    let urlList = getLocalStorage(localStorageKey)
    if (urlList) urlList = JSON.parse(urlList)
    else urlList = []
    const currentUrl = pathname
    const index = urlList.findIndex((v) => v.url == currentUrl)
    if (index == -1) {
      urlList.push({
        url: currentUrl,
        name: PAGETITLE,
      })
    }

    urlList = urlList.filter((v) => menuList.indexOf(v.url.replace(/\//g, '')) != -1)
    window.localStorage.setItem(localStorageKey, JSON.stringify(urlList))
    this.setState({
      urlList,
      resAttr
    })
    if (!isNotPushRouter) {
      let locationState = null
      let locationSearch = ''
      if (location.pathname == pathname) {
        this.props.history.replace(`${pathname}`)
        locationState = location.state
        locationSearch = location.search
      }
      this.props.history.replace(`${pathname}${locationSearch}`, locationState)
    }
  }

  // 只存在remove
  onEdit = (removeUrl) => {
    const { userInfo: { memberId } } = getMenuTree(MENUDATA)
    const localStorageKey = `${memberId}_urlList`
    const { pathname } = this.props
    const currentUrl = pathname
    let cloneUrlList = cloneDeep(this.state.urlList)
    cloneUrlList = cloneUrlList.filter((v) => removeUrl != v.url)
    window.localStorage.setItem(localStorageKey, JSON.stringify(cloneUrlList))
    if (currentUrl == removeUrl) {
      window.location.href = cloneUrlList[0].url
    } else {
      this.setState({
        urlList: cloneUrlList
      })
    }
  }

  handleClick = (key) => {
    ReactEvents.emit('handleGetPageInfo', key)
  }

  renderTabCard = () => {
    const { pathname } = this.props
    const { urlList, resAttr = {} } = this.state
    return (
      <Tabs onChange={this.handleClick} onEdit={this.onEdit} hideAdd type="editable-card" activeKey={pathname}>
        {urlList.map((item) => {
          const { name, url } = item
          return (
            <TabPane
              closeIcon={urlList.length > 1 ? <RsIcon type="icon-guanbi" /> : null}
              // tab={
              //   <Link to={url} title={name}>
              //     {name}
              //   </Link>
              // }
              tab={name}
              key={url}
            >
              {pathname == url && (
                <div key={url} style={{ padding: resAttr.padding || undefined }} className="rightContnet-contentWrapper">
                  <Switch>
                    <Router />
                  </Switch>
                </div>
              )}
            </TabPane>
          )
        })}
      </Tabs>
    )
  }

  render() {
    return <div className="rightContnet">{this.renderTabCard()}</div>
  }
}

Index.propTypes = {}

export default withRouter(React.memo(Index))
