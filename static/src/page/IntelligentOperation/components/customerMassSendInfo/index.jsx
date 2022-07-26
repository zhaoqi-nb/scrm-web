/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Divider, Descriptions, Spin, Image, Row, Col } from 'antd'
import RsIcon from '@RsIcon'
import Api from './api'
import MassSendTable from './massSendTable'
import GroupMassSendTable from './groupMassSendTable'

import './index.less'

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
  0: '未知',
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
      activeKey: 1,
    }
  }

  getDetail = () => {
    const { data } = this.props
    const { id } = data
    this.setState({
      loading: true,
    })
    Api.getDetail({ id })
      .then((res) => {
        this.setState({
          massSendInfo: res.data,
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  getDataIndex = () => {
    const { data } = this.props
    const { id } = data
    Api.getDataIndex({ id }).then((res) => {
      this.setState({
        massSendData: res.data,
      })
    })
  }

  transformMedias = (data) =>
    data.map((v) => ({
      ...v,
      fileType: PhoneViewTypes[v.type],
      textValue: v.content,
      url: v.filePath,
      link: v.content, // 链接为content
      fileExactSize: v.fileSize,
    }))

  // 群发内容解析
  renderContentInfo = (data) =>
    data.map((v, index) => {
      const { fileType, textValue, link, filePath } = v
      return (
        <div style={{ marginBottom: '8px' }}>
          <div className="file-type-label">
            {index + 1}.{fileTypeText[fileType]}
          </div>
          <div>
            {fileType == 'text' && (
              <div className="box1" dangerouslySetInnerHTML={{ __html: textValue?.replace(/\n/g, '<br>') }} />
            )}
            {fileType == 'img' && <Image style={{ borderRadius: '8px' }} width={120} src={filePath} />}
            {fileType == 'file' && <div className="file-box">{renderFile(v)}</div>}
          </div>
        </div>
      )
    })

  renderMassContent = () => {
    const { massSendInfo } = this.state
    const { medias = [], type, filterType, filter, chooseLabels } = massSendInfo
    const newMedias = this.transformMedias(medias)
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Descriptions style={{ marginTop: '8px' }} column={1} colon={false}>
            <Descriptions.Item className="flex-start" label="群发内容">
              <div className="mass-content-div">{this.renderContentInfo(newMedias)}</div>
            </Descriptions.Item>
            {type == 1 && (
              <Descriptions.Item
                labelStyle={{ marginTop: 16 }}
                contentStyle={{ marginTop: 16 }}
                className="flex-start"
                label="群发范围"
              >
                <div className="mass-content-div">
                  {filterType == 0 ? '全部客户' : this.renderFilterConsumber(filter, chooseLabels)}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
    )
  }

  renderFilterConsumber = (data, chooseLabels) => {
    const { sex = '', searchBeginTime, searchEndTime } = data
    return (
      <Descriptions column={1} colon={false}>
        <Descriptions.Item label="客户性别">
          {sex && sex.indexOf(-1) > -1
            ? '全部'
            : sex
                .split(',')
                .map((v) => sexOptions[v])
                .join('、')}
        </Descriptions.Item>
        <Descriptions.Item label="添加日期">
          {searchBeginTime}
          {searchBeginTime && '-'}
          {searchEndTime}
        </Descriptions.Item>
        <Descriptions.Item label="客户标签">{chooseLabels?.map((v) => v.name).join('、')}</Descriptions.Item>
      </Descriptions>
    )
  }

  renderDataBoard = () => {
    const { massSendData = {}, massSendInfo } = this.state
    const { type } = massSendInfo
    const {
      memberSendCount,
      memberUnSendCount,
      userSendCount,
      userUnSendCount,
      userUnReceivedByUpLimitCount,
      userUnReceivedByDeleteCount,
    } = massSendData
    let span = 4
    if (type == 5) span = 6 // 群群发群发
    return (
      <Row className="data-board-row" gutter={12}>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">{type == 5 ? '已发送群主' : '已发送成员'}</div>
            <div className="col-content-data">{memberSendCount}</div>
          </div>
        </Col>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">{type == 5 ? '未发送群主' : '未发送成员'}</div>
            <div className="col-content-data">{memberUnSendCount}</div>
          </div>
        </Col>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">{type == 5 ? '已送达群聊' : '已送达客户'}</div>
            <div className="col-content-data">{userSendCount}</div>
          </div>
        </Col>
        <Col span={span}>
          <div className="col-content">
            <div className="col-content-title">{type == 5 ? '未送达群聊' : '未送达客户'}</div>
            <div className="col-content-data">{userUnSendCount}</div>
          </div>
        </Col>
        {type == 4 && (
          <>
            <Col span={span}>
              <div className="col-content">
                <div className="col-content-title">接收达到上限</div>
                <div className="col-content-data">{userUnReceivedByUpLimitCount}</div>
              </div>
            </Col>
            <Col span={span}>
              <div className="col-content">
                <div className="col-content-title">已不是好友</div>
                <div className="col-content-data">{userUnReceivedByDeleteCount}</div>
              </div>
            </Col>
          </>
        )}
      </Row>
    )
  }

  renderInfoTable = () => {
    const { massSendInfo } = this.state
    const { type } = massSendInfo
    const { data } = this.props
    const { id } = data
    return (
      <div>
        {type === 4 && (
          <div>
            <MassSendTable infoId={id} tableType={1} />
          </div>
        )}
        {type === 5 && (
          <div>
            <GroupMassSendTable infoId={id} tableType={1} />
          </div>
        )}
      </div>
    )
  }

  render() {
    const { loading } = this.state
    return (
      <div>
        <Spin spinning={loading}>
          <div className="page-label">群发详情</div>
          <Divider style={{ margin: '8px 0 0' }} />
          {this.renderMassContent()}
          <div className="page-label">数据统计</div>
          <Divider style={{ margin: '8px 0 16px 0' }} />
          {this.renderDataBoard()}
          {this.renderInfoTable()}
        </Spin>
      </div>
    )
  }
}

Index.propTypes = {}

export default Index
