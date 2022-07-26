import React, { useState, useEffect, useRef } from 'react'

// antd 组件
import { Select, Input, Modal, Form, message, Button } from 'antd'
// 公共组件
import RsIcon from '@RsIcon'
import SearchSelect from '../../comments/publicView/searchSelect'
import Api from '../store/api'
// 导入样式
import '../index.module.less'
import SelectCustom from '../../comments/publicView/screensCustom'

const { Option } = Select

async function fetchUserList(name) {
  const data = {
    page: 1,
    pageSize: 30,
  }
  data.customerGroupNameLike = name
  return Api.getCustomerGroupList(data).then((res) => {
    if (res.retCode == 200) {
      const { list } = res.data
      return list.map((item) => ({
        label: item.groupName,
        value: item.id,
      }))
    }
    return []
  })
}
function CustomerList(props) {
  // 筛选条件
  const [visible, setVisible] = useState(false)
  const formRef = useRef()
  const { onChange } = props
  const [searchObj, setSearchObj] = useState({
    fields: { group1: [] },
  })
  const [attrs, setAttrs] = useState([])
  const [inputValue, setInputValue] = useState()
  const [valueType, setValueType] = useState()
  const handleChange = (item) => {
    // item 是个对象
    //  console.log(item, '-----item-----')
    // 多选处理注释
    // searchObj.groupIds = item.map((itemObj) => item.value)\
    // 单选处理了
    searchObj.groupId = item?.value
    // 一定要这样写，否则不会触发useEffect
    setSearchObj({ ...searchObj })
  }
  const typeChange = (value) => {
    setValueType(value)
    setInputValue('')
  }
  const handleChangeName = (targetValue) => {
    setInputValue(targetValue)
  }

  const handleSearchEvent = () => {
    const obj = {
      ...searchObj,
      groupId: searchObj.groupId,
    }
    obj[valueType] = inputValue
    setSearchObj({ ...obj })
  }
  const getFilterData = (group1List) => {
    const fields = { group1: [] }
    const validateList = []
    group1List.forEach((item, index) => {
      if (item.fieldName && item.where && item.filedValue) {
        fields.group1.push({
          fieldName: item.fieldName,
          value: item.filedValue,
          where: item.where,
          valueType: 1,
        })
      } else {
        validateList.push(index)
      }
    })
    if (validateList.length == group1List.length) {
      // 表示一个完整的条件也没有
      message.error('请填写至少一个完整的筛选，筛选每一项都是必填')
    }
    return fields
  }
  const handleOk = () => {
    const subData = {}
    const listData = formRef.current.getFieldValue('screens')
    if (listData && listData.length > 0) {
      const fields = getFilterData(listData)
      subData.fields = fields
      setSearchObj({ ...searchObj, ...subData })
      if (fields.group1.length > 0) {
        setVisible(false)
      }
    } else {
      message.error('请至少添加一个筛选')
    }
  }

  useEffect(() => {
    if (onChange) {
      onChange(searchObj)
    }
  }, [searchObj])

  useEffect(() => {
    Api.getInitCustomerGroupFileList().then((res) => {
      if (res.retCode == 200) {
        setAttrs(
          res.data.map((item, index) => {
            if (index == 0) {
              setValueType(item.fieldMappingName)
            }
            return {
              label: item.fieldName,
              value: item.fieldMappingName,
            }
          })
        )
      }
    })
  }, [])
  console.log(searchObj)
  return (
    <div>
      <div className="filter-container" style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center' }}>
        <Input.Group compact>
          <SearchSelect
            // mode="multiple"
            showSearch
            placeholder="请输入筛选并选择客户群组"
            fetchOptions={fetchUserList}
            style={{ width: 200, marginRight: 20 }}
            onChange={handleChange}
          />

          <Select bordered placeholder="客户姓名" style={{ width: 120 }} onChange={typeChange}>
            {attrs.map((item) => (
              <Option key={item.label} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>

          <Input
            suffix={
              <RsIcon
                type="icon-sousuo"
                onClick={() => {
                  handleSearchEvent()
                }}
              />
            }
            className="nameSearch"
            style={{ width: '240px' }}
            value={inputValue}
            placeholder="输入关键字回车进行搜索"
            onPressEnter={() => handleSearchEvent()}
            onChange={(e) => handleChangeName(e.target.value)}
          />

          <div
            className="filter-warp-select "
            onClick={() => {
              setVisible(true)
            }}
          >
            <RsIcon style={{ marginRight: '8px' }} type="icon-shaixuan" />
            {searchObj.fields.group1.length > 0 ? (
              <span className="text-link">{`已选择${searchObj.fields.group1.length}项`}</span>
            ) : (
                '筛选'
              )}
          </div>
        </Input.Group>
      </div>
      <Modal
        title="筛选条件"
        onCancel={() => {
          setVisible(false)
        }}
        width={800}
        visible={visible}
        onOk={handleOk}
        okText="搜索"
        footer={[
          <Button
            type="waring"
            danger
            onClick={() => {
              formRef.current.setFieldsValue({
                screens: [],
              })
            }}
          >
            清空搜索条件
          </Button>,
          <Button
            key="back"
            onClick={() => {
              setVisible(false)
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            搜索
          </Button>,
        ]}
      >
        <Form ref={formRef} className="add-group-form pointer">
          <SelectCustom attrs={attrs} />
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerList
