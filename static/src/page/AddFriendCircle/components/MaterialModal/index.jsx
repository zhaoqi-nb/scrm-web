/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Tabs } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import { Material } from '../index'

function RemarkModal({ data, onPress }) {
    const { TabPane } = Tabs;
    const [visible, setVisible] = useState(true);
    const [value, setValue] = useState({});
    const [types, setTypes] = useState('');

    const TYPENUM = [
        { key: 0, name: '企业素材' },
        { key: 1, name: '个人素材' },
    ]

    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    };
    const _onOk = () => {
        onPress({ index: 1, value, types });
        setVisible(false);
    };

    const footRender = [
        <Button key="back" onClick={_onCancel}>
            取消
      </Button>,
        <Button key="submit" onClick={_onOk} type="primary">
            确定
      </Button>,
    ];

    const handelChange = (data, type) => {
        setValue(data?.[0] || {})
        setTypes(type)
    }
    const renderTabs = () => TYPENUM?.map((item) => (
        <TabPane tab={item?.name || ''} key={item?.key || ''}>
            <Material type={item?.key || 0} handelRowSelection={handelChange} />
        </TabPane>
    ))
    return (
        <Modal
            width={800}
            height={600}
            centered
            maskClosable={false}
            visible={visible}
            onOk={_onOk}
            footer={footRender}
            title={
                <div className="titleDiv">
                    <b> 备注编辑</b>
                </div>
            }
            //   footer={footerRender}
            onCancel={_onCancel}
        >
            <div className="container">
                <Tabs defaultActiveKey="0" >
                    {renderTabs()}
                </Tabs>
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
