import React, { useState, useEffect, useRef } from 'react'
import { Switch, Form, Button, message, Radio, Space, Tag, Checkbox, Affix } from 'antd'
// import RsIcon from '@RsIcon'
// import { omit } from 'lodash'
import StaffSelect from '../comments/publicView/staffSelect'
import { optionsCheck } from '../conversation/config'
import './index.less'
import Api from './store/api'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

// const layoutItem = {
//   labelCol: { span: 3 },
//   wrapperCol: { span: 21 },
// }
// const { Option } = Select
function ConverSatinBehaviorSet() {
  const formRef = useRef()

  // 编辑的时候使用
  const [userList, setUserList] = useState([])
  const [userList2, setUserList2] = useState([])
  // const [memberIdsList, setMemberIdsList] = useState([])

  const [btnLoading, setBtnLoading] = useState(false)
  //   // 保存的时候，需要用到这个额文件list 填充attachmentContents
  //   const [viewList, setViewList] = useState([])
  // 格式化数据用于编辑的操作调用
  const dataInfoFormat = (data) => {
    const checkeds = []
    optionsCheck.forEach((item) => {
      if (data[`${item.value}`] == 1) {
        checkeds.push(item.value)
      }
    })
    formRef.current.setFieldsValue({
      messageNoticeFlag: data.messageNoticeFlag == 1,
      messageNoticeFrequency: data.messageNoticeFrequency,
      memberIds: data.auditScopeInfo.map((item) => ({ id: item.memberId, name: item.memberName })), // 监测范围
      memberUser: data.auditUserInfo.map((item) => ({ id: item.memberId, name: item.memberName })), // 接收通知人
      status: data.status == 1,
      checkeds,
    })
    /** 赋值
     * 包括员工
     *文件，switch 开关
     * * */
    const userEditList = data.auditScopeInfo.map((item) => ({
      value: item.memberId,
      label: item.memberName,
    }))
    const userEditList2 = data.auditUserInfo.map((item) => ({
      value: item.memberId,
      label: item.memberName,
    }))

    // 回显
    setUserList(userEditList)
    setUserList2(userEditList2)
    // setFiles
  }

  useEffect(() => {
    const getData = () => {
      Api.getData().then((res) => {
        if (res.retCode == 200) {
          dataInfoFormat(res.data)
        }
      })
    }

    getData()
  }, [])

  const selectChange = (values, type) => {
    if (type == 'memberIds') {
      // 检测范围
      formRef.current.setFieldsValue({
        memberIds: values,
      })
    } else {
      // 通知人
      formRef.current.setFieldsValue({
        memberUser: values,
      })
    }
  }

  // 提交格式化数据处理
  const subFormatData = (data) => {
    const checkeds = data.checkeds || []
    const subData = {
      // 是否开启
      status: data.status ? 1 : 0,
      // 消息通知
      messageNoticeFlag: data.messageNoticeFlag ? 1 : 0,
      // 检测范围
      auditScopeInfo: data.memberIds.map((item) => ({
        // userId: item.userId,
        // userId: item.userId,
        memberId: item.id,
        // memberType: 1,
        // memberType: 1,
      })), // 接收通知人
      auditUserInfo: data.memberUser.map((item) => ({
        // userId: item.userId,
        memberId: item.id,
        // memberType: 1,
      })), /// 成员ID数组
      redpocketFlag: checkeds.includes('redpocketFlag') ? 1 : 0,
      mobileFlag: checkeds.includes('mobileFlag') ? 1 : 0,
      cardFlag: checkeds.includes('cardFlag') ? 1 : 0,
      locationFlag: checkeds.includes('locationFlag') ? 1 : 0,
      // 通知频率
      messageNoticeFrequency: data.messageNoticeFrequency ? 1 : 0,
    }
    // 提交数据
    return subData
  }

  const onFinish = (values) => {
    setBtnLoading(true)
    const data = subFormatData(values)

    Api.saveData(data)
      .then((res) => {
        if (res.retCode == 200) {
          message.success('操作成功', 1)
        } else {
          message.error(res.retMsg)
        }
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }
  const [form] = Form.useForm()
  const memberIdList = Form.useWatch('memberIds', form)
  const memberUserList = Form.useWatch('memberUser', form)
  const statusALL = Form.useWatch('status', form)
  const messageNoticeFlag = Form.useWatch('messageNoticeFlag', form)

  const onCloseTag = (item) => {
    const newList = memberIdList.filter((listItem) => item.id !== listItem.id)
    formRef.current.setFieldsValue({
      memberIds: newList,
    })
    const userEditList = newList.map((newItem) => ({
      value: newItem.id,
      label: newItem.memberName,
    }))

    // 回显
    setUserList(userEditList)
  }
  const onCloseTag2 = (item) => {
    const newList = memberUserList.filter((listItem) => item.id !== listItem.id)
    formRef.current.setFieldsValue({
      memberUser: newList,
    })
    const userEditList = newList.map((newItem) => ({
      value: newItem.id,
      label: newItem.memberName,
    }))

    // 回显
    setUserList2(userEditList)
  }

  return (
    <div className="full">
      <Form {...layout} ref={formRef} form={form} className="full-h" autoComplete="off" onFinish={onFinish}>
        <div className="mt8 mb16 full-h" style={{ maxWidth: '800px' }}>
          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">敏感行为设置</div>
          </div>

          <Form.Item label="敏感行为监测">
            <div className="flex-box padt8">
              <Form.Item name="status" className="flex-box middle-a mb0" valuePropName="checked">
                <Switch />
              </Form.Item>
              <span className="text-sub1 padl8 ">
                开启后，系统将开始监测以下行为，有触发时将生成敏感行为记录（注意：成员和客户都会开启监测）
              </span>
            </div>

            <Form.Item name="checkeds" className={`flex-box middle-a mb0 mt14 ${statusALL == 1 ? '' : 'none-box'}`}>
              <Checkbox.Group options={optionsCheck} />
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="memberIds"
            label="检测范围"
            rules={[
              {
                required: true,
                message: '请选择检测范围成员',
              },
            ]}
          >
            <div className="flex-box flex-column">
              <div className="flex-box middle-a mt6">
                <StaffSelect
                  onStaffChange={(e) => {
                    selectChange(e, 'memberIds')
                  }}
                  className="inblock-box"
                  type="button"
                  buttonText="添加成员"
                  list={userList}
                />
                {/* <span className="text-sub1 padl8">同一个二维码可选择多位员工进行接待，客户扫码后随机分配一名员工</span> */}
              </div>
              {memberIdList && memberIdList.length && memberIdList.map ? (
                <div className="bg-info pad4 padl12 padr12 mt10 over-y" style={{ height: '120px' }}>
                  {memberIdList.map((item, index) => (
                    <Tag
                      onClose={(e) => {
                        onCloseTag(item)
                        e.preventDefault()
                      }}
                      key={index}
                      closable
                      className="mb6"
                    >
                      {item.memberName || item.name}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>
          </Form.Item>

          <Form.Item label="消息通知">
            <div className="flex-box padt8">
              <Form.Item name="messageNoticeFlag" className="flex-box middle-a mb0" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            name="memberUser"
            label="通知接受人"
            rules={[
              {
                required: messageNoticeFlag == 1,
                message: '请选择通知接受人',
              },
            ]}
          >
            <div className="flex-box flex-column">
              <div className="flex-box middle-a mt6">
                <StaffSelect
                  onStaffChange={(e) => {
                    selectChange(e, 'memberUser')
                  }}
                  className="inblock-box"
                  type="button"
                  buttonText="添加成员"
                  list={userList2}
                />
                {/* <span className="text-sub1 padl8">同一个二维码可选择多位员工进行接待，客户扫码后随机分配一名员工</span> */}
              </div>
              {memberUserList && memberUserList.length && memberUserList.map ? (
                <div className="bg-info pad4 padl12 padr12 mt10 over-y" style={{ height: '120px' }}>
                  {memberUserList.map((item, index) => (
                    <Tag
                      onClose={(e) => {
                        onCloseTag2(item)
                        e.preventDefault()
                      }}
                      key={index}
                      closable
                      className="mb6"
                    >
                      {item.memberName || item.name}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>
          </Form.Item>

          <Form.Item label="通知频率">
            <div className="mt6">
              <Form.Item name="messageNoticeFrequency">
                <Radio.Group defaultValue={1}>
                  <Space direction="vertical">
                    <Radio value={0}>
                      每次通知 <span className="text-sub1">（每次触发后，实时推送通知）</span>
                    </Radio>
                    <Radio value={1}>
                      每天通知 <span className="text-sub1">（每天早上8-9点推送昨日数据）</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </Form.Item>
        </div>
        <Affix offsetBottom={0}>
          <div className="flex-box middle ml-24 submitButtonDiv">
            <Button type="primary" loading={btnLoading} htmlType="submit">
              保存
            </Button>
          </div>
        </Affix>
      </Form>
    </div>
  )
}

export default ConverSatinBehaviorSet
