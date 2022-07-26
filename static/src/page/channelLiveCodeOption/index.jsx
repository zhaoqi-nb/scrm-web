import React, { useState, useEffect, useRef } from 'react'
import { Switch, Form, Button, Input, message, Radio, Typography, Tag, Affix } from 'antd'
//
import { useHistory, useLocation } from 'react-router-dom'
import RsIcon from '@RsIcon'
import { omit } from 'lodash'
import StaffSelect from '../comments/publicView/staffSelect'

import DragSortingUpload from '../comments/publicView/upload'
import PhoneView from '../comments/publicView/phoneView'
import CustomTagIndex from '../comments/publicView/customTagNew'

import './index.less'
import Api from './store/api'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
const layoutItem = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
// const { Option } = Select
function ChannelLiveCodeOption() {
  const history = useHistory() // 路由处理
  const location = useLocation()
  const [files, setFiles] = useState([])
  const [messageValue, setMessageValue] = useState([])
  const formRef = useRef()
  const [detailInfo, setDetailInfo] = useState({})
  // const [loading, setLoading] = useState(false)
  // 编辑的时候使用
  const [userList, setUserList] = useState([])

  // const [memberIdsList, setMemberIdsList] = useState([])

  const [btnLoading, setBtnLoading] = useState(false)
  // 保存的时候，需要用到这个额文件list 填充attachmentContents
  const [viewList, setViewList] = useState([])
  // 格式化数据用于编辑的操作调用
  const dataInfoFormat = (data) => {
    formRef.current.setFieldsValue({
      welcomeType: data.welcomeType,
      codeName: data.codeName,
      nickRemarkStatus: data.nickRemarkStatus == 1,
      nickRemarkContent: data.nickRemarkContent,
      memberIds: data.members,
      friendCheck: data.friendCheck == 1,
      customTags: {
        tagList: data.labels.map((item) => {
          const newItem = omit(item, 'id')
          return { ...newItem, name: item.labelName, id: item.labelId }
        }),
      },
    })
    /** 赋值
     * 包括员工
     *文件，switch 开关
     * * */
    const userEditList = data.members.map((item) => ({
      value: item.memberId,
      label: item.name,
    }))

    // 回显
    setUserList(userEditList)

    // 欢迎语处理
    if (data.welcomeType == 1) {
      const welcomeMessageInfo = data.welcomeMessageInfo

      formRef.current.setFieldsValue({
        message: welcomeMessageInfo.message,
      })
      setMessageValue(welcomeMessageInfo.message)
      setDetailInfo({ ...data, message: welcomeMessageInfo.message })
      const filelist = welcomeMessageInfo.attachmentContents ? JSON.parse(welcomeMessageInfo.attachmentContents) : []
      // 回显示
      setFiles(filelist)
      // 保存时候需要
      setViewList(filelist)
    }

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

  const selectChange = (values) => {
    // 使用员工处理
    formRef.current.setFieldsValue({
      memberIds: values,
    })
  }
  // 提交文件数据是格式化
  const attachmentContentsFormatSub = (list) =>
    JSON.stringify(
      list.map((viewItem) => {
        const backData = {
          msgtype: viewItem.fileType,
          msgContent: {},
          ...omit(viewItem, 'index'),
        }
        if (viewItem.fileType == 'link') {
          backData.msgContent = {
            title: viewItem.linkTitle,
            picurl: viewItem.imgData && viewItem.imgData.url,
            desc: viewItem.linkDesc,
            url: viewItem.link,
          }
        } else if (viewItem.fileType == 'file') {
          backData.msgContent = {
            fileurl: viewItem.url,
          }
        } else if (viewItem.fileType == 'video') {
          backData.msgContent = {
            videourl: viewItem.url,
          }
        } else if (viewItem.fileType == 'img') {
          backData.msgtype = 'image'
          backData.msgContent = {
            media_id: 'MEDIA_ID',
            picurl: viewItem.url,
          }
        }
        return backData
      })
    )
  // 提交格式化数据处理
  const subFormatData = (data) => {
    const subData = {
      codeName: data.codeName,
      members: data.memberIds.map((item) => ({
        userId: item.userId,
        memberId: item.id,
        memberType: 1,
      })), /// 成员ID数组
      welcomeType: data.welcomeType || 1, // 1好友欢迎语;2群欢迎语;3渠道活码;
      nickRemarkStatus: data.nickRemarkStatus ? 1 : 0,
      nickRemarkContent: data.nickRemarkContent,
      friendCheck: data.friendCheck ? 1 : 0,
      receiveTimeFlag: 0, // 写死
    }
    if (subData.welcomeType == 1) {
      subData.welcomeMessageInfo = {
        message: data.message,
        attachmentContents: '',
      }
      if (viewList && viewList.length > 0) {
        subData.welcomeMessageInfo.attachmentContents = attachmentContentsFormatSub(viewList)
      }
    }
    const customTags = data.customTags
    if (customTags && customTags.tagList && customTags.tagList.length > 0) {
      subData.labels = customTags.tagList.map((item) => ({
        labelGroupId: item.labelGroupId,
        labelId: item.id,
      }))
    }

    // if (data.splitTimeRefVos && data.splitTimeRefVos.length > 0 && checkSw) {
    //   subData.splitTimeRefVos = data.splitTimeRefVos.map((splitTimeItem) => ({
    //     weeks: splitTimeItem.weeks.join(','),
    //     startingTime: moment(splitTimeItem.timeList[0]).format('HH:mm'),
    //     endTime: moment(splitTimeItem.timeList[1]).format('HH:mm'),
    //     message: splitTimeItem.message,
    //     attachmentContents: attachmentContentsFormatSub(splitTimeItem.fileList),
    //   }))
    // }

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
  const onDataMessge = (key, value) => {
    if (key == 'message') {
      formRef.current.setFieldsValue({
        message: value,
      })
      setMessageValue(value)
    }
  }
  const onFileChange = (list) => {
    // 添加附件 更新操作完成之后每次回传的数据
    setViewList(list)
    // 需要添加一个formItem ，name="attachmentContents"
    // formRef.current.setFieldsValue({
    //   attachmentContents: list,
    // })
  }
  const onRadioWelcomeTypeChange = (e) => {
    if (e.target.value == 1) {
      setFiles(viewList)
    }
    setMessageValue('')
  }
  const [form] = Form.useForm()
  const newRemarkValue = Form.useWatch('nickRemarkContent', form)
  const nickRemarkStatus = Form.useWatch('nickRemarkStatus', form)
  const memberIdList = Form.useWatch('memberIds', form)
  const customTags = Form.useWatch('customTags', form)
  const CustomTagList = (customTags && customTags.tagList) || []
  // 欢迎语设置  1渠道欢迎语;2默认欢迎语;3不发送欢迎语
  const welcomeType = Form.useWatch('welcomeType', form) || 1
  const messageInfo = Form.useWatch('message', form)

  const onCloseTag = (item) => {
    const newList = memberIdList.filter((listItem) => item.id !== listItem.id)
    formRef.current.setFieldsValue({
      memberIds: newList,
    })
    const userEditList = newList.map((newItem) => ({
      value: newItem.id,
      label: newItem.name,
    }))
    // 回显
    setUserList(userEditList)
  }
  const onCloseCustomTags = (item) => {
    const newList = CustomTagList.filter((listItem) => item.id !== listItem.id)
    formRef.current.setFieldsValue({
      customTags: { tagList: newList },
    })
  }

  return (
    <div>
      <Form
        {...layout}
        ref={formRef}
        form={form}
        className="channelLiveCodeOption-form"
        autoComplete="off"
        onFinish={onFinish}
        colon={false}
      >
        <div className="mt8 mb16" style={{ maxWidth: '800px' }}>
          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">{location?.state?.id ? '修改活码' : '新建活码'}</div>
          </div>
          <div className="titleText ">基础信息</div>
          <Form.Item
            name="codeName"
            label="活码名称"
            // size="small"
            rules={[
              {
                required: true,
                message: '请输入活码名称',
              },
            ]}
          >
            <Input placeholder="名称不会展现给客户，用于记录场景" showCount maxLength={30} />
          </Form.Item>
          <Form.Item
            name="memberIds"
            label="添加成员"
            rules={[
              {
                required: true,
                message: '请选择使用员工',
              },
            ]}
          >
            <div className="flex-box flex-column">
              <div className="flex-box middle-a">
                <StaffSelect
                  onStaffChange={(e) => {
                    selectChange(e)
                  }}
                  className="inblock-box"
                  type="button"
                  buttonText="添加成员"
                  list={userList}
                  key={JSON.stringify(userList)}
                />
                <span className="text-sub1 padl8">同一个二维码可选择多位员工进行接待，客户扫码后随机分配一名员工</span>
              </div>
              {memberIdList && memberIdList.length && memberIdList.map ? (
                <div className="bg-info pad4 padl12 padr12 mt10 over-y" style={{ height: '120px' }}>
                  {memberIdList.map((item, index) => (
                    <Tag
                      onClose={(e) => {
                        onCloseTag(item)
                        e.preventDefault()
                      }}
                      className="mb6"
                      key={index}
                      closable
                    >
                      {item.name}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>
          </Form.Item>
          <Form.Item name="receiveTimeFlag" label="接待时间" className="flex-box middle-a">
            <Radio value={0} checked>
              全天在线
            </Radio>
          </Form.Item>
          <Form.Item label="自动通过好友">
            <div className="flex-box padt8">
              <Form.Item name="friendCheck" className="flex-box middle-a mb0" valuePropName="checked">
                <Switch />
              </Form.Item>
              <span className="text-sub1 padl8">客户添加时无需经过确认自动成为好友</span>
            </div>
          </Form.Item>
          <Form.Item label="客户备注">
            <div className="flex-box padt8">
              <Form.Item name="nickRemarkStatus" className="mb0" valuePropName="checked">
                <Switch />
              </Form.Item>
              <span className="text-sub1 padl8">备注位置：备注在昵称后</span>
            </div>
            {nickRemarkStatus ? (
              <div>
                <Form.Item
                  name="nickRemarkContent"
                  {...layoutItem}
                  label="客户昵称"
                  className="flex-box middle-a  bg-info mt12"
                >
                  <Input placeholder="请输入客户备注（备注展示在昵称后）" showCount maxLength={30} />
                </Form.Item>
                <Typography className="mt-24">
                  <pre>预览：客户昵称{newRemarkValue}</pre>
                </Typography>
              </div>
            ) : null}
          </Form.Item>
          <Form.Item label="客户标签">
            <Form.Item name="customTags">
              <CustomTagIndex />
            </Form.Item>
            <div>
              {CustomTagList && CustomTagList.length ? (
                <div className="bg-info pad4 padl12 padr12 mt10 over-y" style={{ height: '120px' }}>
                  {CustomTagList.map((item, index) => (
                    <Tag
                      onClose={(e) => {
                        onCloseCustomTags(item)
                        e.preventDefault()
                      }}
                      className="mb6"
                      key={index}
                      closable
                    >
                      {item.name}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>
          </Form.Item>
          <div className="titleText ">欢迎语设置</div>
          <div className="text-title f13  pad12  bg-info flex-box middle-a radius8 mb24">
            <RsIcon type="icon-tishixinxitubiao" className="text-link  f16 mr10" />
            因企业微信限制，若使用成员已在「企业微信后台」配置了欢迎语，这里的欢迎语将不会生效
          </div>
          <Form.Item label="设置欢迎语">
            <Form.Item name="welcomeType" className="mt4">
              <Radio.Group name="welcomeType" defaultValue={1} onChange={onRadioWelcomeTypeChange}>
                <Radio value={1}>渠道欢迎语</Radio>
                <Radio value={2}>好友欢迎语</Radio>
                <Radio value={3}>不发送欢迎语</Radio>
              </Radio.Group>
            </Form.Item>
            {welcomeType == 2 ? (
              <div className="mt24">将发送成员已设置的欢迎语，若所选成员未设置欢迎语，则不会发送欢迎语</div>
            ) : null}
          </Form.Item>

          {welcomeType == 1 ? (
            <Form.Item
              name="message"
              label="欢迎语"
              className="textAreaItem"
              rules={[
                {
                  required: true,
                  message: '请添加一条欢迎语',
                },
              ]}
            >
              <Input.TextArea
                showCount
                style={{ height: '228px' }}
                autoSize={{ minRows: 10, maxRows: 10 }}
                placeholder="请输入欢迎语"
                bordered
                value={messageInfo}
                maxLength={300}
                onChange={(e) => {
                  onDataMessge('message', e.target.value)
                }}
              />
              <div className="pr mt-30">
                <DragSortingUpload
                  files={files}
                  onChange={(e) => {
                    onFileChange(e, 'attachmentContents')
                  }}
                />
              </div>
            </Form.Item>
          ) : null}
        </div>
        <div className="pf" style={{ left: '1100px', bottom: '90px' }}>
          <PhoneView messageValue={messageValue} list={viewList} />
        </div>
        <Affix offsetBottom={0}>
          <div className="flex-box middle ml-24 submitButtonDiv">
            <Button
              type="text"
              className="mr8"
              onClick={() => {
                history.goBack(-1)
              }}
            >
              返回
            </Button>
            <Button type="primary" loading={btnLoading} htmlType="submit">
              确定
            </Button>
          </div>
        </Affix>
      </Form>
    </div>
  )
}

export default ChannelLiveCodeOption
