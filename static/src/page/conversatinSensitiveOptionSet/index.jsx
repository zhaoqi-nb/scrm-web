import React, { useState, useEffect, useRef } from 'react'
import { Switch, Form, Button, message, Radio, Space, Tag, Input, Affix } from 'antd'
//
import { useHistory, useLocation } from 'react-router-dom'
import { uniq } from 'lodash'
import StaffSelect from '../comments/publicView/staffSelect'
import TagInput from './comments/tagInput'
import './index.less'
import Api from './store/api'

// const optionsCheck = [
//   { label: '红包转账', value: 'Apple' },
//   { label: '发送手机号', value: 'phone' },
//   { label: '发送名片', value: '1' },
//   { label: '发送位置', value: '2' },
// ]

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
// const layoutItem = {
//   labelCol: { span: 3 },
//   wrapperCol: { span: 21 },
// }
// const { Option } = Select
function ConversatinSensitiveOptionSet() {
  const history = useHistory() // 路由处理
  const location = useLocation()
  //   const [files, setFiles] = useState([])
  //   const [messageValue, setMessageValue] = useState([])
  const formRef = useRef()
  const [detailInfo, setDetailInfo] = useState({})
  // 编辑的时候使用
  const [userList, setUserList] = useState([])
  const [userList2, setUserList2] = useState([])

  const [btnLoading, setBtnLoading] = useState(false)
  //   // 保存的时候，需要用到这个额文件list 填充attachmentContents
  //   const [viewList, setViewList] = useState([])
  const dataInfoFormat = (data) => {
    formRef.current.setFieldsValue({
      messageNoticeFlag: data.messageNoticeFlag == 1,
      messageNoticeFrequency: data.messageNoticeFrequency,
      memberIds: data.sensitiveAuditScopeRefs.map((item) => ({ id: item.memberId, name: item.memberName })), // 监测范围
      memberUser: data.sensitiveAuditUserRefs.map((item) => ({ id: item.memberId, name: item.memberName })), // 接收通知人
      name: data.name,
      sensitiveMatchWordRefs: {
        list: data.sensitiveMatchWordRefs,
      },
    })
    /** 赋值
     * 包括员工
     *文件，switch 开关
     * * */
    const userEditList = data.sensitiveAuditScopeRefs.map((item) => ({
      value: item.memberId,
      label: item.memberName,
    }))
    const userEditList2 = data.sensitiveAuditUserRefs.map((item) => ({
      value: item.memberId,
      label: item.memberName,
    }))

    // 回显
    setUserList(userEditList)
    setUserList2(userEditList2)
    // setFiles
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
    const subData = {
      name: data.name,
      sensitiveMatchWordRefs: data.sensitiveMatchWordRefs.list,
      sensitiveAuditScopeRefs: data.memberIds.map((item) => ({
        //  userId: item.userId,
        memberId: item.id,
        // memberType: 1,
      })), /// 检测范围
      sensitiveAuditUserRefs: data.memberUser.map((item) => ({
        //  userId: item.userId,
        memberId: item.id,
        // memberType: 1,
      })), /// 通知接受人
      messageNoticeFlag: data.messageNoticeFlag ? 1 : 0,
      // 通知频率
      messageNoticeFrequency: data.messageNoticeFrequency ? 1 : 0,
    }

    // 提交数据
    return subData
  }

  const onFinish = (values) => {
    setBtnLoading(true)
    const data = subFormatData(values)
    if (detailInfo.id) {
      data.id = detailInfo.id
      Api.upData(data)
        .then((res) => {
          if (res.retCode == 200) {
            message.success('操作成功', 1, () => {
              history.push({ pathname: '/conversatinSensitiveSet' })
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
              history.push({ pathname: '/conversatinSensitiveSet' })
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
  const [form] = Form.useForm()
  const memberIdList = Form.useWatch('memberIds', form)
  const memberUserList = Form.useWatch('memberUser', form)
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

  const checkTagInput = (_, value) => {
    if (!value) {
      return Promise.resolve()
    }
    if (value.list && value.list.length > 0) {
      if (uniq(value.list).length !== value.list.length) {
        return Promise.reject(new Error('您输入敏感词有相同项,请删除'))
      }
      return Promise.resolve()
    }

    return Promise.reject(new Error('请至少添加一个敏感词'))
  }

  return (
    <div className="full-h">
      <Form {...layout} ref={formRef} className="full-h" form={form} autoComplete="off" onFinish={onFinish}>
        <div className="mt8 mb16 full-h" style={{ maxWidth: '800px' }}>
          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">敏感词设置</div>
          </div>

          <Form.Item
            name="name"
            label="敏感词组名称"
            size="small"
            rules={[
              {
                required: true,
                message: '请输入敏感词组名称',
              },
            ]}
          >
            <Input placeholder="请输入敏感词组，例如：防止对客户消极怠慢" showCount maxLength={20} />
          </Form.Item>
          <Form.Item
            name="sensitiveMatchWordRefs"
            label="敏感词"
            size="small"
            rules={[
              {
                required: true,
                message: '请输入敏感词',
              },
              {
                validator: checkTagInput,
              },
            ]}
          >
            <TagInput />
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
                      style={{ marginBottom: '4px' }}
                    >
                      {item.name}
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
                      style={{ marginBottom: '4px' }}
                    >
                      {item.name}
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
            <Button
              type="text"
              className="mr10"
              onClick={() => {
                history.goBack(-1)
              }}
            >
              返回
            </Button>
            <Button type="primary" loading={btnLoading} htmlType="submit">
              保存
            </Button>
          </div>
        </Affix>
      </Form>
    </div>
  )
}

export default ConversatinSensitiveOptionSet
