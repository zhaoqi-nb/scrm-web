/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Select, Button, Form, Input, Col, Row, DatePicker, TimePicker, InputNumber } from 'antd'
import RsIcon from '@RsIcon'
import Api from './api'
import CustomTagNew from '../publicView/customTagNew'
import CityCascader from '../cityCascader'
import './index.module.less'

const { Option } = Select

// labelType为自定义字段的组件类型  1 单行文本  2 多行文本  3 日期  4 时间 5 数值 6 下拉列表  7 复选框 8  单选框 9 级联字段  10 表单组合字段 11地区选择
// valueType为组件关系类型1：字符类型关系；2：单选型关系；3：数值型关系；4：日期型关系；5：多选型关系：
const labelTypeToValueType = {
  1: 1,
  2: 1,
  3: 4,
  4: 4,
  5: 3,
  6: 2,
  7: 5,
  8: 2,
  9: 2,
  10: 1,
  11: 11, // 比较特殊，待定
}
const WHERE = {
  1: '设为',
  2: '清空'
}
function SelectCustom(props) {
  // disabledValue = false, showLength = 0 预览时候两个属性, propsType组件类型默认为custom，筛选客户，event事件
  const { disabledValue = false, formRef, selectType = 'custom' } = props
  const [attrs, setAttrs] = useState([])
  const [valueTypes, setValueTypes] = useState({})
  const [eventList, setEventList] = useState([])
  const [selectValue, setSelectValue] = useState(1)

  useEffect(() => {
    Api.cusFieldConfigList().then((res) => {
      setAttrs(res?.data)
    })
    Api.getCustomerEvents().then((res) => {
      setEventList(res.data)
    })
    Api.getConditionRelationList().then((res) => {
      setValueTypes(res.data)
    })
  }, [])

  const labelTypeList = [
    {
      label: '包含任意一个',
      value: '1',
    },
    {
      label: '全包含',
      value: '2',
    },
    {
      label: '不包含',
      value: '3',
    }
  ]
  // name="screens"  千万不要修改， name="screens" 千万不要动态传递值
  // 获取formList 值 formRef.current.getFieldValue('screens')

  // 编辑或预览赋值formRef.current.setFieldsValue({
  //     screens: 编辑时的数据.map((item) => ({
  //       value: item.value,
  //       where: item.where,
  //       fieldName: item.fieldName,
  //     })),
  //   })
  // 预览时disabledValue=false

  const handleFieldChange = (index, code, value, type) => {
    const { setFieldsValue, getFieldValue } = formRef.current
    const screens = getFieldValue('screens')
    screens[index] = {
      ...screens[index],
      [code]: value,
      // valueType: labelTypeToValueType[type],
      valueType: type,
      value: undefined,
      where: null,
      // fieldName: null
    }
    setFieldsValue({
      screens
    })
  }
  const renderFilterCom = (type, data) => {
    switch (type) { // 1 单行文本  2 多行文本  3 日期  4 时间 5 数值 6 下拉列表  7 复选框 8  单选框 9 级联字段  10 表单组合字段 11地区选择
      case 1:
        return <Input placeholder="请输入" />;
      case 2:
        return <Input placeholder="请输入" />;
      case 3:
        return <DatePicker />;
      case 4:
        return <TimePicker />;
      case 5:
        return <InputNumber />;
      case 6:
        return <Select>
          {data && data.map((v) => <Option key={v.key} value={v.key}>{v.value}</Option>)}
        </Select>;
      case 7:
        return <Select mode="multiple">
          {data && data.map((v) => <Option key={v.key} value={v.key}>{v.value}</Option>)}
        </Select>;
      case 8:
        return <Select>
          {data && data.map((v) => <Option key={v.key} value={v.key}>{v.value}</Option>)}
        </Select>;
      case 11:
        return <CityCascader cityLevel={3} />
      default:
        return <Input placeholder="请输入" />;
    }
  }
  // 客户属性筛选
  const renderShuxing1 = (field, remove) => <Row gutter={24}>
    <Col style={{ width: '140px' }}>
      <Form.Item
        {...field}
        preserve={false}
        name={[field.name, 'fieldName']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select
          onChange={(value, op) => {
            handleFieldChange(field.name, 'fieldName', value, op.type)
            handleFieldChange(field.name, 'showFiledName', op.children, op.type)
          }}
          placeholder="请选择"
          disabled={disabledValue}
        >
          {attrs.map((item) => (
            <Option key={item.key} type={item.type} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    <Form.Item
      {...field}
      hidden
      preserve={false}
      name={[field.name, 'valueType']}
    ><Input />
    </Form.Item>
    <Col style={{ width: '140px' }}>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.screens[field.name]?.valueType != curValues.screens[field.name].valueType}>
        <Form.Item
          {...field}
          name={[field.name, 'where']}
          preserve={false}
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select placeholder="请选择" disabled={disabledValue} onChange={(e) => setSelectValue(e)}>
            {Object.keys(WHERE).map((v) => (
              <Option key={v} value={v}>
                {WHERE[v]}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form.Item>
    </Col>
    <Col style={{ width: selectValue == 1 ? '230px' : '0px' }}>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues?.screens?.[field?.name]?.where != curValues?.screens?.[field?.name]?.where}>
        {({ getFieldValue }) => {
          const fieldName = getFieldValue(['screens', field.name, 'fieldName'])
          const where = getFieldValue(['screens', field.name, 'where'])

          if (where == 2) {
            return null;
          }
          const fieldInfo = attrs.find((v) => v.key == fieldName)
          const { type, nodes } = fieldInfo || {}
          return <Form.Item
            {...field}
            preserve={false}
            name={[field.name, 'filedValue']}
            rules={[{ required: true, message: '请输入筛选条件的值，否则不生效' }]}
          >
            {renderFilterCom(type, nodes)}
          </Form.Item>
        }}
      </Form.Item>
    </Col>

    {!disabledValue && (
      <RsIcon
        type="icon-guanbi"
        className="mt10 text-sub1"
        style={{ marginLeft: '5px' }}
        onClick={() => {
          remove(field.name)
        }}
      />
    )}
  </Row>
  // 客户属性筛选
  const renderShuxing = (field, remove) => <Row gutter={24}>
    <Col style={{ width: '140px' }}>
      <Form.Item
        {...field}
        preserve={false}
        name={[field.name, 'fieldName']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select
          onChange={(value, op) => {
            handleFieldChange(field.name, 'fieldName', value, op.type)
          }}
          placeholder="请选择"
          disabled={disabledValue}
        >
          {attrs.map((item) => (
            <Option key={item.key} type={item.type} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    <Form.Item
      {...field}
      hidden
      preserve={false}
      name={[field.name, 'valueType']}
    ><Input />
    </Form.Item>
    <Col style={{ width: '140px' }}>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.screens[field.name]?.valueType != curValues.screens[field.name].valueType}>
        {({ getFieldValue }) => {
          const nextValueType = getFieldValue(['screens', field.name, 'valueType'])
          const whereList = valueTypes[nextValueType] || {}
          return <Form.Item
            {...field}
            name={[field.name, 'where']}
            preserve={false}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select placeholder="请选择" disabled={disabledValue}>
              {Object.keys(whereList).map((v) => (
                <Option key={v} value={v}>
                  {whereList[v]}
                </Option>
              ))}
            </Select>
          </Form.Item>
        }}
      </Form.Item>
    </Col>
    <Col style={{ width: '230px' }}>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.screens[field.name]?.valueType != curValues.screens[field.name].valueType}>
        {({ getFieldValue }) => {
          const fieldName = getFieldValue(['screens', field.name, 'fieldName'])
          const fieldInfo = attrs.find((v) => v.key == fieldName)
          const { type, nodes } = fieldInfo || {}
          return <Form.Item
            {...field}
            preserve={false}
            name={[field.name, 'value']}
            rules={[{ required: true, message: '请输入筛选条件的值，否则不生效' }]}
          >
            {renderFilterCom(type, nodes)}
          </Form.Item>
        }}
      </Form.Item>
    </Col>

    {!disabledValue && (
      <RsIcon
        type="icon-guanbi"
        className="mt10 text-sub1"
        style={{ marginLeft: '5px' }}
        onClick={() => remove(field.name)}
      />
    )}
  </Row>

  const handelChange = (data, name, code) => {
    const { setFieldsValue, getFieldValue } = formRef.current
    const screens = getFieldValue('screens')
    const result = data?.tagList?.map((item) => ({ ...item, label: item?.name || '', value: item?.id || '' }))
    screens[name] = {
      ...screens[name],
      [code]: { tagList: result },
      value: JSON.stringify(result)
      // fieldName: null
    }
    setFieldsValue({
      screens
    })
  }
  const handelSelect = (data, name, code) => {
    const { setFieldsValue, getFieldValue } = formRef.current
    const screens = getFieldValue('screens')
    const _data = data?.map((item) => ({ ...item, name: item?.label, id: item?.value || '' }))
    screens[name] = {
      ...screens[name],
      [code]: { tagList: _data },
      value: JSON.stringify(_data)
      // fieldName: null
    }
    setFieldsValue({
      screens
    })
  }
  // 客户标签筛选
  const renderLabel = (field, remove) => <Row gutter={24}>
    <Col style={{ width: '140px' }}>
      <Form.Item
        {...field}
        preserve={false}
        name={[field.name, 'where']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select placeholder="请选择" disabled={disabledValue}>
          {labelTypeList.map((item) => (
            <Option key={item.label} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    <Col style={{ width: '270px' }}>
      <Form.Item
        {...field}
        preserve={false}
        name={[field.name, 'value1']}
        rules={[{ required: true, message: '请输入筛选条件的值，否则不生效' }]}
      >
        <CustomTagNew value={{ tagList: [] }} onChange={(data) => handelChange(data, field.name, 'value1')}>
          <Select
            labelInValue
            open={false}
            value={formRef.current.getFieldValue('screens')[field.name]?.value1?.tagList}
            mode="tags"
            onChange={(data) => handelSelect(data, field.name, 'value1')}
          /></CustomTagNew>

      </Form.Item>
    </Col>
    {!disabledValue && (
      <RsIcon
        type="icon-guanbi"
        className="mt10 text-sub1"
        style={{ marginLeft: '5px' }}
        onClick={() => remove(field.name)}
      />
    )}
  </Row>

  // 基于事件
  const renderEvent = (field, remove) => <Row>
    <Col span={22}>
      <Form.Item
        {...field}
        name={[field.name, 'event']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select placeholder="请选择" disabled={disabledValue}>
          {eventList.map((item) => (
            <Option key={item.labelId} value={item.labelId}>
              {item.labelName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    {!disabledValue && (
      <RsIcon
        type="icon-guanbi"
        className="mt10 text-sub1"
        style={{ marginLeft: '5px' }}
        onClick={() => remove(field.name)}
      />
    )}
  </Row>
  const renderUpdateCustom = (field, remove) => <Row gutter={24} className="customer-attr-box">
    <Col>
      <Form.Item
        style={{ marginBottom: 0 }}
      >
        {renderShuxing1(field, remove)}
      </Form.Item>
    </Col>
  </Row>
  // 基于客户
  const renderCustom = (field, remove) => <Row gutter={24} className="customer-attr-box">
    <Col>
      <Form.Item
        {...field}
        preserve={false}
        name={[field.name, 'attrType']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select style={{ width: '170px' }} disabled={disabledValue}>
          <Option key={1} value={1}>客户属性</Option>
          <Option key={2} value={2}>客户标签</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col>
      <Form.Item
        shouldUpdate={(prevValues, curValues) => prevValues.screens[field.name]?.attrType != curValues.screens[field.name]?.attrType}
        style={{ marginBottom: 0 }}
      >
        {({ getFieldValue }) => {
          const nextAttrType = getFieldValue(['screens', field.name, 'attrType'])
          return <>
            {/* 属性 */}
            {nextAttrType == 1 && renderShuxing(field, remove)}
            {/* 标签 */}
            {nextAttrType == 2 && renderLabel(field, remove)}
          </>
        }}
      </Form.Item>
    </Col>
  </Row>

  return (
    <div className="add-group-form pointer">
      <div className="select-user-info flex-box mt30 ">
        {
          selectType != 'updateCustom' && <><div className="flex-box middle mr10 ">且</div>
            <div className="dotted-line" /></>
        }
        <div className={disabledValue ? ' full-w  pr mb-40' : 'full-w  pr'}>
          <Form.List preserve={false} initialValue={[{}]} name="screens">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item key={field.key} noStyle>
                    {selectType == 'custom' && renderCustom(field, remove)}
                    {selectType == 'updateCustom' && renderUpdateCustom(field, remove)}
                    {selectType == 'event' && renderEvent(field, remove)}
                  </Form.Item>
                ))}
                {!disabledValue && (
                  <Form.Item noStyle>
                    <div className="mb-16 pa" style={{ bottom: 0 }}>
                      <Button
                        type="link"
                        // disabled={fields.length >= 5}
                        onClick={() => add()}
                        icon={<RsIcon type="icon-tianjia1" />}
                      >
                        添加筛选
                      </Button>
                    </div>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </div>
      </div>
    </div>
  )
}

export default SelectCustom
