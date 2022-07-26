import React, { Component } from 'react'
import { Input, Form, Radio, Button, Checkbox, message, Row, Col } from 'antd'
import { patternPhone } from '../../utils/Util'
import Api from './api'

import './index.less'

const isProduct = process.env.NODE_ENV == 'production'

const industryOptions = [
  { label: '消费（线上or线下）', value: '消费（线上or线下）' },
  { label: '电商行业', value: '电商行业' },
  { label: '新零售行业', value: '新零售行业' },
  { label: '餐饮行业', value: '餐饮行业' },
  { label: '外卖行业', value: '外卖行业' },
  { label: '直播行业/视频平台', value: '直播行业/视频平台' },
  { label: '酒店平台', value: '酒店平台' },
  { label: '在线招聘平台', value: '在线招聘平台' },
  { label: '其他', value: '其他' },
]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
      time: 60,
      sendPhoneCodeLoading: false,
      isFlag: true
    }
  }

  onFinish = (values) => {
    this.setState({
      loading: true
    })
    values.industry = values.industry.join(',')
    // 线索来源和来源渠道暂时先写死
    values.cluesSourceType = 2
    values.cluesChannelsType = 1
    const { countries } = values
    if (countries == 1) {
      Api.checkPhoneCode({
        phoneNo: values.phone, // 手机号
        code: values.code, // 发送验证码返回的code
        verify: values.verify// 验证码
      }).then(() => {
        Api.addDataFormOther(values).then(() => {
          message.success('提交成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      })
    } else {
      Api.addDataFormOther(values).then(() => {
        message.success('提交成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
    }
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

  render() {
    const { sendPhoneCodeLoading, isFlag, time, loading } = this.state
    return <div className="official-account-h5">
      <img style={{ width: '100%' }} src={require('../image/form_log.png')} alt="logo" className="logo" />
      <Form className="official-account-form" onFinish={this.onFinish} layout="vertical" preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <div className="form-header-title">
          【申请试用】燃数科技自主研发另类数据库产品
        </div>
        <div className="field-description">
          <p>试用须知：</p>
          <p>1、<span className="font-red">请务必正确填写以下信息</span>，在您提交数据库试用申请后，燃数将在后台审核您的信息，通过后将于24H内与您取得联系，感谢您的支持！</p>
          <p>2、本数据库产品是由燃数科技自主研发的大数据引擎，对线上平台进行深度跟踪、数据清洗和建模计算后发布</p>
          <p>3、<span className="font-red">【重要提示】由于涉及公司产品商业机密，暂不向券商、咨询公司或类似企业人员提供相关产品试用，敬请谅解！</span></p>
        </div>
        <Form.Item hidden initialValue={!isProduct ? '07c5e1be19254c169700c2b112c3c113' : 'c715aead09c6489794a064ba9074df39'} name="companyId">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item hidden initialValue="" name="code">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="1.姓名" rules={[{ required: true, message: '请填写此项' }]} name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="2.您在哪个区域" rules={[{ required: true, message: '请填写此项' }]} name="countries">
          <div className="field-description">用于区分您的手机号验证方式</div>
          <Form.Item style={{ marginBottom: 0 }} name="countries">
            <Radio.Group>
              <Radio value="1">中国大陆</Radio>
              <Radio value="2">海外</Radio>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.countries !== curValues.countries}>
          {({ getFieldValue }) => {
            const nextCountries = getFieldValue('countries')
            const isChina = nextCountries == 1
            return nextCountries ? <>
              <Form.Item label={isChina ? '3.请问你所在的地区' : '3. 请问你所在的海外地区'} rules={[{ required: true, message: '请填写此项' }]} name="contactAddressInfo">
                <div className="field-description">{isChina ? '请务必正确填写，以便更好提供服务（格式：江苏省苏州市）' : '务必正确填写，以便更好提供服务（如：中国香港、中国澳门、美国等）'}</div>
                <Form.Item style={{ marginBottom: 0 }} name="contactAddressInfo">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请填写此项' },
                  {
                    validator: (_, value) => !isChina ? Promise.resolve() : value ?
                      (patternPhone(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error('该手机号码格式无法识别'))) : Promise.resolve(),
                  },
                ]}
                label={isChina ? '4.手机' : '4. 海外电话'}
              >
                <div className="field-description">{isChina ? '请务必正确填写，用于联系开通产品试用' : '请务必正确填写，用于审核（格式：区号-电话号码）'}</div>
                <Form.Item style={{ marginBottom: 0 }} name="phone">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Form.Item>
              {
                isChina && <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item rules={[{ required: true, message: '请输入验证码' }]} name="verify">
                      <Input maxLength={6} placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.phone !== curValues.phone}>
                      {() => {
                        const phone = getFieldValue('phone')
                        const isSuccess = patternPhone(phone)
                        return <Button loading={sendPhoneCodeLoading} onClick={() => this.sendPhoneCode(phone)} className="code-btn" disabled={!isSuccess || !isFlag} type="primary">{isFlag ? '获取验证码' : `重新获取 ${time}S`}</Button>
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              }
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: '请输入正确的邮箱',
                  },
                  { required: true, message: '请填写此项' },
                ]}
                label="5.邮箱"
              >
                <div className="field-description">请务必正确填写，用于开通产品试用</div>
                <Form.Item style={{ marginBottom: 0 }} name="email">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="6.所在公司/机构" rules={[{ required: true, message: '请填写此项' }]} name="companyName">
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="7.你所关注的投研方向 (最少选1项)" rules={[{ required: true, message: '请请至少选择一个您关心的投研方向' }]} name="industry">
                <Checkbox.Group options={industryOptions} />
              </Form.Item>
            </> : null
          }}
        </Form.Item>

        <Form.Item style={{ alignItems: 'center' }}>
          <Button loading={loading} type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  }
}

Index.propTypes = {}

export default Index
