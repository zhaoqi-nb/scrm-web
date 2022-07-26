/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Radio, Tag } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import './index.less';
import Api from '../../service'
import { dataSourceFormat } from '../../helper'
import { TRCheckboxModal } from '@Tool/components'

function GroupModal({ data, onPress }) {
  const TITLE = {
    'add': '添加分组',
    'update': '修改分组'
  }
  const RADIO = [
    { label: '辖内全部门可见', value: 1 },
    { label: '部分部门可见', value: 2 },
  ]
  const [visible, setVisible] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [treeValue, setTreeValue] = useState([]);
  const [radioValue, setRadioValue] = useState(1);
  const [treeNode, setTreeNode] = useState([]);
  const [value, setValue] = useState('');
  useEffect(() => {
    fetchData()
    if (data?.code != 'add') {
      setValue(data?.data?.name || '')
      setRadioValue(data?.data?.scope)
      const departInfos = data?.data?.departInfos?.map((item) => ({ ...item, title: item?.departName || '' }))
      setTreeNode(departInfos)
      setTreeValue(departInfos?.map((item) => item?.id))
    }
    //如果是个人素材，去掉范围选择
    if (data?.checkKey == 1) setRadioValue(null)
  }, [])

  const fetchData = async () => {
    const res = await Api.queryAllDepartAndAllMemberAddRoleBoundary();
    if (res?.retCode === 200) {
      const result = dataSourceFormat(res?.data || [])
      setTreeData(result)
    }
  }
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = () => {
    if (!(value?.length)) {
      message.error('分组名称不能为空');
      return;
    }
    onPress({ index: 1, value, radioValue, treeValue });
    setVisible(false);
  };

  const handelDepart = async () => {
    const result = await TRCheckboxModal.show({
      treeData,
      value: treeValue,
      title: '选择部门'
    })
    if (result?.index === 1) {
      setTreeValue(result?.checkedKeys || [])
      setTreeNode(result?.checkedNodes || [])
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
  const renderBottom = () => {
    if (radioValue != 2) return null;
    return (
      <div className="bottom">
        <div><Button onClick={handelDepart}>添加部门</Button></div>
        {treeValue?.length ? <div className="bottomResult">
          {treeNode?.map((item) => <Tag>{item?.title || ''}</Tag>)}
        </div> : null}
      </div>
    )
  }
  return (
    <Modal
      width={527}
      height={data?.checkKey != 1 ? 350 : 250}
      centered
      maskClosable={false}
      visible={visible}
      onOk={_onOk}
      footer={footRender}
      title={
        <div className="titleDiv">
          <b> {TITLE?.[data?.code] || ''}</b>
        </div>
      }
      //   footer={footerRender}
      onCancel={_onCancel}
    >
      <div className="groupModal">
        <div className='flexBox'>
          <div><span className='star'>*</span>分组名称</div>
          <div>
            <Input
              placeholder="请输入分组名称"
              maxLength={8}
              showCount
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        {
          data?.checkKey != 1 ? <div className='radio'>
            <Radio.Group
              options={RADIO}
              value={radioValue}
              onChange={(e) => setRadioValue(e.target.value)}
            />
          </div> : null
        }
        {renderBottom()}
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
