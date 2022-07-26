import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Drawer, Input, message, Form } from 'antd'

import RsIcon from '@RsIcon'

import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Api from './store/api'
import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'
import SelectCustom from '../comments/publicView/screensCustom'
import '../index.less'

function GroupList() {
  const showform = useRef()

  const history = useHistory()

  // 表格数据源
  const [dataSource, setDataSource] = useState([])
  // 查看详情状态
  const [visible, setVisible] = useState(false)
  // 查看详情状态
  const [delVisible, setDelVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [customerGroupName, setCustomerGroupName] = useState('')
  const [optionDataRow, setOptionDataRow] = useState({})
  // 控制预览详情的样式
  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
    }
    data.customerGroupNameLike = customerGroupName
    Api.getCustomerGroupList(data)
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          setDataSource(list)
          setPagination({ ...pagination, total, pageNo, pageSize })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const [attrs, setAttrs] = useState([])
  useEffect(() => {
    Api.getInitCustomerGroupFileList().then((res) => {
      if (res.retCode == 200) {
        setAttrs(
          res.data.map((item) => ({
            label: item.fieldName,
            value: item.fieldMappingName,
          }))
        )
      }
    })
  }, [])
  const pageChange = (page, pageSize) => {
    getData(page, pageSize)
  }
  // 搜索框点击搜索
  const handleSearch = () => {
    getData()
  }

  // 监听搜索框值的改变
  const handleChangeName = (e) => {
    setCustomerGroupName(e.target.value)
  }

  useEffect(() => {
    getData()
  }, [])

  // 查看条件触发
  useEffect(() => {
    if (visible) {
      const data = JSON.parse(optionDataRow.filterJson)

      showform.current.setFieldsValue({
        screens: data.group1.map((item) => ({
          filedValue: item.value,
          where: item.where,
          fieldName: item.fieldName,
        })),
      })
    }
  }, [visible, optionDataRow])

  const goAddCustomerGroup = (id) => {
    const stateObj = {
      id,
    }
    if (stateObj.id) {
      history.push({ pathname: '/addCustomerGroup', state: stateObj })
    } else {
      history.push({ pathname: '/addCustomerGroup' })
    }
  }
  const renderEmptyBtn = () => (
    <Button
      type="primary"
      onClick={() => {
        goAddCustomerGroup()
      }}
    >
      创建客户分群
    </Button>
  )
  // const find = (text, record) => {
  //   console.log(text, record)
  // }

  const onClose = () => {
    setVisible(false)
  }
  const updateCustomerCount = (id) => {
    Api.updateCustomerCount({ id })
      .then((res) => {
        if (res.retCode == 200) {
          message.success('操作成功')
          getData()
        } else {
          message.error(res.retMsg)
        }
      })
      .finally(() => {
        // setVisible(false)
      })
  }

  const optionButtonList = [
    {
      label: '更新',
      clickFN: (data) => {
        updateCustomerCount(data.id)
      },
    },
    {
      label: '编辑',
      clickFN: (data) => {
        setOptionDataRow(data)
        goAddCustomerGroup(data.id)
      },
    },
    {
      label: '查看条件',
      clickFN: (data) => {
        setOptionDataRow(data)
        setVisible(true)
      },
    },
    {
      label: '删除',
      clickFN: (data) => {
        setOptionDataRow(data)
        setDelVisible(true)
      },
    },
  ]

  const columns = [
    {
      title: '群组名称',
      dataIndex: 'groupName',
    },
    {
      title: '满足条件客户数',
      dataIndex: 'customerCount',
    },
    {
      title: '群组更新周期',
      dataIndex: 'updateType',
      key: 'updateType',
      render: (text, rowData) => {
        const textObj = {
          1: '静态群组',
          2: '手动更新',
        }
        if (text == 3) {
          return `${rowData.cycleValue}天/更新`
        }
        return textObj[text]
      },
    },
    {
      title: '可见范围',
      dataIndex: 'showBoundary',
      key: 'showBoundary',
      render: (text) => {
        const textObj = {
          1: '仅自己可见',
          2: '全体成员可见',
          3: '指定成员可见',
        }
        return textObj[text]
      },
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      // render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastGetTime',
      render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={1} items={optionButtonList} />
      ),
    },
  ]

  // setSelectedRowKeys
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // const onSelectChange = (RowKeys) => {
  //   setSelectedRowKeys(RowKeys)
  // }
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // }
  const deleteData = (ids) => {
    Api.deleteCustomerGroup({ ids })
      .then((res) => {
        if (res.retCode == 200) {
          message.success('操作成功')
          getData()
        } else {
          message.error(res.retMsg)
        }
      })
      .finally(() => {
        setDelVisible(false)
      })
  }

  const handleOk = () => {
    if (optionDataRow.id) deleteData(optionDataRow.id)
  }

  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">客户分群</div>
          {renderEmptyBtn()}
        </div>
        <div className="customer-group-container" style={{ width: '216px' }}>
          <Input
            suffix={<RsIcon onClick={handleSearch} type="icon-sousuo" />}
            className="input-search"
            placeholder="输入关键字搜索群组"
            onPressEnter={handleSearch}
            onChange={handleChangeName}
          />
        </div>
      </div>
      <div className="group-list-container">
        <PulicTable
          columns={columns}
          loading={loading}
          pagination={pagination}
          dataSource={dataSource}
          // rowSelection={rowSelection}
          pageChange={pageChange}
          scroll={{ x: 1300 }}
          emptyText="还没有客户分群记录哦，快去新建吧！"
          renderEmptyBtn={renderEmptyBtn}
        />
        <Modal
          title="删除提示"
          onCancel={() => {
            setDelVisible(false)
          }}
          visible={delVisible}
          onOk={handleOk}
          okText="删除"
          okButtonProps={{ danger: true }}
        >
          <p>确认删除群组名称为【{optionDataRow.groupName}】的客户群组吗？</p>
        </Modal>
        <Drawer
          title="分群条件详情"
          placement="right"
          width={754}
          closable={false}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: '0px', paddingRight: '0px' }}
          size="large"
          extra={<RsIcon onClick={onClose} type="icon-guanbi " className="f18" />}
        >
          <Form ref={showform} className="add-group-form">
            <SelectCustom disabledValue attrs={attrs} />
          </Form>
        </Drawer>
      </div>
    </div>
  )
}

export default GroupList
