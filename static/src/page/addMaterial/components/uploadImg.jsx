/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { Upload, message, Image, Button, } from 'antd'
import { UploadOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons'
import { TYPE, compute } from '../helper'
import './index.less'
function UploadImg(props) {
  const { imgData = {}, handelChange, type = 'img' } = props
  const [loading, setLoading] = useState(false)
  const [flieObj, setFileObj] = useState(imgData)
  useEffect(() => {
    setFileObj(imgData)
  }, [JSON.stringify(imgData)]);

  const upLoadProps = {
    name: 'file',
    multiple: false,
    data: { type: 1 },
    showUploadList: false,
    accept: TYPE[type]?.accept || '',
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
          handelChange && handelChange({ ...response.data, fileType: compute(info.file.name), imgData: { url: response.data?.url || '' } })
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
      const SIZE = TYPE?.[type]?.size || 0
      const isUplaod = true
      const isLt2M = file.size / 1024 / 1024 > SIZE
      if (isLt2M) {
        message.error(`${file.name}文件大小超出限制，请修改后上传`)
      }
      return isUplaod
    },
  }

  const uploadButton = (
    <div className=" middle flex-column upload" style={{ background: '#F5F7FA' }}>
      {loading ? <LoadingOutlined className="f20" /> : <UploadOutlined className="f20" />}
      <div className="mt8"> {flieObj?.url ? '重新上传' : '点击上传图片'}</div>
    </div>
  )
  const handelDelete = () => {
    setFileObj({})
    handelChange({}, 'delete')
  }
  const itemRender = () => {
    switch (type) {
      case 'img':
        return <Image src={flieObj?.url || ''} alt={flieObj?.fileName || ''} style={{ width: '112px', height: '112px' }} />
      case 'file':
        return <div>{flieObj?.fileName || ''}</div>
      case 'video':
        return <div>{flieObj?.fileName || ''}</div>
      default: break;
    }
  }
  const btnRender = () => {
    const isHave = flieObj?.id
    switch (type) {
      case 'img':
        return uploadButton
      case 'file':
        return <div><Button>{isHave ? '重新上传' : '+添加文件'}</Button></div>
      case 'video':
        return <div><Button>{isHave ? '重新上传' : '+添加视频'}</Button></div>
      case 'link':
        return uploadButton
      default: break;
    }
  }

  const uploadRender = () => {
    return (
      <div className='uploadera'>
        <Upload name="avatar" {...upLoadProps} listType={TYPE?.[type]?.key || ''} className="avatar-uploader" showUploadList={false}>
          {btnRender()}
        </Upload>
        <div className="text-sub1" >
          {TYPE?.[type]?.titleRender}
        </div>
      </div>
    )
  }
  return (
    <div style={{ width: '100%' }}>
      {uploadRender()}
      {flieObj.url && type != 'link' ? <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        {itemRender()}
        <DeleteOutlined style={{ marginLeft: '20px' }} onClick={handelDelete} />
      </div> : null}
    </div>
  )
}

export default UploadImg
