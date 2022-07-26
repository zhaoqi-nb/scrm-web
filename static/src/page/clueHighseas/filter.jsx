import React, { Component } from 'react'
import { Input, Popover, Form, Select, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import { setValues } from './store/action'

import './index.less'

const { Option } = Select

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

  handleSearch = (name) => {
    this.props.setValues({
      name,
    })
  }

  renderFormOption = (data) =>
    Object.keys(data).map((v) => (
      <Option key={v} value={v}>
        {data[v]}
      </Option>
    ))

  handleFinish = (values) => {
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
    // 姓名，公司名称，线索来源，来源渠道，最后维护人
    const { cluesSourceTypeList, cluesChannelsTypeInfo, filterInitValue } = this.props
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
          <Col span={8}>
            <Form.Item name="companyName" label="公司名称">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="contactAddressInfo" label="详细地址">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="来源" name="cluesSourceType">
              <Select placeholder="请选择">
                <Option value="">全部</Option>
                {this.renderFormOption(cluesSourceTypeList)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="updateId" label="最后维护人">
              <Select showSearch filterOption optionFilterProp="title" placeholder="请选择">
                {this.renderUserOption()}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="来源渠道" name="cluesChannelsType">
              <Select placeholder="请选择">
                <Option value="">全部</Option>
                {this.renderFormOption(cluesChannelsTypeInfo)}
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
    const { industryList, regionList } = this.props
    return (
      <div style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center' }}>
        <Input
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '240px' }}
          placeholder="输入姓名"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <div className="filter-warp" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {/* <span style={{ margin: '0 8px 0 24px' }}></span> */}
          <Popover
            overlayStyle={{ paddingTop: '0px', width: '800px' }}
            placement="bottom"
            trigger="click"
            visible={popoverVisible}
            overlayClassName="filter-popover"
            content={this.renderFilterContent}
            onVisibleChange={this.handlePopoverVisibleChange}
          >
            <span style={{ marginRight: '8px', marginLeft: '8px' }} className="filter-warp-filter-select">
              <RsIcon style={{ marginRight: '8px' }} type="icon-shaixuan" />
              自定义筛选
            </span>
          </Popover>
        </div>
        <div>
          <span className="f-title" style={{ width: '70px' }}>所属行业</span>
          <Select placeholder="请选择" style={{ width: '120px' }} onChange={(value) => this.handleChangeSelect(value, 'industry')}>
            <Option value="" key="全部">全部</Option>
            {industryList.map((item) => <Option value={item} key={item}>{item}</Option>)}
          </Select>
        </div>
        <div style={{ marginLeft: '12px' }}>
          <span className="f-title" style={{ width: '70px' }}>所属国家</span>
          <Select placeholder="请选择" style={{ width: '120px' }} onChange={(value) => this.handleChangeSelect(value, 'countries')}>
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
    cluesDistributeType: state.clueHighseas.cluesDistributeType,
    willExpiredFlag: state.clueHighseas.willExpiredFlag,
    cluesSourceTypeList: state.commonLayout.cluesSourceTypeList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    followStatusList: state.commonLayout.followStatusList,
    filterInitValue: state.clueHighseas.filterInitValue,
    departList: state.clueHighseas.departList,
    memberInfoListByDepart: state.clueHighseas.memberInfoListByDepart,
    industryList: state.commonLayout.industryList,
    regionList: state.commonLayout.regionList,
  }),
  { setValues }
)(Index)
