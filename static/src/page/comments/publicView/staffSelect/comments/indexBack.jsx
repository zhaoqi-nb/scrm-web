import React, { useState, useEffect } from 'react'
import { Transfer, Tree, Input, Checkbox } from 'antd'
import { intersection, uniqBy } from 'lodash'
// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1

const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: generateTree(children, checkedKeys),
  }))

function TreeTransfer({ dataSource, targetKeys, ...restProps }) {
  const checkStrictly = false // 根据checkStrictly设置的值在 titleRender 做特殊处理
  // const [targetKeys, setTargetKeys] = useState();
  const [expandedKeys, setExpandedKeys] = useState([])

  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const [generateTreeData, setGenerateTreeData] = useState(generateTree(dataSource, targetKeys))

  const transferDataSource = []
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item)
      flatten(item.children)
    })
  }
  flatten(dataSource)
  const getParentKey = (dataList, listKey = []) => {
    dataList.forEach((item) => {
      listKey.push(item.key)
      if (item.children && item.children.length > 0) {
        getParentKey(item.children, listKey)
      }
    })
    return listKey
  }
  /** *
   * 筛选方法不够完善后续，补充
   *
   *1. 树形搜索，应该有高亮匹配，支持部门名称，用户名称搜索，
   *
   *2.不高亮做法=>更高级处理，检索保持树形，且过滤掉没有任何匹配的数据节点
   * ** */
  const getTreeNew = (tree, value) => {
    const newTree = tree.filter((item) => `${item.key}`.indexOf(value) !== -1)
    return newTree.map((item) => {
      if (item.children) {
        item.children = getTreeNew(item.children, value)
      }
      return item
    })
  }

  const searchChange = (e) => {
    // console.log(1111)
    const { value } = e.target

    if (value.length > 0) {
      setExpandedKeys(getParentKey(dataSource).filter((item) => `${item}`.indexOf(value) !== -1))
      setAutoExpandParent(true)
      // 各个层级筛选方法
      setGenerateTreeData(getTreeNew(dataSource, value))
    } else {
      setExpandedKeys([])
      setAutoExpandParent(false)
      setGenerateTreeData(generateTree(dataSource, targetKeys))
    }
  }
  const onExpand = (keys) => {
    setExpandedKeys(keys)
    setAutoExpandParent(false)
  }
  // 获取树的全部叶子节点
  const getTreeLeafKeys = (treeNode, list = []) => {
    treeNode.forEach((item) => {
      if (item.children && item.children.length > 0) {
        getTreeLeafKeys(item.children, list)
      } else {
        list.push(item.key)
      }
    })
    return list
  }
  const titleRender = (nodeData, checkList) => {
    console.log(nodeData, checkList, '------nodeData-----')
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
          const leafKeys = getTreeLeafKeys(nodeData.children)
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
        {nodeData.title}
        <Checkbox autoFocus indeterminate={indeterminate} checked={checked} />
      </div>
    )
  }
  const handleChange = (changeTargetKeys, direction) => {
    if (direction === 'left') {
      // setTargetKeys(targetKeys);
      setGenerateTreeData(generateTree(dataSource, changeTargetKeys))
    }
    restProps.onChange && restProps.onChange(changeTargetKeys)
  }

  return (
    <Transfer
      {...restProps}
      listStyle={{
        width: 300,
        height: 500,
      }}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      handleChange={handleChange}
      render={(item) => `${item.title}`}
      showSelectAll
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys]
          return (
            <div>
              <div className="pad15" style={{ display: 'none' }}>
                <Input onChange={searchChange} />
              </div>
              <div className="over-y" style={{ maxHeight: '458px' }}>
                <Tree
                  blockNode
                  // checkable
                  checkStrictly={checkStrictly}
                  defaultExpandAll
                  expandedKeys={expandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={onExpand}
                  autoExpandParent={autoExpandParent}
                  treeData={generateTreeData}
                  onCheck={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                  titleRender={(e) => titleRender(e, checkedKeys)}
                  onSelect={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                />
              </div>
            </div>
          )
        }
      }}
    </Transfer>
  )
}
// 数据例子，
// const treeData = [
//   { key: '0-0', title: '0-0', parents: [] },
//   {
//     key: '0-1',
//     title: '0-1',
//     children: [
//       {
//         key: '0-1-0',
//         title: '0-1-0',
//         parents: ['0-1'],
//         children: [
//           { key: '0-1-0-0', title: '0-1-0-0', parents: ['0-1', '0-1-0'] },
//           { key: '0-1-0-1', title: '0-1-0-1', parents: ['0-1', '0-1-0'] },
//         ],
//       },
//       { key: '0-1-1', title: '0-1-1', parents: ['0-1'] },
//     ],
//   },
//   { key: '0-2', title: '0-2' },
// ]
/** *
 * 高度定制只是适用选择员工
 * 如修改请联系-郑先虎
 *
 * ** */
function TransferTree(props) {
  const { onChange, treeData, selectedKeys } = props
  const [targetKeys, setTargetKeys] = useState([])
  // 获取树的指定keys节点全部叶子节点
  const getTreeLeafKeys = (treeNode, keys, list = []) => {
    // 返回的是list 平行的全量数据
    if (keys instanceof Array && keys.length > 0) {
      treeNode.forEach((item) => {
        if (item.children && item.children.length > 0) {
          getTreeLeafKeys(item.children, keys, list)
        } else {
          const newList = intersection(keys, item.parents)
          if (newList.length > 0 || keys.includes(item.key)) {
            list.push(item)
          }
        }
      })
    }
    return list
  }
  const onChangeTree = (keys) => {
    // 左边树形选中的全部叶子节点   叶子节点数据是数据库里面全量数据，后续如果加什么过滤器，
    // 改造过滤器通过 props 传递过来。 建议写再 ../publicView/staffSelect/index.js文件中

    const listItem = uniqBy(getTreeLeafKeys(treeData, keys, []), 'id')
    const selectKeys = listItem.map((item) => item.key)
    setTargetKeys(selectKeys)
    onChange && onChange(listItem)
  }
  /**
   * *
   *
   * selectedKeys 外部传递过来的选中值
   *
   *
   * * */
  useEffect(() => {
    if (selectedKeys && selectedKeys.length > 0) {
      onChangeTree(selectedKeys)
    }
  }, [selectedKeys])

  //   const [treeDataNew, setTreeDataNew] = useState(treeData)

  //   const filterOption = (inputValue, item) => {
  //     // if (inputValue) {
  //     //   return item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
  //     // }
  //     setSeachValue(inputValue)
  //     return true
  //   }

  return <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChangeTree} />
}

export default TransferTree
