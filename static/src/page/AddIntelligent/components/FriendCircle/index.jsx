/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Form, Input, Select, Button, Affix, message } from 'antd'
import Api from '../../../AddFriendCircle/service'
import { initStaffData, } from '../../../AddFriendCircle/helper'
import { SendTarget, } from '../index'
import { TRCheckboxModal } from '@Tool/components'
import { UploadKind } from '../index'
import { userTreeFormat } from '@/utils/Util'


export default function AddFriendCircle({ data, onPress }) {
    const [staffData, setStaffData] = useState([]);
    const [staffValue, setStaffValue] = useState([]);
    const [staffOption, setStaffOption] = useState([])
    const [form] = Form.useForm()
    const fetchData = async () => {
        const res = await Api.getStaffData();
        if (res?.retCode === 200) {
            const data = initStaffData(res?.data || []);
            const result = userTreeFormat(res?.data || [])
            setStaffData(result)
            setStaffOption(data?.resultData || [])
        }
    }

    useEffect(() => {
        if (data?.code === 'edit') {
            setStaffValue(data?.editData?.implementNumberList)
            form.setFieldsValue({
                ...data,
                ...data.editData,
            })
        }
    }, [])

    // useEffect(() => {
    //     if (data?.code === 'edit') {
    //         console.log(data, 'data')
    //         form.setFieldsValue({
    //             ...data,
    //             fileList: data.fileData
    //         })
    //     }
    // }, [JSON.stringify(data)])
    const titleRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
    const handelSelect = async () => {
        const result = await TRCheckboxModal.show({
            treeData: staffData,
            value: staffValue,
            title: '选择员工',
            titleRender,
            itemRender: titleRender
        })
        if (result.index === 1) {
            form.setFieldsValue({ implementNumberList: result?.checkedKeys })
            setStaffValue(result?.checkedKeys || [])
        }
    }

    const onFinish = async (bata) => {
        let obj = {
            ...data,
            ...bata,
            // implementType: 2,
            // friendCircleType: 1,
            // externalType: 1,
            operatingTitle: bata?.name || ''
        }
        if (!(obj.textContent) && !(obj?.fileList?.length)) {
            message.error('朋友圈内容不能为空')
            return;
        }
        onPress({ index: 1, ...obj, labelIds: obj.labelId?.map((item) => item?.id || '') })

        // const res = await Api.addFriendCircle(obj);
        // if (res?.retCode === 200) {
        //     message.success('创建朋友圈成功')
        //     onPress({ index: 1, data: obj })
        //     // history.push('/CicleOfFriends')
        // } else {
        //     message.error('创建朋友圈失败')
        // }
    }
    const handelCancel = () => {
        onPress({ index: 0 })
        // history.push('/CicleOfFriends')
    }
    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className="FriendCircle">
            <div className="main">
                <Form
                    onFinish={onFinish}
                    form={form}
                >
                    <div className="subTitle">
                        流程节点备注
          </div>
                    <Form.Item
                        name="name"
                    >
                        <Input placeholder="请填写流程节点备注" maxLength={20} showCount />
                    </Form.Item>
                    <Form.Item
                        label={'发送目标客户'}
                        name='labelId'
                    >
                        <SendTarget staffValue={staffValue} />
                    </Form.Item>
                    <div className="subTitle">
                        朋友圈内容设置
          </div>
                    <Form.Item
                        label="任务名称"
                        name="friendCircleName"
                        rules={[{ required: true, message: '请填写任务名称' }]}
                    >
                        <Input placeholder="请输入任务名称" maxLength={20} showCount />
                    </Form.Item>
                    <Form.Item
                        label="执行成员"
                        name="implementNumberList"
                        rules={[{ required: true, message: '请填写任务名称' }]}
                    >
                        <Select
                            placeholder="发表成员"
                            options={staffOption}
                            open={false}
                            onClick={handelSelect}
                            mode="tags"
                            maxTagCount={3}
                            showArrow
                        />
                    </Form.Item>


                    <Form.Item
                        label={'文本内容'}
                        name='textContent'
                    >
                        <Input.TextArea
                            placeholder='请输入内容'
                            maxLength={1000}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item
                        name='fileList'
                    >
                        <UploadKind data={data} />
                    </Form.Item>
                    <div style={{ flex: 1 }}></div>
                    {data?.renderCode === 'readOnly' ? null : <Affix offsetBottom={5}>
                        <Form.Item wrapperCol={{ offset: 19, span: 30 }}>
                            <Button style={{ marginRight: '20px' }} onClick={handelCancel}>返回</Button>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Affix>}


                </Form>
            </div>
        </div>
    )
}
