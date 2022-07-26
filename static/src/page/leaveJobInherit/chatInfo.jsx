/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Drawer } from 'antd'
import RsIcon from '@RsIcon'
import Api from './store/api'
import _ from 'lodash'
import moment from 'moment'
import './index.less'

const columns = [
    {
        "title": "微信昵称",
        "dataIndex": "customerName",
        "algin": "center",
        "render": (text, record) => {
            let textLabel = record.customerType == 1 ? record.customerCorpName : "微信"
            if (textLabel == null || textLabel == "null") textLabel = ""
            return <p style={{ display: "flex", alignItems: "center", padding: "0", margin: "0" }}>{text || record.memberName}
                {textLabel ? <span style={{ color: record.customerType == 1 ? "#FFBA00" : "#46C93A", marginLeft: "10px" }}>{`@${textLabel}`}</span> : null}
            </p>
        }
    }, {
        "title": "进群方式",
        "dataIndex": "joinScene",
        "algin": "center",
        "render": (text, record) => {
            return text == 1 ? "直接邀请" : text == 2 ? "邀请链接" : text == 3 ? "扫描群二维码" : ""
        }
    }, {
        "title": "入群时间",
        "dataIndex": "joinTime",
        "algin": "center",
        "render": (text) => moment(text).format("YYYY-MM-DD")
    }
]

export default function ChatInfo(props) {
    const [infos, setInfos] = useState({})
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageInfo, setPageInfo] = useState({
        pageNo: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    })

    useEffect(() => {
        queryGroupMemberListByPage()
        getByKey()
    }, [pageInfo.pageNo, pageInfo.pageSize, props.ifShowChat])

    const getByKey = () => {
        if (_.get(props, "chatInfos.id")) {
            Api.getByKey(_.get(props, "chatInfos.id")).then(res => {
                if (res.retCode == 200) {
                    setInfos(res.data)
                }
            })
        }
    }


    //请求列表接口
    const queryGroupMemberListByPage = useCallback(() => {
        if (!_.get(props, "chatInfos.id")) return
        setLoading(true)
        Api.queryGroupMemberListByPage({
            pageNo: pageInfo?.pageNo,
            pageSize: pageInfo?.pageSize,
            groupId: _.get(props, "chatInfos.id")
        }).then((res) => {
            if (res.retCode == 200) {
                const list = _.get(res, 'data.list');
                setPageInfo({
                    pageNo: _.get(res, 'data.pageNo'),
                    pageSize: _.get(res, 'data.pageSize'),
                    pageCount: _.get(res, 'data.pageCount'),
                    total: _.get(res, 'data.total')
                })
                setDataSource(list)
                setLoading(false)
            }
        })
    }, [pageInfo.pageNo, pageInfo.pageSize])

    const handleChangeTable = (page) => {
        if (page.pageSize != pageInfo.pageSize) page.current = 1
        setPageInfo({
            pageCount: 1,
            pageNo: page.current,
            pageSize: page.pageSize,
            total: page.defaultCurrent,
        })
    }


    return (
        <div className="leaveJobInherit-drawer">
            <Drawer title="客户群详情"
                className="chatInfo"
                width={912}
                visible={props.ifShowChat}
                maskClosable={false}
                closable={false}
                placement="right"
                onClose={() => { props.setIfShowChat(false) }}>
                <RsIcon
                    type="icon-guanbi"
                    style={{ cursor: "pointer", position: "absolute", top: 12, right: 20, fontSize: "16px" }}
                    onClick={() => { props.setIfShowChat(false) }}
                />
                <dl className="chatInfo-dl">
                    <dt>
                        <img src={require("./images/chat_img.png")} />
                    </dt>
                    <dd>
                        <p className="chatInfo-dl-fontWeight">燃数大客户群</p>
                        <p style={{ display: "flex", alignItems: "center", margin: "0", padding: "0" }}>
                            群主：<span className="chatInfo-dl-weight">小七</span>
                            <span className="chatInfo-dl-fenge">｜</span>共6位群成员
                        </p>
                    </dd>
                </dl>
                <p>
                    <span className="title-label">创建时间</span> {moment(infos.createTime).format("YYYY-MM-DD")}
                </p>
                <p>
                    <span className="title-label">标签</span>  {
                        _.get(infos, "labelVos") && _.get(infos, "labelVos").map(item => {
                            return <span style={{ display: "inline-block", borderRadius: "2px", border: "1px solid #E1E8F0", margin: "0 5px", padding: "1px 5px", borderRadius: "4px", color: "#262626", background: "#F5F7FA" }}>{item.name}</span>
                        })
                    }

                </p>
                <p>
                    <span className="title-label">群公告</span> {_.get(infos, "notice")}
                </p>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    size="small"
                    onChange={handleChangeTable}
                    pagination={{
                        className: 'pagination',
                        showTotal: (total) => `共${total}条记录`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: pageInfo?.pageNo,
                        pageSize: pageInfo?.pageSize,
                        defaultCurrent: pageInfo.pageCount,
                        total: pageInfo.total
                    }}
                />
            </Drawer>

        </div>
    )
}
