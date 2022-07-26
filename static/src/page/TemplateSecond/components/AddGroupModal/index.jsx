/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, message, Tag, InputNumber, ConfigProvider } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import { ExclamationCircleFilled } from '@ant-design/icons'
import './index.less';
import UploadImg from '../../../addMaterial/components/uploadImg'
import { ClientModal } from '../index'
import locale from 'antd/lib/locale/zh_CN';
import Api from '../../service'
import moment from 'moment'

function GroupModal({ data, onPress }) {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState('');
  const [imgData, setImgData] = useState({});
  const [tagList, setTagList] = useState([]);
  const [date, setDate] = useState('');
  const [num, setNum] = useState(200);


  useEffect(() => {
    const { editData } = data;
    if (data?.editData?.id) {
      setNum(editData?.upperLimit || "")
      setDate(moment(editData?.failureTime || ''))
      setImgData({ url: editData?.groupCode || '' })
      setTagList([{ name: editData?.qwName || '', id: editData?.groupId || '' }])
    }
  }, [])
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = async () => {
    if (!date || !(imgData?.url) || !(tagList?.length)) {
      message.error('不能存在空项');
      return;
    }
    let obj = {
      activityCodeId: data?.id || '',
      groupCode: imgData?.url || '',
      groupId: tagList?.[0]?.id || '',
      failureTime: moment(date).format('x'),
      upperLimit: num
    }
    if (data?.editData?.id) {
      obj.id = data?.editData?.id || ''
    }
    let res = await Api.addGroupCode(obj)
    if (res?.retCode === 200) {
      onPress({ index: 1, value });
      setVisible(false);
    }
  };

  const footRender = [
    <Button key="back" onClick={_onCancel}>
      取消
    </Button>,
    <Button key="submit" onClick={_onOk} type="primary">
      确定
    </Button>,
  ];

  const handelImg = (data) => {
    setImgData(data)
  }

  const handelAdd = async () => {
    const result = await ClientModal.show({ type: data?.type || '', data: tagList })
    if (result.index === 1) {
      setTagList(result?.selectedRowKeys || [])
    }
  }

  const handelDate = (data) => {
    setDate(data)
  }

  const handelNum = (data) => {

    setNum(data)
  }
  return (
    <ConfigProvider locale={locale}>
      <Modal
        width={527}
        height={800}
        centered
        maskClosable={false}
        visible={visible}
        onOk={_onOk}
        footer={footRender}
        title={
          <div className="titleDiv">
            <b> 添加</b>
          </div>
        }
        //   footer={footerRender}
        onCancel={_onCancel}
      >
        <div className="addGroupModal">
          <div className="first">
            <div className="left"><span>*</span>客户群</div>
            <div className="right">
              <div className='addqun' onClick={handelAdd}>+添加群聊</div>
              <div className="render">
                {tagList?.map((item) => <Tag>{item?.name || ''}</Tag>)}
              </div>
            </div>
          </div>
          <div className="first">
            <div className="left"><span>*</span>群二维码</div>
            <div className="right">
              <UploadImg handelChange={handelImg} imgData={imgData} />
            </div>
          </div>
          <div className="first">
            <div className="left"><span>*</span>群二维码有效期</div>
            <div className="right">
              <DatePicker
                onChange={handelDate}
                value={date}
                placeholder={'请选择日期'}
              />
              <div className='rightBottom'>群二维码有效期为7天，请填写群二维码上的日期</div>
            </div>
          </div>
          <div className="first">
            <div className="left"><span>*</span>群人数上限</div>
            <div className="right">
              <InputNumber value={num} max={200} min={0} onChange={handelNum} />
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
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
