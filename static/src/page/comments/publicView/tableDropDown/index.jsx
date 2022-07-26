import React from 'react'
import { Menu, Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'

/** *
 * props
 *
 * table 操作列使用
 *  {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
*optionButtonList 实例
optionButtonList = [
    {
      label: '数据统计',
      clickFN: (data) => {
        console.log(data, '----rowData---')
      },
    },
    {
      label: '详情',
      clickFN: (data) => {
        console.log(data, '----rowData---')
      },
    },
  ]
 * ** */
function TableDropDown(props) {
  const { items, showNum, rowData, rowKey } = props
  const newItems = items.map((item, index) => {
    item['-option-key-'] = `${index}${rowKey}`
    return item
  })
  const buttonList = newItems.slice(0, showNum)
  const menuList = newItems.slice(showNum).map((item) => {
    item.key = item['-option-key-']
    return item
  })
  const onMenuClick = ({ key, keyPath, domeEvent, item }) => {
    // item 是Menu.Item ReactNode 对象， 可以获取所有自定义的props 对象属性
    const { menuClickFN, menuItem } = item.props
    // rowData,表格行数据 rowKey 行索引 menuItem //渲染按钮对象
    menuClickFN && menuClickFN(rowData, rowKey, menuItem, domeEvent, key, keyPath)
  }
  const ButttonRender = () =>
    buttonList.map((buttonItem) => (
      <Button
        key={buttonItem['-option-key-']}
        type="link"
        size="small"
        className="pad6"
        onClick={(event) => {
          buttonItem.clickFN && buttonItem.clickFN(rowData, rowKey, buttonItem, event)
        }}
      >
        {buttonItem.label}
      </Button>
    ))
  // 如果2.O以上可以 items={menuList}
  const menu = () => (
    <Menu
      onClick={(menuEvent) => {
        onMenuClick(menuEvent)
      }}
    >
      {menuList.map((item) => (
        <Menu.Item key={item['-option-key-']} menuItem={item} menuClickFN={item.clickFN}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <div className="flex-box middl-a">
      {ButttonRender()}
      {menuList.length > 0 ? (
        <Dropdown overlay={menu} size="small">
          <div onClick={(e) => e.preventDefault()} className="f12 mt6">
            <div className="text-link">
              更多
              <DownOutlined />
            </div>
          </div>
        </Dropdown>
      ) : null}
    </div>
  )
}

export default TableDropDown
