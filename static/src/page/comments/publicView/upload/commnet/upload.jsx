import React, { useState, useRef, useEffect } from 'react'
import { Button, Popover, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import RsIcon from '@RsIcon'
import UploadPanel from './uploadPanel'
import LinForm from './linForm'

function UploadDropType(props) {
  const formRef = useRef()
  // 上传的data  外部控制是否打看弹框属性showModal  外部初始化数据
  const { onChange, data, showModal, optionData, linkType } = props
  const [fileType, setFileType] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [uploadData, setUploadData] = useState({})

  useEffect(() => {
    if (optionData && optionData.fileType && showModal) {
      setFileType(optionData.fileType)
      setIsModalVisible(showModal)
      setUploadData(optionData)
    }
    // const subscription = optionData.subscribe()

    // // Specify how to clean up after this effect:
    // return () => {
    //   subscription.unsubscribe()
    // }
  }, [optionData, showModal])

  const onChangeType = (type) => {
    setFileType(type)
    setPopoverVisible(false)
    setIsModalVisible(true)
    setUploadData({})
  }

  const content = () => (
    <div className="flex-box flex-column">
      <Button
        type="text"
        onClick={() => {
          onChangeType('img')
        }}
        icon={<RsIcon type="icon-gerenhuoma-tupian" />}
      >
        图片
      </Button>
      <Button
        type="text"
        onClick={() => {
          onChangeType('link')
        }}
        icon={<RsIcon type="icon-lianjie" />}
      >
        链接
      </Button>
      <Button
        type="text"
        onClick={() => {
          onChangeType('file')
        }}
        icon={<RsIcon type="icon-wenjian" />}
      >
        文件
      </Button>
      <Button
        type="text"
        onClick={() => {
          onChangeType('video')
        }}
        icon={<RsIcon type="icon-shipin" />}
      >
        视频
      </Button>
    </div>
  )
  const renderTitle = () => {
    switch (fileType) {
      case 'file':
        return '添加文件'
      case 'img':
        return '添加图片'
      case 'video':
        return '添加视频'
      case 'link':
        return '添加链接'
      default:
        '添加图片'
    }
  }
  const onHandleCancel = () => {
    if (fileType == 'link') {
      formRef.current.resetFields()
    }
    setIsModalVisible(false)
  }
  const onHandleOk = () => {
    if (fileType == 'link') {
      formRef.current
        .validateFields()
        .then((values) => {
          onChange && onChange({ ...values, fileType })
          formRef.current.resetFields()
          setIsModalVisible(false)
        })
        .catch(() => {
          // errInfo
          // 表单验证失败
          message.error('表单验证失败，请仔细填写')
        })
    } else {
      if (uploadData.url) {
        // 表示上传文件存在
        onChange && onChange({ ...uploadData, fileType }) // object  传递出上传文件信息
      }
      setIsModalVisible(false)
    }
  }
  const onBtnClick = () => {
    setPopoverVisible(!popoverVisible)
  }
  const onUploadChange = (upLoadFileInfo) => {
    // upLoadFile 后台接口返回的数据
    setUploadData(upLoadFileInfo)
  }
  return (
    <div>
      <Popover placement="topLeft" visible={popoverVisible} title="" content={content}>
        <Button type="text" onClick={onBtnClick} icon={<PlusOutlined className="text-link" />}>
          {popoverVisible ? '点击关闭' : '添加附件'}
        </Button>
      </Popover>

      <Modal title={renderTitle()} visible={isModalVisible} onOk={onHandleOk} onCancel={onHandleCancel}>
        {fileType == 'link' ? (
          <LinForm linkType={linkType} formRef={formRef} uploadData={uploadData} />
        ) : (
          <UploadPanel fileData={data} uploadData={uploadData} fileType={fileType} onChange={onUploadChange} /> // 编辑时候回显示数据
        )}
      </Modal>
    </div>
  )
}
export default UploadDropType
