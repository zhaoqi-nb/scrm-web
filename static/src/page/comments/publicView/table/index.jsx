/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react'
import { Table, Popover, message, Button, ConfigProvider, Image } from 'antd'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import RsIcon from '@RsIcon'
import { arrayMoveImmutable } from 'array-move'
import { omit } from 'lodash'
import DraggableNode from './draggableNode'
import Api from './store/api'

import './index.less'

const DragHandle = SortableHandle(() => (
  <RsIcon type="icon-tuodong" style={{ cursor: 'grab', color: '#4E5969', fontSize: '16px' }} />
))
const SortableItem = SortableElement((props) => <tr {...props} />)
const SortableBody = SortableContainer((props) => <tbody {...props} />)

// eslint-disable-next-line func-names
export default function (props) {
  const { configType, sortConfig = {}, updateTitleUrl } = props

  const { loading, emptyText, customize = true, renderEmptyBtn, dataSource, pageChange, titleUrl = '' } = props
  let { pagination } = props
  const propsTable = omit(props, [
    'emptyText',
    'loading',
    'isSize',
    'customize',
    'renderEmptyBtn',
    'dataSource',
    'pagination',
    'pageChange',
  ])
  pagination = {
    current: pagination.pageNo,
    // defaultPageSize: 20,
    // pageSize: 20,
    total: 0,
    position: ['bottomCenter'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
    showTotal: (total) => `共 ${total} 项`,
    onChange: pageChange,
    ...pagination,
  }
  const { isSort, sortKey, onSort } = sortConfig
  const propsColumns = props.columns || []
  const [columns, setColumns] = useState([]) // 编辑后的表头
  const [fetchColumns, setFetchColumns] = useState([]) // 接口获取回来的表头
  const [fetchLoading, setFetchLoading] = useState(false) // 表格loading
  const [saveLoading, setSaveLoading] = useState(false) // 表格loading
  const [popoverVisible, setPopoverVisible] = useState(false)

  // 保存用户自定义表头数据
  const handleConfigChange = (data, isSet) => {
    // isSet是否更新表格表头
    const configColumns = data
      .filter((v) => v.hiddenFlag)
      .map((v) => {
        // if (!v.hiddenFlag) return null
        const columnInfo = propsColumns.find((column) => (column.configTitle || column.title) == v.columnName)
        return columnInfo
      })
    setFetchColumns(data)
    if (isSet) {
      setColumns(configColumns)
    }
  }

  // 保存用户自定义表头
  const updateUserColumnList = (updateSource) => {
    const data = { updateSource }
    if (configType == 'customerList') {
      data.param = [...updateSource]
    }

    Api.updateUserColumnList(updateTitleUrl, data).then(() => {
      setSaveLoading(false)
      setPopoverVisible(false)
      message.destroy()
      message.success('操作成功')
    })
  }

  // 恢复默认表头
  const handleInitColumnSetting = () => {
    if (configType !== 'customerList') {
      Api.initColumnSetting(configType).then(() => {
        setPopoverVisible(false)
      })
    }
  }

  const sortColumn = isSort
    ? {
      title: '',
      dataIndex: 'DragHandle',
      width: 50,
      render: () => <DragHandle />,
    }
    : ''

  const cinfigColumn = () => {
    if (configType) {
      const operationTableColumn = propsColumns.filter((item) => item.dataIndex == 'operationTableColumn')[0]
      const titleText = operationTableColumn && operationTableColumn.title
      const operationObj = omit(operationTableColumn, ['title'])
      return {
        title: (
          <Popover
            visible={popoverVisible}
            trigger="click"
            onVisibleChange={(visible) => setPopoverVisible(visible)}
            overlayClassName="table-cinfig-columns-popover"
            title={
              <div>
                <span>自定义列表字段</span>
                <span
                  style={{
                    fontWeight: 400,
                    color: '#8C8C8C',
                    marginLeft: '8px',
                  }}
                >
                  拖拽字段进行排序
                </span>
              </div>
            }
            content={
              <div>
                <div style={{ maxHeight: '400px' }} className="over-y">
                  <DraggableNode onChange={handleConfigChange} dataList={fetchColumns} />
                </div>
                <div className="table-cinfig-footer">
                  <div onClick={handleInitColumnSetting} className="footer-sysconfig">
                    恢复默认
                  </div>
                  <div>
                    <Button onClick={() => setPopoverVisible(false)} type="text">
                      取消
                    </Button>
                    <Button
                      loading={saveLoading}
                      onClick={() => {
                        setSaveLoading(true)
                        updateUserColumnList(fetchColumns)
                      }}
                      style={{ marginLeft: '8px' }}
                      type="primary"
                    >
                      确定
                    </Button>
                  </div>
                </div>
              </div>
            }
          >
            <div className="table-cinfig-columns">
              {titleText || ''} <RsIcon type="icon-shezhi" />
            </div>
          </Popover>
        ),
        dataIndex: 'configAction',
        fixed: 'right',
        width: 60,
        ...operationObj,
      }
    }
    return ''
  }
  const getConfigColumns = () => {
    if (!popoverVisible) {
      setFetchLoading(true)
      if (configType) {
        Api.getColumnListByBusinessType({ type: configType, url: titleUrl })
          .then((res) => {
            if (res.retCode == 200) {
              handleConfigChange(res.data, true)
            }
          })
          .finally(() => {
            setFetchLoading(false)
          })
      } else {
        setFetchLoading(false)
        setColumns(propsColumns)
      }
    }
  }

  useEffect(() => {
    getConfigColumns()
  }, [popoverVisible])

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el)
      onSort(newData)
    }
  }

  function DraggableContainer(sortProps) {
    return (
      <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...sortProps} />
    )
  }

  function DraggableBodyRow({ className, style, ...restProps }) {
    const index = dataSource.findIndex((x) => x[sortKey] === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  const customizeRenderEmpty = () => {
    if (loading) {
      return <div>数据加载中...</div>
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
        <p style={{ paddingTop: 10 }}>{emptyText || '暂无数据'}</p>
        {renderEmptyBtn ? renderEmptyBtn() : null}
      </div>
    )
  }
  return (
    <ConfigProvider renderEmpty={customize && customizeRenderEmpty}>
      {columns.length == 0 ? <Table key="1" columns={[]} loading={loading || fetchLoading} /> : <Table
        key="2"
        {...propsTable}
        dataSource={dataSource}
        pagination={pagination}
        components={{
          body: isSort
            ? {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            }
            : {},
        }}
        columns={[sortColumn, ...columns, cinfigColumn()].filter((v) => v)}
        loading={loading || fetchLoading}
      />}
    </ConfigProvider>
  )
}
