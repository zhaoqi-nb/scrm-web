import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import UploadPanel from './uploadPanel'
import LinForm from '../../comments/publicView/upload/commnet/linForm'

function DataList(props, ref) {
  const formRef = useRef()
  // 上传的data  外部控制是否打看弹框属性showModal  外部初始化数据
  const { optionData, onChange } = props
  const [fileType, setFileType] = useState('img')
  const [uploadData, setUploadData] = useState({})

  useEffect(() => {
    if (optionData && optionData.fileType) {
      setFileType(optionData.fileType)
      setUploadData(optionData)
    }
    // const subscription = optionData.subscribe()

    // // Specify how to clean up after this effect:
    // return () => {
    //   subscription.unsubscribe()
    // }
    console.log(optionData, 'optionData------------------')
  }, [optionData])
  const onCallback = () => {
    if (fileType == 'link') {
      return formRef.current.validateFields()
    }
    return new Promise((resolve, reject) => {
      if (uploadData.url) {
        resolve(uploadData)
      } else {
        reject({ msg: '请上传文件' })
      }
    })
  }
  const onGetData = () => {
    if (fileType == 'link') {
      return { ...formRef.current.getFieldsValue(), fileType }
    }
    return { ...uploadData, fileType }
  }

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // onCallback 就是暴露给父组件的方法
    onCallback,
    onGetData,
  }))

  const onUploadChange = (upLoadFileInfo) => {
    // upLoadFile 后台接口返回的数据
    setUploadData(upLoadFileInfo)
    onChange && onChange({ ...upLoadFileInfo, fileType })
  }
  return (
    <div>
      {fileType == 'link' ? (
        <LinForm formRef={formRef} uploadData={uploadData} />
      ) : (
        <UploadPanel fileData={{ type: 0 }} uploadData={uploadData} fileType={fileType} onChange={onUploadChange} /> // 编辑时候回显示数据
      )}
    </div>
  )
}

export default forwardRef(DataList)

/** *
 * 1.这个一个额外的组件，会传递一额新的ref
 * 2. 点击外面确定的时候，onfilsh 调用表单验证，获取数据，如果是link的话
 * 3. 如果是上传，直接改变外面的值，保存时候获取
 *
 *
 *
 * *** */
