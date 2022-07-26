/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Form, Input, Select, Button, Radio, Row, Col, DatePicker, TimePicker, message } from 'antd'
import Api from './service'
import { initStaffData, RADIO } from './helper'
import { TRCheckboxModal } from '@Tool/components'
import { SendTarget, UploadKind } from './components'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { userTreeFormat } from '@/utils/Util'


export default function AddFriendCircle() {
  const [staffData, setStaffData] = useState([]);
  const [staffValue, setStaffValue] = useState([]);
  const [staffOption, setStaffOption] = useState([])
  const [form] = Form.useForm()
  const history = useHistory()
  const fetchData = async () => {
    const res = await Api.getStaffData();
    if (res?.retCode === 200) {
      const data = initStaffData(res?.data || []);
      const result = userTreeFormat(res?.data || [])
      setStaffData(result)
      setStaffOption(data?.resultData || [])
    }
  }
  const titleRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
  const handelSelect = async () => {
    const result = await TRCheckboxModal.show({
      treeData: staffData,
      value: staffValue,
      title: '选择员工',
      titleRender,
      itemRender: titleRender
    })
    if (result.index === 1) {
      form.setFieldsValue({ implementNumberList: result?.checkedKeys })
      setStaffValue(result?.checkedKeys || [])
    }
  }

  const onFinish = async (data) => {
    let obj = {
      ...data,
      implementType: 2,
      friendCircleType: 1,
      externalType: 1
    }
    if (!(obj.textContent) && !(obj?.fileList?.length)) {
      message.error('朋友圈内容不能为空')
    }
    if (data?.sendType === 2) {
      obj.sendTime_YYYY_MM_DD = moment(obj?.date?.first).format('YYYY-MM-DD');
      obj.sendTime_HH_MM = moment(obj?.date?.second).format('HH:mm');
    }
    const res = await Api.addFriendCircle(obj);
    if (res?.retCode === 200) {
      message.success('创建朋友圈成功')
      history.push('/CicleOfFriends')
    } else {
      message.error('创建朋友圈失败')
    }
  }
  const handelCancel = () => {
    history.push('/CicleOfFriends')
  }
  useEffect(() => {
    fetchData()
  }, []);
  return (
    <div className="addFriendCircle">
      <div className="title">
        创建朋友圈任务
      </div>
      <div className="subTitle">
        任务信息
      </div>
      <div className="main">
        <Form
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="任务名称"
            name="friendCircleName"
            rules={[{ required: true, message: '请填写任务名称' }]}
          >
            <Input placeholder="请输入任务名称" maxLength={20} showCount />
          </Form.Item>
          <Form.Item
            label="执行成员"
            name="implementNumberList"
            rules={[{ required: true, message: '请填写任务名称' }]}
          >
            <Select
              placeholder="发表成员"
              options={staffOption}
              open={false}
              onClick={handelSelect}
              mode="tags"
              maxTagCount={3}
              showArrow
            />
          </Form.Item>
          <Form.Item
            label={'发送目标客户'}
            name='labelIds'
          >
            <SendTarget staffValue={staffValue} />
          </Form.Item>
          <div className="subTitle">
            朋友圈内容
          </div>
          <Form.Item
            label={'文本内容'}
            name='textContent'
          >
            <Input.TextArea
              placeholder='请输入内容'
              maxLength={1000}
              showCount
            />
          </Form.Item>
          <Form.Item
            label={'附件内容'}
            name='fileList'
          >
            <UploadKind />
          </Form.Item>
          <div className="subTitle">
            高级设置
          </div>
          <Form.Item
            label={'发布方式'}
            name='sendType'
            style={{ alignItems: 'center' }}
            initialValue={1}
          >
            <Radio.Group
              options={RADIO}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevValues, curValues) => prevValues.sendType !== curValues.sendType}
          >
            {({ getFieldValue }) => {
              const sendType = getFieldValue('sendType')
              return sendType == 2 &&
                <Row>
                  <Col>

                    <Form.Item name={['date', 'first']} rules={[{ required: true, message: '请填写年月日' }]} >
                      <DatePicker />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name={['date', 'second']} rules={[{ required: true, message: '请填写时分' }]}>
                      <TimePicker format={'HH:mm'} />
                    </Form.Item>
                  </Col>
                </Row>
            }}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button style={{ marginRight: '20px' }} onClick={handelCancel}>返回</Button>
            <Button type="primary" htmlType="submit">
              提交
        </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
