/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Radio, Image } from 'antd'
import { UploadAll, MaterialModal } from '../../../AddFriendCircle/components'
import { UploadOutlined } from '@ant-design/icons'


export default function UploadKind({ onChange, data }) {
    const [checkKey, setCheckKey] = useState(1);
    const [fileData, setFileData] = useState([]);
    const [fileResult, setFileResult] = useState({});


    const RADIO = [
        { title: '图片', key: 1 },
        { title: '视频', key: 2 },
        { title: '素材库选择', key: 3 },
    ]
    const handelRadio = (val) => {
        setCheckKey(val?.target?.value)
    }
    useEffect(() => {
        setCheckKey(data?.radioType || '')
        setFileResult(data?.editData?.fileList?.[0] || {})
        onChange(data?.editData?.fileList);
    }, [JSON.stringify(data)])

    const handelChange = (data) => {
        setFileData(data)
        const _data = data?.map((item) => ({ ...item, fileType: checkKey }))
        onChange(_data);
    }

    const handelMaterial = async () => {
        const result = await MaterialModal.show();
        if (result?.index === 1) {
            setFileResult(result?.value || '')
            onChange([{ ...result?.value, materialType: result?.types, materialId: result?.value?.id || '', fileType: 3 }])
        }
    }

    const fileRender = () => {
        const url = fileResult?.coverUrl || fileResult?.url
        return <div className='result'>
            {url ? <div className='left'><Image src={url} /></div> : null}
            <div className="center">{fileResult?.title || ''}</div>
            <div className="right">  <a onClick={handelMaterial}>重新选择</a> </div>
        </div>
    }
    const materialRender = () => {
        if (fileResult?.id) {
            return fileRender()
        }
        return <div className="flex-box middle flex-column upload" style={{ background: '#F5F7FA' }} onClick={handelMaterial}>
            <UploadOutlined className="f20" />
            <div className="mt8"> 素材库导入</div>
        </div>
    }
    const bottomRender = () => {
        if (checkKey === 1) {
            return <UploadAll imgData={data?.editData?.fileList || []} checkKey={checkKey} handelChange={handelChange} />
        } else if (checkKey === 2) {
            return <UploadAll imgData={data?.editData?.fileList || []} type="video" checkKey={checkKey} handelChange={handelChange} />
        } else {
            return materialRender()
        }
    }
    return (
        <div className="upLoadKind">
            <div className="top">
                <Radio.Group value={checkKey} onChange={handelRadio}>
                    {RADIO?.map((item) => <Radio value={item?.key}>{item?.title || ''}</Radio>)}
                </Radio.Group>
            </div>
            <div className="bottom" >{bottomRender()}</div>
        </div>
    )
}
