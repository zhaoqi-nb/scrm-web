import React, { useState, useEffect } from 'react'
import { Upload, message, Button, Image } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import RsIcon from '@RsIcon'

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
    accept: 'video/*',
    rule: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob'],
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
      const isUplaod = true
      const isLtM = file.size / 1024 / 1014
      if (isLtM > 10 && fileType == 'img') {
        // 2M图片
        message.error(`${file.name}图片大小超出限制，请修改后上传`)
        setLoading(false)
      } else if (isLtM > 20) {
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
        return `图片支持10M以内,${fileTypeObj.rule.join('、')}格式`
      case 'video':
        return '视频大小不超过20M'
      default:
        ''
    }
  }
  const uploadButton = (
    <div className="flex-box middle flex-column">
      {loading ? <LoadingOutlined className="f20" /> : <UploadOutlined className="f20" />}
      <div className="mt8"> 点击上传图片</div>
    </div>
  )
  const onDelClick = () => {
    setFileObj({})
    onChange && onChange({ fileType: 'img' })
  }
  const uploadButtonImg = (
    <div className="flex-box pr">
      <Image src={fileObj.url} alt={fileObj.fileName} width={102} height={102} preview={false} />
    </div>
  )
  const renderImg = () => (
    <div className="flex-box pr">
      <Upload name="avatar" {...upLoadProps} listType="picture-card" className="avatar-uploader" showUploadList={false}>
        {fileObj.url ? uploadButtonImg : uploadButton}
      </Upload>
      <div className="text-sub1 pa" style={{ left: '112px' }}>
        {renderConentText()}
      </div>
      {fileObj.url ? (
        <div className="pa" style={{ bottom: 5, left: '112px' }}>
          <RsIcon
            type="icon-shanchu"
            className="f20 ml10"
            onClick={() => {
              onDelClick()
            }}
          />
        </div>
      ) : null}
    </div>
  )
  const renderFilePanel = () => {
    const btnText = {
      file: '添加文件',
      video: '添加视频',
    }
    const typeIcons = {
      link: 'icon-lianjie',
      video: 'icon-shipin',
      file: 'icon-wenjian',
    }
    const disabled = fileObj.link || fileObj.fileName
    return (
      <div className="">
        <div className="flex-box middle-a">
          <Upload {...upLoadProps}>
            <Button size="small" loading={loading} disabled={disabled} icon={<RsIcon type="icon-tianjia" />}>
              {btnText[fileType]}
            </Button>
          </Upload>
          <div className="text-sub1 ml20">{renderConentText()}</div>
        </div>
        {disabled ? (
          <div className="flex-box middle-a between mt18 mb12 ">
            <div className="padt9 padb9 padl12 padr12 bg-panel box-sh flex1 f14" key={index}>
              <RsIcon type={typeIcons[fileType]} className="mr3 f18" /> {fileObj.link || fileObj.fileName}
            </div>
            <RsIcon
              type="icon-shanchu"
              className="f20 ml10"
              onClick={() => {
                onDelClick()
              }}
            />
          </div>
        ) : null}
      </div>
    )
  }

  return <div>{fileType == 'img' ? renderImg() : renderFilePanel()}</div>
}

export default UpLoadPanel
