import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import TRNotification from '../../utils/TRNotifaction';
import './index.less';

function RemarkModal({ data, onPress }) {
  const { TextArea } = Input;
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(data?.data || '')
  }, [])
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = () => {
    onPress({ index: 1, value });
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

  return (
    <Modal
      width={527}
      height={326}
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
        <TextArea
          placeholder="请输入备注"
          maxLength={500}
          showCount
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
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
