/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import TRNotification from '../../utils/TRNotifaction';
import './index.less';
import CityCascader from '../../../comments/cityCascader'
import Api from '../../server'

function RemarkModal({ data, onPress }) {
    const { TextArea } = Input;
    console.log(data, 'data')
    const [visible, setVisible] = useState(true);
    const [value, setValue] = useState('');
    const [cityData, setCityData] = useState([]);

    useEffect(() => {
        setValue(data?.data || '')
    }, [])
    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    };
    const _onOk = async () => {
        const res = await Api.batchUpdateRegion({
            ids: data?.selectedRowKeys,
            province: cityData?.[0] || '',
            city: cityData?.[1] || '',
            county: cityData?.[2] || '',
            town: cityData?.[3] || '',
        })
        console.log(res, 'res')
        onPress({ index: 1, value });
        setVisible(false);
    };
    const handelChange = (data) => {
        const cityCodesArr = data.split('-')
        setCityData(cityCodesArr)
    }
    const footRender = [
        <Button key="back" onClick={_onCancel}>
            取消
      </Button>,
        <Button key="submit" onClick={_onOk} type="primary">
            确定
      </Button>,
    ];

    return (
        <Modal
            width={527}
            height={226}
            centered
            maskClosable={false}
            visible={visible}
            onOk={_onOk}
            footer={footRender}
            title={
                <div className="titleDiv">
                    <b> 设置地区</b>
                </div>
            }
            //   footer={footerRender}
            onCancel={_onCancel}
        >
            <div className="AreaModal">
                <div className="title">
                    将选中的<span>{data?.selectedRowKeys?.length}个群聊地区设置为:</span>
                </div>
                <div className="bottom">
                    <CityCascader onChange={handelChange} />
                </div>
            </div>
        </Modal>
    );
}
/**
 * data  结算单元初始化数据
 * chooseList  打开弹框回显的数据集合
 */
class SettleModal {
    __key__ = '';

    show = (data) => new Promise((resolve) => {
        if (this.__key__ !== '') {
            return;
        }
        this.__key__ = String(Date.now());
        TRNotification.add({
            key: this.__key__,
            content: (
                <RemarkModal
                    data={data}
                    // data={data}
                    // defaultCheckedList={chooseList}
                    onPress={(obj) => {
                        TRNotification.remove(this.__key__);
                        this.__key__ = '';
                        resolve(obj);
                    }}
                />
            ),
            duration: null,
        });
    });

    dismiss = () => {
        if (this.__key__.length > 0) {
            TRNotification.remove(this.__key__);
            this.__key__ = '';
        }
    };
}

const AddModal = new SettleModal();
export default AddModal;
