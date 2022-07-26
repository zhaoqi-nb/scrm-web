/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Switch, Radio, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons'
import TRNotification from '@Tool/utils/TRNotifaction';
import './index.less';
import Api from '../../clinetRunOff/service'
import { initStaffData } from '../helper'
import { TRCheckboxModal } from '@Tool/components'
import { RADIO_ENUM } from './helper'

function GroupModal({ onPress }) {

  const [visible, setVisible] = useState(true);
  const [switchValue, setSwitchValue] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [staffOption, setStaffOption] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [staffValue, setStaffValue] = useState([]);
  const [remindId, setRemindId] = useState('');

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    let [res, res1] = await Promise.all([Api.getDetailRemind(), Api.getStaffData()])
    if (res?.retCode === 200 && res1?.retCode === 200) {
      if (res?.data) {
        const data = res?.data
        const resultData = data?.memberList?.map((item) => item?.id || '')
        setSwitchValue(data?.openFlag === 1);
        setRadioValue(data?.remindType)
        setStaffValue(resultData)
        setRemindId(data?.id || '')
      }
      const data = initStaffData(res1?.data || {})
      setStaffOption(data?.resultData || [])
      setStaffData(data?.departList || [])
    }
  }
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = () => {
    handelFinfish()
  };

  const handelFinfish = async () => {
    let res = await Api.sureRemind({
      remindType: radioValue,
      openFlag: switchValue ? 1 : 0,
      remindMemberId: staffValue.join(','),
      id: remindId
    });
    if (res?.retCode === 200) {
      onPress({ index: 1 });
      setVisible(false);
    }
  }

  const handelRadio = (e) => {
    setRadioValue(e.target.value)
  }
  const handelSelect = async () => {
    const result = await TRCheckboxModal.show({
      treeData: staffData,
      value: staffValue,
      title: '选择员工'
    })
    if (result?.index === 1) {
      setStaffValue(result?.checkedKeys || [])
    }
  }

  const footRender = [
    <Button key="back" onClick={_onCancel}>
      取消
    </Button>,
    <Button key="submit" onClick={_onOk} type="primary">
      确定
    </Button>,
  ];

  const handelStaff = (data) => {
    setStaffValue(data)
  }
  return (
    <Modal
      width={627}
      height={526}
      centered
      maskClosable={false}
      visible={visible}
      onOk={_onOk}
      footer={footRender}
      title={
        <div className="titleDiv">
          <b> 提醒设置</b>
        </div>
      }
      //   footer={footerRender}
      onCancel={_onCancel}
    >
      <div className="remindModal">
        <div className="banner">
          <ExclamationCircleFilled />开启通知后，将按照所设置的通知频率在企业微信中给「接收提醒人」发送消息通知
        </div>
        <div className='statusBox'>
          <div>当前状态</div>
          <div><Switch checked={switchValue} onChange={(e) => setSwitchValue(e)} /></div>
        </div>
        <div>
          <div>通知频率</div>
          <div className='radioBox'>
            <Radio.Group value={radioValue} onChange={handelRadio}>
              {RADIO_ENUM?.map((item) => <Radio value={item?.value || ''}>{item?.title || ''}</Radio>)}
            </Radio.Group>
          </div>
        </div>
        <div>
          <div>接收提醒人</div>
          <div className='people'>
            <Select
              placeholder="请选择员工"
              options={staffOption}
              open={false}
              onClick={handelSelect}
              value={staffValue}
              onChange={handelStaff}
              mode='tags'
              maxTagCount={2}
              showArrow
            />
          </div>
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
        <GroupModal
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
