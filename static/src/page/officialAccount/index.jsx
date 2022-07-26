import React, { Component } from 'react'
import { Row, Col, Image } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Api from './api'
import { GetQueryString } from '../../utils/Util'
import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    const authCode = GetQueryString('auth_code')
    if (authCode) this.saveAuthOfficialAccountInfo(authCode)
    else this.getAuthOfficialAccountList()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      dataList: []
    }
  }

  saveAuthOfficialAccountInfo = (auth_code) => {
    Api.saveAuthOfficialAccountInfo({
      auth_code
    }).then(() => {
      window.history.pushState({}, 0, '/officialAccount');
      this.getAuthOfficialAccountList()
    })
  }

  getAuthOfficialAccountList = () => {
    Api.getAuthOfficialAccountList().then((res) => {
      this.setState({
        dataList: res.data,
        updataTime: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    })
  }

  getAuthOfficialAccountUrl = () => {
    Api.getAuthOfficialAccountUrl().then((res) => {
      window.location.href = res.data
    })
  }

  renderOfficialAccountList = () => {
    const { dataList } = this.state
    const newDataList = [...dataList]
    newDataList.unshift({
      type: 'add'
    })
    const span = 6
    return <Row className="official-account-row">
      {newDataList.map((v) => {
        const { type, avatar, name, isVerify } = v
        if (type == 'add') {
          return <Col onClick={this.getAuthOfficialAccountUrl} span={span}>
            <div className="col-content col-content-add">
              <RsIcon style={{ fontSize: '32px', marginBottom: '8px' }} type="icon-tianjia" />
              <div>授权公众号</div>
            </div>
          </Col>
        }
        return <Col span={span}>
          <div className="col-content col-content-official">
            <div>
              <Image style={{ borderRadius: '12px' }} width={64} preview={false} src={avatar} />
              <div className="col-content-name">{name}</div>
              <div><span className="col-content-type">{type == 2 ? '服务号' : '订阅号'}</span>{isVerify ? '已认证' : '未认证'}</div>
            </div>
            <div className="col-content-bind">{isVerify ? '已绑定微信开放平台' : '未绑定微信开放平台'}</div>
          </div>
        </Col>
      })}
    </Row>
  }

  render() {
    const { updataTime = '' } = this.state
    return <>
      <div className="page-title">公众号对接</div>
      <div className="official-account-content">
        <RsIcon className="official-account-tips" type="icon-tishixinxitubiao" />
        <div className="content-text">
          <div className="content-tips">帐号管理规则：</div>
          <div>1.请务必使用已认证服务号或订阅号授权使用该系统</div>
          <div>2.该系统适用于同一公司主体旗下多个公众号同时使用</div>
          <div>3.为保证所有功能正常，授权时请保持默认选择</div>
        </div>
      </div>
      <div className="official-account-updatetime">数据更新时间：{updataTime}</div>
      {this.renderOfficialAccountList()}
    </>
  }
}

Index.propTypes = {}

export default Index
