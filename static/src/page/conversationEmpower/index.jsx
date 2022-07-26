import React, { useState, useEffect, useRef } from 'react'
import { copyText } from '@util'
import { message, Form, Button, Input } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import Api from './store/api'

const fileUrl =
  'https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/%E4%BC%9A%E8%AF%9D%E5%AD%98%E6%A1%A3%E6%8E%88%E6%9D%83%E6%93%8D%E4%BD%9C%E6%8C%87%E5%BC%95.pdf'
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
function ConversationEmpower() {
  const [dataInfo, setDataInfo] = useState({})
  const location = useLocation()
  const history = useHistory()
  const [btnLoading, setBtnLoading] = useState(false)
  const formRef = useRef()
  const getDataInfo = () => {
    Api.getFixedConfig().then((res) => {
      if (res.retCode == 200) {
        const data = res.data || {}
        if (data.ipWhiteList) {
          data.ipWhiteList = data.ipWhiteList.replace(/\,/gi, ';')
        }
        setDataInfo(data)
      }
    })
  }
  const getData = () => {
    Api.getData().then((res) => {
      if (res.retCode == 200) {
        const data = res.data || {}
        formRef.current.setFieldsValue({
          sessionsaveSecret: data.sessionsaveSecret,
          sessionsavePrivateKeyVersion: data.sessionsavePrivateKeyVersion,
        })
      }
    })
  }
  useEffect(() => {
    getDataInfo()
    getData()
  }, [])

  const onFinish = (values) => {
    setBtnLoading(true)
    const data = { ...values }

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
  const exportFileUrl = () => {
    // exportFile 跨域，非同源，
    // exportFile(fileUrl) // 跨域，非同源，
    window.open(fileUrl)
  }
  const copyTextFn = (text) => {
    copyText(text)
    message.success('复制成功，如果复制内容为空，请选择您想要复制的内容自行复制')
  }

  return (
    <div className="pr full-h">
      <div className="mt8 mb16" style={{ maxWidth: '619px' }}>
        <div className="flex-box  full-w  flex-column">
          <div className="titleText f18">会话存档授权</div>
          {/* 公钥 */}
          <div className="flex-box middle-a flex-between">
            <div className="titleText f14 ">公钥</div>
            <div className="flex-box ">
              <div
                className="text-link pointer padr16 mr15"
                onClick={() => {
                  copyTextFn(dataInfo.publicKey)
                }}
                style={{ borderRight: '1px solid #E1E8F0' }}
              >
                复制
              </div>
              <div
                className="text-link pointer"
                onClick={() => {
                  exportFileUrl()
                }}
              >
                查看指引
              </div>
            </div>
          </div>
          {/* 公钥 文本 */}
          <div
            className="pad12 text-sub"
            style={{ border: '1px solid #E1E8F0', height: '150px', wordWrap: 'break-word' }}
          >
            {dataInfo.publicKey}
          </div>
          {/* 可信任IP */}
          <div className="flex-box middle-a flex-between mt24">
            <div className="titleText f14 ">可信任IP地址</div>
            <div className="flex-box ">
              <div
                className="text-link pointer padr16 mr15"
                onClick={() => {
                  copyTextFn(dataInfo.ipWhiteList)
                }}
                style={{ borderRight: '1px solid #E1E8F0' }}
              >
                复制
              </div>
              <div
                className="text-link pointer"
                onClick={() => {
                  exportFileUrl()
                }}
              >
                查看指引
              </div>
            </div>
          </div>
          {/* 可信任IP 文本 */}
          <div
            className="pad12 text-sub"
            style={{ border: '1px solid #E1E8F0', height: '120px', wordWrap: 'break-word' }}
          >
            {dataInfo.ipWhiteList}
          </div>
          {/* 对接信息 */}
          <div className="flex-box middle-a flex-between mt24">
            <div className="titleText f14  flex-box middle-a">
              <div className="bg-waring mr10 radius4" style={{ width: '4px', height: '4px' }} />
              对接信息
            </div>
            <div className="flex-box ">
              <div
                className="text-link pointer"
                onClick={() => {
                  exportFileUrl()
                }}
              >
                查看指引
              </div>
            </div>
          </div>
          {/* 对接信息 表单 */}
          <Form {...layout} ref={formRef} className="channelLiveCodeOption-form" autoComplete="off" onFinish={onFinish}>
            <Form.Item
              name="sessionsaveSecret"
              label="会话Secret"
              size="small"
              rules={[
                {
                  required: true,
                  message: '请输入会话Secret',
                },
              ]}
            >
              <Input placeholder="请输入会话Secret,查看指引可获取相关说明" />
            </Form.Item>
            <Form.Item
              name="sessionsavePrivateKeyVersion"
              label="公钥版本号"
              size="small"
              rules={[
                {
                  required: true,
                  message: '请输入公钥版本号',
                },
              ]}
            >
              <Input placeholder="请输入公钥版本号" />
            </Form.Item>
            <Form.Item noStyle>
              <div className="flex-box middle pa ml-24 submitButtonDiv" style={{ bottom: '0px', left: '0px' }}>
                {location.state?.back && (
                  <Button
                    type="text"
                    className="mr10"
                    onClick={() => {
                      history.goBack(-1)
                    }}
                  >
                    返回
                  </Button>
                )}
                <Button type="primary" loading={btnLoading} htmlType="submit">
                  保存
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default ConversationEmpower
