import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import zh_CN from 'antd/lib/locale/zh_CN'
import { getMenuTree } from '@util'
import LayoutIndex from './layout/index'
import store from './store/store'
import Login from './login/index'
import OfficialAccountForm from './officialAccountForm'
import './index.less'
import './toRem'
import '../less/index.less'
import CodePage from './CodePage'

const menuData = getMenuTree(MENUDATA)
if (!menuData) document.getElementById('container').style.minWidth = 0 // 有些页面不需要minWidth

// 渲染路由
ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route path="/officialAccountForm" exact component={OfficialAccountForm} />
          <Route path="/CodePage" exact component={CodePage} />
          <Route path="/login" exact component={Login} />
          <Route path="/" component={LayoutIndex} />
        </Switch>
      </Provider>
    </BrowserRouter>
  </ConfigProvider>,
  document.getElementById('container')
)
