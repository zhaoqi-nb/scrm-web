/* eslint-disable*/
import React, { useEffect, useRef } from 'react'
import './index.less'
import { Input, Button, Form } from 'antd';
import SelectCustom from '../../../comments/screensCustomSj'
import moment from 'moment'
import _ from 'lodash'


export default function UpdateClientAttr({ data, onPress }) {
    const { code, editData = {} } = data;
    const ref = useRef()
    const handelInput = (e) => {
        setInputValue(e.target.value)
    }

    useEffect(() => {
        initData()
    }, [])

    const initData = () => {
        if (code === 'edit') {
            const screens = editData?.screens?.map((item) => {
                if (item.valueType == 4) {
                    return { ...item, filedValue: moment(item.filedValue) }
                }
                return { ...item }
            })
            ref.current.setFieldsValue({ ...data.editData, screens })
        }
    }

    const handelCancel = () => {
        onPress({ index: 0 })
    }

    const onFinish = (data) => {
        const result = _.cloneDeep(data)
        onPress({ index: 1, ...result, updateCustomerAttributeList: result?.screens || [] })
    }
    return (
        <div className="ClientAttribute">
            <Form
                onFinish={onFinish}
                ref={ref}
            >
                <div className="dateTitle">流程节点备注</div>
                <Form.Item name='operatingTitle'><Input placeholder="请输入备注名称" showCount maxLength={30} /></Form.Item>
                <div className="dateTitle">筛选客户</div>
                <Form.Item ><SelectCustom selectType={'updateCustom'} formRef={ref} /></Form.Item>
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
