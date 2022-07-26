/* eslint-disable*/

import React, { useState, useEffect } from 'react'
import './index.less'
import { DatePicker, Table, Spin } from 'antd'
import CityCascader from '@/page/comments/cityCascader'
import Api from './service'
import RsIcon from '@RsIcon'
import Charts from './Charts'
import { initColumns, initMapOption, initChartsOption, BANNER, TYPE } from './helper'
import moment from 'moment'
export default function Overview() {
    const [date, setDate] = useState([moment(), moment().subtract(7, 'days')]); //日期
    const [bannerData, setBannerData] = useState({}); //banner数据
    const [types, setTypes] = useState('map'); //切换地图柱状图 表格
    const [options, setOptions] = useState({}); //echarts数据
    const [cityData, setCityData] = useState({ province: '', city: '', county: '' }); //echarts数据
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [tableInfo, setTableInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchMap = async (data = {}) => {
        const res = await Api.getMap({
            startDate: date?.[0] ? moment(date?.[0]).startOf('day').format('x') : '', //开始日期
            endDate: date?.[1] ? moment(date?.[1]).endOf('day').format('x') : '',
            ...data
        });
        if (res?.retCode === 200) {
            const result = initMapOption(res?.data || []);
            setOptions(result)

        }
    }

    const fetchCharts = async (data = {}) => {
        const res = await Api.getChartsData({
            province: cityData?.province || '',//多级选择的省份
            city: cityData?.city || '',//多级选择的省份下的市
            county: cityData?.county || '',//多级选择的省份下的市下的区
            ...data
        })
        if (res?.retCode === 200) {
            const result = initChartsOption(res?.data || [])
            setOptions(result)
        }
    }

    const fetchData = async (data = {}) => {
        const res = await Api.getStatisticInfo({
            startTime: date?.[0] ? moment(date?.[0]).startOf('day').format('x') : '', //开始日期
            endTime: date?.[1] ? moment(date?.[1]).endOf('day').format('x') : '',
            province: cityData?.province || '',//多级选择的省份
            city: cityData?.city || '',//多级选择的省份下的市
            county: cityData?.county || '',//多级选择的省份下的市下的区
            ...data
        });
        if (res?.retCode === 200) {
            setBannerData(res?.data || {})
        }
    }
    const renderBanner = () => {
        return BANNER?.map((item) => {
            return <div className={`bannerLeft ${item.code === 'lostGroupCustomerSum' ? 'bannerRight' : ''}`}>
                <div className="left">
                    <div className='iconBox' style={{ background: item?.background, color: item?.color }}><RsIcon type={item?.icon || ''} /> </div>
                    <div>
                        <div className='leftTitle'>{item?.title || ''}</div>
                        <div className='leftMain'>{bannerData?.[item?.code] || 0}</div>
                    </div>
                </div>
                <div className="right">
                    {item?.add ? <div className='rightItem'><div className='shangsan'></div> <div className='mainItem'>新增 {bannerData?.[item?.add] || 0}</div></div> : null}
                    {item?.minus ? <div className='rightItem'><div className='xiasan'></div> <div className='mainItemBottom'>流失 {bannerData?.[item?.minus] || 0}</div></div> : null}
                </div>
            </div>
        })
    }
    const fetchTable = async (data = {}) => {
        const res = await Api.getTableData({
            province: cityData?.province || '',//多级选择的省份
            city: cityData?.city || '',//多级选择的省份下的市
            county: cityData?.county || '',//多级选择的省份下的市下的区
            pageSize: 5,
            ...data
        });
        if (res?.retCode === 200) {
            setDataSource(res?.data?.list || [])
            const columns = initColumns();
            setColumns(columns);
            setTableInfo(res?.data || {})
        }
    }
    const renderMain = () => {
        switch (types) {
            case 'map':
                return <Charts config={options} />
            case 'zhu':
                return <Charts config={options} />
            case 'table':
                return <Table
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
                        total: tableInfo.totalCount
                    }}
                    onChange={(options) => fetchTable({ pageNo: options?.current, pageSize: options?.pageSize })}
                />
            default:
                break;
        }
        return <Charts config={options} />
    }
    const handelTabs = (data) => {
        setTypes(data?.type || '')
        fetchType(data?.type || '')
    }
    useEffect(() => {
        fetchData()
        // fetchCharts()
        // fetchTable()
        fetchMap()
    }, []);
    const handelCity = (data) => {
        const _cityData = data.split('-');
        const obj = {
            province: _cityData?.[0] || '',
            city: _cityData?.[1] || '',
            county: _cityData?.[2] || '',
        }
        // if (_cityData.length >= 3) {
        setCityData(obj)
        fetchData(obj)
        fetchType(types, obj)
        // }
    }

    const fetchType = (type = types, data = {}) => {
        if (type === 'zhu') {
            fetchCharts(data)
        } else if (type === 'map') {
            fetchMap(data)
        } else {
            fetchTable(data)
        }
    }

    const handelDate = (date) => {
        setDate(date);
        const obj = {
            startTime: moment(date?.[0]).startOf('day').format('x'), //开始日期
            endTime: moment(date?.[1]).endOf('day').format('x'),
        }
        fetchData(obj)
        fetchType(types, obj)
    }

    const handelExport = async () => {
        setLoading(true)
        const res = await Api.getExport({
            province: cityData?.province || '',//多级选择的省份
            city: cityData?.city || '',//多级选择的省份下的市
            county: cityData?.county || '',//多级选择的省份下的市下的区
        });
        if (res?.retCode === 200) {
            window.open(res?.data)
            setLoading(false)
        }

    }
    return (
        <Spin spinning={loading} tip={'导出中'}>
            <div className="Overview">
                <div className="top">
                    <div className="title">数据概览</div>
                    <div className="topBottom">
                        <div><DatePicker.RangePicker value={date} onChange={handelDate} /></div>
                        <div className='city'><CityCascader
                            cityLevel={3}
                            onChange={handelCity} /></div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="title">客户数据看板</div>
                    <div className="banner">
                        {renderBanner()}
                    </div>
                    <div className="main">
                        <div className="mainTitle">按地区统计</div>
                        <div className="mainRender">
                            <div className="mainLeft">
                                {renderMain()}
                            </div>
                            <div className="mainRight">
                                {types === 'table' ? <div onClick={handelExport}><RsIcon type={'icon-daochu'} /></div> : null}
                                {TYPE?.map((item) => <div
                                    className={`${types === item?.type ? 'select' : ''}`}
                                    onClick={() => handelTabs(item)}
                                >{item?.icon}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    )
}
