import React, { Component } from 'react'
import { Image, Input } from 'antd'
import Modal from '@Modal'
import RsIcon from '@RsIcon'
import ConfigTable from '../publicView/table'
import Api from './api'

import './index.less'

const groupCodeTypes = {
  1: '7天码',
  2: '永久活码'
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    const { value } = this.props
    console.log(value)
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  UNSAFE_componentWillReceiveProps(nextPorps) {
    const { value } = this.props
    if (JSON.stringify(value) != JSON.stringify(nextPorps.value) && !value) {
      this.setState({
        selectedRows: [nextPorps.value],
        saveSelectedRows: nextPorps.value,
        preSaveSelectedRows: nextPorps.value
      })
    }
  }

  getInitialState() {
    return {
      columns: [{
        title: '样式',
        dataIndex: 'qrCodeUrl',
        // width: 80,
        render: (text) => <Image src={text || ''} style={{ width: '50px', height: '50px' }} />
      }, {
        title: '群活码名称',
        dataIndex: 'groupCodeName',
      }, {
        title: '群活码类型',
        dataIndex: 'groupCodeType',
        render: (val) => groupCodeTypes[val]
      }, {
        title: '创建人',
        dataIndex: 'createName',
      }],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 项`,
      },
    }
  }

  handleChangeName = (name) => {
    this.setState({
      name
    })
  }

  handleSaveSelectGroup = () => {
    const { selectedRows } = this.state
    // const { selectedRows } = this.state
    if (!selectedRows || !selectedRows.length) return Promise.resolve()
    this.setState({
      saveSelectedRows: selectedRows[0],
      preSaveSelectedRows: selectedRows[0],
    })
    const { onChange } = this.props
    onChange && onChange(selectedRows[0])
    return Promise.resolve()
  }

  handleSearch = (groupCodeName) => {
    const { pagination } = this.state
    this.setState({
      groupCodeName,
      pagination: {
        ...pagination,
        pageSize: pagination.pageSize
      },
    }, this.getCodeTable)
  }

  // 获取群活码
  getCodeTable = () => {
    const { groupCodeName } = this.state
    const { pagination } = this.state
    this.setState({
      isLoading: true,
    })
    Api.getCodeTable({
      groupType: 1,
      groupCodeName,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    }).then((res) => {
      const { list, total } = res.data
      this.setState({
        pagination: {
          ...pagination,
          total,
        },
        dataSource: list,
      })
    }).finally(() => {
      this.setState({
        isLoading: false
      })
    })
  }

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.getCodeTable)
  }

  renderGroupModal = () => {
    const { groupVisible, dataSource, isLoading, columns = [], pagination, name, selectedRowKeys, preSaveSelectedRows } = this.state
    const rowSelection = {
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: selectedKeys,
          preSaveSelectedRows: undefined
        })
      },
      selectedRowKeys: preSaveSelectedRows ? [preSaveSelectedRows.id] : selectedRowKeys
    };
    return <Modal
      onOk={this.handleSaveSelectGroup}
      onCancel={() => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: []
        })
        this.handleShowGroupModal()
      }}
      width={800}
      title="群活码选择"
      visible={groupVisible}
    >
      <Input
        suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
        className="input-search"
        style={{ width: '240px', marginBottom: '16px' }}
        placeholder="请输入群活码名称"
        onPressEnter={(e) => this.handleSearch(e.target.value)}
        onChange={(e) => this.handleChangeName(e.target.value)}
      />
      <ConfigTable
        scroll={{ x: 'max-content', y: 400 }}
        loading={isLoading}
        columns={columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={dataSource}
        pageChange={this.handleChangeTable}
        pagination={pagination}
        rowKey={(record) => record.id}
      />
    </Modal>
  }

  handleShowGroupModal = () => {
    this.setState((state) => ({
      groupVisible: !state.groupVisible,
    }))
  }

  handleDeleteSelect = () => {
    this.setState({
      saveSelectedRows: undefined
    })
    const { onChange } = this.props
    onChange && onChange(undefined)
  }

  render() {
    const { saveSelectedRows, groupVisible, } = this.state
    const { children } = this.props
    const { groupCodeName, groupCodeType, qrCodeUrl } = saveSelectedRows || {}
    // if (!isReady) return null
    return <>
      {saveSelectedRows ?
        <div className="select-group-div">
          <Image src={qrCodeUrl} style={{ width: '120px', height: '120px' }} />
          <div className="select-group-div-info">
            <div>
              <div className="group-Name">{groupCodeName}</div>
              <div style={{ marginTop: 8 }}>{groupCodeTypes[groupCodeType]}</div>
            </div>
            <div>
              <RsIcon
                onClick={() => {
                  this.handleShowGroupModal()
                  this.getCodeTable()
                }}
                style={{ fontSize: '16px' }}
                type="icon-bianji1"
              />
              <RsIcon onClick={this.handleDeleteSelect} style={{ marginLeft: '8px', fontSize: '16px' }} type="icon-shanchu" />
            </div>
          </div>
        </div> :
        children || <div
          onClick={() => {
            this.handleShowGroupModal()
            this.getCodeTable()
          }}
          className="add-form-btn"
        >
          <RsIcon style={{ marginRight: '4px', fontSize: '16px' }} type="icon-tianjia1" />
          <div style={{ height: '17px', lineHeight: '17px' }}>选择群活码</div>
        </div>}
      {groupVisible && this.renderGroupModal()}
    </>
  }
}

Index.propTypes = {}

export default Index
