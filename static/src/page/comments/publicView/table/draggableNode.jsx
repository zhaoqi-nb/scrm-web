import React, { useRef } from 'react'
import { Checkbox } from 'antd'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { cloneDeep } from 'lodash'

const type = 'DraggableTabNode'

function DraggableTabNode({ index, children, moveNode, isMove }) {
  const ref = useRef()
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      }
    },
    drop: (item) => {
      moveNode(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  if (isMove) drop(drag(ref))
  return (
    <div ref={ref} className={`dragnode ${isOver ? dropClassName : ''} ${!isMove ? 'cursor-not-move' : ''}`}>
      {children}
    </div>
  )
}

export default class DraggableTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { order: [], dataList: [] }
  }

  componentDidMount() {
    this.initData()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataList } = this.props
    if (nextProps.dataList != dataList) {
      this.initData(nextProps)
    }
  }

  initData = ({ dataList } = this.props) => {
    this.setState({
      order: dataList.map((v) => v.columnSort),
      dataList: cloneDeep(dataList),
    })
  }

  // 移动
  moveTabNode = (dragKey, hoverKey) => {
    const { dataList, order } = this.state
    const newOrder = [...order]
    const dragIndex = newOrder.indexOf(dragKey)
    const hoverIndex = newOrder.indexOf(hoverKey)

    newOrder.splice(dragIndex, 1)
    newOrder.splice(hoverIndex, 0, dragKey)

    this.setState(
      {
        order: newOrder,
        dataList: newOrder.map((v) => dataList.find((item) => item.columnSort == v)),
      },
      () => {
        this.props.onChange(this.state.dataList)
      }
    )
  }

  renderDraggableTabNode = (data) => {
    if (!data || !data.length) return null
    return data.map((node) => {
      const { id, columnSort, columnName, editFlag } = node
      return (
        <DraggableTabNode key={id} isMove={Boolean(editFlag)} index={columnSort} moveNode={this.moveTabNode}>
          <Checkbox disabled={!editFlag} value={id}>
            {columnName}
          </Checkbox>
        </DraggableTabNode>
      )
    })
  }

  // 选中
  handleCheckChange = (checkKeys) => {
    this.setState(
      (state) => ({
        dataList: state.dataList.map((v) => ({
          ...v,
          hiddenFlag: checkKeys.indexOf(v.id) == -1 ? 0 : 1,
        })),
      }),
      () => {
        const { dataList } = this.state
        this.props.onChange(dataList)
      }
    )
  }

  render() {
    const { dataList } = this.state
    const checkKeys = dataList.map((v) => v.hiddenFlag && v.id)
    return (
      <DndProvider backend={HTML5Backend}>
        <Checkbox.Group value={checkKeys} style={{ width: '100%' }} onChange={this.handleCheckChange}>
          {this.renderDraggableTabNode(dataList)}
        </Checkbox.Group>
      </DndProvider>
    )
  }
}
