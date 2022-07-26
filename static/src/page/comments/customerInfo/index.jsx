import React, { Component } from 'react'
import { Drawer, Row, Col, Descriptions, Tabs, Collapse, Image, Avatar, Tag, message, Popover } from 'antd'
import RsIcon from '@RsIcon'
import moment from 'moment'
import Modal from '@Modal'
import Api from './api'
import { getMenuTree } from '../../../utils/Util'
import CustomerEventList from './customerEventList'
import CustomerFollowLogList from './customerFollowLogList'
import CustomTagNew from '../publicView/customTagNew'
import ClientInfo from './comment/index'
import './index.less'

const { TabPane } = Tabs
const { Panel } = Collapse
// 1:普通客户;2:意向客户;3:成交客户;4:多次成交;5:无效
// const userStageList = {
//   1: '普通客户',
//   2: '意向客户',
//   3: '成交客户',
//   4: '多次成交',
//   5: '无效',
// }
// 1：未成交:2：已成交:3：多次成交:4：已到期
// const dealFlagList = {
//   1: '未成交',
//   2: '已成交',
//   3: '多次成交',
//   4: '已到期',
// }
// 11 广告投放、12渠道活码、13营销素材、14运营活动、15渠道代理、16公司资源、17转介绍、18个人开发、19其他
// 11-官网、12-App、13-客户中心（系统/自建）、14-百度营销、15-巨量引擎、16-腾讯广点通、17-企业微信、18-微信公众号（粉丝数据）、19-微信小程序、20-微信客服、21-有赞、22-抖店
// const sourceList = {
//   11: '官网',
//   12: 'App',
//   13: '客户中心（系统/自建',
//   14: '百度营销',
//   15: '巨量引擎',
//   16: '腾讯广点通',
//   17: '企业微信',
//   18: '微信公众号',
//   19: '微信小程序',
//   20: '微信客服',
//   21: '有赞',
//   22: '抖店',
// }

// 0-未知 1-男性 2-女性
// const genderList = {
//   1: '男性',
//   2: '女性',
//   0: '未知',
// }

// 客户资料需要展示的模块字段：1-基础信息；2-联系信息；3-业务信息；4-系统信息；5-业务信息；6-公域信息；',
const categoryTypeList = {
  1: '基础信息',
  2: '联系信息',
  3: '业务信息',
  4: '系统信息',
  // 5: '业务信息',
  // 6: '公域信息',
}

const getTagList = (data) => {
  let taglist = []
  if (data && data.length > 0) {
    taglist = data.map((item) => {
      item.labelGroupId = item.labelGroupId || item.id
      return item
    })
  }
  return taglist
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    // 父组件外部调用对象
    this.props.onParent && this.props.onParent(this)

    const {
      userInfo: { companyId },
    } = getMenuTree(MENUDATA)
    this.setState(
      {
        companyId,
      },
      this.getDataListByCompanyId
    )
    this.getCustomerInfoById()
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   nextProps.onParent && nextProps.onParent(this)
  //   return prevState
  // }

  optionInfo = (value, id) => {
    this.setState({
      visible: value,
    })
    if (id) {
      this.getCustomerInfoById()
    }
  }

  getInitialState() {
    return {
      rightActiveKey: '1',
      customerInfoKeys: {},
      visible: false,
    }
  }

  getDataListByCompanyId = () => {
    const { companyId } = this.state
    Api.getDataListByCompanyId(companyId).then((res) => {
      const customerAttribute = res.data
      const categoryTypes = customerAttribute.map((v) => v.categoryType)
      const customerInfoKeys = {}
      Array.from(new Set(categoryTypes)).forEach((v) => {
        const customerInfoKey = customerAttribute.filter((item) => item.categoryType == v && item.hiddenFlag == 1)
        customerInfoKeys[v] = customerInfoKey
      })
      this.setState({
        customerInfoKeys,
      })
    })
  }

  getCustomerInfoById = () => {
    const { id } = this.props
    if (id) {
      Api.getCustomerInfoById(id).then((res) => {
        this.setState({
          customerInfo: res.data,
        })
      })
    }
  }

  renderCustomerData = () => {
    const { customerInfoKeys, customerInfo } = this.state

    // 编辑时间回掉
    const { editChange } = this.props
    return (
      <Tabs style={{ width: '312px' }} type="card">
        <TabPane
          tab={
            <div
              onClick={() => {
                editChange && editChange(customerInfo)
              }}
            >
              客户资料
              {editChange && <RsIcon style={{ marginLeft: '5px' }} type="icon-bianji" />}
            </div>
          }
          key="1"
          style={{ overflow: 'auto' }}
        >
          <Collapse
            expandIcon={(panelProps) => (
              <RsIcon
                type="icon-jiantouyou"
                style={{
                  transform: `rotate(${panelProps.isActive ? 90 : -90}deg)`,
                  border: '1px solid #E1E8F0',
                  padding: '2px',
                  right: 0,
                  top: '25%',
                }}
              />
            )}
            className="customer-info-collapse"
            ghost
            expandIconPosition="right"
            defaultActiveKey={Object.keys(categoryTypeList).map((v) => v)}
          >
            {Object.keys(categoryTypeList).map((v) => {
              const list = customerInfoKeys[v]
              const name = categoryTypeList[v]
              if (!list || !list.length) return null
              return (
                <Panel header={name} key={v}>
                  <Descriptions className="customer-panel-descript" colon={false} column={1}>
                    {list.map((item) => (
                      <Descriptions.Item className="flex-warp" label={item.columnName}>
                        {this.renderDescriptionsItem(item)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Panel>
              )
            })}
          </Collapse>
        </TabPane>
      </Tabs>
    )
  }

  handleChangeRightKey = (rightActiveKey) => {
    this.setState({
      rightActiveKey,
    })
  }

  renderAddUser = (data, marginBottom) => {
    if (!data || !data.length) return null
    return data.map((v) => {
      const { name, avatar } = v
      return (
        <div style={{ display: 'inline-block', marginRight: '5px', marginBottom }}>
          <Avatar style={{ marginRight: '4px' }} size={24} src={avatar} />
          {name}
        </div>
      )
    })
  }

  renderAddLabels = (data, marginBottom) => {
    if (!data || !data.length) return null
    return data.map((v) => {
      const { name } = v
      return <Tag style={{ marginBottom }}>{name}</Tag>
    })
  }

  renderDescriptionsItem = (item) => {
    // columnType 为2的需要转中文
    const { customerInfo = {} } = this.state
    const { columnValue, columnType } = item
    const showValue = customerInfo[columnValue]
    if (columnValue == 'followList' && showValue) {
      return showValue.map((v) => {
        const { name, avatar } = v
        return (
          <div style={{ margin: '0 5px 5px 0' }}>
            <Avatar style={{ marginRight: '4px' }} size={24} src={avatar} />
            {name}
          </div>
        )
      })
    }
    if (['updateTime', 'createTime', 'orderDateMillisecond'].indexOf(columnValue) > -1 && showValue) {
      return moment(showValue).format('YYYY-MM-DD HH:mm:ss')
    }
    if (columnValue == 'avatar' && showValue) {
      return <Avatar size={24} src={showValue} />
    }
    if (columnType == 2) {
      return customerInfo[`${columnValue}_zc`]
    }
    return showValue
  }

  // 客户打标签
  handelTag = (data, oldTag = [], uerInfo = {}) => {
    const tagData = data?.tagList?.map((item) => item)
    const param = {
      externalUserInfoId: uerInfo.id,
      addTagString: '',
      removeTagString: '',
    }
    const removeTag = []

    // oldTag 依赖数据库返回可能是null
    oldTag = oldTag || []

    oldTag.forEach((item) => {
      let isAddRomve = true
      tagData.forEach((tagItem, index) => {
        if (tagItem.id == item.id) {
          // 如果旧的的id 在新增里面 旧的id没有删除 isAddRomve=false旧的id 不添加
          isAddRomve = false
          //
          tagData.splice(index, 1) // 移除当前id 留下的都是添加id
        }
      })
      if (isAddRomve) {
        removeTag.push(item.id)
      }
    })

    param.addTagString = tagData.map((item) => item.id).join(',')
    param.removeTagString = removeTag.join(',')
    const { customerInfo = {} } = this.state
    customerInfo.mainFollowLabelList = tagData
    Api.updateCustomerTag(param).then((res) => {
      if (res.retCode == 200) {
        message.success('操作成功')
        this.setState({
          customerInfo,
        })
      }
    })
  }

  // 删除客户
  deleteCustomerByCustomerId = () => {
    const { id, deleteCallBack } = this.props
    return new Promise((resolve, reject) => {
      Api.deleteCustomerByCustomerId(id)
        .then(() => {
          resolve()
          deleteCallBack()
        })
        .catch(() => reject())
    })
  }

  handleChangeVisible = (modalType) => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
      modalType,
    }))
  }

  renderDeleteModal = () => (
    <Modal
      visible
      onOk={this.deleteCustomerByCustomerId}
      title="删除客户"
      type="delete"
      onCancel={this.handleChangeVisible}
    >
      确认删除选中的客户？删除后，此操作将无法恢复。
    </Modal>
  )

  render() {
    const { id, deleteCallBack } = this.props
    const { customerInfo = {}, rightActiveKey, visible, modalVisible, modalType } = this.state
    if (!id) return null
    const {
      name,
      phone,
      email,
      avatar,
      type,
      corpName,
      followList = [],
      mainFollowInfo = {},
      labelCountList = [],
      mainFollowLabelList = [],
    } = customerInfo
    return (
      <>
        <Drawer
          closable={false}
          title="客户详情"
          visible={visible}
          width={912}
          maskClosable
          onClose={() => this.optionInfo(false)}
          className="customer-info-drawer"
          extra={
            <RsIcon
              onClick={() => {
                // 关闭按钮的回掉
                // onCancelDrawer()
                // onRefresh()
                this.optionInfo(false)
              }}
              style={{ fontSize: '16px', cursor: 'pointer' }}
              type="icon-guanbi"
            />
          }
        >
          {/* 客户基本信息 */}
          <div className="customer-info-drawer-header">
            <Row>
              <Col
                span={24}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', justifyContent: 'space-between' }}
              >
                <div className="customer-name-avatar">
                  {avatar ? (
                    <Image className="avatar-image" preview={false} width={40} src={avatar} />
                  ) :
                    (
                      <div className="avatar">
                        <RsIcon type="icon-morentouxiang" />
                      </div>
                    )}
                  <div className="customer-name">{name}</div>
                  {[1, 2].indexOf(type) > -1 && <div className="customer-type">@{type == 1 ? '微信' : corpName}</div>}
                </div>
                <div className="select-row-div" style={{ marginBottom: 0 }}>
                  {/* <span
                    onClick={() => {
                      console.log('添加标签')
                    }}
                    style={{ display: 'none' }}
                    className="select-col-div"
                  >
                    添加标签
                  </span> */}
                  {mainFollowInfo?.id && (
                    <CustomTagNew
                      value={{ tagList: getTagList(mainFollowLabelList) }}
                      onChange={(data) => this.handelTag(data, mainFollowLabelList, mainFollowInfo)}
                    >
                      <span className="select-col-div padl8">添加标签</span>
                    </CustomTagNew>
                  )}
                  {deleteCallBack && <span
                    onClick={() => this.handleChangeVisible('删除')}
                    style={{ padding: '0 12px' }}
                    className="select-col-div"
                  >
                    删除
                  </span>}
                </div>
              </Col>
              <Descriptions colon={false} column={2} className="qiwei-info">
                <Descriptions.Item className="no-warp add-label" label="标签汇总">
                  <Popover content={this.renderAddLabels(labelCountList, 8)}>
                    <div className="box-clamp-1">{this.renderAddLabels(labelCountList)}</div>
                  </Popover>
                </Descriptions.Item>
                <Descriptions.Item className="no-warp add-user" label="企微标签">
                  <>
                    <Popover content={this.renderAddLabels(mainFollowLabelList, 8)}>
                      <div className="box-clamp-1">{this.renderAddLabels(mainFollowLabelList)}</div>
                    </Popover>
                    {mainFollowInfo?.id && (
                      <CustomTagNew
                        value={{ tagList: getTagList(mainFollowLabelList) }}
                        onChange={(data) => this.handelTag(data, mainFollowLabelList, mainFollowInfo)}
                      >
                        <RsIcon style={{ marginLeft: '5px' }} type="icon-bianji" />
                      </CustomTagNew>
                    )}
                  </>
                </Descriptions.Item>
              </Descriptions>
              <Descriptions column={4}>
                <Descriptions.Item label="手机">{phone}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
                <Descriptions.Item label="微信昵称">{name}</Descriptions.Item>
                <Descriptions.Item label="已添加企微成员">
                  <Popover content={this.renderAddUser(followList, 8)}>
                    <div className="box-clamp-1">{this.renderAddUser(followList)}</div>
                  </Popover>
                </Descriptions.Item>
              </Descriptions>
            </Row>
          </div>
          {/* 客户资料 */}
          <div style={{ display: 'flex', marginTop: '8px', flex: 1, overflow: 'hidden' }}>
            {this.renderCustomerData()}
            <Tabs
              onChange={this.handleChangeRightKey}
              style={{ width: '600px' }}
              activeKey={rightActiveKey}
              type="card"
            >
              <TabPane tab="跟进记录" key="1">
                {rightActiveKey == 1 && <CustomerFollowLogList customerId={id} />}
              </TabPane>
              <TabPane tab="客户动态" key="2">
                {rightActiveKey == 2 && <CustomerEventList customerId={id} />}
              </TabPane>
              {/* <TabPane tab="线索动态" key="3"> 先不做
              <Card title="线索动态">线索动态</Card>
            </TabPane> */}
              <TabPane tab="会话记录" key="3">
                {rightActiveKey == 3 && customerInfo.id ? (
                  <div className="m24 bgList-panel">
                    <ClientInfo info={customerInfo} />
                  </div>
                ) : null}
              </TabPane>
            </Tabs>
          </div>
        </Drawer>
        {modalVisible && modalType == '删除' && this.renderDeleteModal()}
      </>
    )
  }
}

Index.propTypes = {}

export default Index
