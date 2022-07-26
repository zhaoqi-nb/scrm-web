import React, { Component } from 'react'
import { Radio, Input } from 'antd'
import { isEmpty } from 'lodash'
import DataList from './comments/DataList'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  dataRef = React.createRef()

  componentDidMount() { }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  UNSAFE_componentWillReceiveProps(nextPorps) {
    const { value } = this.props
    if (JSON.stringify(value) != JSON.stringify(nextPorps.value)) {
      this.setState(this.getInitialState(nextPorps))
    }
  }

  getInitialState({ value } = this.props) {
    return {
      currentValue: !isEmpty(value) ? value : { fileType: 'text' }
    }
  }

  radioChange = (fileType) => {
    this.setState({
      currentValue: { fileType }
    }, () => {
      const { currentValue } = this.state
      this.props.onChange(currentValue)
    })
  }

  onChangeText = (value) => {
    const { fileType } = this.state.currentValue
    this.setState({
      currentValue: {
        fileType,
        [fileType]: {
          content: value
        },
        textValue: value
      }
    }, () => {
      const { currentValue } = this.state
      this.props.onChange(currentValue)
    })
  }

  uploadChange = (e) => {
    const { fileType } = this.state.currentValue
    const param = {}
    if (fileType != 'link') {
      param.name = e.fileName
      param.size = e.fileSize
      param.url = e.url
    }
    this.setState({
      currentValue: {
        fileType,
        [fileType]: param,
        ...e,
      }
    }, () => {
      const { currentValue } = this.state
      this.props.onChange(currentValue)
    })
  }

  render() {
    const { currentValue } = this.state
    const { fileType } = currentValue
    const textValue = currentValue[fileType]?.content
    return <div className="tree-components">
      <div className="term-type">
        <div style={{ marginRight: '12px' }}>选择话术类型</div>
        <Radio.Group
          value={fileType}
          onChange={(e) => {
            this.radioChange(e.target.value)
          }}
        >
          <Radio value="text">文字</Radio>
          <Radio value="img">图片</Radio>
          {/* <Radio value="link">链接</Radio>
          <Radio value="file">文件</Radio>
          <Radio value="video">视频</Radio> */}
        </Radio.Group>
      </div>
      <div className="term-concent">
        {fileType == 'text' ?
          <Input.TextArea
            value={textValue}
            onChange={(e) => {
              this.onChangeText(e.target.value)
            }}
            autoSize={{ minRows: 4, maxRows: 8 }}
          /> :
          <DataList
            optionData={currentValue}
            ref={this.dataRef}
            onChange={this.uploadChange}
          />}
      </div>
    </div>
  }
}

Index.propTypes = {}

export default Index
