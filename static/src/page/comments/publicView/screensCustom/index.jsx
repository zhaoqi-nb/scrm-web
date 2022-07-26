import React from 'react'

import { Select, Button, Form, Input } from 'antd'
// import { MinusCircleOutlined } from '@ant-design/icons'
import RsIcon from '@RsIcon'

import './index.module.less'

const { Option } = Select

function SelectCustom(props) {
  // disabledValue = false, showLength = 0 预览时候两个属性
  const { attrs = [], disabledValue = false } = props
  // setAttrs([
  //   { label: 'Beijing', value: 'Beijing' },
  //   { label: 'Shanghai', value: 'Shanghai' },
  // ])
  // 字符窜类型
  //   字符类型关系（101-是；102-不是；103-包含；104-开头是；105-结尾是；106开头不是；107-结尾不是；108-为空；109-不为空；110-不包含）"
  // 单选型关系（201-是；202-不是；203-包含；204-不包含；205-为空；206-不为空）
  // 数值型关系（301-大于；302-小于；303-等于；304-大于等于；305-小于等于；306-不等于；307-为空；308-不为空）
  // 日期型关系（401-是；402-不是；403-早于；404-晚于；405-在范围内；406-不在范围内；407-为空；408-不为空）
  // 多选型关系（501-等于某些值；502-不是某些值；503-包含某些值；504-不包含某些值；505-为空；506-不为空某些值）

  const whereList = [
    {
      label: '是',
      value: '101',
    },
    {
      label: '不是',
      value: '102',
    },
    {
      label: '包含',
      value: '103',
    },
    {
      label: '开头是',
      value: '104',
    },
    {
      label: '结尾是',
      value: '105',
    },
    {
      label: '开头不是',
      value: '106',
    },
    {
      label: '结尾不是',
      value: '107',
    },
    {
      label: '为空',
      value: '108',
    },
    {
      label: '不为空',
      value: '109',
    },
    {
      label: '不包含',
      value: '110',
    },
  ]
  // name="screens"  千万不要修改， name="screens" 千万不要动态传递值
  // 获取formList 值 formRef.current.getFieldValue('screens')

  // 编辑或预览赋值formRef.current.setFieldsValue({
  //     screens: 编辑时的数据.map((item) => ({
  //       filedValue: item.value,
  //       where: item.where,
  //       fieldName: item.fieldName,
  //     })),
  //   })
  // 预览时disabledValue=false
  return (
    <div className="select-user-info flex-box mt30">
      <div className="flex-box middle mr10 ">且</div>
      <div className="dotted-line" />
      <div className={disabledValue ? ' full-w  pr mb-40' : 'full-w  pr'}>
        <Form.List initialValue={[{}]} name="screens">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item required={false} key={field.key} className="mb0" noStyle>
                  <div key={field.key} className="customer-attr-box flex-box middle-a">
                    <div className=" mt-24 padr8">客户属性</div>
                    <div className="mr16" style={{ width: '140px' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'fieldName']}
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select disabled={disabledValue}>
                          {attrs.map((item) => (
                            <Option key={item.label} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="mr16" style={{ width: '140px' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'where']}
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select disabled={disabledValue}>
                          {whereList.map((item) => (
                            <Option key={item.label} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div style={{ width: '270px' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'filedValue']}
                        rules={[{ required: true, message: '请输入筛选条件的值，否则不生效' }]}
                      >
                        <Input disabled={disabledValue} />
                      </Form.Item>
                    </div>
                    {!disabledValue && (
                      <RsIcon
                        type="icon-guanbi"
                        className="f16 ml16 mt-24 text-sub1"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </div>
                </Form.Item>
              ))}
              {!disabledValue && (
                <Form.Item noStyle>
                  <div className="mb-16 pa" style={{ bottom: 0 }}>
                    <Button
                      type="link"
                      disabled={fields.length >= 5}
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
  )
}

export default SelectCustom
