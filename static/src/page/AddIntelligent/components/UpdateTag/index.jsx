/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Input, Tag, Button, message } from 'antd';
import CustomTagNew from '../../../comments/publicView/customTagNew'

export default function UpdateTag({ data, onPress }) {
    const { code, editData = {} } = data;
    const [inputValue, setInputValue] = useState('')
    const [addTagData, setAddTagData] = useState([])
    const [deleteTagData, setDeleteTagData] = useState([])

    const handelInput = (e) => {
        setInputValue(e.target.value)
    }

    useEffect(() => {
        initData()
    }, [])

    const initData = () => {
        if (code === 'edit') {
            setAddTagData(editData?.addLabelList || []);
            setDeleteTagData(editData?.removeLabelList || [])
            setInputValue(editData?.operatingTitle || '')
        }
    }
    const handelSave = () => {
        if (addTagData?.length || deleteTagData?.length) {
            const addLabelList = addTagData?.map((item) => ({ ...item, labelId: item?.id, labelName: item?.name }))
            const removeLabelList = deleteTagData?.map((item) => ({ ...item, labelId: item?.id, labelName: item?.name }))
            onPress({
                index: 1,
                removeLabelList,
                addLabelList,
                operatingTitle: inputValue?.length ? inputValue : '修改客户标签'
            })
        } else {
            message.error('标签不能为空')
            return;
        }
    }

    const handelAdd = (data = []) => {
        setAddTagData(data?.tagList || [])
    }

    const closeAdd = (val) => {
        const result = [...addTagData]?.filter((item) => {
            return item.id != val.id
        });
        setAddTagData(result)
    }
    const closeDelete = (val) => {
        const result = [...deleteTagData]?.filter((item) => {
            return item.id != val.id
        });
        setDeleteTagData(result)
    }
    const handelDelete = (data = []) => {
        setDeleteTagData(data?.tagList || [])
    }
    const handelCancel = () => {
        onPress({ index: 0 })
    }

    return (
        <div className="UpdateTag">
            <div className="dateTitle">流程节点备注</div>
            <div className="dateSecond"><Input placeholder="请输入备注名称" showCount maxLength={30} value={inputValue} onChange={handelInput} /></div>
            <div className="dateTitle">客户标签设置</div>
            <div className='tagTitle'>新增标签</div>
            <div className='addBoxx'>
                <CustomTagNew value={{ tagList: addTagData }} onChange={handelAdd} />
            </div>
            <div className='tagBox'>
                {addTagData?.map((item) => <Tag closable key={item?.id || ''} onClose={() => closeAdd(item)}>{item?.name || ''}</Tag>)}
            </div>
            <div className='tagTitle'>删除标签</div>
            <div className='addBoxx'>
                <CustomTagNew value={{ tagList: deleteTagData }} onChange={handelDelete} />
            </div>
            <div className='tagBox'>
                {deleteTagData?.map((item) => <Tag closable key={item?.id || ''} onClose={() => closeDelete(item)}>{item?.name || ''}</Tag>)}

            </div>
            { data?.renderCode === 'readOnly' ? null : <div className="dateLast">
                <Button className="cancelBtn" onClick={handelCancel}>取消</Button>
                <Button type="primary" onClick={handelSave}>保存</Button>
            </div>}

        </div>
    )
}
