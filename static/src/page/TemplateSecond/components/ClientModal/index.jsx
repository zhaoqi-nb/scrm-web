/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Table, ConfigProvider } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons'
import './index.less';
import Api from './service'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN';


function GroupModal({ data, onPress }) {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState('');
  const [columns, setColumns] = useState([]);
  const [dataSource, setDatasource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableInfo, setTableInfo] = useState({})
  const [selectAllData, setSelectAllData] = useState([])


  const COLUMNS = {
    name: '群名称',
    customerSize: '群人数',
    ownerName: '群主',
    createTime: '建群时间'
  }
  const onSelectChange = (newSelectedRowKeys, data) => {
    setSelectAllData(data)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: data?.type == '2' ? 'checkbox' : 'radio'
  };

  useEffect(() => {
    const arr = data?.data?.map((item) => item?.id || '')
    setSelectedRowKeys(arr)
    setSelectAllData(data?.data)
    fetchData({ pageSize: 5 })
  }, [])

  const fetchData = async (data) => {
    let res = await Api.getTableData({ name: value, ...data, });
    if (res?.retCode === 200) {
      const result = initColumns(res?.data || [])
      setColumns(result?.columns)
      setDatasource(result?.dataSource)
      setTableInfo(res?.data || {})
    }
  }

  const initColumns = (data = []) => {
    const columns = Object.keys(COLUMNS)?.map((item) => {
      const obj = {
        key: item,
        dataIndex: item,
        title: COLUMNS[item]
      }
      if (item === 'customerSize') {
        obj.render = (val, allVal) => <div> {val}/<span style={{ color: '#8C8C8C' }}>{allVal?.size || 0}</span></div>
      } else if (item === 'createTime') {
        obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
      } else {
        obj.render = (val) => val || '-'
      }
      return obj
    })
    const dataSource = data?.list?.map((item) => ({ ...item, key: item?.id || '' }))

    return {
      columns,
      dataSource
    }
  }
  const _onCancel = () => {
    onPress({ index: 0 });
    setVisible(false);
  };
  const _onOk = () => {
    if (data?.type == '2' && selectedRowKeys.length > 5) {
      message.error('最多可以勾选5个群')
      return;
    }
    onPress({ index: 1, selectedRowKeys: selectAllData });
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

  const handelValue = (e) => {
    setValue(e?.target?.value || '')
  }

  const handelBlur = () => {
    fetchData({ pageSize: 5 })
  }

  return (
    <ConfigProvider locale={locale}>
      <Modal
        width={800}
        height={700}
        centered
        maskClosable={false}
        visible={visible}
        onOk={_onOk}
        footer={footRender}
        title={
          <div className="titleDiv">
            <b> 选择客户群</b>
          </div>
        }
        //   footer={footerRender}
        onCancel={_onCancel}
      >
        <div className="clientModal">
          <div className="banner">
            <div className="left">
              <ExclamationCircleFilled />
            </div>
            <div className="right">
              最多可以选择{data?.type == '2' ? 5 : 1}个客户群
          </div>
          </div>
          <div className="main">
            <Input
              placeholder='请输入要搜索的群名'
              suffix={<SearchOutlined />}
              value={value}
              onBlur={handelBlur}
              onChange={handelValue}
              onPressEnter={handelBlur}
            />
          </div>
          <div>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={dataSource}
              pagination={{
                className: 'pagination',
                showTotal: (total) => `共${total}条记录`,
                showQuickJumper: true,
                showSizeChanger: true,
                current: tableInfo?.pageNo,
                pageSize: tableInfo?.pageSize,
                defaultCurrent: tableInfo.pageCount,
                total: tableInfo.total
              }}
              onChange={(options) => fetchData({ pageNo: options?.current, pageSize: options?.pageSize })}
            />
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
