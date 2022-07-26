/* eslint-disable*/
import React, { useState, useEffect, useRef } from 'react'
import { DatePicker, Select, Table } from 'antd'
import { initStaffData, initTableData } from './helper'
import { TRCheckboxModal } from '@Tool/components'
import './index.less'
import Api from '../clinetRunOff/service'
import CustomerInfo from '../comments/customerInfo'
import RsIcon from '@RsIcon'
import RemindModal from './RemindModal'
import moment from 'moment'
import { userTreeFormat } from '@/utils/Util'



export default function StaffDelete() {
    const cusTomerInfoRef = useRef(null)

    const { RangePicker } = DatePicker;
    const [date, setDate] = useState([])
    const [staffData, setStaffData] = useState([]);
    const [staffValue, setStaffValue] = useState([]);
    const [staffOption, setStaffOption] = useState([]);
    const [checkObj, setCheckObj] = useState({});
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [tableInfo, setTableInfo] = useState({});
    const [optionId, setOptionId] = useState('');

    const handelDate = (data) => {
        setDate(data)
        fetchTableData({
            bizTimeStart: moment(data?.[0]).format('YYYY-MM-DD'),
            bizTimeEnd: moment(data?.[1]).format('YYYY-MM-DD'),
            memberIds: staffValue
        })
    }

    const fetchData = async () => {
        const [res, res1] = await Promise.all([Api.getStaffData(), Api.getJurisdiction()]);
        if (res?.retCode === 200 && res1?.retCode === 200) {
            const data = initStaffData(res?.data || []);
            const departList = userTreeFormat(res?.data || [])
            setStaffData(departList || [])
            setStaffOption(data?.resultData || [])
            setCheckObj(res1?.data || false)
        }
    }

    const fetchTableData = async (data) => {
        let res = await Api.getTableData({
            bizType: 'customer_del',
            ...data,
            pageSize: 5
        })
        if (res?.retCode === 200) {
            const result = initTableData(res?.data?.list || [])
            setColumns([...result?.columns || [], columnsMore()]);
            setDataSource(result?.dataSource || []);
            setTableInfo(res?.data || {})
        }
    }

    const titleRender = (item) => {
        return <div className='itemBox'>{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
    }

    const handelSelect = async () => {
        const result = await TRCheckboxModal.show({
            treeData: staffData,
            value: staffValue,
            title: '选择员工',
            titleRender,
            itemRender: titleRender
        })
        if (result.index === 1) {
            setStaffValue(result?.checkedKeys || [])
            fetchTableData({
                bizTimeStart: date?.length ? moment(date?.[0]).format('YYYY-MM-DD') : '',
                bizTimeEnd: date?.length ? moment(date?.[1]).format('YYYY-MM-DD') : '',
                memberIds: result?.checkedKeys || []
            })
        }
    }

    const handelDetail = (data) => {
        setOptionId(data?.customerId || '')
        setTimeout(() => {
            cusTomerInfoRef?.current?.optionInfo(true)
        }, 0);
    }

    const columnsMore = () => {
        return {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            render: (val, allVal) => {
                return <div className='operateBox'>
                    <a onClick={() => handelDetail(allVal)}>客户详情</a></div>
            }
        }
    }

    useEffect(() => {
        fetchData()
        fetchTableData();
    }, []);

    const handelSetting = async () => {
        const result = await RemindModal.show();
        if (result.index === 1) {
            fetchData()
        }
    }

    const handelStaff = (data) => {
        setStaffValue(data)
        fetchTableData({
            bizTimeStart: date?.length ? moment(date?.[0]).format('YYYY-MM-DD') : '',
            bizTimeEnd: date?.length ? moment(date?.[1]).format('YYYY-MM-DD') : '',
            memberIds: data
        })
    }
    return (
        <div className="staffContainer">
            <div className="title">员工删人提醒</div>
            <div className="banner">
                <div className="bannerLeft">
                    <RangePicker
                        value={date}
                        onChange={handelDate}
                    />
                    <Select
                        placeholder="请选择员工"
                        options={staffOption}
                        open={false}
                        onClick={handelSelect}
                        value={staffValue}
                        mode='tags'
                        maxTagCount={1}
                        showArrow
                        onChange={handelStaff}
                    />
                </div>
                <div className="bannerRight">
                    {checkObj?.flag ?
                        <div>
                            <div className={`${checkObj?.checkOpenStatus ? '' : 'openFalse'}`}><RsIcon type='icon-xiaoxi' /></div>
                            <div>当前{checkObj?.checkOpenStatus ? '开启' : '未开启'}【每次删人通知】</div>
                            <div onClick={handelSetting}><a>提醒设置</a></div>
                        </div>
                        : null}
                </div>
            </div>
            <div className="main">
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
                    onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}
                />
                {optionId?.length ? <CustomerInfo id={optionId} key={optionId} ref={cusTomerInfoRef} editChange={() => { }} /> : null}

            </div>
        </div >
    )
}
