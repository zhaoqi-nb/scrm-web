/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { Upload, message, Image, Button } from 'antd'
import { UploadOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons'
import { TYPE, compute } from './helper'
import './index.less'
function UploadImg(props) {
    const { imgData = [], handelChange, type = 'img', checkKey } = props
    const [loading, setLoading] = useState(false)
    const [flieObj, setFileObj] = useState([])

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
                    let arr = [...flieObj];

                    if (type == 'img') {
                        arr.push({ ...response.data, fileType: 1 });
                        setFileObj(arr)
                    } else {
                        arr[0] = { ...response.data, fileType: 2 };
                        setFileObj([...arr])
                    }
                    arr = arr.map((item) => ({ ...item, fileUrl: item?.url || '' }))
                    handelChange && handelChange(arr)
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
            let isUplaod = true
            const isLt2M = file.size / 1024 / 1024 > SIZE
            if (flieObj.length >= 9) {
                isUplaod = false;
                message.error('图片最多上传9张')
            }
            if (isLt2M) {
                isUplaod = false;
                message.error(`${file.name}文件大小超出限制，请修改后上传`)
            }
            return isUplaod
        },
    }

    const uploadButton = (
        <div className="flex-box middle flex-column upload" style={{ background: '#F5F7FA' }}>
            {loading ? <LoadingOutlined className="f20" /> : <UploadOutlined className="f20" />}
            <div className="mt8"> {flieObj?.url ? '重新上传' : '点击上传图片'}</div>
        </div>
    )

    const uploadVideoButton = (
        <div className="flex-box middle flex-column upload" style={{ background: '#F5F7FA' }}>
            {loading ? <LoadingOutlined className="f20" /> : <UploadOutlined className="f20" />}
            <div className="mt8"> {flieObj?.url ? '重新上传' : '添加视频'}</div>
        </div>
    )
    const handelDelete = (data, index) => {
        const fileResult = flieObj?.filter((item, _index) => index != _index)
        handelChange(fileResult)
        setFileObj(fileResult)
        // setFileObj({})
        // handelChange({}, 'delete')
    }
    const imgRender = () => {
        return flieObj?.map((item, index) => {
            return item?.fileType == 1 ? <div className='imgBox'>
                <Image src={item?.url || ''} alt={item?.fileName || ''} style={{ width: '112px', height: '112px' }} />
                <DeleteOutlined style={{ marginLeft: '5px' }} onClick={() => handelDelete(item, index)} />
            </div> : null
        })
    }

    const videoRender = () => {
        return flieObj?.map((item, index) => {
            return item?.fileType == 2 ? <div>
                <span>{item?.fileName || ''}</span>
                <DeleteOutlined style={{ marginLeft: '5px' }} onClick={() => handelDelete(item, index)} />
            </div> : null
        })
    }
    const itemRender = () => {
        switch (type) {
            case 'img':
                return imgRender()
            case 'file':
                return <div>{flieObj?.fileName || ''}</div>
            case 'video':
                return videoRender()
            default: break;
        }
    }
    const btnRender = () => {
        const isHave = flieObj?.id
        switch (type) {
            case 'img':
                return uploadButton
            case 'file':
                return <div><Button>{'+添加文件'}</Button></div>
            case 'video':
                return uploadVideoButton
            case 'link':
                return uploadButton
            default: break;
        }
    }

    const uploadRender = () => {
        return (
            <div className="flex-box">
                <Upload name="avatar" {...upLoadProps} listType={TYPE?.[type]?.key || ''} showUploadList={false}>
                    {btnRender()}
                </Upload>
                <div style={{ marginLeft: '10px' }}>
                    {TYPE?.[type]?.titleRender}
                </div>
            </div>
        )
    }
    return (
        <div className='uploadBox'>
            {uploadRender()}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', flexFlow: 'wrap' }}>
                {itemRender()}

            </div>
        </div>
    )
}

export default UploadImg
