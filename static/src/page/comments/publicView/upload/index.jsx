import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Image } from 'antd'
import update from 'immutability-helper'
import RsIcon from '@RsIcon'
import UploadDropType from './commnet/upload'

const type = 'DragableUploadList'

function DragableUploadListItem({ moveRow, file, fileList, onEdeitClick, onDelClick, ...restProps }) {
  const ref = React.useRef()
  const index = fileList.indexOf(file)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drop(drag(ref))

  const optionBtn = () => (
    <div className="flex-box">
      <div
        onClick={() => {
          onEdeitClick()
        }}
      >
        <RsIcon type="icon-bianji" className="f20 ml10" />
      </div>
      <div
        onClick={() => {
          onDelClick()
        }}
      >
        <RsIcon type="icon-shanchu" className="f20 ml10" />
      </div>
    </div>
  )
  const dargItemRender = (item) => {
    if (['file', 'video', 'link'].includes(item.fileType)) {
      const typeIcons = {
        link: 'icon-lianjie',
        video: 'icon-shipin',
        file: 'icon-wenjian',
      }
      return (
        <div className="flex-box middle-a between mb12 ">
          <div className="padt9 padb9 padl12 padr12 bg-panel box-sh flex1 f14" key={index} style={{ cursor: 'move' }}>
            <RsIcon type={typeIcons[item.fileType]} className="mr3 f18" /> {item.link || item.fileName}
          </div>
          {optionBtn()}
        </div>
      )
    }
    if (item.fileType == 'img') {
      return (
        <div className="flex-box mb12">
          <div style={{ cursor: 'move' }}>
            <Image width={120} src={item.url} />
          </div>
          <div className="flex-box flex-end-a">{optionBtn()}</div>
        </div>
      )
    }
    return null
  }

  return (
    <div ref={ref} {...restProps} className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}>
      {dargItemRender(file, index)}
    </div>
  )
}

function DragSortingUpload(props) {
  const { onChange, files, linkType } = props
  const [fileList, setFileList] = useState([])
  // 控制编辑数据
  const [optionData, setOptionData] = useState({})
  // 控制弹框
  const [showModal, setShowModal] = useState(false)

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex]
      const list = update(fileList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      })

      setFileList(list)
      console.log('一级回传数据2', fileList)
      onChange && onChange(fileList)
    },
    [fileList, onChange]
  )
  useEffect(() => {
    setFileList(files)
  }, [files])

  const updateFileList = (item) => {
    // 对数据进行更新
    let optionList = [...fileList]
    if (item.index === -1) {
      optionList.push(item)
    } else {
      fileList.splice(item.index, 1, item)
      optionList = [...fileList]
    }
    setFileList(optionList)

    onChange && onChange(optionList)
  }

  const onUploadChange = (info) => {
    // info点击弹框确定按钮回传的值
    updateFileList(info)
  }
  const onEdeitClick = (item) => {
    // 编辑数据
    setOptionData(item)
    // 打开弹框
    setShowModal(true)
  }
  const onDelClick = (item) => {
    let optionList = []
    fileList.splice(item.index, 1)
    optionList = [...fileList]
    onChange && onChange(optionList)
    setFileList(optionList)
  }

  // const dargItemsRender = () => (
  //   <div>
  //     {fileList.map((item) => (
  //       <DragableUploadListItem
  //         key={new Date().getTime()}
  //         onEdeitClick={() => {
  //           onDelClick(item)
  //         }}
  //         onDelClick={() => {
  //           onEdeitClick(item)
  //         }}
  //         file={item}
  //         fileList={fileList}
  //         moveRow={moveRow}
  //       />
  //     ))}
  //   </div>
  // )

  return (
    <div className="flex-box  flex-column bg-white radius-b4 border1 full-w">
      <div className="flex-box flex-between middle-a m5 m-l1 padr12 padl12">
        {fileList.length < 9 ? (
          <UploadDropType
            linkType={linkType || 'link'}
            data={{ type: 0 }}
            optionData={optionData}
            showModal={showModal}
            onChange={onUploadChange}
          />
        ) : (
          <div>最多添加9个</div>
        )}
        <div className="text-sub1 f12">注：由于企微限制最多发送1条文字+9个附件</div>
      </div>
      {fileList.length ? (
        <div className="pad12 bordert-1 ">
          <DndProvider backend={HTML5Backend}>
            {fileList.map((item, index) => (
              <DragableUploadListItem
                key={index}
                onEdeitClick={() => {
                  onEdeitClick({ ...item, index })
                }}
                onDelClick={() => {
                  onDelClick({ ...item, index })
                }}
                file={item}
                fileList={fileList}
                moveRow={moveRow}
              />
            ))}
          </DndProvider>
        </div>
      ) : null}
    </div>
  )
}

export default DragSortingUpload
