import React, { useState, useEffect } from 'react'
import { Upload, message, Image } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'

const { Dragger } = Upload
const uploadType = {
  img: {
    accept: 'image/jpeg,image/jpg,image/png',
    rule: ['jpg', 'png', 'jpeg'],
  },
  pdf: {
    accept: 'application/pdf',
    rule: ['pdf'],
  },
  word: {
    accept: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    rule: ['doc', 'docx'],
  },
  excel: {
    accept:
      'application/vnd.ms-excel, application/x-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    rule: ['xls', 'xlsx'],
  },
  ppt: {
    accept: 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    rule: ['ppt', 'pptx'],
  },
  video: {
    accept: 'video/mp4',
    rule: ['mp4'],
  },
  cad: {
    accept:
      'application/acad,application/x-autocad,image/vnd.dwg,image/x-dwg,image/vnd.dxf,image/x-dxf,image/vnd.dwt,image/x-dwt',
    rule: ['cad'],
  },
}

function UpLoadPanel(props) {
  const [loading, setLoading] = useState(false)
  const [fileObj, setFileObj] = useState({})
  const [index, setIndex] = useState(-1)
  // onChange 上传成功执行change 抛出数据 // uploadData 外部传递过来的初始化数据
  const { onChange, fileType, fileData, uploadData } = props
  let fileTypeObj = uploadType[fileType]

  if (fileType === 'file') {
    fileTypeObj = {
      accept: [uploadType.word.accept, uploadType.excel.accept, uploadType.pdf.accept, uploadType.ppt.accept].join(
        ', '
      ),
      rule: [...uploadType.word.rule, ...uploadType.excel.rule, ...uploadType.pdf.rule, ...uploadType.ppt.rule],
    }
  }
  useEffect(() => {
    if (uploadData && uploadData.url) {
      setFileObj(uploadData)
      setIndex(uploadData.index)
    } else {
      setFileObj({})
    }
    setLoading(false)
  }, [uploadData])
  const upLoadProps = {
    name: 'file',
    multiple: false,
    data: fileData,
    accept: fileTypeObj.accept,
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
          setFileObj({ ...response.data, index })
          onChange && onChange({ ...response.data, index })
        } else {
          message.error(`${info.file.name}上传服务器失败`)
        }
        setLoading(false)
      } else if (status === 'error') {
        setLoading(false)
        message.error(`${info.file.name} 上传失败`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
    itemRender: () => null,
    beforeUpload: (file) => {
      setFileObj({})
      let isUplaod = true
      const isLtM = file.size / 1024 / 1014
      if (isLtM > 2 && fileType == 'img') {
        isUplaod = false
        setLoading(false)
        // 2M图片
        message.error(`${file.name}图片大小超出限制，请修改后上传`)
      } else if (isLtM > 20) {
        isUplaod = false
        // 2M图片
        message.error(`${file.name}文件大小超出限制，请修改后上传`)
        setLoading(false)
      }
      return isUplaod
    },
  }
  const renderConentText = () => {
    switch (fileType) {
      case 'file':
        return '支持文件格式：Word、Excel、PDF、PPT，大小不超过20M'
      case 'img':
        return `支持图片格式${fileTypeObj.rule.join('、')}`
      case 'video':
        return '视频大小不超过20M'
      default:
        ''
    }
  }
  const uploadButton = () => (
    <div> {loading ? <LoadingOutlined className="f36" /> : <UploadOutlined className="f36" />}</div>
  )

  const renderFile = () => {
    console.log(fileObj.url)
    if (fileType == 'img') {
      return <Image src={fileObj.url} preview={false} width={100} />
    }
    return (
      <div
        onClick={() => {
          window.open(fileObj.url)
        }}
      >
        {fileObj.fileName}
      </div>
    )
  }

  return (
    <Dragger {...upLoadProps}>
      <div className="ant-upload-drag-icon">{fileObj.url ? renderFile() : uploadButton()}</div>
      <p className="ant-upload-text">{fileObj.url ? '点击或拖拽到此处替换源文件' : '点击添加或拖拽到此处'}</p>
      <p className="ant-upload-hint">{renderConentText()}</p>
    </Dragger>
  )
}

export default UpLoadPanel
