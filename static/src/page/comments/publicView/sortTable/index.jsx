import React from 'react'
import Sortable from 'sortablejs'

function SortableTable(props) {
  const { menus } = props
  const sortableGroupDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      const options = {
        draggable: '.rows',
        animation: '150',
        onEnd: (evt) => {
          const { children } = evt.to
          const { newIndex, oldIndex } = evt // oldIndex 拖动的数据位置，新的数据位置
          console.log(evt, newIndex, oldIndex, children, '----children--')
        },
      }
      Sortable.create(componentBackingInstance, options)
    }
  }
  const renderSelectedItemView = (item, i) => (
    <div className="rows flex-box f18">
      {item.label}
      {i}
    </div>
  )

  return (
    <div className="flex-box flex-column" ref={sortableGroupDecorator}>
      {menus && menus.map((item, i) => renderSelectedItemView(item, i))}
    </div>
  )
}
export default SortableTable
