import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Button, message, Image, Tag, Avatar } from 'antd'
// 公共组件
import RsIcon from '@RsIcon'
import { omit } from 'lodash'
import moment from 'moment'
import CustomerInfo from '../../comments/customerInfo'
import PulicTable from '../../comments/publicView/table'
import Api from '../store/api'
import TableDropDown from '../../comments/publicView/tableDropDown'
import CustomerFilter from './filter'
import CustomTagIndex from '../../comments/publicView/customTagNew'
import { getFormaterValue } from '../configData'

const { confirm } = Modal

function CustomerList(props, ref) {
  const cusTomerInfoRef = useRef()
  const { onCreate, onEditChage } = props
  // loading
  const [excChange, setExcChange] = useState(false)
  // loading
  const [loading, setLoading] = useState(false)
  // 表格头部配置
  const [columns, setColums] = useState([])
  // 控制操作区域的隐藏和展示
  const [actionStatus, setActionStatus] = useState(false)
  const [pagination, setPagination] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [optionId, setOptionId] = useState('')

  const [searchObj, setSearchObj] = useState({ noSearch: false })
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
      ...omit(searchObj, ['noSearch']),
    }
    Api.queryList(data)
      .then((res) => {
        if (res.retCode == 200) {
          const { list, totalCount } = res.data || {}
          if (list && list.length > 0) {
            setDataSource(list)
            setPagination({ ...pagination, total: totalCount, pageNo, pageSize })
          } else {
            setDataSource([])
            setPagination({ ...pagination, total: 0, pageNo, pageSize })
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const pageChange = (page, pageSize) => {
    getData(page, pageSize)
  }
  const renderEmptyBtn = () => (
    <Button
      type="primary"
      onClick={() => {
        onCreate && onCreate()
      }}
    >
      新建
    </Button>
  )
  // useEffect(() => {
  //   if (optionId) {
  //     cusTomerInfoRef.current.optionInfo(true)
  //   }
  // }, [optionId])
  const optionButtonList = [
    {
      label: '查看详情',
      clickFN: (data) => {
        setOptionId(data.id)
        setTimeout(() => {
          cusTomerInfoRef.current.optionInfo(true)
        }, 0)
      },
    },
  ]
  const renderImg = (url) => {
    if (url) {
      return <Image rootClassName="mr5 radius11" src={url} preview={false} width={22} height={22} />
    }
    return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
  }
  const getColumnData = (list) => {
    const rendrObj = {
      // 预留特殊字段格式化
      name: (text, record) => {
        const { avatar, type, corpName } = record
        return (
          <>
            {avatar && <Avatar style={{ marginRight: '8px' }} src={avatar} size={24} />}
            {text}
            {[1, 2].indexOf(type) > -1 && <div className="customer-type">@{type == 1 ? '微信' : corpName}</div>}
          </>
        )
      },
      followList: (items = []) => (
        <div className="flex-box">
          {items?.slice(0, 1)?.map((item) => (
            <div className="flex-box f14 middle-a mr14">
              {renderImg(item.avatar)} {item.name}
            </div>
          ))}
          {items?.length > 1 ? `等共${items.length}人` : null}
        </div>
      ),
      labelCountList: (items) => {
        if (items && items.length > 0) {
          return (
            <div className="flex-box flex-column">
              <div>
                {items.slice(0, 5).map((item) => (
                  <Tag>{item.name}</Tag>
                ))}
              </div>
              <div className="mt5">{items.length > 5 ? `共${items.length}项` : null}</div>
            </div>
          )
        }
        return null
      },
    }
    if (list && list.length > 0) {
      const columnList = list.map((item) => {
        const renderFN = rendrObj[item.columnValue]
        const renderData = {
          title: item.columnName,
          dataIndex: item.columnValue,
        }
        if (renderFN) {
          renderData.render = renderFN
        } else {
          renderData.render = (text) => {
            const returnText = getFormaterValue(item.columnValue, text)
            if (text && typeof text == 'object') {
              return '数据对象未解析'
            }

            if (['createTime', 'assignTime', 'updateTime'].includes(item.columnValue)) {
              return moment(text).format('YYYY-MM-DD HH:mm:ss') == 'Invalid date'
                ? ''
                : moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
            return returnText || text
          }
        }

        return renderData
      })
      if (columnList.length > 0) {
        columnList.push({
          title: '操作',
          dataIndex: 'operationTableColumn',
          width: 80,
          render: (text, rowData, index) => (
            <TableDropDown rowData={rowData} rowKey={index} showNum={1} items={optionButtonList} />
          ),
        })
      }
      setColums(columnList)
    }
  }

  useEffect(() => {
    Api.getColumnListByBusinessType()
      .then((res) => {
        if (res.retCode == 200) {
          getColumnData(res.data)
          if (res.data.length > 0) {
            getData()
          }
        }
      })
      .finally(() => {
        // setColums([])
      })
  }, [])

  useEffect(() => {
    if (searchObj.noSearch) {
      getData()
    }
  }, [searchObj])

  // 配置表格行是否可选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      // if (selectedRows.length !== 0) {
      //   setActionStatus(actionStatus)
      // }
      setSelectedRowKeys(selectedKeys)
      selectedRows.length !== 0 ? setActionStatus(true) : setActionStatus(false)
    },
    getCheckboxProps: (record) => ({
      disabled: record.status == -1,
    }),
  }

  // 删除
  const delCustom = (selectId) => {
    confirm({
      title: '删除提示',
      icon: '',
      content: '确认删除选中的客户？删除后，此操作将无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      wrapClassName: 'delcustomer-confirm',
      onOk() {
        return Api.deleteCustomerByCustomerId(selectId || selectedRowKeys.join(',')).then((res) => {
          if (res.retCode == 200) {
            message.success('操作成功', 2, () => {
              setActionStatus(false)
              setSelectedRowKeys([])
              getData()
            })
          }
        })
      },
      onCancel() {
        return false
      },
    })
  }
  const changeTagList = (item) => {
    // 打标签功能
    console.log(item, '-----------changeTagList')
    return true
  }

  const readLoadPage = () => {
    // 刷新当前页面属性
    window.location.reload()
  }
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // onCallback 就是暴露给父组件的方法
    readLoadPage,
  }))

  // 表格操作区域
  const renderTableAction = () =>
    actionStatus && (
      <div className="action-container" style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center' }}>
        <span>
          已选中 <b>{selectedRowKeys.length}</b> 项
        </span>
        <CustomTagIndex onChange={changeTagList}>
          <span className="filter-warp-select" style={{ display: 'none' }}>
            <RsIcon style={{ marginRight: '8px' }} type="icon-biaoqian" />
            打标签
          </span>
        </CustomTagIndex>
        {/* <span className="filter-warp-select">
          <RsIcon style={{ marginRight: '8px' }} type="icon-daochu" />
          导出
        </span> */}
        <span className="filter-warp-select" onClick={delCustom}>
          <RsIcon style={{ marginRight: '8px' }} type="icon-shanchu" />
          删除
        </span>
      </div>
    )

  // 搜索改变值的回掉
  const searchValueOnchange = (values) => {
    if (excChange) {
      setSearchObj({ ...values, noSearch: true })
    } else {
      setExcChange(true)
    }
  }

  const onEditChageOption = (dataInfo) => {
    onEditChage && onEditChage(dataInfo)
  }

  const onDeleteCallBack = () => {
    setOptionId('')
    getData()
  }

  return (
    <div>
      {/* 筛选区域 */}
      <CustomerFilter
        onChange={(searchValue) => {
          searchValueOnchange(searchValue)
        }}
      />

      <div className="coustom-list">
        {/* 表格操作区域 */}
        {renderTableAction()}

        {/* 客户列表 */}
        {columns && columns.length > 0 && (
          <PulicTable
            scroll={{ x: 'max-content' }}
            isSort
            configType="customerList"
            titleUrl="scrm-basic/customerRelatedColumnSetting/getCustomerListColumnByCustomerId"
            updateTitleUrl="scrm-basic/customerRelatedColumnSetting/initCustomerColumnByBusiness"
            loading={loading}
            columns={columns}
            pagination={pagination}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pageChange={pageChange}
            emptyText="还没有任何客户哦，快去新建吧！"
            renderEmptyBtn={renderEmptyBtn}
            rowKey="id"
          />
        )}

        {/* 客户详情抽屉 */}
        {optionId && (
          <CustomerInfo
            deleteCallBack={onDeleteCallBack}
            id={optionId}
            key={optionId}
            ref={cusTomerInfoRef}
            editChange={onEditChageOption}
          />
        )}
      </div>
    </div>
  )
}

export default forwardRef(CustomerList)
