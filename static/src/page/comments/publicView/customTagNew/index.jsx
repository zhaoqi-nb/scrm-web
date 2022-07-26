import React, { useState, useEffect } from 'react'
import { Modal, Button, Tag } from 'antd'
import RsIcon from '@RsIcon'
import { findIndex } from 'lodash'
import Api from './store/api'

function CustomTagIndex({ value = {}, onChange, ...resProps }) {
  const [tagList, setTagList] = useState([])
  const [allTag, setAllTag] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    if (isModalVisible) {
      Api.queryTagList().then((res) => {
        if (res.retCode == 200) {
          setAllTag(res.data || [])
        }
      })
    }
  }, [isModalVisible])
  useEffect(() => {
    if (value.tagList) {
      setTagList(value.tagList)
    }
  }, [value.tagList])

  const triggerChange = (changedValue) =>
    onChange?.({
      tagList,
      ...value,
      ...changedValue,
    })

  const onTagListChange = () => {
    if (!('tagList' in value)) {
      setTagList(tagList)
    }

    return triggerChange({
      tagList,
    })
  }

  const onUserClick = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    // 确定的时候改变值
    setIsModalVisible(onTagListChange())
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // 点击标签时间
  const onTagClick = (tag) => {
    const index = findIndex(tagList, { id: tag.id })
    const newList = [...tagList]
    if (index == -1) {
      // 添加
      newList.push(tag)
    } else {
      // 删除
      newList.splice(index, 1)
    }
    setTagList(newList)
  }
  // 删除已选中标签事件
  const onCloseTag = (item) => {
    const newList = tagList.filter((listItem) => item.id !== listItem.id)
    // 回显
    setTagList(newList)
  }

  const returnFooter = () => (
    <div className="bg-info flex-box flex-column pad10">
      <div className="bg-info  alignL padl10 padr10" style={{ height: '100px', overflow: 'auto' }}>
        {tagList.map((item, index) => (
          <Tag
            onClose={(e) => {
              onCloseTag(item)
              e.preventDefault()
            }}
            key={index}
            closable
            style={{ marginBottom: 8 }}
          >
            {item.name}
          </Tag>
        ))}
      </div>
      <div className="flex-box middle-a flex-between padl10 padr10">
        <div>
          已选标签{tagList.length}{' '}
          <Button
            type="link"
            onClick={() => {
              setTagList([])
            }}
          >
            清空
          </Button>
        </div>
        <div>
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )

  //   let newTagList = []
  //   useEffect(() => {
  //     newTagList = [...tagList]
  //   }, [tagList])
  return (
    <div>
      {resProps.children ? (
        <div onClick={onUserClick} className="pointer">
          {resProps.children}
        </div>
      ) : (
        <Button type="customize" icon={<RsIcon type="icon-tianjia" />} onClick={onUserClick} size="small">
          添加标签
        </Button>
        )}
      <Modal
        title="选择标签"
        visible={isModalVisible}
        onOk={handleOk}
        className="ant-modal-zdy"
        onCancel={handleCancel}
        footer={returnFooter()}
        centered
      // bodyStyle={{ minHeight: '300px', maxHeight: '500px' }}
      >
        {/* padr10 预留滚动条的位置 */}
        <div className="over-y padr10" style={{ minHeight: '300px', maxHeight: '500px' }}>
          {allTag.map((item) => (
            <div className="flex-box flex-column mb24 borderb-1">
              <div className="text-sub mb10">{item.name}</div>
              <div className="flex-box  flex-wrap">
                {item.labels.map((tag) => {
                  const indexF = findIndex(tagList, { id: tag.id })
                  const colorText = indexF == -1 ? '' : 'blue'
                  return (
                    <div
                      onClick={() => {
                        onTagClick({ ...tag, labelGroupId: item.id })
                      }}
                      className="pointer"
                    >
                      <Tag className="mb10" color={colorText}>
                        {tag.name}
                      </Tag>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default CustomTagIndex
