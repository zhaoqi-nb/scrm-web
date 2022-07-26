import React, { useState, useEffect, useRef } from 'react'
import { Input, Tag } from 'antd'
// 自定义form 订单
function TagInput({ value = {}, onChange }) {
  const inputRef = useRef(null)
  const [inputText, setInputText] = useState('')
  const [tagList, setTagList] = useState([])
  const triggerChange = (changedValue) =>
    onChange?.({
      list: tagList,
      ...value,
      ...changedValue,
    })
  const onInputKeyUp = (e) => {
    const tageListLength = tagList.length
    if (e.keyCode == 8 && tageListLength > 0 && inputText.length == 0) {
      const optionList = [...tagList]
      optionList.splice(tageListLength - 1, 1)
      setTagList(optionList)
      triggerChange({ list: optionList })
    }
  }
  const onInputChange = (e) => {
    setInputText(e.target.value)
  }
  const onChangeTag = (e) => {
    if (inputText) {
      tagList.push(inputText)
      setTagList([...tagList])
      triggerChange({ list: tagList })
    }
    setInputText('')
    e.preventDefault()
  }

  useEffect(() => {
    if (value.list && value.list.length > 0) {
      setTagList([...value.list])
    }
  }, [value.list])

  const onCloseTagList = (e, index) => {
    const optionList = [...tagList]
    optionList.splice(index, 1)
    setTagList(optionList)
    triggerChange({ list: optionList })
    e.preventDefault()
  }
  const renderTagList = (list) =>
    list.map((item, index) => (
      <div className="mt8 mb8">
        <Tag
          closable
          className=""
          onClose={(e) => {
            onCloseTagList(e, index)
          }}
        >
          {item}
        </Tag>
      </div>
    ))
  return (
    <div
      className="flex-box flex-wrap middle-a padl8 radius8"
      onClick={() => {
        inputRef.current.focus({
          cursor: 'end',
        })
      }}
      style={{ border: '1px solid #E1E8F0' }}
    >
      {tagList && tagList.map && renderTagList(tagList)}
      <Input
        type="text"
        bordered={false}
        value={inputText}
        ref={inputRef}
        onChange={onInputChange}
        onPressEnter={onChangeTag}
        maxLength={10}
        onKeyUp={onInputKeyUp}
        // className="bg-white"
        placeholder="请输入关键词，确认请按，回车后可继续添加"
        style={{
          width: 360,
          bottom: '0px',
          background: '#fff',
        }}
      />
    </div>
  )
}

export default TagInput
