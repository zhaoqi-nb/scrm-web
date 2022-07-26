import React, { Component } from 'react'
import { Drawer, Spin, Divider, Descriptions, Tag, Avatar, Image, Button, Popover } from 'antd'
import RsIcon from '@RsIcon'
import { withRouter } from 'react-router-dom'
import { exportFile } from '@util'
import PhoneView from '../comments/publicView/phoneView'
import Api from './store/api'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getDetail()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      visible: true,
      phoneViewList: []
    }
  }

  getDetail = () => {
    this.setState({
      loading: true
    })
    const { id } = this.props
    Api.getDetail(id).then((res) => {
      this.setState({
        newCustomersInfo: res.data,
        phoneViewList: this.transformMedias(res.data)
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  transformMedias = (data) => {
    const { welcomeMessageInfo, groupActivityCodeUrl } = data
    return [{
      fileType: 'text',
      textValue: welcomeMessageInfo.message,
    }, {
      fileType: 'img',
      url: groupActivityCodeUrl,
    }]
  }

  renderAddUser = (data, marginBottom) => {
    if (!data || !data.length) return null
    return data.map((v) => {
      const { name, thumbAvatar } = v
      return (
        <div style={{ display: 'inline-flex', marginRight: '5px', marginBottom: marginBottom || 0, alignItems: 'center' }}>
          <Avatar style={{ marginRight: '4px' }} size={24} src={thumbAvatar} />
          {name}
        </div>
      )
    })
  }

  renderBasicsInfo = () => {
    const { newCustomersInfo } = this.state
    const { codeName, friendCheck, labels, members } = newCustomersInfo || {}
    return <Descriptions className="basics-info-descript" column={2} colon={false} contentStyle={{ marginRight: 16 }}>
      <Descriptions.Item label="活码名称"><Popover content={codeName}><div className="box-clamp-1">{codeName}</div></Popover></Descriptions.Item>
      <Descriptions.Item label="自动通过好友">{friendCheck ? '开启' : '未开启'}</Descriptions.Item>
      <Descriptions.Item label="添加成员">
        <Popover content={this.renderAddUser(members, 8)}>
          <div className="box-clamp-1">
            {this.renderAddUser(members)}
          </div>
        </Popover>
      </Descriptions.Item>
      <Descriptions.Item className="basics-info-descript-item" label="新客户标签">
        <Popover content={labels?.map((v) => <Tag style={{ marginBottom: 8 }}>{v.labelName}</Tag>)}>
          <div className="box-clamp-1">{labels?.map((v) => <Tag>{v.labelName}</Tag>)}</div>
        </Popover>
      </Descriptions.Item>
    </Descriptions>
  }

  render() {
    const { visible, loading, phoneViewList, newCustomersInfo } = this.state
    const { qrCodeUrl, codeName, id } = newCustomersInfo || {}
    return <Drawer
      closable={false}
      title="任务详情"
      visible={visible}
      width={912}
      onClose={() => {
        this.setState({
          visible: false
        })
      }}
      className="new-customer-info-drawer"
      extra={
        <RsIcon
          onClick={() => {
            this.setState({
              visible: false
            })
          }}
          style={{ fontSize: '16px', cursor: 'pointer' }}
          type="icon-guanbi"
        />
      }
    >
      <Spin wrapperClassName="spin-box" spinning={loading}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="drawer-left clearfix">
            <div className="page-label">基础信息</div>
            <Divider style={{ margin: '8px 0' }} />
            {this.renderBasicsInfo()}
            <div className="page-label">入群引导语</div>
            <Divider style={{ margin: '8px 0' }} />
            <PhoneView list={phoneViewList} />
          </div>
          <div className="drawer-right">
            <Image width={140} src={qrCodeUrl} />
            <div style={{ lineHeight: '32px', padding: '0 12px' }}>{codeName}</div>
            <Button
              style={{ margin: '8px 0' }}
              onClick={() => {
                exportFile(qrCodeUrl)
              }}
              type="primary"
            >下载活码</Button>
            <Button onClick={() => {
              this.props.history.replace(`/addNewCustomersLabel?id=${id}`)
            }}
            >修改</Button>
          </div>
        </div>
      </Spin>
    </Drawer>
  }
}

Index.propTypes = {}

export default withRouter(Index)
