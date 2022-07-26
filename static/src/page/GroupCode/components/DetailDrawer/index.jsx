/* eslint-disable*/

import React, { useState, useEffect } from 'react';
import { ConfigProvider, Drawer, Image, Select, DatePicker, Table, Tooltip } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import { Charts } from '@Tool/components'
import './index.less';
import Api from '../../service'
import { TableTags } from '@Tool/components'
import moment from 'moment'
import { initChartsData } from '../../helper'
import { initSelectData, initColumns, TABS, BANNER, SELECT, CHARTS } from './helper'
import locale from 'antd/lib/locale/zh_CN';
import RsIcon from '@RsIcon'
import { exportFile } from '@/utils/Util'



function DetailDrawer({ data, onPress }) {
    const [visible, setVisible] = useState(true);
    const [topData, setTopData] = useState({});
    const [bannerData, setBannerData] = useState({});
    const [chartsKey, setChartsKey] = useState('addNum');
    const [selectValue, setSelectValue] = useState('week');
    const [date, setDate] = useState([]);
    const [chartsConfig, setChartsConfig] = useState({});
    const [tabsKey, setTabsKey] = useState('code');
    const [selectData, setSelectData] = useState({ code: [], group: [] });
    const [selectResult, setSelectResult] = useState({ code: null, group: null });
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [tableInfo, setTableInfo] = useState({})

    useEffect(() => {
        fetchData()
        handelSelect('week')
        fetchSelectData();
        fetchTableData({}, data?.data?.groupCodeType === 2 ? '' : 'group');

        // fetchChartsData()
    }, [])

    const fetchData = async () => {
        const id = data?.data?.id || ''
        const [res, res1] = await Promise.all([Api.getDetailFirst(id), Api.getDetailBanner(id)]);
        if (res?.retCode === 200 && res1?.retCode === 200) {
            setTopData(res?.data || {})
            setBannerData(res1?.data || {})
        }
    }

    const fetchTableData = async (val, type = '') => {
        const groupCodeType = data?.data?.groupCodeType
        const res = await Api.getTableData({
            groupActivityId: data?.data?.id || '',
            groupId: groupCodeType == 2 ? selectResult?.code || '' : selectResult?.group || '',//群ID
            searchType: groupCodeType,//群维度
            pageSize: 5,
            ...val
        });
        if (res?.retCode === 200) {
            const result = initColumns(type);
            setColumns(result?.columns || []);
            setDataSource(res?.data?.list || [])
            setTableInfo(res?.data)
        }
    }


    const fetchSelectData = async () => {
        const id = data?.data?.id || ''
        const [res, res1] = await Promise.all([Api.getCodeSelect(id), Api.getGroupSelect(id)]);
        if (res?.retCode === 200 && res1?.retCode === 200) {
            const result = initSelectData(res?.data || [], res1?.data || []);
            setSelectData(result)
        }
    }

    const fetchChartsData = async (val = {}, key = chartsKey) => {
        const id = data?.data?.id || ''
        const res = await Api.getChartsData({
            groupActivityCodeId: id,
            startTime: moment(date?.[0]).format('YYYY-MM-DD'),
            endTime: moment(date?.[1]).format('YYYY-MM-DD'),
            ...val
        })
        if (res?.retCode === 200) {
            const chartsConfig = initChartsData(res?.data, key);
            setChartsConfig(chartsConfig)
        }
    }
    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    };

    const copyUrl = (url) => {
        let input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        input.style.display = 'none';
    }
    const handelCopy = () => {
        copyUrl(data?.data?.activityUrl || '')
    }

    const handelUpload = () => {
        exportFile(data?.data?.qrCodeUrl)
    }

    const handelCharts = (data) => {
        setChartsKey(data?.key || '')
        fetchChartsData({}, data?.key)
    }

    const handelTabs = (val) => {
        setTabsKey(val?.key || '')
        if (val?.key === 'date') {
            fetchTableData({ searchType: 3 }, 'date')
        } else {
            const groupCodeType = data?.data?.groupCodeType
            fetchTableData({ searchType: groupCodeType }, groupCodeType == 2 ? '' : 'group')
        }
    }
    const handelDate = (date) => {
        setDate(date)
        fetchChartsData({
            startTime: moment(date?.[0])?.format('YYYY-MM-DD'),
            endTime: moment(date?.[1])?.format('YYYY-MM-DD'),
        })
        setSelectValue(null)
    }
    const handelSelect = (data) => {
        const dateValue = moment().subtract(1, 'day');
        let date = []
        if (data === 'yesterday') {
            date = [dateValue, dateValue]
        } else if (data === 'week') {
            const second = moment().subtract(8, 'days')
            date = [second, dateValue]
        } else {
            const second = moment().subtract(31, 'days');
            date = [second, dateValue]
        }
        setDate(date)
        fetchChartsData({
            startTime: date?.[0]?.format('YYYY-MM-DD'),
            endTime: date?.[1]?.format('YYYY-MM-DD'),
        })
        setSelectValue(data)
    }

    const handelCodeOrGroup = (e, code) => {
        setSelectResult({ ...selectResult, [code]: e })
        fetchTableData({
            searchType: code === 'code' ? 2 : 1,
            groupId: e
        }, code)
    }

    const renderSelect = () => {
        if (tabsKey === 'date') {
            return null;
        }
        else if (data?.data?.groupCodeType == 2) {
            return <div>
                群活码
                <Select
                    options={selectData?.code}
                    value={selectResult?.code}
                    placeholder={'请输入群活码'}
                    onChange={(e) => handelCodeOrGroup(e, 'code')}
                />
            </div>
        } else {
            return <div>
                群聊
                 <Select
                    options={selectData?.group}
                    value={selectResult?.group}
                    placeholder={'请输入群聊'}
                    onChange={(e) => handelCodeOrGroup(e, 'group')}
                />
            </div>
        }
    }
    const handelTable = (options) => {
        const groupType = data?.data?.groupCodeType
        fetchTableData({
            pageNo: options?.current,
            pageSize: options?.pageSize,
            searchType: tabsKey === 'date' ? 3 : groupType
        }, tabsKey == 'date' ? 'date' : groupType == 2 ? '' : 'group')
    }
    const renderTitle = () => {
        return <div>
            <div>入群客户总数：统计进入该群活码所有群的进群客户数的总和（包含历史已进入的群人数）</div>
            <div>退群客户总数：统计进入该群活码所有群的退群客户数的总和（包含历史已进入的群人数）</div>
            <div>净增客户总数：进入该活码所有群的入群客户数-退群客户数的总和</div>
        </div>
    }
    return (
        <ConfigProvider locale={locale}>
            <Drawer
                width={727}
                maskClosable={false}
                visible={visible}
                // onOk={_onOk}
                title={
                    <div className="titleDiv">
                        <b> 数据统计</b>
                    </div>
                }
                maskClosable={true}
                //   footer={footerRender}
                onClose={_onCancel}
                className='drawerDetail'
            >
                <div className="DetailDrawer">
                    <div className="top">基础信息</div>
                    <div className="topMain">
                        <div className="mainLeft">
                            <div className="leftItem"><div>活码名称</div><div>{topData?.groupCodeName || ''}</div></div>
                            <div className="leftItem"><div>备用员工</div><div><TableTags data={topData?.memberList || []} /></div></div>
                            <div className="leftItem"><div>群码类型</div><div>{topData?.groupCodeType == 2 ? '永久码' : '测试码'}</div></div>
                            <div className="leftItem"><div>群标签</div><div><TableTags data={topData?.labelList || []} /></div></div>
                        </div>
                        <div className="mainRight">
                            <div><Image src={data?.data?.qrCodeUrl || ''} /></div>
                            <div className='opearte'><a onClick={handelUpload}>下载</a><a onClick={handelCopy}>复制链接</a></div>
                        </div>
                    </div>
                    <div className="banner">
                        <div className="bannerTitle">数据总览 <Tooltip title={renderTitle()} placement={'topLeft'}><RsIcon type="icon-bangzhu1" className="ml6" /></Tooltip></div>
                        <div className="bannerMain">
                            <div className='bannerWhite'>
                                {
                                    BANNER?.map((item) => <div className='bannerList'>
                                        <div>{bannerData?.[item?.key] || 0}</div>
                                        <div>{item?.title || ''}</div>
                                    </div>)
                                }

                            </div>
                        </div>
                    </div>
                    <div className="chartsBox">
                        <div className="title">数据趋势</div>
                        <div className="tabsBox">
                            <div className="tabs">
                                {CHARTS?.map((item) =>
                                    <div
                                        className={`${item.key === chartsKey ? 'selectCharts' : ''}`}
                                        onClick={() => handelCharts(item)}>{item?.title || ''}</div>
                                )}
                            </div>
                        </div>
                        <div className="bottom">
                            <Select
                                options={SELECT}
                                value={selectValue}
                                onChange={handelSelect}
                                placeholder={'请选择种类'}
                            />
                            <DatePicker.RangePicker
                                value={date}
                                onChange={handelDate}
                            />
                        </div>
                        <div className="chartsDiv">
                            <Charts
                                config={chartsConfig}
                                height={'300px'}
                            />
                        </div>
                    </div>
                    <div className="tableBox">
                        <div className="title">活码明细</div>
                        <div className="tabsBox">
                            <div className="tabs">
                                {TABS?.map((item) =>
                                    <div
                                        className={`${item.key === tabsKey ? 'selectCharts' : ''}`}
                                        onClick={() => handelTabs(item)}>{item.key === 'code' ? data?.data?.groupCodeType == 1 ? '按群聊' : '按活码' : item?.title || ''}</div>
                                )}
                            </div>
                        </div>
                        <div className="selectBox">
                            {renderSelect()}
                        </div>
                        <div className="tableDiv">
                            <Table
                                columns={columns}
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
                                onChange={handelTable}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
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
                <DetailDrawer
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
