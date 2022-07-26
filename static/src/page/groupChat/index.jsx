/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { Input, Select, Table, message, Spin, Button } from 'antd'
import './index.less'
import { Detail, AreaModal } from './components'
import Api from './server'
import { initData, userTreeFormat } from './helper'
import CustomTagNew from '../comments/publicView/customTagNew'
import RsIcon from '@RsIcon'
import { TRCheckboxModal } from '@Tool/components';
import { SearchOutlined } from '@ant-design/icons'
import _ from 'lodash'

export default function GroupChat() {

  const defaultProps = {
    mode: 'tags',
    maxTagCount: 1,
    maxTagTextLength: 3,
    showArrow: true
  }

  const [tagOptions, setTagOptions] = useState([])
  const [columns, setcolumns] = useState([])
  const [dataSource, setDatasource] = useState([])
  const [tableInfo, setTableInfo] = useState({})
  const [formData, setFormData] = useState({ name: '', labelIds: [], ownerMemberIds: [] })
  const [treeData, setTreeData] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [DetailInfo, setDetailInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectData, setSelectData] = useState({})
  const [syncLoading, setSyncLoading] = useState(false)




  const onSelectChange = (newSelectedRowKeys, data) => {
    if (data.length === 1) {
      setSelectData({ tagList: data?.[0]?.labelVos || [] })
    } else {
      setSelectData({ tagList: [] })

    }
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const fetchData = async () => {
    setLoading(true)
    const [res, res1, res2] = await Promise.all([Api.queryLabelList(), Api.getGroupData({ pageSize: 10 }), Api.getOwner()])
    if (res?.retCode === 200 && res1?.retCode === 200 && res2?.retCode === 200) {
      const result = initData(res?.data, res1, res2);
      const columns = [...result?.columns || [], columnsMore()];
      const data = userTreeFormat(res2?.data, true);
      setTreeData(data)
      setSelectOptions(result?.resultData)
      setTableInfo(result?.tableInfo || {})
      setTagOptions(result?.results)
      setcolumns(columns)
      setDatasource(result?.dataSource || [])
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handelTag = (data, allVal) => {
    Api.hidTag({ groupIds: Array.isArray(allVal?.id) ? allVal?.id : [allVal?.id || ''], labelIds: data?.tagList?.map((item) => item?.id) }).then((data) => {
      if (data?.retCode === 200) {
        message.success('打标签成功')
        handelTable({ ...formData, pageNo: 1, pageSize: 10 })
      }
    })
  }

  const handelDetail = (allVal) => {
    setDetailInfo({ ...allVal, isVisible: true, visibleId: _.random(0, 2.2) })
  }

  const columnsMore = () => {
    return {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (val, allVal) => {
        return <div className='operateBox'>
          <CustomTagNew
            value={{ tagList: allVal?.labelVos || [] }}
            onChange={(data) => handelTag(data, allVal)}>
            <a>打标签</a>
          </CustomTagNew>
          <a onClick={() => handelDetail(allVal)}>详情</a></div>
      }
    }
  }

  const handelTable = async (options) => {
    let res = await Api.getGroupData(options);
    setTableLoading(true)
    if (res?.retCode === 200) {
      const list = res?.data?.list?.map((item) => ({ ...item, key: item?.id }))
      setDatasource(list)
      setTableInfo(res?.data)
      setTableLoading(false)
      // setcolumns([...initData(), columnsMore()])
    }
  }

  const itemRender = (item) => {
    return <div className='itemBox'>{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
  }

  const handelSelect = async () => {
    const result = await TRCheckboxModal.show({ treeData, value: formData?.ownerMemberIds || [], title: '选择群主', titleRender: itemRender, itemRender });
    if (result.index === 1) {
      handelInput(result?.checkedKeys || [], 'ownerMemberIds')
    }
  }

  const handelInput = (e, key) => {
    const formResult = { ...formData, [key]: e }
    setFormData(formResult)
    if (key != 'name') {
      handelTable({ ...formResult, pageNo: 1, pageSize: 10 })
    }
  }
  const handelArea = async () => {
    const result = await AreaModal.show({
      selectedRowKeys
    })
  }

  const handelSynch = async () => {
    setSyncLoading(true)
    const res = await Api.getSync();
    if (res?.retCode === 200) {
      setSyncLoading(false)
    }
  }
  const renderTop = () => {
    if (selectedRowKeys?.length) {
      return <div style={{ 'display': 'flex', alignItems: 'center' }}>
        <span>已选中{selectedRowKeys.length}项</span>
        <CustomTagNew value={selectData} onChange={(data) => handelTag(data, { id: selectedRowKeys })}>
          <span className={'signBox'}><RsIcon style={{ marginLeft: '3px', marginRight: '3px' }} type="icon-biaoqian" /> 打标签</span>
        </CustomTagNew>
        <span onClick={handelArea} className={'signBox'}><RsIcon style={{ marginLeft: '3px', marginRight: '3px' }} type="icon-biaoqian" /> 设置地区</span>
      </div>
    }
    return (
      <>
        <div>
          <Input
            placeholder="请输入要搜索的群聊名称"
            onChange={(e) => handelInput(e.target.value, 'name')}
            onPressEnter={() => handelTable(formData)}
            onBlur={() => handelTable(formData)}
            suffix={<SearchOutlined />}
          />
        </div>
        <div><Select
          onClick={handelSelect}
          open={false}
          value={formData?.ownerMemberIds}
          options={selectOptions}
          onChange={(e) => handelInput(e, 'ownerMemberIds')}
          placeholder="选择群主"
          {...defaultProps}
        /></div>
        <div><Select
          placeholder="选择群标签"
          options={tagOptions}
          value={formData?.labelIds}
          onChange={(e) => handelInput(e, 'labelIds')}
          {...defaultProps}
        /></div>
        <div className='btnBox'>
          <Button onClick={handelSynch}>群聊同步</Button>
        </div>
      </>
    )
  }

  const renderMain = () => {
    if (loading) return <div className={'spinBox'}><Spin /></div>
    return (
      <>
        <div className="title">企微群聊</div>
        <div className="banner">
          {renderTop()}
        </div>
        <div className='main'>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            loading={tableLoading}
            pagination={{
              className: 'pagination',
              showTotal: (total) => `共${total}条记录`,
              showQuickJumper: true,
              showSizeChanger: true,
              current: tableInfo?.pageNo,
              pageSize: tableInfo?.pageSize,
              defaultCurrent: tableInfo.pageCount,
              total: tableInfo.total
            }}
            onChange={(options) => handelTable({ pageNo: options?.current, pageSize: options?.pageSize })}
          />

        </div>
      </>
    )
  }

  return (
    <Spin spinning={syncLoading} tip={'群聊同步中'}>
      <div className="groupChat">
        {renderMain()}
        <Detail DetailInfo={DetailInfo} />
      </div>
    </Spin>
  )
}
