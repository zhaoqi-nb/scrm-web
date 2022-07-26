/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Tag } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import { ExclamationCircleFilled } from '@ant-design/icons'
import './index.less';
import UploadImg from '../../../addMaterial/components/uploadImg'
import { ClientModal } from '../index'
import Api from './service'
function GroupModal({ data, onPress }) {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState('');
  const [imgData, setImgData] = useState({});
  const [tagList, setTagList] = useState([]);


  useEffect(() => {
    const { editData } = data;
    if (data?.editData?.id) {
      const groupData = editData?.groupList?.map((item) => ({ ...item, name: item?.groupName || '', id: item?.groupId || '' }))
      setValue(editData?.qwName || '')
      setImgData({ url: editData?.qwActivityCode || '' })
      setTagList(groupData)
    }
  }, [])
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = async () => {
    let obj = {
      qwName: value,
      qwActivityCode: imgData?.url || '',
      groupIds: tagList?.map((item) => item?.id || ''),
      activityCodeId: data?.id || ''
    }
    if (data?.editData?.id) {
      obj.id = data?.editData?.id || ''
    }
    let res = await Api.submitData(obj)
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
  return (
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
      <div className="templateModal">
        <div className="banner">
          <div className="left">
            <ExclamationCircleFilled />
          </div>
          <div className="right">
            为了统计数据准确，上传的【企业微信活码】和【对应群聊】中添加的客户群，需与企业微信后台保持一致
          </div>
        </div>
        <div className="first">
          <div className="left">企业微信群活码名称</div>
          <div className="right">
            <Input
              value={value}
              placeholder='建议和企业微信后台备注的群活码名称一致'
              onChange={(e) => setValue(e?.target?.value || '')}
              maxLength={30}
              showCount
            />
          </div>
        </div>
        <div className="first">
          <div className="left">企业微信活码</div>
          <div className="right">
            <UploadImg handelChange={handelImg} imgData={imgData} />
          </div>
        </div>
        <div className="first">
          <div className="left">对应群聊</div>
          <div className="right">
            <div className='addqun' onClick={handelAdd}>+添加群聊</div>
            <div className="render">
              {tagList?.map((item) => <Tag>{item?.name || ''}</Tag>)}
            </div>
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
