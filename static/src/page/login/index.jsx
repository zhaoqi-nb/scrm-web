/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import RsIcon from '@RsIcon'
import Api from './store/api'
import { patternPhone, GetQueryString, getEncData, patternEimal } from '../../utils/Util'
import ForgetPassword from './forgetPassword'
import Header from './header'

import './index.less'

const iconFont = {
  fontSize: '20px',
}

const isProduct = process.env.NODE_ENV == 'production'

const isDev = process.env.NODE_ENV == 'development'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef()

  componentDidMount() { }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      isForgetPassword: false,
      logingType: 1, // 1为账号登录，2为扫码登录
    }
  }

  onFinish = (values) => {
    this.setState({
      loginLoding: true,
    })
    const redirectUrl = GetQueryString('redirectUrl')
    Api.doLogin({
      ...values,
      redirectUrl,
      password: getEncData(values.password),
    })
      .then((res) => {
        message.success('登录成功')
        if (values.rememberPassword) {
          localStorage.setItem('rememberPassword', true)
        }
        const { data: { dataBurning } } = res
        if (isDev || !dataBurning) {
          window.location.href = '/'
        } else {
          const loginRedirectUrl = isProduct ? 'https://crm.databurning.com/systemjump' : ' http://172.24.24.5:7015/systemjump'
          const { memberId, accessToken } = res.data
          window.location.href = `${loginRedirectUrl}?accessToken=${accessToken}&sysUserId=${memberId}&urlfrom=login`
        }
      })
      .catch((err) => {
        if (err.retCode == '666666') {
          this.handleChangeForget()
        }
      })
      .finally(() => {
        this.setState({
          loginLoding: false,
        })
      })
  }

  handleChangeForget = () => {
    this.setState((state) => ({
      isForgetPassword: !state.isForgetPassword,
    }))
  }

  handleChangeLoginType = () => {
    this.setState((state) => ({
      logingType: state.logingType == 1 ? 2 : 1
    }), () => {
      const { iframeUrl, logingType } = this.state
      if (logingType == 2 && !iframeUrl) {
        Api.getLoginQrCode().then((res) => {
          this.setState({
            iframeUrl: res.data
          })
        })
      }
    })
  }

  render() {
    const { isForgetPassword, loginLoding, logingType, iframeUrl } = this.state
    const rememberPassword = localStorage.getItem('rememberPassword')
    return (
      <div className="login-big">
        <Header />
        <div className="login-content">
          {isForgetPassword ? (
            <ForgetPassword onChangeForget={this.handleChangeForget} />
          ) :
            (
              <div className="login-content-form">
                <div onClick={this.handleChangeLoginType} className={`qr-image ${logingType == 2 ? 'qr-image-zh' : 'qr-image-er'}`}>
                  <div className="imgApp" />
                </div>
                {logingType == 2 ? <iframe frameBorder={0} name="扫码登录" height="100%" width="100%" src={iframeUrl} /> : <>
                  <div className="login-content-form-header">燃数SCRM</div>
                  <div className="login-content-form-tips">欢迎使用燃数SCRM</div>
                  <Form
                    ref={this.formRef}
                    // name="basic"
                    wrapperCol={{ span: 24 }}
                    // autoComplete="off"
                    initialValues={{ rememberPassword }}
                    onFinish={this.onFinish}
                    style={{ marginTop: '50px' }}
                  >
                    <Form.Item
                      name="mobile"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: '请输入手机号或邮箱' },
                        {
                          validator: (_, value) =>
                            value
                              ? patternPhone(value) || patternEimal(value)
                                ? Promise.resolve()
                                : Promise.reject(new Error('该手机号码格式或邮箱无法识别'))
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入手机号"
                        bordered={false}
                        prefix={<RsIcon style={iconFont} type="icon-denglu-yonghuzhanghao" />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: '请输入密码' }]}
                    >
                      <Input.Password
                        bordered={false}
                        prefix={<RsIcon style={iconFont} type="icon-denglu-mima" />}
                        placeholder="请输入密码"
                        visibilityToggle
                      />
                    </Form.Item>
                    <Form.Item name="rememberPassword" valuePropName="checked">
                      <Checkbox style={{ fontSize: '14px', height: '32px' }}>记住密码</Checkbox>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '8px' }}>
                      <Button
                        loading={loginLoding}
                        style={{ width: '100%', height: '48px', fontSize: '18px' }}
                        type="primary"
                        htmlType="submit"
                      >
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                  <div className="form-footer">
                    <div>
                      还没有账号？
                      <Button style={{ fontSize: '14px' }} type="link">
                        立即注册
                      </Button>
                    </div>
                    <div onClick={this.handleChangeForget} className="reset-btn">
                      忘记密码
                    </div>
                  </div>
                </>}
              </div>
            )}
        </div>
        <div className="login-footer">© 2022 北京燃数科技有限公司. All rights reserved.</div>
      </div>
    )
  }
}

Index.propTypes = {}

export default Index
