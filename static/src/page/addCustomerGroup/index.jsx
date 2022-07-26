import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Radio, InputNumber, message } from 'antd'

import { useHistory, useLocation } from 'react-router-dom'
import SelectCustom from '../comments/publicView/screensCustom'
import StaffSelect from '../comments/publicView/staffSelect'
import Api from './store/api'

function Index() {
  const history = useHistory() // 路由处理
  const location = useLocation()
  const [userList, setUserList] = useState([])
  const [detailInfo, setDetailInfo] = useState({})
  const [showUpdate, setShowUpdate] = useState(true)
  const [customCount, setCustomCount] = useState(0)
  const [attrs, setAttrs] = useState([])
  const formRef = useRef()

  // initialValues 表单数据初始化
  const [initialValues] = useState({ showBoundary: 1, updateType: 1 })
  // 确定按钮的状态
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    Api.getInitCustomerGroupFileList().then((res) => {
      if (res.retCode == 200) {
        setAttrs(
          res.data.map((item) => ({
            label: item.fieldName,
            value: item.fieldMappingName,
          }))
        )
      }
    })
  }, [])

  // 编辑回显数据格式化
  const dataInfoFormat = (data) => {
    // // 选择员工处理

    if (data.customerCount > 0) {
      setCustomCount(data.customerCount)
      if (data.customerCount > 0) {
        setShowUpdate(false)
      } else {
        setShowUpdate(true)
      }
    }
    /** 赋值
     * * */
    if (data.showBoundary == 3) {
      const userEditList = data.boundaryValue.split(',').map((item) => ({
        value: item,
        label: '',
      }))
      // 回显
      setUserList(userEditList)
    }

    formRef.current.setFieldsValue({
      groupName: data.groupName,
      showBoundary: data.showBoundary,
      updateType: data.updateType,
      cycleValue: data.cycleValue,
      screens: data.fields.group1.map((item) => ({
        filedValue: item.value,
        where: item.where,
        fieldName: item.fieldName,
      })),
    })
  }
  // group1List是 group1一组， group2List，或另外一组 2022年5月20号不做
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
  // 提交数据格式化，
  const subFormatData = (data) => {
    const subData = {
      groupName: data.groupName,
      showBoundary: data.showBoundary || 1,
      updateType: data.updateType || 1,
      cycleValue: data.cycleValue || '',
      // boundaryValue: data.memberIds.map((item) => item.id).join(','), // 多个员工
    }
    if (data.showBoundary == 3) {
      subData.boundaryValue = data.memberIds.map((item) => item.id).join(',')
    }

    const listData = formRef.current.getFieldValue('screens')
    if (listData && listData.length > 0) {
      const fields = getFilterData(listData)
      subData.fields = fields
    } else {
      message.error('请至少添加一个筛选')
    }
    return subData
  }

  useEffect(() => {
    const getData = (id) => {
      Api.getData({ id }).then((res) => {
        if (res.retCode == 200) {
          setDetailInfo(res.data)
          dataInfoFormat(res.data)
        } else {
          setDetailInfo({ id })
        }
      })
    }
    if (location.state && location.state.id) {
      getData(location.state.id)
    }
  }, [location.state])

  const clickView = () => {
    const listData = formRef.current.getFieldValue('screens')
    let isExecute = false
    let data = {}
    if (listData && listData.length > 0) {
      isExecute = true
      // isExecute = listData.every(item => {
      //   return item.fieldName&&item.where&&item.filedValue
      // })
      data = getFilterData(listData)
    } else {
      message.error('请至少添加一个筛选')
    }

    if (data.group1[0]) {
      isExecute = true
    } else {
      // 表示一条合规的数据也不存在
      isExecute = false
    }

    if (isExecute) {
      Api.getGroupGetCount({ fields: data })
        .then((res) => {
          if (res.retCode == 200) {
            const { count = 0 } = res.data || {}
            setCustomCount(count)
          }
        })
        .finally(() => {
          if (customCount > 0) {
            setShowUpdate(false)
          } else {
            setShowUpdate(true)
          }
        })
    }
  }
  const selectChange = (values) => {
    // 使用员工处理
    formRef.current.setFieldsValue({
      memberIds: values,
    })
  }

  const onFinish = (values) => {
    const data = subFormatData(values)
    if (detailInfo.id) {
      data.id = detailInfo.id
      Api.upData(data)
        .then((res) => {
          if (res.retCode == 200) {
            message.success('操作成功', 1, () => {
              history.goBack(-1)
            })
          } else {
            message.error(res.retMsg)
          }
        })
        .finally(() => {
          setBtnLoading(false)
        })
    } else {
      Api.saveData(data)
        .then((res) => {
          if (res.retCode == 200) {
            message.success('操作成功', 1, () => {
              history.goBack(-1)
            })
          } else {
            message.error(res.retMsg)
          }
        })
        .finally(() => {
          setBtnLoading(false)
        })
    }
  }

  // 筛选客户结构
  const renderSelectCustom = () => (
    <div className="select-user-box">
      <div>
        <span>
          预计满足条件客户数
          {customCount > 0 ? <span>{customCount}</span> : ''}
        </span>
        {showUpdate ? (
          <Button type="link" onClick={clickView}>
            点击查看
          </Button>
        ) : (
          <Button type="link" onClick={clickView}>
            更新
          </Button>
        )}
      </div>
      <SelectCustom attrs={attrs} />
    </div>
  )

  const [form] = Form.useForm()
  const updateTypeChange = Form.useWatch('updateType', form)
  const showBoundaryChange = Form.useWatch('showBoundary', form)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">创建客户分群</div>
      </div>

      <Form
        labelCol={{ span: 2 }}
        ref={formRef}
        form={form}
        className="add-group-form"
        autoComplete="off"
        onFinish={onFinish}
        initialValues={initialValues}
        colon={false}
      >
        {/* 群组名称 */}
        <Form.Item label="群组名称" name="groupName" rules={[{ required: true, message: '请输入群组名称' }]}>
          <Input
            style={{ width: 550, height: 34, backgroundColor: 'none', padding: '0 10px' }}
            placeholder="请输入群组名称"
            showCount
            maxLength={20}
          />
        </Form.Item>

        {/* 群组可见范围 */}
        <Form.Item label="群组可见范围">
          <Form.Item className="add-group-gangen" name="showBoundary">
            <Radio.Group>
              <Radio value={1}>仅自己可见</Radio>
              <Radio value={2}>全体成员</Radio>
              <Radio value={3}>指定成员可见</Radio>
            </Radio.Group>
          </Form.Item>
          {showBoundaryChange === 3 && (
            <div className="flex-box middle-a  ">
              {/* <div className="mr8">使用员工:</div> */}
              <Form.Item
                noStyle
                name="memberIds"
                rules={[
                  {
                    required: true,
                    message: '请选择使用员工',
                  },
                ]}
              >
                <StaffSelect
                  onStaffChange={(e) => {
                    selectChange(e)
                  }}
                  list={userList}
                />
              </Form.Item>
            </div>
          )}
        </Form.Item>

        {/* 群组更新周期 */}
        <Form.Item label="群组更新周期">
          <div className="flex-box middl-a">
            <Form.Item style={{ display: 'flex' }} className="group-update-time" name="updateType">
              <Radio.Group>
                <Radio value={1}>静态群组</Radio>
                <Radio value={2}>手动更新</Radio>
                <Radio value={3}>周期性更新</Radio>
              </Radio.Group>
            </Form.Item>
            {updateTypeChange === 3 && (
              <>
                <Form.Item
                  name="cycleValue"
                  rules={[
                    {
                      required: true,
                      message: '请输入周期更新天数',
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="请输入周期更新天数"
                    className="enter-update-time"
                    style={{ width: 244 }}
                  />
                </Form.Item>
                <div className="pad8"> 天</div>
              </>
            )}
          </div>
        </Form.Item>
        {/* 筛选筛选客户 */}
        <Form.Item label="筛选客户">{renderSelectCustom()}</Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="text"
            className="mr10"
            onClick={() => {
              history.goBack(-1)
            }}
          >
            返回
          </Button>
          <Button loading={btnLoading} type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Index
