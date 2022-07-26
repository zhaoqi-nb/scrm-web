/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react'
import { Button, Input, Table, Dropdown, message } from 'antd'
import RsIcon from '@RsIcon'
import { Drawer } from '@Tool/components'
import { BANNER, initColumns } from './helper'
import './index.less'
import Api from './service'
import OperateDetail from './components/OperateDetail'
import * as action from './store/action-type'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
export default function Index() {
  const [inputValue, setInputValue] = useState('')
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [checksKey, setChecksKey] = useState('')
  const [tableInfo, setTableInfo] = useState({})
  const [bannerData, setBannerData] = useState({})

  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchData()
    fetchBanner()
  }, [])

  const fetchBanner = async () => {
    const res = await Api.getBannerData()
    if (res?.retCode == 200) {
      let obj = {}
      res?.data?.map((item) => {
        obj[item.operatingStatus] = item.operatingNum
      })
      setBannerData(obj)
    }
  }
  const handelInput = (e) => {
    setInputValue(e.target.value)
  }
  const fetchData = async (data = {}) => {
    const res = await Api.getTableData({
      operatingTitle: inputValue,
      operatingStatus: checksKey,
      pageSize: 20,
      ...data,
    })

    if (res?.retCode === 200) {
      setTableInfo(res?.data || {})
      const columns = initColumns(res?.data?.list || [])
      setDataSource(res?.data?.list || [])
      setColumns([...columns, operateRender()])
    }
  }
  const handelOpen = async (data) => {
    const res = await Api.getOpen(data?.id || 0)
    if (res?.retCode === 200) {
      message.success('开启成功')
      fetchData()
    }
  }

  const handelPause = async (data) => {
    const res = await Api.getPause(data?.id || 0)
    if (res?.retCode === 200) {
      message.success('暂停成功')
      fetchData()
    }
  }

  const handelDelete = async (data) => {
    const res = await Api.getDelete(data?.id || 0)
    if (res?.retCode === 200) {
      message.success('删除成功')
      fetchData()
    }
  }
  const menu = (allVal) => {
    const MENU = {
      1: {
        name: '草稿',
        data: [
          { name: '开启', fn: handelOpen },
          { name: '删除', fn: handelDelete },
          { name: '编辑', fn: handelEdit },
        ],
      },
      2: {
        name: '未开始',
        data: [
          { name: '开启', fn: handelOpen },
          { name: '删除', fn: handelDelete },
        ],
      },
      3: {
        name: '进行中',
        data: [
          { name: '暂停', fn: handelPause },
          { name: '删除', fn: handelDelete },
        ],
      },
      4: {
        name: '暂停',
        data: [
          { name: '开启', fn: handelOpen },
          { name: '删除', fn: handelDelete },
        ],
      },
      5: { name: '已结束', data: [{ name: '删除', fn: handelDelete }] },
    }
    let _data = MENU?.[allVal?.operatingStatus || 0]?.data
    if (!allVal.haveEdit) {
      _data = _data.filter((item) => item.name != '编辑')
    }
    return (
      <div className="moreDiv">
        {_data.map((item) => (
          <div key={item.name} onClick={() => item?.fn(allVal)}>
            {item?.name || ''}
          </div>
        ))}
      </div>
    )
  }
  const handelEdit = (data) => {
    dispatch({
      type: action?.SETEDIT,
      value: { edit: data, type: data?.groupCodeType || '' },
    })
    history.push('/AddIntelligent')
  }

  // 点击详情
  const handleDetailClick = async (data) => {
    await Drawer.show(
      {
        title: '营销计划详情',
        ...data,
        bodyStyle: { backgroundColor: '#F5F7FA' },
        width: 800,
        handelEdit,
        handelDelete,
        handelPause,
        handelOpen,
      },
      OperateDetail
    )
  }

  const operateRender = () => {
    return {
      key: 'operate',
      dataIndex: 'operate',
      title: '操作',
      fixed: 'right',
      width: 150,
      render: (val, allVal) => (
        <div className="moreBox">
          <a onClick={() => handleDetailClick(allVal)}>详情</a>
          {allVal?.haveEdit ? (
            <Dropdown overlay={() => menu(allVal)}>
              <div className="inlineBlock">
                <a className="moreA">更多</a>
                <RsIcon type={'icon-tianchongxiajiantou'} />
              </div>
            </Dropdown>
          ) : null}
        </div>
      ),
    }
  }
  const handelBanner = (item) => {
    setChecksKey(item.key)
    fetchData({ operatingStatus: item.key })
  }
  const renderBanner = () => {
    return BANNER?.map((item) => (
      <div className={`${checksKey == item?.key ? 'checkBanner' : ''}`} onClick={() => handelBanner(item)}>
        <span className="iconBox">{item?.icon || ''}</span>
        {item?.title || ''} {bannerData[item?.key || 0]}
      </div>
    ))
  }
  const handelAdd = () => {
    history.push('/AddIntelligent')
  }
  const handelBlur = () => {
    fetchData()
  }
  return (
    <div className="smartBox">
      <div className="smartTitle">
        <div>智能运营</div>{' '}
        <Button type="primary" onClick={handelAdd}>
          创建营销计划
        </Button>{' '}
      </div>
      <div className="formBox">
        <Input
          value={inputValue}
          onChange={handelInput}
          onBlur={handelBlur}
          onPressEnter={handelBlur}
          placeholder={'搜索营销计划'}
          suffix={<RsIcon type="icon-sousuo" />}
        />
      </div>
      <div className="bannerBox">{renderBanner()}</div>
      <div className="tableBox">
        <Table
          scroll={{
            x: 1500,
          }}
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            className: 'pagination',
            showTotal: (total) => `共${total}条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: tableInfo?.pageNo,
            pageSize: tableInfo?.pageSize,
            defaultCurrent: tableInfo.pageCount,
            total: tableInfo.total,
            position: ['bottomCenter'],
            size: 'small',
          }}
          onChange={(options) => fetchData({ pageNo: options?.current, pageSize: options?.pageSize })}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  )
}
