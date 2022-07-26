import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Input, message, Radio, Switch, Affix } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory, useLocation } from 'react-router-dom'
import { omit } from 'lodash'
import PhoneView from '../comments/publicView/phoneView'
import './index.less'
import DataList from './comments/DataList'
import Api from './store/api'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
// const { Option } = Select
function AddGroup() {
  const history = useHistory() // 路由处理
  const location = useLocation()
  const formRef = useRef()
  const dataRef = useRef()
  const [detailInfo, setDetailInfo] = useState({})

  const [checkSw, setCheckSw] = useState(false)
  const [title, setTitle] = useState('')

  const [btnLoading, setBtnLoading] = useState(false)
  // 操作显示的file数据 长度永远保持是一个，群客户欢迎语文件只是一个 只是用于预览
  const [viewList, setViewList] = useState([])
  // 操作文件
  const [optionData, setOptionData] = useState({ fileType: 'img' })

  // 客户操作数据留存，需要入库数据库的
  const [subDataFiles, setSubDataFiles] = useState({
    img: { fileType: 'img' },
    link: { fileType: 'link' },
    file: { fileType: 'file' },
    video: { fileType: 'video' },
  })

  // 格式化数据用于编辑的操作调用
  const dataInfoFormat = (data) => {
    // // 选择员工处理
    // formRef.current.setFieldsValue({
    //   memberIds: data.members,
    // })
    formRef.current.setFieldsValue({
      message: data.message.split('%NICKNAME%').join('【客户昵称】'),
    })

    /** 赋值
     * 包括员工
     *文件，switch 开关
     * * */
    const DataFilesObject = { ...subDataFiles }
    const filelist = data.attachmentContents ? JSON.parse(data.attachmentContents) : []
    filelist.forEach((item) => {
      if (item.showType) {
        setOptionData(item)
        setViewList([{ ...item }])
        formRef.current.setFieldsValue({
          fileType: item.fileType,
        })
      }
      DataFilesObject[item.fileType] = { ...item }
    })
    setSubDataFiles(DataFilesObject)

    setCheckSw(data.messageNotification == 1)
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
      setTitle('编辑群欢迎语')
    }
    setTitle('新建群欢迎语')
  }, [location.state])

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
      message: data.message.split('【客户昵称】').join('%NICKNAME%'),
      bizType: 2, // 1好友欢迎语;2群欢迎语;3渠道活码;
      messageNotification: checkSw ? 1 : 0,
      // memberIds: ['97a5983c78cc4b938fc96b5d0bd06c36'],
      // openSplitTime: 0,
    }
    let subfileListDatas = Object.keys(subDataFiles).map((key) => {
      let showType = false
      if (optionData.fileType == key) {
        showType = true
      }
      return { ...subDataFiles[key], showType }
    })
    if (subfileListDatas && subfileListDatas.length > 0) {
      // subfileListDatas  注：：：：后台只是支持存当前展示图片 已经设置的不保存，
      // 后续需要改成保存，防止用户上传资源浪费
      // subfileListDatas
      subfileListDatas = subfileListDatas.filter((item) => item.showType)

      subData.attachmentContents = attachmentContentsFormatSub(subfileListDatas)
    }

    // 提交数据
    console.log(subData, '------subData------')
    return subData
  }

  const onFinish = (values) => {
    dataRef.current.onCallback(values.message).then(
      (resolveData) => {
        subDataFiles[values.fileType] = { ...resolveData, fileType: values.fileType }
        setSubDataFiles({
          ...subDataFiles,
        })
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
      },
      (err) => {
        if (err.msg) {
          message.error(err.msg)
        }
      }
    )
  }
  // const onDataMessge = (key, value) => {
  //   if (key == 'message') {
  //     formRef.current.setFieldsValue({
  //       message: value,
  //     })
  //   }
  // }
  const onFileChange = (list) => {
    // 添加附件 更新操作完成之后每次回传的数据
    setViewList([{ ...list }])
    subDataFiles[list.fileType] = list
    setSubDataFiles({
      ...subDataFiles,
    })
    // 需要添加一个formItem ，name="attachmentContents"
    // formRef.current.setFieldsValue({
    //   attachmentContents: list,
    // })
  }
  // radio btn切换时，将切换之前面板数据保存到  setSubDataFiles 用于最后的提交
  const onRadioChange = (value) => {
    formRef.current.setFieldsValue({
      fileType: value,
    })
    // 切换之前的数据
    const oldData = dataRef.current.onGetData()
    // 覆盖之前的数据
    subDataFiles[oldData.fileType] = { ...oldData }
    setSubDataFiles({
      ...subDataFiles,
    })

    const newData = subDataFiles[value]
    // radio 切换时候，要赋值用于预览显示
    setViewList([{ ...newData }])
    setOptionData(newData)
  }

  const onBtnClick = () => {
    let messageText = formRef.current.getFieldValue('message') || ''
    messageText += '【客户昵称】'
    formRef.current.setFieldsValue({
      message: messageText,
    })
  }
  const onSwChange = (checked) => {
    setCheckSw(checked)
  }
  return (
    <div>
      <Form.Provider
        onFormChange={(name, { forms }) => {
          if (name === 'linkForm') {
            const { linkForm } = forms
            const newLink = linkForm.getFieldsValue()
            setViewList([{ ...newLink, fileType: 'link' }])
          }
        }}
      >
        <Form {...layout} ref={formRef} name="dynamic_form_nest_item" autoComplete="off" onFinish={onFinish}>
          <div className="mt8 mb16" style={{ maxWidth: '800px' }}>
            <div className="flex-box  full-w  flex-column">
              <div className="titleText ">{title}</div>
              <div className="padl36 padt8 padb8 bg-tip flex-box flex-column radius8">
                <div className="text-title f13  pr">
                  <RsIcon type="icon-tishixinxitubiao" className="text-link pa f16" style={{ left: '-22px' }} />
                  因企业微信限制，入群欢迎语创建上限为100条，在企业微信后台创建的也将计入其中
                </div>
              </div>
            </div>
            <Form.Item>
              <div className="flex-box  full-w  flex-column padt14">
                <div
                  className="full-w padt8 padb8 mb20 flex-box middle-a "
                  style={{ borderBottom: '1px dashed #E1E8F0' }}
                >
                  <div className="text-waring1 padr3 f14"> * </div> 欢迎语1
                </div>
                <div className="flex-box  flex-column bg-white radius-b4 border1 full-w padr12">
                  <div className="flex-box flex-between middle-a m5 m-l1">
                    <Button
                      type="text"
                      className="text-link flex-box middle-a"
                      onClick={onBtnClick}
                      size="small"
                      icon={<RsIcon type="icon-tianjia" className="f16" />}
                    >
                      插入昵称
                    </Button>
                  </div>
                </div>
                <Form.Item
                  name="message"
                  label=""
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
                    autoSize={{ minRows: 10, maxRows: 10 }}
                    placeholder="请输入欢迎语"
                    bordered
                    maxLength={300}
                  />
                </Form.Item>
              </div>
              <div className="flex-box  full-w  flex-column">
                <div
                  className="full-w padt8 padb8 mb20 flex-box middle-a "
                  style={{ borderBottom: '1px dashed #E1E8F0' }}
                >
                  <div className="text-waring1 padr3 f14"> * </div> 欢迎语2
                </div>
                <div className="padl36 padt8 padb12 bg-tip flex-box flex-column radius8">
                  <div className="text-title f13  pr">
                    <RsIcon type="icon-tishixinxitubiao" className="text-link pa f16" style={{ left: '-22px' }} />
                    因企业微信限制，入群欢迎语创建上限为100条，在企业微信后台创建的也将计入其中
                    企微限制，欢迎语2中的消息类型只能有1个，如果四者同时填写，则按图片、链接、文件、视频的
                    优先级获取其中1个
                  </div>
                </div>

                <div className=" mt16 border1 radius4">
                  <Form.Item
                    name="fileType"
                    label="选择消息类型"
                    className="flex-box padl12 padt8 padb8 borderb-1 middle-a"
                  >
                    <Radio.Group
                      name="fileType"
                      defaultValue={optionData.fileType}
                      onChange={(e) => {
                        onRadioChange(e.target.value)
                      }}
                    >
                      <Radio value="img">图片</Radio>
                      <Radio value="link">链接</Radio>
                      <Radio value="file">文件</Radio>
                      <Radio value="video">视频</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <div className={`pad12 ${optionData.fileType == 'link' ? 'mt-36' : 'mt-24'}`}>
                    <DataList
                      ref={dataRef}
                      optionData={optionData}
                      onChange={(e) => {
                        onFileChange(e)
                      }}
                    />
                  </div>
                </div>

                {/* <div className="pr">
                  <div className="pa" style={{ right: '-300px', top: '-400px' }}>
                    <PhoneView list={viewList} />
                  </div>
                </div> */}
              </div>
            </Form.Item>
            <div className="flex-box  full-w  flex-column">
              <div
                className="full-w padt8 padb8 mb20 text-bold flex-box middle-a f16 flex-between"
                style={{ borderBottom: '1px dashed #E1E8F0' }}
              >
                消息提醒
              </div>
            </div>
            <Form.Item label="" name="messageNotification" valuePropName="checked">
              <div className="flex-box middle-a padt16 ">
                <div className="padr8 text-sub">是否开启</div>
                <Switch checked={checkSw} value onChange={onSwChange} size="small" />
                <div className="padl8 text-sub1">
                  开启后，新建该条欢迎语会通过群发通知企业全部员工：“管理员创建了新的入群欢迎语”
                </div>
              </div>
            </Form.Item>
          </div>
          <div className="pf" style={{ left: '1100px', bottom: '90px' }}>
            <PhoneView list={viewList} />
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
      </Form.Provider>
    </div>
  )
}

export default AddGroup
