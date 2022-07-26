/* eslint-disable import/named */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Modal, Row, Col, Input, Collapse, Form, DatePicker, InputNumber, Select, message } from 'antd'

import moment from 'moment'
import { isNumber } from 'lodash'
import Api from '../store/api'
import { optionListObj } from '../configData'

const { Panel } = Collapse
const { Option } = Select
// 客户资料需要展示的模块字段：1-基础信息；2-联系信息；3-业务信息；4-系统信息；5-业务信息；6-公域信息；',
const categoryTypeList = {
  1: '基础信息',
  2: '联系信息',
  3: '业务信息',
  // 4: '系统信息',
  // 5: '业务信息',
  // 6: '公域信息',
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const rulesObj = {
  mainFollowRemindCustomerName: [{ required: true, message: '客户名不能为空' }],
  phone: [
    // { required: true, message: '手机号不能为空' },
    {
      pattern: /^[\da-zA-Z_][a-zA-Z\d_-]{4,12}$/,
      message: '请输入正确的手机号',
    },
  ],
  landline: [
    {
      pattern: /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/,
      message: '请输入正确的座机号',
    },
  ],
}

function OptionCustomer(props, ref) {
  const { onOkCallBack } = props
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [addCustomer] = Form.useForm()
  const [filedList, setFiledList] = useState([])
  const [detailInfo, setDetailInfo] = useState({})
  const [loading, setLoading] = useState(false)

  const optionModal = (value, optionData) => {
    if (optionData) {
      setDetailInfo(optionData)
    }
    setIsModalVisible(value)
  }

  const handleAddCustom = async () => {
    // 触发表单验证
    const isValidate = await addCustomer.validateFields().catch((err) => err)
    if (isValidate.errorFields) return false

    // 获取表单数据
    const values = addCustomer.getFieldsValue()
    setLoading(true)
    if (detailInfo.id) {
      values.id = detailInfo.id
      Api.updateCustomerBasicInformation(values).then((res) => {
        if (res.retCode == 200) {
          setLoading(false)
          message.success('操作成功', 1, () => {
            setIsModalVisible(false)
            onOkCallBack && onOkCallBack()
          })
        } else {
          message.error(res.retMsg)
        }
      })
    } else {
      Api.manualAddCustomerInfo(values).then((res) => {
        if (res.retCode == 200) {
          setLoading(false)
          message.success('操作成功', 1, () => {
            setIsModalVisible(false)
            onOkCallBack && onOkCallBack()
          })
        } else {
          message.error(res.retMsg)
        }
      })
    }
    // 调用 API
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const renderItem = (filedItem) => {
    const type = filedItem.columnType // 1：字符类型关系；2：单选型关系；3：数值型关系；4：日期型关系；5：多选型关系：',
    const rules = []
    let optionList = []
    const opitonObj = optionListObj[filedItem.columnValue]
    if (opitonObj) {
      optionList = Object.keys(opitonObj).map((key) => ({
        label: opitonObj[key],
        value: `${key}`,
      }))
    }

    /** *******验证规则处理******* */
    if (filedItem.mandatoryFlag == 1) {
      // 1,必填，2非必填
      rules.push({ required: true, message: `${filedItem.columnName}不能为空` })
    }
    if (rulesObj[filedItem.columnValue]) {
      rules.push(...rulesObj[filedItem.columnValue])
    }
    /** *******编辑时候值处理******* */

    switch (type) {
      case 1:
        return (
          <Form.Item
            label={filedItem.columnName}
            labelCol={{ span: 6 }}
            name={`${filedItem.columnValue}`}
            rules={[...rules]}
          >
            <Input placeholder={`请输入${filedItem.columnName}`} />
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={filedItem.columnName}
            labelCol={{ span: 6 }}
            name={filedItem.columnValue}
            rules={[...rules]}
          >
            <Select placeholder={`请选择${filedItem.columnName}`}>
              {optionList.map((item) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )
      case 3:
        return (
          <Form.Item
            label={filedItem.columnName}
            labelCol={{ span: 6 }}
            name={filedItem.columnValue}
            rules={[...rules]}
          >
            <InputNumber placeholder="请输入数字" min={0} max={300} />
          </Form.Item>
        )
      case 4:
        return (
          <Form.Item
            label={filedItem.columnName}
            labelCol={{ span: 6 }}
            name={filedItem.columnValue}
            rules={[...rules]}
          >
            <DatePicker placeholder={`请选择${filedItem.columnName}`} />
          </Form.Item>
        )

      default:
        return null
    }
  }

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // onCallback 就是暴露给父组件的方法
    optionModal,
  }))

  useEffect(() => {
    if (detailInfo.id) {
      // detailInfo.birthday = detailInfo.birthday ? moment(detailInfo.birthday) : ''
      Object.keys(detailInfo).forEach((key) => {
        // 日期字段特殊处理
        if (['birthday'].includes(key)) {
          detailInfo[key] = detailInfo[key] ? moment(detailInfo[key]) : ''
          // 单选是number
        } else if (isNumber(detailInfo[key])) {
          detailInfo[key] = `${detailInfo[key]}`
        }
      })
      addCustomer.setFieldsValue({
        ...detailInfo,
      })
    }
  }, [detailInfo])

  useEffect(() => {
    const getDataListByLoginHolder = () => {
      Api.getDataListByLoginHolder().then((res) => {
        if (res.retCode == 200) {
          const list = res.data || []
          const newList = []
          list
            .filter(
              (item) =>
                item.status == 1 && item.editFlag == 1 && item.hiddenFlag == 1 && categoryTypeList[item.categoryType]
            )
            .forEach((item) => {
              const groupObj = {
                groupId: item.categoryType,
                groupName: categoryTypeList[item.categoryType],
                filedList: [{ ...item }],
              }
              let isAdd = true
              if (newList.length > 0) {
                newList.forEach((newItem) => {
                  if (newItem.groupId == groupObj.groupId) {
                    isAdd = false
                    newItem.filedList.push(item)
                  }
                })
              }
              if (isAdd) {
                newList.push(groupObj)
              }
            })
          setFiledList([...newList])
        }
      })
    }
    getDataListByLoginHolder()
  }, [])

  return (
    <div>
      <Modal
        width={796}
        title="创建客户"
        visible={isModalVisible}
        onOk={handleAddCustom}
        onCancel={handleCancel}
        okText="保存"
        confirmLoading={loading}
        destroyOnClose
        centered
        wrapClassName="add-custom-modle"
      >
        <div className="add-custom-dialog">
          <Form {...layout} form={addCustomer} reserve={false} autoComplete="off" colon={false} labelAlign="right">
            <Collapse defaultActiveKey={['1', '2', '3']} ghost expandIconPosition="right">
              {filedList.map((item) => (
                <Panel header={item.groupName} key={item.groupId}>
                  <Row className="flex-box  flex-wrap full-w">
                    {item.filedList.map((filedItem) => (
                      <Col span={12}>{renderItem(filedItem)}</Col>
                    ))}
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default forwardRef(OptionCustomer)
