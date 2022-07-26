import React, { Component } from 'react'
import { Select, Space } from 'antd'
import Api from './api'

import './index.less'

const { Option } = Select

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.initData()
  }

  UNSAFE_componentWillReceiveProps(nextPorps) {
    const { cityLevel, value } = this.props
    if (cityLevel != nextPorps.cityLevel || value != nextPorps.value) {
      this.initData(nextPorps)
    }
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  initData = ({ cityLevel = 4, value } = this.props) => {
    if (value) {
      const cityCodes = value.split('-')
      this.setState(
        {
          contactProvinces: cityCodes[0] == 'null' ? undefined : cityCodes[0],
          contactCounty: cityCodes[2] == 'null' ? undefined : cityCodes[2],
          contactCity: cityCodes[1] == 'null' ? undefined : cityCodes[1],
          township: cityLevel == 4 ? cityCodes[3] == 'null' ? undefined : cityCodes[3] : undefined,
        },
        () => {
          const { contactProvinces, contactCity } = this.state
          if (contactProvinces) {
            this.getAreaList({
              provincesId: contactProvinces,
              level: 2
            })
          }
          if (contactCity) {
            this.getAreaList({
              provincesId: contactCity,
              level: 3
            })
          }
        }
      )
    }
    this.getAreaList({
      level: 1,
      provincesId: ''
    })
  }

  getInitialState() {
    return {
      allProvinces: [], // 城市省份list
      cityList: [], // 省份下市级list
      countyList: [], // 市级下县级list
      townshipList: [], // 县级下镇街道list
      contactProvinces: undefined, // 省id
      contactCounty: undefined, // 县级id
      contactCity: undefined, // 市级id
      township: undefined, // 街道id
    }
  }

  // 获取省份
  getAreaList = (param) => {
    const { cityLevel = 4 } = this.props
    if (param.level > cityLevel) return
    Api.getAreaList(param).then((res) => {
      const { level } = param || {}
      const obj = {}
      if (level == 1) {
        obj.allProvinces = res.data
      } else if (level == 2) {
        obj.cityList = res.data
      } else if (level == 3) {
        obj.countyList = res.data
      } else if (level == 4) {
        obj.townshipList = res.data
      }
      this.setState(obj)
    })
  }

  renderOption = (data) =>
    data.map((v) => (
      <Option title={v.name} key={v.id} value={String(v.id)}>
        {v.name}
      </Option>
    ))

  handleChangeCode = (code, id = '') => {
    const { onChange, cityLevel = 4 } = this.props
    const { contactProvinces, contactCity, contactCounty } = this.state
    const param = {
      [code]: id,
    }
    let codes = ''
    if (code == 'contactProvinces') {
      param.contactCity = undefined
      param.contactCounty = undefined
      param.township = undefined
      this.getAreaList({
        provincesId: id,
        level: 2
      })
      codes = id || ''
    } else if (code == 'contactCity') {
      param.contactCounty = undefined
      param.township = undefined
      this.getAreaList({
        provincesId: id,
        level: 3
      })
      codes = `${contactProvinces}-${id}`
    } else if (code == 'contactCounty') {
      codes = `${contactProvinces}-${contactCity}-${id}`
      param.township = undefined
      cityLevel == 4 && this.getAreaList({
        provincesId: id,
        level: 4
      })
    } else if (code == 'township') {
      codes = `${contactProvinces}-${contactCity}-${contactCounty}-${id}`
    }
    if (onChange) onChange(codes)
    this.setState(param)
  }

  render() {
    const { allProvinces, contactProvinces, contactCounty, contactCity, cityList, countyList, township, townshipList } = this.state
    const { cityLevel = 4 } = this.props
    return (
      <Space className={`city-cascader-space city-cascader-space-${cityLevel}`} style={{ width: '100%' }}>
        <Select
          onChange={(value) => this.handleChangeCode('contactProvinces', value)}
          value={contactProvinces || undefined}
          placeholder="请选择省 / 直辖市"
          showSearch
          optionFilterProp="title"
          allowClear
          style={{ width: '100%' }}
        >
          {this.renderOption(allProvinces)}
        </Select>
        {cityLevel != 1 && <Select
          onChange={(value) => this.handleChangeCode('contactCity', value)}
          value={contactCity || undefined}
          placeholder="请选择市 / 直辖市"
          showSearch
          optionFilterProp="title"
          allowClear
          style={{ width: '100%' }}
        >
          {this.renderOption(cityList)}
        </Select>}
        {cityLevel > 2 && <Select
          onChange={(value) => this.handleChangeCode('contactCounty', value)}
          value={contactCounty || undefined}
          placeholder="请选择区 / 县"
          showSearch
          optionFilterProp="title"
          allowClear
          style={{ width: '100%' }}
        >
          {this.renderOption(countyList)}
        </Select>}
        {cityLevel == 4 && <Select
          onChange={(value) => this.handleChangeCode('township', value)}
          value={township || undefined}
          placeholder="请选择"
          showSearch
          optionFilterProp="title"
          allowClear
          style={{ width: '100%' }}
        >
          {this.renderOption(townshipList)}
        </Select>}
      </Space>
    )
  }
}

Index.propTypes = {}

export default Index
