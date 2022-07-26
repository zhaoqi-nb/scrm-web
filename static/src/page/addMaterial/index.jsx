/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, message, Select, Button, Col, Row } from 'antd'
import Api from './server'
import { initSelectData, RULES, REQUEST, VIEW } from './helper'
import PhoneView from '../comments/publicView/phoneView'
import UploadImg from './components/uploadImg'
import './index.less'
import { useHistory } from "react-router-dom";
import { GroupModal, GroupChoseModal } from '../materialLibrary/components'
function Index() {
  const reducer = useSelector((state) => state.materialLibrary);
  const [selectData, setSelectData] = useState([])
  const [form] = Form.useForm()
  const [messageValue, setMessagevalue] = useState('')
  const [fileList, setFileList] = useState({})
  const history = useHistory();

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    const { editData } = reducer;
    const tabsKey = reducer?.globalData?.tabsKey

    if (editData?.id) {
      let obj = editData
      if (tabsKey === '6') {
        setMessagevalue(editData?.content || '')
      } else {
        obj.content = editData?.url || ''
      }
      setFileList(obj)
      form.setFieldsValue(obj)
    }
    let res = await Api.getGroupList({ dataType: reducer?.globalData?.dataType, materialType: reducer?.globalData.tabsKey });
    if (res?.retCode === 200) {
      const result = initSelectData(res?.data)
      setSelectData(result)
    } else {
      message.error(res?.resMsg || '')
    }
  }
  const handelFinish = async (data) => {
    let mes = '添加'
    const { globalData = {}, editData = {} } = reducer
    let obj = {
      ...data,
      ...fileList,
      categoryId: data?.categoryId?.[0] || '',
      dataType: reducer?.globalData?.dataType || '0',
      bgImg: fileList?.url,
      fileUrl: fileList?.url || '',
      linkName: data?.linkTitle || '',
      coverUrl: fileList?.url || ''
    }
    if (editData?.id) {
      obj.id = editData?.id
      mes = '编辑'
    }
    let res = await Api.addRequest(obj, REQUEST?.[globalData?.tabsKey])
    if (res?.retCode === 200) {
      message.success(`${mes}成功`)
      history.push('/materialLibrary')
    } else {
      message.error(`${mes}失败`)
    }
  }

  const handelImg = (data, code = '') => {
    if (data?.url) {
      form.setFieldsValue({ content: data?.url || '' })
      setFileList({ ...fileList, ...data })
    } else if (code === 'delete') {
      form.setFieldsValue({ content: data?.url || '' })
      setFileList({})
    } else {
      setFileList({ ...fileList, ...data })
    }
  }
  const renderMain = () => {
    const tabsKey = reducer?.globalData?.tabsKey
    if (tabsKey === '6') {
      return <Input.TextArea
        maxLength={1024}
        showCount
        onChange={(e) => setMessagevalue(e.target.value)}
      />
    } else if (tabsKey === '2') {
      return <UploadImg handelChange={handelImg} imgData={fileList} />
    } else if (tabsKey === '0') {
      return <UploadImg handelChange={handelImg} type='file' imgData={fileList} />
    } else if (tabsKey === '3') {
      return <UploadImg handelChange={handelImg} type='video' imgData={fileList} />
    } else {
      return renderItem()
    }
  }

  const handelValue = (val, allVal) => {
    const url = allVal?.coverUrl?.file?.response?.data?.url || '';
    handelImg({
      ...allVal,
      coverUrl: url,
      linkDesc: allVal?.summary || ''
    })
  }
  const handelForm = (data) => {
    form.setFieldsValue({ coverUrl: data?.imgData?.url })
    handelImg(data)
  }
  const renderItem = () => {
    const defaultProps = {
      maxLength: 30,
      showCount: true
    }
    return (
      <div className='linkContainer'>
        <Form.Item label='链接地址  ' name='linkUrl' rules={RULES}><Input className='inputBox'
        /></Form.Item>
        <Form.Item label='链接标题' name='linkTitle' rules={RULES}><Input
          {...defaultProps}
        /></Form.Item>
        <Form.Item label='链接描述' name='summary' rules={RULES}><Input.TextArea
          {...defaultProps}
        /></Form.Item>
        <Form.Item label='链接封面' name='coverUrl' rules={RULES}>
          <UploadImg handelChange={handelForm} imgData={fileList} />
        </Form.Item>
      </div>

    )
  }
  const handelCancel = () => {
    history.push('/materialLibrary')

  }

  const handelAdd = async () => {
    const { globalData } = reducer;
    let result = await GroupModal.show({
      code: 'add'
    })
    if (result.index === 1) {
      let res = await Api.addGroupList({
        dataType: globalData?.dataType,
        materialType: globalData.tabsKey,
        name: result?.value || '',
        deptList: result?.treeValue || [],
        scope: result?.radioValue || null
      })
      if (res?.retCode === 200) {
        message.success('添加分组成功')
        fetchData()
      } else {
        message.error(res?.retMsg || '')
      }
    }
  }
  const handelGroup = async () => {
    const res = await GroupChoseModal.show({
      data: reducer.globalData || {},
      values: form.getFieldsValue('categoryId') || ''
    })
    if (res.index === 1) {
      fetchData()
      form.setFieldsValue({
        categoryId: res?.selectedKeys
      })
    }
  }
  // if (loading) return <Spin />
  return (
    <div className='formContainer'>
      <div className='title'>
        {reducer?.editData?.id ? '编辑素材' : '新建素材'}
      </div>
      <div className='basic'>基础信息</div>
      <div className='main'>
        <div className="left">
          <Form
            onFinish={handelFinish}
            name="basic"
            onValuesChange={handelValue}
            form={form}
            className='formDiv'
          // initialValues={reducer?.editData || {}}
          >
            <Row>
              <Col span={20}>
                <Form.Item
                  label='素材标题'
                  name='title'
                  rules={RULES}
                >
                  <Input
                    placeholder='仅内部可见，方便整理和查看'
                    maxLength={30}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item
                  label='分组选择'
                  name='categoryId'
                  rules={RULES}
                  className='flexBox'
                >
                  <Select
                    options={selectData}
                    open={false}
                    onClick={handelGroup}
                  // onChange={handleSelect}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <div className='selectBox'>
                  <a onClick={handelAdd}>+添加分组</a>
                </div>
              </Col>
            </Row>
            <Row style={{ flex: 1 }}>
              <Col span={20}>
                <Form.Item
                  label='素材内容'
                  name='content'
                  rules={RULES}
                >
                  {
                    renderMain()
                  }
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className='over' wrapperCol={{ offset: 15, span: 10 }}>
              <Button onClick={handelCancel}>
                返回
            </Button>
              <Button type="primary" htmlType="submit">
                保存
            </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          <PhoneView list={fileList?.url || reducer?.globalData?.tabsKey == '5' ? [{ ...fileList, fileType: VIEW[reducer?.globalData?.tabsKey] }] : []} messageValue={messageValue} />
        </div>
      </div>


    </div>
  )
}

export default Index
