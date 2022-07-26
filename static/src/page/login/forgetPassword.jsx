import React, { Component } from 'react'
import RsIcon from '@RsIcon'
import { Form, Input, Button } from 'antd'
import { patternPhone } from '../../utils/Util'
import Api from './store/api'

import './index.less'

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
      isFlag: true,
      time: 60,
      sendPhoneCodeLoading: false,
      step: 1
    }
  }

  onFinish = (values) => {
    const { step, phoneNo } = this.state
    if (step == 1) {
      this.setState({
        step: 2
      })
    } else {
      Api.updatePassWord({
        mobile: phoneNo,
        newPassword: values.firstPassword
      }).then(() => {
        this.setState({
          step: 3
        })
      })
    }
  }

  checkPhoneCode = (value) => {
    if (!value) return Promise.reject(new Error('请输入验证码'))
    const values = this.formRef.current.getFieldsValue(['code', 'mobile'])
    return Api.checkPhoneCode({
      phoneNo: values.mobile, // 手机号
      code: values.code, // 发送验证码返回的code
      verify: value// 验证码
    }).then(() => {
      this.setState({
        phoneNo: values.mobile
      })
      return Promise.resolve()
    }).catch(() => Promise.reject(new Error('验证码错误，请重新输入')))
  }

  sendPhoneCode = (phoneNo) => {
    this.setState({
      sendPhoneCodeLoading: true
    })
    Api.sendPhoneCode({
      phoneNo
    }).then((res) => {
      this.formRef.current.setFieldsValue({
        code: res.data
      })
      this.setState({
        sendPhoneCodeLoading: false,
        isFlag: false
      })
      const timmer = setInterval(() => {
        this.setState(({ time }) => {
          if (time <= 1) {
            clearInterval(timmer)
            // 重置秒数
            return { time: 60, isFlag: true }
          }
          return { time: time - 1, isFlag: false }
        })
      }, 1000)
    })
  }

  renderSuccess = () => {
    const { onChangeForget } = this.props
    return <div className="success-div">
      <div style={{ textAlign: 'center' }}>
        <RsIcon style={{ fontSize: '64px', marginBottom: '24px' }} type="icon-chenggong" />
        <div className="login-content-form-header">密码重置成功！</div>
      </div>
      <Button style={{ width: '100%', height: '48px', fontSize: '18px' }} type="primary" onClick={onChangeForget}>去登录</Button>
    </div>
  }

  render() {
    const { isFlag, time, sendPhoneCodeLoading, step } = this.state
    return (
      <div className="login-content-form">
        {step == 3 ? this.renderSuccess() : <>
          <div className="login-content-form-header">重置密码</div>
          <Form
            ref={this.formRef}
            wrapperCol={{ span: 24 }}
            onFinish={this.onFinish}
            style={{ marginTop: '50px' }}
          >
            {step == 1 ?
              <>
                <Form.Item hidden initialValue="" name="code">
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="mobile" rules={[{ required: true, message: '请输入手机号' }]}>
                  <Input className="login-input" placeholder="请输入手机号" bordered={false} />
                </Form.Item>
                <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.mobile !== curValues.mobile}>
                  {({ getFieldValue }) => {
                    const phone = getFieldValue('mobile')
                    const isSuccess = patternPhone(phone)
                    return <Form.Item
                      name="verify"
                      validateTrigger="onSubmit"
                      rules={[
                        {
                          validator: (_, value) => this.checkPhoneCode(value),
                        }
                      ]}
                    >
                      <Input className="verify-input" suffix={<Button loading={sendPhoneCodeLoading} onClick={() => this.sendPhoneCode(phone)} disabled={!isSuccess || !isFlag} type="link">{isFlag ? '获取验证码' : `重新获取 ${time}S`}</Button>} maxLength={6} bordered={false} placeholder="请输入验证码" />
                    </Form.Item>
                  }}
                </Form.Item>
              </> :
              <>
                <Form.Item
                  name="firstPassword"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    {
                      validator(_, value) {
                        if (value == '123456') return Promise.reject(new Error('密码太过简单，请重新输入'))
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input.Password className="login-input" bordered={false} placeholder="请输入密码" visibilityToggle={false} />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: '请确认新密码' }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('firstPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入密码不同，请重新输入'));
                    },
                  })]}
                  validateTrigger="onBlur"
                  name="secondPassword"
                >
                  <Input.Password className="login-input" bordered={false} placeholder="请输入密码" visibilityToggle={false} />
                </Form.Item>
              </>}
            <Form.Item shouldUpdate>
              {({ getFieldsValue }) => {
                const { verify, mobile, code, secondPassword, firstPassword } = getFieldsValue(['verify', 'mobile', 'code', 'firstPassword', 'secondPassword'])
                return <Form.Item style={{ marginBottom: '8px' }}>
                  <Button disabled={step == 1 ? (!verify || !mobile || !code) : (!secondPassword || !firstPassword)} style={{ width: '100%', height: '48px', fontSize: '18px' }} type="primary" htmlType="submit">
                    {step == 1 ? '下一步' : '确定'}
                  </Button>
                </Form.Item>
              }}
            </Form.Item>
            <div style={{ textAlign: 'right', display: 'block' }} className="form-footer">
              <div style={{ display: 'inline-block' }} onClick={this.props.onChangeForget} className="reset-btn">返回登录</div>
            </div>
          </Form>
        </>}
      </div>
    )
  }
}

Index.propTypes = {}

export default Index
