/* eslint-disable*/

import React, { useState, useEffect } from 'react';
import { ConfigProvider, Drawer, message, Radio, Table, Tooltip, Image } from 'antd';
import TRNotification from '@Tool/utils/TRNotifaction';
import './index.less';
import locale from 'antd/lib/locale/zh_CN';
import Api from '../../service'
import moment from 'moment'
import { DESCRIBE, BANNER, OPTIONS, initColumns } from './helper'
import { QuestionCircleOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons'
import RsIcon from '@RsIcon'

import { CIRCLE_TYPE, SEND_TYPE } from '../../helper'
// const CIRCLE_TYPE = {
//     1: '企业发表',
//     2: '个人发表'
// }
// const SEND_TYPE = {
//     1: '立即发送',
//     2: '指定时间'
// }
function DetailDrawer({ data, onPress }) {
    const [visible, setVisible] = useState(true);
    const [detailData, setDetailData] = useState({});
    const [radioValue, setRadioValue] = useState('');
    const [columns, setColumns] = useState('');
    const [dataSource, setDataSource] = useState('');
    const [tableInfo, setTableInfo] = useState({});
    const [discussDetail, setDiscussDetail] = useState({})



    useEffect(() => {
        fetchData()
        fetchTableData()
    }, [])

    const fetchData = async () => {
        const res = await Api.getDetailData(data?.data?.id);
        if (res?.retCode === 200) {
            setDetailData(res?.data || {})
        }
    }

    const _onCancel = () => {
        onPress({ index: 0 });
        setVisible(false);
    }

    const fetchTableData = async (val = {}) => {
        const res = await Api.getDetailTableData({
            friendCircleId: data?.data?.id,
            publishStatus: radioValue,
            pageSize: 5,
            ...val
        })
        if (res?.retCode === 200) {
            const result = initColumns(res?.data?.list || [])
            setColumns([...result?.columns, columnsMore()])
            setDataSource(result?.dataSource || [])
            setTableInfo(res?.data)
        }
    }

    const handelRemind = async (allVal) => {
        if (allVal.doRemindFlag == 0) return;
        const res = await Api.getRemind(allVal?.id || '');
        if (res?.retCode === 200) {
            message.success('提醒成功')
        }
    }
    const handelStatus = async (allVal) => {
        const res = await Api.getDiscuss(allVal?.id);
        if (res?.retCode === 200) {
            setDiscussDetail(res?.data || {})
        }
    }
    const columnsMore = () => {
        return {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            render: (val, allVal) => <div className='operateBox'>
                {allVal?.publishStatus ? <a onClick={() => handelStatus(allVal)}> 互动数据 </a> : <a
                    className={`${allVal?.doRemindFlag == 0 ? 'enableSend' : ''}`}
                    onClick={() => handelRemind(allVal)}>提醒</a>}

            </div>
        }
    }

    const renderDescribe = () => {
        return DESCRIBE?.map((item) => {
            return <div className="descibeItem">
                <div>{item?.title || ''}</div>  <div>{renderRight(item)}</div>
            </div>
        })
    }

    const renderRight = (item) => {
        const value = detailData?.[item?.key || '']
        const formatKey = 'YYYY-MM-DD HH:mm'
        if (item.key === 'createTime') {
            return moment(value).format(formatKey)
        } else if (item.key === 'friendCircleType') {
            return CIRCLE_TYPE?.[value] || ''
        } else if (item.key === 'sendType') {
            return <>{SEND_TYPE?.[value] || ''}<span style={{ marginLeft: '5px' }}>{moment(detailData?.sendTime).format(formatKey)}</span></>
        } else if (item.key === 'createMemberName') {
            return <><img src={detailData?.createMemberAvatar || ''} /><span>{value}</span>  </>
        }
        return value
    }

    const renderBanner = () => {
        return BANNER?.map((item) => (
            <div className='bannerItem'>
                <div>{detailData?.[item?.key] || 0}</div>
                <div>{item?.title || ''}</div>
            </div>
        ))
    }
    const handelRadio = (e) => {
        setRadioValue(e.target.value)
        fetchTableData({
            publishStatus: e.target.value
        })
    }

    const renderMaterial = () => {
        return <div className='material'>
            <img src={detailData?.fileList?.[0].materialFileUrl || ''} style={{ width: '60px', height: '60px' }} />
            <div>{detailData?.fileList?.[0]?.materialTitle || '-'}</div>
        </div>
    }

    const renderAll = () => {
        return detailData?.fileList?.map((item) => {
            if (item.fileType == 1) {
                return <Image src={item?.fileUrl || ''} className={`${detailData?.fileList?.length > 1 ? 'maxImg' : 'onlyImg'}`} />
            } else if (item.fileType == 3) {
                return renderMaterial()
            } else {
                return <div className='videoBox'>
                    <div className='mask'></div>
                    <RsIcon type="icon-shipin1" className="icon" />
                    <img src={item?.fileUrl || ''} className={`onlyImg`} /></div>
            }
        })
    }
    const renderDiscuss = () => {
        if (!(Object.keys(discussDetail)?.length)) return null;
        return <>
            <div className="discuss">
                <div><HeartOutlined /> <span>{discussDetail?.likeSize || 0}</span></div>
                <div><CommentOutlined /> <span>{discussDetail?.commentSize || 0}</span></div>
            </div><div className="last">
                {discussDetail?.likeUserList?.length ? <div className="title">点赞客户</div> : null}
                <div className="list">
                    {
                        discussDetail?.likeUserList?.map((item) => (
                            <div className='listItem'>
                                <img src={item?.userAvatar || ''} />
                                <span>{item?.userName || ''}</span>
                                <span className='vx'>@{item?.userType == 1 ? '微信' : '企业微信'}</span>
                                <span style={{ fontSize: '12px' }}>{moment(Number(item.createTime)).format('YYYY-MM-DD HH:mm')}</span>
                            </div>
                        ))
                    }

                    {/* <div className='listItem'>
                        <img src={"https://wework.qpic.cn/wwpic/529109_3aEQvT9QQEezSDo_1653658096/0"} />
                        <span>微信名称</span>
                        <span className='vx'>@微信</span>
                        <span>2022-5-25 10:30</span>
                    </div>
                    <div className='listItem'>
                        <img src={"https://wework.qpic.cn/wwpic/529109_3aEQvT9QQEezSDo_1653658096/0"} />
                        <span>微信名称</span>
                        <span className='vx'>@微信</span>
                        <span>2022-5-25 10:30</span>
                    </div>
                    <div className='listItem'>
                        <img src={"https://wework.qpic.cn/wwpic/529109_3aEQvT9QQEezSDo_1653658096/0"} />
                        <span>微信名称</span>
                        <span className='vx'>@微信</span>
                        <span>2022-5-25 10:30</span>
                    </div> */}
                </div>
            </div>
        </>
    }
    return (
        <ConfigProvider locale={locale}>
            <Drawer
                width={912}
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
                className='detailCircle'
            >
                <div className="detailFriends">
                    <div className="left">
                        <div className="title">发布信息</div>
                        <div className="describe">
                            {renderDescribe()}
                        </div>
                        <div className="subTitle">发布成员情况</div>
                        <div className="banner">
                            <div className="bannerLeft">
                                <div className='bannerAll'>
                                    {renderBanner()}
                                </div>
                            </div>
                            <div className="bannerRight">
                                <div className='bannerItem'>
                                    <div>{detailData?.estimateNumber || ''}</div>
                                    <div>可见客户<Tooltip title='成员确认发表朋友圈后，可在微信朋友圈中看到该条朋友圈的客户列表'><QuestionCircleOutlined /></Tooltip></div>
                                </div>
                            </div>
                        </div>
                        <div className="tabs">
                            <Radio.Group
                                // options={OPTIONS}
                                value={radioValue}
                                buttonStyle="solid"
                                onChange={handelRadio}
                            >
                                {OPTIONS?.map((item) => <Radio.Button value={item.value}>{item?.label || ''}</Radio.Button>)}
                            </Radio.Group>
                        </div>
                        <div className="tableBox">
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
                    <div className="right">
                        <div className="title">朋友圈内容</div>
                        <div className="mainDescribe">
                            {detailData?.textContent || ''}
                        </div>
                        <div className="mainMaterial">
                            {renderAll()}
                        </div>


                        {renderDiscuss()}
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
