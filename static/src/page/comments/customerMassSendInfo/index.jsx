/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Drawer, Divider, Descriptions, Spin, Image, Row, Col, Tabs } from 'antd'
import RsIcon from '@RsIcon'
import Api from './api'
import PhoneView from '../publicView/phoneView'
import MassSendTable from './massSendTable'
import GroupMassSendTable from './groupMassSendTable'

import './index.less'

const { TabPane } = Tabs

const PhoneViewTypes = {
  1: 'text',
  2: 'img',
  3: 'link',
  4: 'video',
  5: 'file',
}

const fileTypeText = {
  text: '文本',
  img: '图片',
  link: '链接',
  vido: '视频',
  file: '文件',
}

const statusText = {
  '-1': '已取消',
  0: '待发送',
  1: '已发送',
}

const sexOptions = {
  1: '男',
  2: '女',
  0: '未知'
}

const renderFile = (item) => {
  if (!(item && item.fileName)) {
    return null
  }
  const fileNameList = item.fileName.split('.')
  const typeObj = {
    pdf: 'icon-pdf',
    doc: 'icon-word',
    docx: 'icon-word',
    xlsx: 'icon-excel',
    xls: 'icon-excel',
  }

  let typeText = 'icon-tongyongwenjianleixing'
  const typekey = fileNameList[1] ? fileNameList[1].toLowerCase() : 'nullKey'
  if (typekey && typeObj[typekey]) {
    typeText = typeObj[typekey]
  }

  return (
    <div className="flex-box middle-a bg-white pad8">
      <div className="flex-box flex1 flex-column padr16">
        <div className="text-ellipsis2 text-sub">{fileNameList[0]}</div>
        <div className="text-sub1"> {(item.fileExactSize / 1024 / 1024).toFixed(2)}M</div>
      </div>
      <div style={{ width: '30px' }}>
        <RsIcon type={typeText} className="f30" />
      </div>
    </div>
  )
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.getDetail()
    this.getDataIndex()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      massSendInfo: {},
      visible: true,
      activeKey: 1
    }
  }

  getDetail = () => {
    const { id } = this.props
    this.setState({
      loading: true
    })
    Api.getDetail({ id }).then((res) => {
      this.setState({
        massSendInfo: res.data
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }

  getDataIndex = () => {
    const { id } = this.props
    Api.getDataIndex({ id }).then((res) => {
      this.setState({
        massSendData: res.data
      })
    })
  }

  renderMemberVos = (data) => {
    const length = data?.length
    if (length > 2) {
      return `${data[0].name}、${data[1].name} 等`
    } return data.map((v) => v.name).join('、')
  }

  renderBasicsInfo = () => {
    const { massSendInfo } = this.state
    const { name, status, memberVos = [], creator, type, allCusCount } = massSendInfo
    return <Descriptions column={2} colon={false}>
      <Descriptions.Item label="任务名称">{name}</Descriptions.Item>
      <Descriptions.Item label="创建人">{creator}</Descriptions.Item>
      <Descriptions.Item label="群发状态">{statusText[status]}</Descriptions.Item>
      <Descriptions.Item label="群发客户">消息将送达&nbsp;{this.renderMemberVos(memberVos)}{memberVos.length}个{type == 1 ? '员工' : '群主'}的{allCusCount || 0}个{type == 1 ? '客户' : '群'}</Descriptions.Item>
    </Descriptions>
  }

  transformMedias = (data) => data.map((v) => ({
    ...v,
    fileType: PhoneViewTypes[v.type],
    textValue: v.content,
    url: v.filePath,
    link: v.content, // 链接为content
    fileExactSize: v.fileSize
  }))

  // 群发内容解析
  renderContentInfo = (data) => data.map((v, index) => {
    const { fileType, textValue, link, filePath } = v
    return <div style={{ marginBottom: '8px' }}>
      <div className="file-type-label">{index + 1}.{fileTypeText[fileType]}</div>
      <div>
        {fileType == 'text' && <div className="box1" dangerouslySetInnerHTML={{ __html: textValue?.replace(/\n/g, '<br>') }} />}
        {fileType == 'img' && <Image style={{ borderRadius: '8px' }} width={120} src={filePath} />}
        {fileType == 'file' && <div className="file-box">{renderFile(v)}</div>}
      </div>
    </div>
  })

  renderMassContent = () => {
    const { massSendInfo } = this.state
    const { medias = [], type, filterType, filter, chooseLabels } = massSendInfo
    const newMedias = this.transformMedias(medias)
    return <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Descriptions style={{ marginTop: '8px' }} column={1} colon={false}>
          <Descriptions.Item className="flex-start" label="群发内容">
            <div className="mass-content-div">
              {this.renderContentInfo(newMedias)}
            </div>
          </Descriptions.Item>
          {type == 1 && <Descriptions.Item labelStyle={{ marginTop: 16 }} contentStyle={{ marginTop: 16 }} className="flex-start" label="群发范围">
            <div className="mass-content-div">
              {filterType == 0 ? '全部客户' : this.renderFilterConsumber(filter, chooseLabels)}
            </div>
          </Descriptions.Item>}
        </Descriptions>
      </div>
      <PhoneView list={newMedias} />
    </div>
  }

  renderFilterConsumber = (data, chooseLabels) => {
    const { sex = '', searchBeginTime, searchEndTime } = data
    return <Descriptions column={1} colon={false}>
      <Descriptions.Item label="客户性别">
        {sex && sex.indexOf(-1) > -1 ? '全部' : sex.split(',').map((v) => sexOptions[v]).join('、')}
      </Descriptions.Item>
      <Descriptions.Item label="添加日期">
        {searchBeginTime}{searchBeginTime && '-'}{searchEndTime}
      </Descriptions.Item>
      <Descriptions.Item label="客户标签">
        {chooseLabels?.map((v) => v.name).join('、')}
      </Descriptions.Item>
    </Descriptions>
  }

  renderDataBoard = () => {
    const { massSendData = {}, massSendInfo } = this.state
    const { type } = massSendInfo
    const { memberSendCount, memberUnSendCount, userSendCount, userUnSendCount, userUnReceivedByUpLimitCount, userUnReceivedByDeleteCount } = massSendData
    let span = 4
    if (type == 2) span = 6 // 群群发群发
    return <Row className="data-board-row" gutter={12}>
      <Col span={span}>
        <div className="col-content">
          <div className="col-content-title">{type == 2 ? '已发送群主' : '已发送成员'}</div>
          <div className="col-content-data">{memberSendCount}</div>
        </div>
      </Col>
      <Col span={span}>
        <div className="col-content">
          <div className="col-content-title">{type == 2 ? '未发送群主' : '未发送成员'}</div>
          <div className="col-content-data">{memberUnSendCount}</div>
        </div>
      </Col>
      <Col span={span}>
        <div className="col-content">
          <div className="col-content-title">{type == 2 ? '已送达群聊' : '已送达客户'}</div>
          <div className="col-content-data">{userSendCount}</div>
        </div>
      </Col>
      <Col span={span}>
        <div className="col-content">
          <div className="col-content-title">{type == 2 ? '未送达群聊' : '未送达客户'}</div>
          <div className="col-content-data">{userUnSendCount}</div>
        </div>
      </Col>
      {type == 1 && <>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">客户接收已达上限</div>
            <div className="col-content-data">{userUnReceivedByUpLimitCount}</div>
          </div>
        </Col>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">因不是好友发送失败</div>
            <div className="col-content-data">{userUnReceivedByDeleteCount}</div>
          </div>
        </Col>
      </>}
    </Row>
  }

  activeKeyChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }

  renderInfoTable = () => {
    const { massSendInfo, activeKey } = this.state
    const { type } = massSendInfo
    const { id } = this.props
    return <Tabs style={{ marginTop: '32px' }} destroyInactiveTabPane onChange={this.activeKeyChange} activeKey={String(activeKey)} className="info-table-tabs scrm-tabs">
      <TabPane tab={type == 1 ? '成员详情' : '按群主查看'} key="1">
        {type == 1 && <MassSendTable infoId={id} tableType={activeKey} />}
        {type == 2 && <GroupMassSendTable infoId={id} tableType={activeKey} />}
      </TabPane>
      <TabPane tab={type == 1 ? '客户详情' : '按群聊查看'} key="2">
        {type == 1 && <MassSendTable infoId={id} tableType={activeKey} />}
        {type == 2 && <GroupMassSendTable infoId={id} tableType={activeKey} />}
      </TabPane>
    </Tabs>
  }

  render() {
    const { visible, loading } = this.state
    return <Drawer
      closable={false}
      title="群发任务详情"
      visible={visible}
      width={912}
      onClose={() => {
        this.setState({
          visible: false
        })
      }}
      className="custome-mass-send-drawer"
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
      <Spin spinning={loading}>
        <div className="page-label">群发详情</div>
        <Divider style={{ margin: '8px 0 0' }} />
        {this.renderBasicsInfo()}
        {this.renderMassContent()}
        <div className="page-label">数据统计</div>
        <Divider style={{ margin: '8px 0 16px 0' }} />
        {this.renderDataBoard()}
        {this.renderInfoTable()}
      </Spin>
    </Drawer>
  }
}

Index.propTypes = {}

export default Index
