/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import './index.less'
import { Button, Select, DatePicker, Table, Modal, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { TRCheckboxModal } from '@Tool/components'
import { BANNER, FRIEND_SELECT, initStaffData, initColumns } from './helper'
import Api from './service'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Detail } from './components'
import { userTreeFormat } from '@/utils/Util'

export default function CicleOfFriends() {
    const [type, setType] = useState(null);
    const [date, setDate] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const [staffValue, setStaffValue] = useState([]);
    const [staffOption, setStaffOption] = useState([])
    const [switchData, setSwitchData] = useState({})
    const [columns, setColumns] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [tableInfo, setTableInfo] = useState({})

    const { confirm } = Modal

    const history = useHistory()

    useEffect(() => {
        fetchData()
        fetchTableData()
    }, []);

    const fetchData = async () => {
        const [res, res1] = await Promise.all([Api.getStaffData(), Api.getSWitch()])
        if (res?.retCode === 200 && res1?.retCode === 200) {
            const data = initStaffData(res?.data || []);
            const result = userTreeFormat(res?.data)
            setSwitchData(res1?.data || {})
            setStaffData(result)
            setStaffOption(data?.resultData || [])
        }
    }
    const handelCancel = (data) => {
        if (data?.sendStatus != 4) return;
        confirm({
            title: '取消提示',
            content: '确认取消发送定时任务?',
            onOk: async () => {
                const res = await Api.getCancel(data?.id);
                if (res?.retCode === 200) {
                    message.success('取消发送成功')
                    fetchTableData()
                }
            }
        })
    }

    const handelDetail = (allVal) => {
        Detail.show({ data: allVal })
    }
    const columnsMore = () => {
        return {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            render: (val, allVal) => <div className='operateBox' >
                <a onClick={() => handelCancel(allVal)} className={`${allVal?.sendStatus != 4 ? 'enableSend' : ''} ${allVal.sendType == 1 ? "noneView" : ""}`}>取消发送</a>
                <a onClick={() => handelDetail(allVal)}> 详情 </a>
            </div>
        }
    }

    const fetchTableData = async (data) => {
        const res = await Api.getTableData({
            shouldSendMemberId: staffValue,
            fileterStartTime: moment(date?.[0]).format('YYYY-MM-DD'),
            fileterEndTime: moment(date?.[1]).format('YYYY-MM-DD'),
            pageSize: 5,
            ...data
        })
        if (res?.retCode === 200) {
            const result = initColumns(res?.data?.list || [])
            setColumns([...result?.columns, columnsMore()]);
            setDataSource(result?.dataSource);
            setTableInfo(res?.data)
        }
    }

    const renderBanner = () => BANNER?.map((item, index) => (
        <div>{index + 1}.{item?.title || ''}:{item?.main || ''}</div>
    ))

    const handelStaff = (data) => {
        setStaffValue(data)
        fetchTableData({
            shouldSendMemberId: data
        })
    }

    const titleRender = (item) => <div className="itemBox">{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
    const handelSelect = async () => {
        const result = await TRCheckboxModal.show({
            treeData: staffData,
            value: staffValue,
            title: '选择员工',
            titleRender,
            itemRender: titleRender
        })
        if (result.index === 1) {
            fetchTableData({
                shouldSendMemberId: result?.checkedKeys || []
            })
            setStaffValue(result?.checkedKeys || [])
        }
    }
    const handelType = (e) => {
        setType(e)
        fetchTableData({
            friendCircleType: e
        })
    }
    const handelDate = (e) => {
        setDate(e)
        fetchTableData({
            fileterStartTime: moment(e?.[0]).format('YYYY-MM-DD'),
            fileterEndTime: moment(e?.[1]).format('YYYY-MM-DD'),
        })
    }
    const allRenderBanner = () => {
        if (!(switchData?.checkOpenStatus)) return null;
        return (
            <div className="banner">
                <div className="left">
                    <div className="first">
                        <ExclamationCircleFilled /> 温馨提示:
        </div>
                    <div className="second">
                        {renderBanner()}
                    </div>
                </div>
                <div className="right" onClick={handelSwitch}>
                    不再提示
      </div>
            </div>
        )
    }
    const handelSwitch = async () => {
        const res = await Api.changeSwitch(switchData?.switchId || '');
        if (res?.retCode === 200) {
            setSwitchData({ ...switchData, checkOpenStatus: false })
        }
    }
    const handelToAdd = () => {
        history.push('/AddFriendCircle')
    }
    return (
        <div className="friendsContainer">
            <div className="title">
                <div>朋友圈管理</div>
                <div><Button type="primary" onClick={handelToAdd}>发布企业朋友圈</Button></div>
            </div>
            {allRenderBanner()}
            <div className="main">
                <div className="mainSelect">
                    <Select
                        placeholder="朋友圈类型"
                        options={FRIEND_SELECT}
                        value={type}
                        onChange={handelType}
                    />
                    <Select
                        placeholder="发表成员"
                        options={staffOption}
                        open={false}
                        onClick={handelSelect}
                        value={staffValue}
                        mode="tags"
                        maxTagCount={1}
                        showArrow
                        onChange={handelStaff}
                    />
                    <DatePicker.RangePicker
                        value={date}
                        onChange={handelDate}
                    />
                </div>
                <div className="mainTable">
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
                </div>
            </div>
        </div>
    )
}
