/* eslint-disable*/

import React, { useState } from 'react';
import { ConfigProvider, Drawer } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import locale from 'antd/lib/locale/zh_CN';

function DetailDrawer({ data, onPress, Children }) {
    const [visible, setVisible] = useState(true);

    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    };

    return (
        <ConfigProvider locale={locale}>
            <Drawer
                width={727}
                maskClosable={false}
                visible={visible}
                // onOk={_onOk}
                title={
                    <div className="titleDiv">
                        <b> {data?.title || ''}</b>
                    </div>
                }
                maskClosable={true}
                //   footer={footerRender}
                onClose={_onCancel}
            >
                <Children onPress={onPress} data={data} />
            </Drawer>
        </ConfigProvider>
    );
}

class SettleModal {
    __key__ = '';

    show = (data, children) => new Promise((resolve) => {
        if (this.__key__ !== '') {
            return;
        }
        this.__key__ = String(Date.now());
        TRNotification.add({
            key: this.__key__,
            content: (
                <DetailDrawer
                    data={data}
                    // data={data}
                    Children={children}
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
