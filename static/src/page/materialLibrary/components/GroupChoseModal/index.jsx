/* eslint-disable*/
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input, message, Table } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import './index.less';
import Api from '../../service'
import RsIcon from '@RsIcon'
import { GroupModal } from '../index'

function GroupChooseModal({ data, onPress }) {
    const [visible, setVisible] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [selectedKeys, setsSlectedKeys] = useState([]);
    const handelChange = (selectedKey) => {
        setsSlectedKeys(selectedKey)
    }
    useEffect(() => {
        if (data?.values?.categoryId?.length) {
            setsSlectedKeys([data?.values?.categoryId])
        }
    }, [])
    const rowSelection = {
        onChange: handelChange,
        selectedRowKeys: selectedKeys,
        type: 'radio'
    };

    const columns = [{
        key: 'name',
        dataIndex: 'name',
        title: '分组'
    }, {
        key: 'scope',
        dataIndex: 'scope',
        title: '可见部门',
        render: (val, allVal) => {
            return val == 1 ? '全部部门' : allVal?.departInfos?.map((item) => item?.departName || '')?.join(',')
        }
    }]
    useEffect(() => {
        fetchData()

    }, [])

    const fetchData = async () => {
        const res = await Api.getGroupList({
            dataType: data?.data?.dataType || 0,
            materialType: data?.data?.tabsKey || 0
        });
        if (res?.retCode === 200) {
            setDataSource(res?.data || [])
        }
    }
    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    };
    const _onOk = () => {

        onPress({ index: 1, selectedKeys });
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

    const handelInput = (e) => {
        setInputValue(e.target.value)
    }
    const handelAdd = async () => {
        let result = await GroupModal.show({
            code: 'add'
        });
        if (result.index === 1) {
            let res = await Api.addGroupList({
                dataType: data?.data?.dataType || 0,
                materialType: data?.data?.tabsKey || 0,
                name: result?.value || '',
                deptList: result?.treeValue || [],
                scope: result?.radioValue || null
            })
            if (res?.retCode === 200) {
                message.success('添加分组成功')
                fetchData()
            } else {
                message.error(res?.retMsg || '')
            }
        }
    }

    const _dataSource = useMemo(() => {
        const data = dataSource?.map((item) => ({ ...item, key: item?.id }))?.filter((item) => item?.name.indexOf(inputValue) != -1)
        return data;

    }, [inputValue, dataSource])
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
                    <b>分组选择</b>
                </div>
            }
            //   footer={footerRender}
            onCancel={_onCancel}
        >
            <div className='groupChoseModal'>
                <div className="top">
                    <div className="topLeft">
                        <Input value={inputValue} onChange={handelInput} placeholder={'请输入分组名称'} suffix={<RsIcon type="icon-sousuo" />} />
                    </div>
                    <div className="topRight">
                        <a onClick={handelAdd}>+添加分组</a>
                    </div>
                </div>
                <div className="bottom">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={_dataSource}
                        pagination={{
                            pageSize: 5
                        }}
                    />
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
                <GroupChooseModal
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
