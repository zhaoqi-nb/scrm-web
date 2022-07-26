/* eslint-disable*/
import React, { useEffect, useRef } from 'react'
import './index.less'
import { Input, Button, Form } from 'antd';
import SelectCustom from '../../../comments/screensCustomSj'
import _ from 'lodash'


export default function ClientEvent({ data, onPress }) {
    const { code, editData = {} } = data;
    const ref = useRef()

    useEffect(() => {
        initData()
    }, [])

    const initData = () => {
        if (code === 'edit') {
            ref.current.setFieldsValue({ ...data.editData })
        }
    }

    const handelCancel = () => {
        onPress({ index: 0 })
    }

    const onFinish = (data) => {
        const result = _.cloneDeep(data);
        onPress({ index: 1, ...result, eventList: [result?.screens || []] })
    }
    return (
        <div className="ClientEvent">
            <Form
                onFinish={onFinish}
                ref={ref}
            >
                <div className="dateTitle">流程节点备注</div>
                <Form.Item name='operatingTitle'><Input placeholder="请输入备注名称" showCount maxLength={30} /></Form.Item>
                <div className="dateTitle">筛选客户</div>
                <Form.Item ><SelectCustom selectType="event" /></Form.Item>
                {data?.renderCode === 'readOnly' ? null : <Form.Item className='flexBox1'>
                    <Button className="cancelBtn" onClick={handelCancel}>取消</Button>
                    <Button htmlType="submit" type="primary">保存</Button>
                </Form.Item>}

            </Form>
            {/* <div className="dateTitle">流程节点备注</div>
            <div className="dateSecond"><Input placeholder="请输入备注名称" showCount maxLength={30} value={inputValue} onChange={handelInput} /></div>
            <div className='dateTitle'>筛选客户</div>
            <div><SelectCustom value={[]} /></div>
            <div className="dateLast">
                <Button className="cancelBtn" onClick={handelCancel}>取消</Button>
                <Button type="primary" onClick={handelSave}>保存</Button>
            </div> */}
        </div>
    )
}
