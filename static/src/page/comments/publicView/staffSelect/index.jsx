import React, { useState, useEffect } from 'react'
import { Select, Modal, Button, Input, Tree, Checkbox, Image } from 'antd'
import { remove, uniqBy, uniq, intersection } from 'lodash'
import RsIcon from '@RsIcon'
import API from './store/api'
import './index.less'

const { Option } = Select
const renderOption = (data) => {
  if (!data || !data.length) return []
  return data.map((v) => <Option key={v.code}>{v.name}</Option>)
}

/** *
 * 对外导出组件
 * ** */
/** *
 * 高度定制只是适用选择员工
 * 如修改请联系-郑先虎
 * 对外导出组件,onStaffChange 是对外选择组件, list 是反向赋值
 * ** */
function StaffSelect(props) {
  const [treeDataSoure, setTreeDataSoure] = useState([])
  const {
    list = [], // 编辑时候回显的值，
    onStaffChange,
    type = 'select',
    buttonText = '',
    placeholder = '请选择使用成员',
    style = {},
  } = props
  // 初始化绑定的用于select 文本框数据展示，通过该值 在接口调用时候过滤那些选中的tree
  const [userIds, setUserIds] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false)
  // 返回给外部的数据
  const [returnData, setReturnData] = useState([])

  const [treeData, setTreeData] = useState([])
  const userClick = () => {
    setIsModalVisible(true)
  }

  // 成员个数
  const [conentNum, setConentNum] = useState(0)

  // 树形选中的
  const [checkedKeys, setCheckedKeys] = useState([])

  const handleOk = () => {
    // 确定操作 组件绑定change
    onStaffChange && onStaffChange(returnData)

    setUserIds(
      returnData.map((item) => ({
        value: item.key,
        label: item.title,
      }))
    )
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // 格式化树形数据
  //  数据源dataSoure //levList第几层 ，parentList 父分组 ，///selectList 返回选中的key， //返回选中的  returnDataList

  // 获取树的全部叶子节点
  const getTreeLeafKeys = (treeNode, keyslist = []) => {
    treeNode.forEach((item) => {
      if (item.children && item.children.length > 0) {
        getTreeLeafKeys(item.children, keyslist)
      } else {
        keyslist.push(item)
      }
    })
    return keyslist
  }

  const dataSourceFormat = (
    dataSoure,
    searchkey,
    levList = [0],
    parentList = [],
    selectList = [],
    returnDataList = []
  ) => {
    dataSoure.forEach((element, index) => {
      // 树形数据格式化
      levList[levList.length - 1] = index
      if (element.memberInfoList && element.memberInfoList.length > 0) {
        element.key = levList.join('-')
        element.parents = parentList // 父级key 用于自定义checkBox 框的数据处理
        element.title = element.name || element.departName || element.qywxDepartName
        element.children = []
      }

      parentList = [...levList]
      if (element.memberInfoList && element.memberInfoList.length > 0) {
        levList.push(index)
        let newList = element.memberInfoList.map((memberItem, newIndex) => {
          levList[levList.length - 1] = newIndex
          const newItem = {
            key: levList.join('-'),
            parents: parentList, // 父级key 用于自定义checkBox 框的数据处理
            title: memberItem.name,
            ...memberItem,
          }
          /** ** 获取选中的的keys集合start*** */
          if (userIds && userIds.length > 0) {
            let isAdd = false
            userIds.forEach((itemList) => {
              /**
               * 后台返回的，可能会有数据不一致的bug 补充一个或的判断  因为入库的是时候取得的是 element.id，编辑详情返回的是userId
               * 如果出现多选，情况可以删除 itemList.value == element.id
               * 如果出现数据不一致的情况，可以保存的时候和后台协商是userID 还是id 或着详情返回id
               *
               * * */
              if (itemList.value == newItem.userId || itemList.value == newItem.id) {
                isAdd = true
                if (!itemList.label) {
                  // 有时候后台给的详情数据没有返回用户名称，导致label为空，label 为空的情况下，再次反向赋值
                  itemList.label = newItem.name
                }
              }
            })
            if (isAdd) {
              selectList.push(newItem.key)
              returnDataList.push(newItem)
            }
          }
          /** ** 获取选中的的keys集合end *** */
          return newItem
        })

        if (searchkey) {
          newList = newList.filter((item) => item.title.indexOf(searchkey) != -1)
        }
        /// conentNumNew += element.memberInfoList.length
        element.children.push(...newList)
        element.disabled = newList.length == 0 && !(element.subDepartList && element.subDepartList.length > 0)
        levList = levList.slice(0, levList.length - 1)
        // dataSourceFormat(element.children, levList, element.key, selectList, returnDataList)
        // 循环完了进入下一个处理levList
      } else {
        // 后台如果过滤了数据没有员工的数据不返回 这里就不执行了
        // 表示部门没有员工也要禁止选中
        element.disabled = element.departName
      }
      if (element.subDepartList && element.subDepartList.length > 0) {
        levList.push(index)
        const newList = element.subDepartList.filter((item) => item.memberInfoList && item.memberInfoList.length > 0)
        element.children.push(...newList)
        dataSourceFormat(element.children, searchkey, levList, parentList, selectList, returnDataList)
        levList = levList.slice(0, levList.length - 1)
      }
    })
    setConentNum(getTreeLeafKeys(dataSoure).length)
    return { dataSoure, selectList, returnDataList }
  }

  const selectChange = (value) => {
    setUserIds(value)
    remove(returnData, (item) => value.indexOf(item.key) == -1)
    setReturnData([...returnData])
    setCheckedKeys(returnData.map((item) => item.key))
    onStaffChange && onStaffChange(returnData)
    return false
  }
  // 全量的树形数据结构

  const getUserList = () => {
    API.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      if (res.retCode == 200) {
        setTreeDataSoure(res.data)
        // 现在是搜索框内容是被清空的，如果需要保留
        //  const data = dataSourceFormat(res.data,searchVaule)
        const data = dataSourceFormat(res.data)
        setTreeData(data.dataSoure)
        if (data.selectList.length > 0) {
          setReturnData(data.returnDataList)
          setCheckedKeys(data.selectList)
          // 用于编辑回传值
          onStaffChange && onStaffChange(uniqBy(data.returnDataList, 'userId'))
        }
      }
    })
  }

  const [expandedKeys, setExpandedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState([])
  const [searchVaule, setSearchVaule] = useState('')

  useEffect(() => {
    // 编辑的时候
    // if (list && list.length > 0) {
    //   setUserIds(list)
    // }
    setUserIds([...list])
  }, [list])

  useEffect(() => {
    if (isModalVisible) {
      getUserList()
      setSearchVaule('')
    }
  }, [userIds, isModalVisible])

  const onExpand = (keys) => {
    setExpandedKeys(keys)
    setAutoExpandParent(false)
  }

  const onSearchChange = (e) => {
    const { value } = e.target
    setSearchVaule(value)
    e.preventDefault()
  }
  // const getParentKey = (key, tree) => {
  //   let parentKey
  //   for (let i = 0; i < tree.length; i++) {
  //     const node = tree[i]
  //     if (node.children) {
  //       if (node.children.some((item) => item.key === key)) {
  //         parentKey = node.key
  //       } else if (getParentKey(key, node.children)) {
  //         parentKey = getParentKey(key, node.childreƒn)
  //       }
  //     }
  //   }
  //   return parentKey
  // }
  const handleSearchEvent = () => {
    const conentNumNew = 0
    setConentNum(conentNumNew)
    const data = dataSourceFormat(treeDataSoure, searchVaule)
    // console.log(data.dataSoure, treeDataSoure
    setExpandedKeys([])
    setTreeData(data.dataSoure)
    setAutoExpandParent(false)
  }

  const [selectNodeKey, setSelectNodeKey] = useState([]) // 保存所有父子节点选中的key
  // 树绑定选中事件
  const onTreeSelect = (selectKeys, { selected, node }) => {
    const opitonKeys = [...checkedKeys]
    const returnDataNodes = [...returnData]
    // 获取可被选中的叶子节点
    const leafNode = getTreeLeafKeys([node]).filter((item) => !item.disabled)
    // 过滤掉禁止选中的
    const LeafKeys = leafNode.map((item) => item.key)
    // selected 树形控件bug selected返回状态不准确，
    //  setSelectNodeKey 做灵敏度判断处理
    selected = !selectNodeKey.includes(node.key)

    // 选中节点
    if (selected) {
      if (leafNode.length > 0) {
        opitonKeys.push(...LeafKeys)
        returnDataNodes.push(...leafNode)
      } else {
        // 表示他是一个人员，不是部门
        opitonKeys.push(...selectKeys)
        returnDataNodes.push(node)
      }
      selectNodeKey.push(node.key)

      LeafKeys.forEach((item) => {
        if (!selectNodeKey.includes(item)) {
          selectNodeKey.push(item)
        }
      })
    } else {
      // 取消选中
      remove(opitonKeys, (removeItemKey) => {
        const returnBool = node.key == removeItemKey || LeafKeys.includes(removeItemKey)
        return returnBool
      })
      remove(returnDataNodes, (removeItem) => {
        const returnBool = node.key == removeItem.key || LeafKeys.includes(removeItem.key)
        return returnBool
      })
      remove(selectNodeKey, (selectKey) => {
        const returnBool = node.key == selectKey
        return returnBool
      })
    }
    /* 搜索导致无子节点的处理 */
    remove(returnDataNodes, (removeItem) => {
      const returnBool =
        node.key == removeItem.key &&
        ((node.memberInfoList && node.memberInfoList.length > 0) ||
          (node.subDepartList && node.subDepartList.length > 0))
      return returnBool
    })
    remove(opitonKeys, (removeItemKey) => {
      const returnBool =
        node.key == removeItemKey &&
        ((node.memberInfoList && node.memberInfoList.length > 0) ||
          (node.subDepartList && node.subDepartList.length > 0))
      return returnBool
    })
    /* 搜索导致无子节点的处理 end */

    setSelectNodeKey([...uniq(selectNodeKey)])
    setCheckedKeys(uniq(opitonKeys))
    setReturnData(uniqBy(returnDataNodes, 'key'))
  }
  const checkStrictly = false
  const renderImg = (nodeData) => {
    if (nodeData.thumbAvatar) {
      return <Image rootClassName="mr5 radius11" src={nodeData.thumbAvatar} preview={false} width={22} height={22} />
    }
    if (nodeData.userId) {
      return <RsIcon type="icon-morentouxiang" className="f20 mr5" />
    }
    return null
  }
  const titleRender = (nodeData, checkList) => {
    let checked = false // 是否选中
    let indeterminate = false // 全选半选
    if (checkList.length > 0) {
      if (checkStrictly) {
        // 无关联处理
        if (checkList.includes(nodeData.key)) {
          checked = true
        }
      } else {
        /** *****关联处理****** */
        // 检测该node 父亲元素是否被选中，如果被选中，自身也要被选中
        // nodeData.parents  如果这个存在,点击上级选择按钮 全部选中
        const newList = intersection(checkList, nodeData.parents)
        if (checkList.includes(nodeData.key) || newList.length > 0) {
          checked = true
        }
        // 反像处理父类
        if (nodeData.children && nodeData.children.length > 0) {
          // 判断叶子结点是否全部选中，否 设置indeterminate为true,是indeterminate=false checked=true
          const leafKeys = getTreeLeafKeys(nodeData.children).map((item) => item.key)
          const slecetLeafs = intersection(leafKeys, checkList) // 合并相同项目
          /// console.log(leafKeys, slecetLeafs, checkList, '-------leafKeys-- slecetLeafs---checkList---')
          if (leafKeys.length === slecetLeafs.length) {
            indeterminate = false
            checked = true
          } else if (slecetLeafs.length > 0) {
            indeterminate = true
          }
        }
      }
    }

    return (
      <div className="flex-box full-w flex-between">
        <div>
          {renderImg(nodeData)}
          {nodeData.title}
        </div>

        <Checkbox autoFocus indeterminate={indeterminate} checked={checked} />
      </div>
    )
  }
  const onItemColse = (item) => {
    if (item) {
      // icon删除操作
      // 删除
      remove(checkedKeys, (removeItemKey) => {
        const returnBool = item.key == removeItemKey
        return returnBool
      })
      remove(returnData, (removeItem) => {
        const returnBool = item.key == removeItem.key
        return returnBool
      })
      setCheckedKeys([...checkedKeys])
      setReturnData([...returnData])
    } else {
      // 清空操作
      setCheckedKeys([])
      setReturnData([])
    }
  }
  const renderSelectList = (itemList) => (
    <div className="flex-box flex-column">
      {itemList.map((item) => (
        <div className="flex-box full-w flex-between mb16 ">
          <div>
            {renderImg(item)}
            {item.title}
          </div>
          <RsIcon
            className="pointer"
            onClick={() => {
              onItemColse(item)
            }}
            type="icon-guanbi"
          />
        </div>
      ))}
    </div>
  )

  return (
    <div {...props}>
      {type == 'select' ? (
        <Select
          mode="tags"
          style={{ minWidth: '300px', ...style }}
          value={userIds}
          maxTagCount={2}
          showArrow
          placeholder={placeholder}
          open={false}
          onClick={userClick}
          onChange={selectChange}
        >
          {renderOption([])}
        </Select>
      ) : (
        <div>
          <Button icon={<RsIcon type="icon-tianjia" />} type="customize" onClick={userClick} size="small">
            {buttonText}
          </Button>
        </div>
      )}

      <Modal
        title="选择成员"
        className="ant-modal-zdy"
        width={754}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex-box flex-between radius4">
          <div className="borderBody">
            <div className="Body-title">全部成员 ({conentNum})</div>
            <div className="padt16 padr16 padl16 ">
              <Input
                suffix={<RsIcon onClick={handleSearchEvent} type="icon-sousuo" />}
                className="input-search"
                value={searchVaule}
                style={{ dispay: 'none' }}
                placeholder="请输入要搜索的人员名称"
                onPressEnter={handleSearchEvent}
                onChange={onSearchChange}
              />
              <Tree
                onExpand={onExpand}
                height={300}
                blockNode
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                checkedKeys={checkedKeys}
                onSelect={onTreeSelect}
                treeData={treeData}
                titleRender={(e) => titleRender(e, checkedKeys)}
              />
            </div>
          </div>
          <div className="borderBody ">
            <div className="Body-title flex-box flex-between">
              已选择成员({checkedKeys.length})
              <div
                className="text-link f14 pointer"
                onClick={() => {
                  onItemColse()
                }}
              >
                清空
              </div>
            </div>
            <div className="padt16 padr16 padl16 over-y" style={{ maxHeight: '330px' }}>
              {renderSelectList(returnData)}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default StaffSelect
