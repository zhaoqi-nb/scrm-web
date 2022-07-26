import React, { useState } from 'react'
import { Upload, message } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'

function UploadImg(props) {
  const { imgData = {}, onChange } = props
  const [loading, setLoading] = useState(false)
  const [flieObj, setFileObj] = useState(imgData)
  const upLoadProps = {
    name: 'file',
    multiple: false,
    data: { type: 1 },
    showUploadList: false,
    accept: 'image/jpeg,image/jpg,image/png',
    action: '/api/scrm-service/file/upload',
    onChange(info) {
      const { status } = info.file
      if (status == 'uploading') {
        setLoading(true)
      }
      if (status === 'done') {
        const { response = {} } = info.file
        if (response.retCode == 200) {
          message.success(`${info.file.name} 上传成功`)
          setFileObj(response.data)
          onChange && onChange(response.data)
        } else {
          message.error(`${info.file.name}上传服务器失败`)
        }
        setLoading(false)
      } else if (status === 'error') {
        setLoading(false)
        message.error(`${info.file.name} 上传失败`)
      }
    },
    // onDrop(e) {
    //   console.log('Dropped files', e.dataTransfer.files)
    // },
    itemRender: () => null,
    beforeUpload: (file) => {
      const isUplaod = true
      const isLt2M = file.size / 1024 / 1014 > 2
      if (isLt2M) {
        message.error(`${file.name}文件大小超出限制，请修改后上传`)
      }
      return isUplaod
    },
  }
  const uploadButton = (
    <div className="flex-box middle flex-column">
      {loading ? <LoadingOutlined className="f20" /> : <UploadOutlined className="f20" />}
      <div className="mt8"> 点击上传图片</div>
    </div>
  )
  return (
    <div className="flex-box">
      <Upload name="avatar" {...upLoadProps} listType="picture-card" className="avatar-uploader" showUploadList={false}>
        {flieObj.url ? <img src={flieObj.url} alt={flieObj.fileName} style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <div className="text-sub1 pa" style={{ left: '112px' }}>
        图片支持2M以内，jpg/png 格式
      </div>
    </div>
  )
}

export default UploadImg
