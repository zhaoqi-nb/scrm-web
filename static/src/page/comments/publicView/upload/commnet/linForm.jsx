import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import UploadImg from './uploadImg'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

function LinkForm(props) {
  const { formRef, uploadData, linkType = 'link' } = props

  const onUploadImg = (objData) => {
    formRef.current.setFieldsValue({
      imgData: objData,
    })
  }
  useEffect(() => {
    if (uploadData && uploadData.link) {
      formRef.current.setFieldsValue(uploadData)
    } else {
      formRef.current.setFieldsValue({
        index: -1,
      })
    }
  }, [formRef, uploadData])

  return (
    <Form {...layout} ref={formRef} name="linkForm">
      <Form.Item name="index" />
      <Form.Item
        name="link"
        label="链接地址"
        rules={[
          {
            required: true,
          },
          {
            type: 'url',
            // warningOnly: true,
          },
          {
            type: 'string',
            min: 6,
          },
        ]}
      >
        <Input placeholder="链接地址请以http或https开头" />
      </Form.Item>
      {linkType == 'link' && (
        <>
          <Form.Item
            name="linkTitle"
            label="链接标题"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input showCount maxLength={30} placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            name="linkDesc"
            label="链接描述"
            className="textAreaItem"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea
              showCount
              maxLength={100}
              autoSize={{ minRows: 3, maxRows: 3 }}
              style={{ height: 92 }}
              placeholder="请输入链接描述"
            />
          </Form.Item>

          <Form.Item
            label="链接封面"
            name="imgData"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <UploadImg onChange={onUploadImg} imgData={uploadData.imgData} />
          </Form.Item>
        </>
      )}
    </Form>
  )
}
export default LinkForm
