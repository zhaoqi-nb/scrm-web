/* eslint-disable*/

import { Tag } from 'antd'
import React, { useState, useEffect } from 'react'
import './index.less'
import Api from '../../service'
import CustomTagNew from '../../../comments/publicView/customTagNew'

export default function SendTarget({ onChange, staffValue, value = [] }) {

    const [tagData, setTagData] = useState([]);
    const [num, setNum] = useState('');
    useEffect(() => {
        setTagData(value)
    }, [JSON.stringify(value)]);
    const handelTag = (data) => {
        setTagData(data?.tagList || []);
        // const Idlist = data?.tagList?.map((item) => item?.id || '')
        onChange(data?.tagList || [])
    }

    const handelVisible = async () => {
        const Idlist = tagData?.map((item) => item?.id || '')

        const res = await Api.getVisibleData({
            userTage: Idlist,
            memberIds: staffValue
        })
        if (res?.retCode === 200) {
            setNum(res?.data?.num)
        }
    }
    return (
        <div className="targetBox">
            <div className="first">
                <div className="left">客户标签</div>
                <div className="right">
                    <CustomTagNew
                        value={{ tagList: tagData }}
                        onChange={handelTag}
                    />
                    <div className="bottom">
                        {tagData?.map((item) => <Tag>{item?.name || ''}</Tag>)}
                    </div>
                </div>
            </div>
            <div className="second">
                可见客户数 {num}<a onClick={handelVisible}>查看</a>
            </div>
        </div>
    )
}
