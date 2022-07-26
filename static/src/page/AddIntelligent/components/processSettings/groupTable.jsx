/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Input } from 'antd'

import RsIcon from '@RsIcon'

import Api from './store/api'
import PulicTable from '../../../comments/publicView/table'
import './index.less'

function GroupList({ onChange, customerGroupId = [] }) {
  // 表格数据源
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [selectKeys, setSelectKeys] = useState([])
  const [selectRows, setSelectRows] = useState([])
  const [customerGroupName, setCustomerGroupName] = useState('')

  // 控制预览详情的样式
  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    setSelectKeys(customerGroupId)
    const data = {
      pageNo,
      pageSize,
    }
    data.customerGroupNameLike = customerGroupName
    Api.getCustomerGroupList(data)
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          let _list = list.map((item) => ({ ...item, key: item?.id || '' }))
          setDataSource(_list)
          setPagination({ ...pagination, total, pageNo, pageSize })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const pageChange = (page, pageSize) => {
    getData(page, pageSize)
  }
  // 搜索框点击搜索
  const handleSearch = (e) => {
    e.preventDefault();
    getData()
  }

  // 监听搜索框值的改变
  const handleChangeName = (e) => {
    setCustomerGroupName(e.target.value)
  }

  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    setSelectKeys(customerGroupId)
  }, [customerGroupId]);
  const columns = [
    {
      title: '群组名称',
      dataIndex: 'groupName',
    },
    {
      title: '满足条件客户数',
      dataIndex: 'customerCount',
    }
  ]

  const selectRow = (selectedKeys, selectedRows) => {
    setSelectRows(selectedRows)
    setSelectKeys(selectedKeys)
    onChange && onChange(selectedKeys)
  }

  const rowSelection = {
    onChange: selectRow,
    selectedRowKeys: selectKeys,
    type: 'radio'
  }

  return (
    <>
      <Input
        suffix={<RsIcon onClick={handleSearch} type="icon-sousuo" />}
        className="input-search"
        placeholder="输入关键字搜索群组"
        onPressEnter={(e) => handleSearch(e)}
        onChange={handleChangeName}
        style={{ marginBottom: '16px' }}
      />
      <div className="group-list-container">
        <PulicTable
          columns={columns}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          dataSource={dataSource}
          pageChange={pageChange}
          scroll={{ x: true }}
        />
      </div>
    </>
  )
}

export default GroupList
