import React, { useState, useEffect, useRef } from 'react'
import { Switch, Form, Button, Input, message, Affix } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import { omit } from 'lodash'
import StaffSelect from '../comments/publicView/staffSelect'

import DragSortingUpload from '../comments/publicView/upload'
import PhoneView from '../comments/publicView/phoneView'
import FormItemList from './comments/formItemList'
import './index.less'
import Api from './store/api'

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
}
// const { Option } = Select
function AddFried() {
  const history = useHistory() // 路由处理
  const location = useLocation()
  const [files, setFiles] = useState([])
  const formRef = useRef()
  const [detailInfo, setDetailInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [checkSw, setCheckSw] = useState(false)

  const [messageValue, setMessageValue] = useState('')
  // 编辑的时候使用
  const [userList, setUserList] = useState([])
  const [formItemList, setFormItemList] = useState([])

  const [btnLoading, setBtnLoading] = useState(false)
  // 保存的时候，需要用到这个额文件list 填充attachmentContents
  const [viewList, setViewList] = useState([])
  // 格式化数据用于编辑的操作调用
  const dataInfoFormat = (data) => {
    // // 选择员工处理
    formRef.current.setFieldsValue({
      memberIds: data.members,
    })
    formRef.current.setFieldsValue({
      message: data.message,
    })
    setMessageValue(data.message)
    /** 赋值
     * * */
    const userEditList = data.members.map((item) => ({
      value: item.id,
      label: item.name,
    }))

    console.log(userEditList, '------userEditList---------')
    // 回显
    setUserList(userEditList)

    setCheckSw(data.openSplitTime == 1)
    const filelist = data.attachmentContents ? JSON.parse(data.attachmentContents) : []
    // 回显示
    setFiles(filelist)
    // 保存时候需要
    setViewList(filelist)
    // setFiles

    /** FormItemList数据处理* */
    setFormItemList(data.splitTimeRefVoList)
  }

  useEffect(() => {
    const getData = (id) => {
      setLoading(true)
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

  const onSwChange = (checked) => {
    setCheckSw(checked)
  }
  const selectChange = (values) => {
    console.log(values, '---------执行---------')
    // 使用员工处理
    formRef.current.setFieldsValue({
      memberIds: values,
    })
  }
  // 提交文件数据是格式化
  const attachmentContentsFormatSub = (list) => {
    if (list && list.length > 0) {
      return JSON.stringify(
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
    }
    return ''
  }

  // 提交格式化数据处理
  const subFormatData = (data) => {
    const subData = {
      message: data.message,
      memberIds: data.memberIds.map((item) => item.id), /// 成员ID数组
      openSplitTime: checkSw ? 1 : 0, // 是否开启分时段 0不开启 1开启（新增好友欢迎语需要传）
      bizType: 1, // 1好友欢迎语;2群欢迎语;3渠道活码;
      attachmentContents: '',
    }

    if (viewList && viewList.length > 0) {
      subData.attachmentContents = attachmentContentsFormatSub(viewList)
    }
    if (data.splitTimeRefVos && data.splitTimeRefVos.length > 0 && checkSw) {
      subData.splitTimeRefVos = data.splitTimeRefVos.map((splitTimeItem) => ({
        weeks: splitTimeItem.weeks.join(','),
        startingTime: moment(splitTimeItem.timeList[0]).format('HH:mm'),
        endTime: moment(splitTimeItem.timeList[1]).format('HH:mm'),
        message: splitTimeItem.message,
        attachmentContents: attachmentContentsFormatSub(splitTimeItem.fileList),
      }))
    }

    // // 提交数据
    // console.log(subData, '------subData------')
    // console.log(data, '------subData------')
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

  return (
    <div>
      <Form {...layout} ref={formRef} name="dynamic_form_nest_item" autoComplete="off" onFinish={onFinish}>
        <div className="mt8 mb16" style={{ maxWidth: '800px' }}>
          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">{detailInfo.id ? '修改欢迎语' : '新建欢迎语'}</div>
            <div className="padl36 padt8 padb16 bg-tip flex-box flex-column radius8">
              <div className="text-title f13 text-bold pr">
                <RsIcon type="icon-tishixinxitubiao" className="text-link pa f16" style={{ left: '-18px' }} />
                温馨提示
              </div>
              <div className="padt8">
                1. 当同时给成员在企业微信后台和数客后台同时配置了好友欢迎语，优先发送企业微信设置的
                <br />
                2. 一个成员如果被设置了多个欢迎语，将会使用最新设置或修改的欢迎语
              </div>
            </div>
          </div>

          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">基础信息</div>
            <Form.Item
              name="memberIds"
              label="使用员工"
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
          <div className="flex-box  full-w  flex-column">
            <div className="titleText ">欢迎语设置</div>
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
                style={{ height: 228 }}
                autoSize={{ minRows: 11, maxRows: 11 }}
                placeholder="请输入欢迎语"
                bordered
                value={messageValue}
                maxLength={300}
                onChange={(e) => {
                  onDataMessge('message', e.target.value)
                }}
              />
              <div className="pr mt-26">
                <DragSortingUpload
                  files={files}
                  onChange={(e) => {
                    onFileChange(e, 'attachmentContents')
                  }}
                />
                <div className="pa" style={{ right: '-300px', top: '-400px' }}>
                  <PhoneView messageValue={messageValue} list={viewList} />
                </div>
              </div>
            </Form.Item>
          </div>
          <div className="flex-box full-w flex-column">
            <div className="titleText">分时段欢迎语设置</div>
            <div className="flex-box middle-a pad12">
              <div className="text-sub mr8">分时段欢迎语设置</div>
              <Switch checked={checkSw} value onChange={onSwChange} size="small" />
            </div>
            {checkSw ? (
              <div className="padl36 padt8 padb16 bg-tip flex-box flex-column radius8">
                <div className="text-title f13 text-bold pr">
                  <RsIcon type="icon-tishixinxitubiao" className="text-link pa f16" style={{ left: '-18px' }} />
                  温馨提示
                </div>
                <div className="padt8">
                  1. 员工上下班不同时间段可设置不同欢迎语
                  <br />
                  2. 分时段之外的时间将发送欢迎语
                </div>
              </div>
            ) : null}
            {checkSw ? <FormItemList formRef={formRef} listData={formItemList} /> : null}

            <div className="padl36 padt8 padb16 bg-tip flex-box flex-column radius8">
              <div className="text-title f13 text-bold pr">
                <RsIcon type="icon-tishixinxitubiao" className="text-link pa f16" style={{ left: '-18px' }} />
                温馨提示
              </div>
              <div className="padt8">
                1. 新建欢迎语最多可发送1条文字消息和9附件
                <br /> 2. 文字消息和附件不能同时为空，当两者均填写时用户会收到多条消息
                <br />
                3. 欢迎语将在客户加为好友后20秒内下发，因网络延迟可能造成发送不成功
              </div>
            </div>
          </div>
          {(detailInfo.message, loading)}
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

export default AddFried
