import React from 'react'
import { Table, ConfigProvider, Image } from 'antd'

import './index.less'
import { omit } from 'lodash'

// function ResizeableTitle(props) {
//   const { onResize, width, ...restProps } = props

//   if (!width) {
//     return <th {...restProps} />
//   }

//   return null
//   // <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
//   //   <th {...restProps} />
//   // </Resizable>
// }

// function PulicTable1(props) {
//   // pagination 分页信息，可以喝paginationDefault一致，也可以指传递
//   const { loading, emptyText, isSize = false, customize = true, renderEmptyBtn, pagination } = props

//   const propsTable = omit(props, ['emptyText', 'loading', 'isSize', 'customize', 'renderEmptyBtn', ''])
//   propsTable.pagination = {
//     ...paginationDefault,
//     ...pagination,
//   }
//   // 给予一个默认值
//   // props.pagination = propsTable.pagination

//   const { dataSource } = propsTable
//   const { columns } = propsTable
//   const [tableColumns, settableColumns] = useState([])

//   settableColumns(columns)

//   const componentsSize = {
//     header: {
//       cell: ResizeableTitle,
//     },
//   }

//   let viewColumns = tableColumns.map((col) => col)
//   if (isSize) {
//     const handleResize =
//       (index) =>
//       (e, { size }) => {
//         const nextColumns = [...columns]
//         nextColumns[index] = {
//           ...nextColumns[index],
//           width: size.width,
//         }
//         settableColumns(nextColumns)
//       }
//     viewColumns = columns.map((col, index) => ({
//       ...col,
//       onHeaderCell: (column) => ({
//         width: column.width,
//         onResize: handleResize(index),
//       }),
//     }))
//   }
//   let data = []
//   if (dataSource.length > 0) {
//     data = dataSource.map((item, index) => {
//       if (item.key) {
//         delete item.key
//       }
//       return {
//         key: index,
//         ...item,
//       }
//     })
//   }
//   return (
//     <div>
//       <ConfigProvider renderEmpty={customize && customizeRenderEmpty}>
//         isSize ? (
//         <Table {...propsTable} columns={viewColumns} dataSource={data} components={componentsSize} loading={loading} />
//         ) : (
//         <Table {...propsTable} columns={viewColumns} dataSource={data} loading={loading} />)
//       </ConfigProvider>
//     </div>
//   )
// }
function PulicTable(props) {
  const { loading, emptyText, customize = true, renderEmptyBtn, dataSource, pageChange } = props
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
    defaultCurrent: 1,
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

  const customizeRenderEmpty = () => {
    if (loading) {
      return <div>数据加载中...</div>
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Image width={90} height={89} preview={false} src={require('./empty.png')} />
        <p style={{ paddingTop: 10 }}>{emptyText || '暂无数据'}</p>
        {renderEmptyBtn()}
      </div>
    )
  }
  let data = []
  if (dataSource.length > 0) {
    data = dataSource.map((item, index) => {
      if (item.key) {
        delete item.key
      }
      return {
        key: index,
        ...item,
      }
    })
  }

  return (
    <div>
      <ConfigProvider renderEmpty={customize && customizeRenderEmpty}>
        <Table {...propsTable} dataSource={data} pagination={pagination} loading={loading} />
      </ConfigProvider>
    </div>
  )
}

export default PulicTable
