import React, { Component } from 'react'
import { Input, Popover, Form, TreeSelect, Select, Row, Col, DatePicker, Button } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import moment from 'moment'
import { setValues } from './store/action'

import './index.less'

const { Option } = Select
const { RangePicker } = DatePicker

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() { }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      name: '',
    }
  }

  handleChangeName = (name) => {
    this.setState({
      name,
    })
  }

  handleSearch = (cluesNameOrPhoneOrLandline) => {
    this.props.setValues({
      cluesNameOrPhoneOrLandline,
    })
  }

  handleClickSpan = (e) => {
    const value = e.target.getAttribute('value')
    const param = {}
    const { willExpiredFlag, cluesDistributeType } = this.props
    if (value) {
      switch (value) {
        case '1':
          param.cluesDistributeType = cluesDistributeType == 1 ? '' : 1
          break
        case '2':
          param.cluesDistributeType = cluesDistributeType == 2 ? '' : 2
          break
        case '3':
          param.cluesDistributeType = cluesDistributeType == 3 ? '' : 3
          break
        case '4':
          param.cluesDistributeType = cluesDistributeType == 4 ? '' : 4
          break
        case 'willExpiredFlag':
          param.willExpiredFlag = !willExpiredFlag
          break
        default:
          break
      }
      this.props.setValues(param)
    }
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  handleFinish = (values) => {
    const format = 'YYYY-MM-DD'
    const { createCluesTime, lastFollowCluesTime } = values
    if (createCluesTime && createCluesTime[0] && createCluesTime[1]) {
      values.createCluesStartTime = moment(createCluesTime[0]).format(format)
      values.createCluesEndTime = moment(createCluesTime[1]).format(format)
    }
    if (lastFollowCluesTime && lastFollowCluesTime[0] && lastFollowCluesTime[1]) {
      values.lastFollowCluesStartTime = moment(lastFollowCluesTime[0]).format(format)
      values.lastFollowCluesEndTime = moment(lastFollowCluesTime[1]).format(format)
    }
    delete values.createCluesTime
    delete values.lastFollowCluesTime
    this.props.setValues({ ...values })
    this.setState({
      popoverVisible: false,
    })
  }

  renderUserOption = () => {
    const { memberInfoListByDepart = [] } = this.props
    const userIds = []
    const dataList = memberInfoListByDepart.reduce((prev, cur) => {
      const { userId, userName } = cur
      if (userIds.indexOf(userId) == -1) {
        userIds.push(userId)
        prev.push({
          userId,
          userName,
        })
      }
      return prev
    }, [])
    return dataList.map((v) => (
      <Option title={v.userName} value={v.userId} key={v.userId}>
        {v.userName}
      </Option>
    ))
  }

  // 重置筛选项
  handleInitFormValue = () => {
    const { filterInitValue } = this.props
    const resetFields = Object.keys(filterInitValue)
    this.formRef.current.resetFields(resetFields)
    this.props.setValues({ ...filterInitValue })
    this.setState({
      popoverVisible: false,
    })
  }

  renderFilterContent = () => {
    const { departList, cluesSourceTypeList, cluesChannelsTypeInfo, followStatusList, filterInitValue } = this.props
    return (
      <Form
        // layout="inline"
        preserve={false}
        labelAlign="right"
        ref={this.formRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelWrap
        initialValues={filterInitValue}
        onFinish={this.handleFinish}
      >
        <Row>
          <Col span={10}>
            <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} name="belongDepartId" label="所属部门">
              <TreeSelect
                dropdownMatchSelectWidth={false}
                showSearch
                treeNodeFilterProp="title"
                showArrow
                treeDefaultExpandAll
                placeholder="请选择部门"
                treeData={departList}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="mainFollowMemberId" label="线索负责人">
              <Select optionFilterProp="title" placeholder="请选择">
                <Option title="" value="">
                  全部
                </Option>
                {this.renderUserOption()}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="来源" name="cluesSourceType">
              <Select placeholder="请选择">
                <Option value="">全部</Option>
                {this.renderFormOption(cluesSourceTypeList)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} label="创建时间" name="createCluesTime">
              <RangePicker style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="createId" label="创建人">
              <Select optionFilterProp="title" placeholder="请选择">
                <Option title="" value="">
                  全部
                </Option>
                {this.renderUserOption()}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="来源渠道" name="cluesChannelsType">
              <Select placeholder="请选择">
                <Option value="">全部</Option>
                {this.renderFormOption(cluesChannelsTypeInfo)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} label="最后跟进时间" name="lastFollowCluesTime">
              <RangePicker style={{ width: '100%' }} suffixIcon={<RsIcon type="icon-riqi" />} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="跟进状态" name="followStatus">
              <Select placeholder="请选择">
                <Option value="">全部</Option>
                {this.renderFormOption(followStatusList)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div className="filter-content-footer">
          <Button onClick={this.handleInitFormValue} style={{ marginRight: '8px' }} type="text">
            重置
          </Button>
          <Button htmlType="submit" type="primary">
            查询
          </Button>
        </div>
      </Form>
    )
  }

  handlePopoverVisibleChange = (visible) => {
    this.setState({
      popoverVisible: visible,
    })
  }

  handleChangeSelect = (value, code) => {
    this.props.setValues({
      [code]: value
    })
  }

  render() {
    const { name, popoverVisible } = this.state
    const { willExpiredFlag, cluesDistributeType, industryList, regionList } = this.props
    return (
      <div style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center' }}>
        <Input
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '240px' }}
          placeholder="输入姓名、电话、座机"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ margin: '0 8px 0 24px' }}>快速筛选</span>
          <div onClick={this.handleClickSpan} className="filter-warp">
            <span className={willExpiredFlag ? 'filter-warp-select' : ''} value="willExpiredFlag">
              即将被收回的线索
            </span>
            <span className={cluesDistributeType == 4 ? 'filter-warp-select' : ''} value={4}>
              新的线索
            </span>
            <span className={cluesDistributeType == 1 ? 'filter-warp-select' : ''} value={1}>
              转移的线索
            </span>
            <span className={cluesDistributeType == 2 ? 'filter-warp-select' : ''} value={2}>
              分配的线索
            </span>
            <span className={cluesDistributeType == 3 ? 'filter-warp-select' : ''} value={3}>
              提取的线索
            </span>
            <Popover
              overlayStyle={{ width: '732px' }}
              placement="bottom"
              trigger="click"
              visible={popoverVisible}
              overlayClassName="filter-popover"
              content={this.renderFilterContent}
              onVisibleChange={this.handlePopoverVisibleChange}
            >
              <span className="filter-warp-filter-select">
                <RsIcon style={{ marginRight: '8px' }} type="icon-shaixuan" />
                自定义筛选
              </span>
            </Popover>
          </div>
        </div>
        <div>
          <span className="f-title" style={{ width: '70px' }}>所属行业</span>
          <Select allowClear placeholder="请选择" style={{ width: '120px' }} onChange={(value) => this.handleChangeSelect(value, 'industry')}>
            <Option value="" key="全部">全部</Option>
            {industryList.map((item) => <Option value={item} key={item}>{item}</Option>)}
          </Select>
        </div>
        <div style={{ marginLeft: '12px' }}>
          <span className="f-title" style={{ width: '70px' }}>所属国家</span>
          <Select allowClear placeholder="请选择" style={{ width: '120px' }} onChange={(value) => this.handleChangeSelect(value, 'countries')}>
            {regionList.map((item) => <Option value={item.code} key={item.code}>{item.name}</Option>)}
          </Select>
        </div>
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    cluesDistributeType: state.followupClue.cluesDistributeType,
    willExpiredFlag: state.followupClue.willExpiredFlag,
    cluesSourceTypeList: state.commonLayout.cluesSourceTypeList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    followStatusList: state.commonLayout.followStatusList,
    filterInitValue: state.followupClue.filterInitValue,
    departList: state.followupClue.departList,
    memberInfoListByDepart: state.followupClue.memberInfoListByDepart,
    industryList: state.commonLayout.industryList,
    regionList: state.commonLayout.regionList,
  }),
  { setValues }
)(Index)
