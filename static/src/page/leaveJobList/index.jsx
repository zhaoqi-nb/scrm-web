/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react';
import { Table, DatePicker, Input, Button, Drawer, Tabs } from 'antd'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'
const {TabPane} = Tabs


export default function leaveJobList({location}) {
  const [paramobj, setParamObj] = useState({})
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  //日期参数
  const [dateArr, setDateArr] = useState(null)
  //搜索参数
  const [keyword, setKeyword] = useState(null)

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount:1,
    total:0
  })
  //已分配成员
  const [dateCusArr, setDateCusArr] = useState(null)
  const [dataSourceCus, setDataSourceCus] = useState([])
  const [loadingCus, setLoadingCus] = useState(false)
  const [pageInfoCus, setPageInfoCus] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount:1,
    total:0
  })
  //离职成员详情
  const [leaveUserInfo, setLeaveUserInfo] = useState({})
  //已分配群聊
  const [dateChatArr, setDateChatArr] = useState(null)
  const [dataSourceChat, setDataSourceChat] = useState([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [pageInfoChat, setPageInfoChat] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount:1,
    total:0
  })
  //抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  useEffect(() => {
    queryResignedMemberList()
  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  useEffect(() => {
    queryAssignedCustomerList()
  }, [dateCusArr, pageInfoCus.pageNo, pageInfoCus.pageSize])

  useEffect(() => {
    queryAssignedGroupChatList()
  }, [dateChatArr, pageInfoChat.pageNo, pageInfoChat.pageSize])

  // queryResignedMemberList
  const queryResignedMemberList = useCallback(() => {
    let startDate = null,
      endDate = null;
    if (!_.isNil(dateArr)) {
      startDate = moment(dateArr).format("YYYY-MM-DD")
      endDate = moment(dateArr).format("YYYY-MM-DD")
    }

    setLoading(true)
    Api.queryResignedMemberList({
      startDate,
      endDate,
      keyword: keyword,
      pageNo: pageInfoCus?.pageNo,
      pageSize: pageInfoCus?.pageSize,
      handoverFlag:1,//1 查询离职已分配成员列表 
    }).then((res) => {
      if (true) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount:_.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
        setLoading(false)
      }
    })
  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  //请求列表接口
  const queryAssignedCustomerList = useCallback((obj) => {
    let startDate = null,
      endDate = null;
    if (!_.isNil(dateArr)) {
      startDate = moment(dateArr).format("YYYY-MM-DD")
      endDate = moment(dateArr).format("YYYY-MM-DD")
    }

    setLoadingCus(true)
    Api.queryAssignedCustomerList({
      keyword,
      startDate,
      endDate,
      memberId:_.get(leaveUserInfo, "handoverMemberId") || _.get(obj, "handoverMemberId"), //成员id
      pageNo: pageInfoCus?.pageNo,
      pageSize: pageInfoCus?.pageSize,
      transferType: 2,//查询类型 1 在职 2 离职
      transferStatus: 1//分配状态 0待分配 1已分配
    }).then((res) => {
      if (true) {
        const list = _.get(res, 'data.list');
        setDataSourceCus(list)
        setPageInfoCus({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount:_.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
        setLoadingCus(false)
      }
    })
  }, [dateCusArr, pageInfoCus.pageNo, pageInfoCus.pageSize])

  const queryAssignedGroupChatList = useCallback((obj, page) => {
    if (!_.get(leaveUserInfo, "handoverMemberId") && !_.get(obj, "handoverMemberId")) return
    let pageflag = page?page:pageInfoChat
    Api.queryAssignedGroupChatList({
      "pageNo": pageflag.pageNo,
      "pageSize": pageflag.pageSize,
      "keyword": "",//群搜索
      "startDate": !_.isNil(dateChatArr)?moment(dateChatArr).format("YYYY-MM-DD"):null,
      "endDate": !_.isNil(dateChatArr)?moment(dateChatArr).format("YYYY-MM-DD"):null,
      "memberId": _.get(leaveUserInfo, "handoverMemberId") || _.get(obj, "handoverMemberId") //成员id
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSourceChat(list)
        setPageInfoChat({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount:_.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
        setLoadingChat(false)
      }
    })
  },[dateChatArr, pageInfoChat.pageNo, pageInfoChat.pageSize])
  
  const changeInputValue = (e) => {
    setKeyword(e.target.value)
  }

  const handleChangeTable = (page) => {
    if(page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 5,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.defaultCurrent,
    })
  }

  const handleChangeTableCus = (page) => {
    if(page.pageSize != pageInfoCus.pageSize) page.current = 1
    setPageInfoCus({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.totalCount,
    })
  }

  const handleChangeTableChat = (page) => {
    if(page.pageSize != pageInfoChat.pageSize) page.current = 1
    setPageInfoChat({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.totalCount,
    })
  }


  const columns = [
    {
      "title": "微信昵称",
      "dataIndex": "name",
      "algin": "center",
      "render": (text, record) => {
        let textLabel = record.type == 2 ? record.corpName : "微信"
        return <p style={{ display: "flex", alignItems: "center", padding:"0", margin: "0" }}>{text || record.memberName} <span style={{color:record.type == 1?"#FFBA00":"#46C93A", marginLeft:"10px"}}>{`@${textLabel}`}</span></p>
      }
    },{
      "title": "客户备注",
      "dataIndex": "remark",
      "algin": "center"
    },{
      "title": "原添加人",
      "dataIndex": "handoverMemberName",
      "algin": "center"
    },{
      "title": "接替成员",
      "dataIndex": "takeoverMemberName",
      "algin": "center"
    },{
      "title": "接替状态",
      "dataIndex": "takeoverStatus",
      "algin": "center",
      "render": (text) => {
        return text == 1 ? "接替完毕" : text == 2 ? "等待接替" : text == 3 ? "客户拒绝" : text == 4 ? "接替成员客户达到上限" : "" 
      }
    },{
      "title": "划分时间",
      "dataIndex": "transferTimeStr",
      "algin": "center"
    },{
      "title": "操作",
      "dataIndex": "",
      "algin": "center",
      "render": (text, record) => <Button type="link" onClick={() => {
        setLeaveUserInfo(record)
        queryAssignedCustomerList(record)
        queryAssignedGroupChatList(record)
        setDrawerVisible(true)
      }}>详情</Button>
    }
  ]

  const columnsCus = [
    {
      "title": "微信昵称",
      "dataIndex": "wechat",
      "algin": "center",
      "render": (text, record) => {
        let textLabel = record.type == 2 ? record.corpName : "微信"
        return <p style={{ display: "flex", alignItems: "center", padding:"0", margin: "0" }}>{text || record.memberName} <span style={{color:record.type == 1?"#FFBA00":"#46C93A", marginLeft:"10px"}}>{`@${textLabel}`}</span></p>
      }
    },{
      "title": "客户备注",
      "dataIndex": "remarksDescription",
      "algin": "center"
    },{
      "title": "接替成员",
      "dataIndex": "wx_name",
      "algin": "center"
    },{
      "title": "接替成员所属部门",
      "dataIndex": "wx_name",
      "algin": "center"
    },{
      "title": "接替状态",
      "dataIndex": "takeoverStatus",
      "algin": "center",
      "render": (text) => {
        return text == 1 ? "接替完毕" : text == 2 ? "等待接替" : text == 3 ? "客户拒绝" : text == 4 ? "接替成员客户达到上限" : "" 
      }
    },{
      "title": "分配时间",
      "dataIndex": "userCreateTime_YYYY_MM_DD",
      "algin": "center",
      // "render": (text, record) => moment(text).format("YYYY-MM-DD HH:mm:ss")
    }
  ]

  const columnsChat = [
    {
      "title": "群聊",
      "dataIndex": "name",
      "algin": "center",
    },{
      "title": "群人数",
      "dataIndex": "size",
      "algin": "center"
    },{
      "title": "新群主",
      "dataIndex": "wx_name",
      "algin": "center"
    },{
      "title": "接替成员所属部门",
      "dataIndex": "wx_name",
      "algin": "center"
    },{
      "title": "接替状态",
      "dataIndex": "wx_name",
      "algin": "center"
    },{
      "title": "分配时间",
      "dataIndex": "wx_name",
      "algin": "center"
    }
  ]
  return (
    <div className="leaveJobList">
      <p className="leaveJobList-pagetitle">
        已分配离职成员
      </p>
      <div className="leaveJobList-search">
        <DatePicker
          style={{ width: "260px", marginRight:"16px" }} 
          onChange={setDateArr}
        />
        <Input
          value={keyword}
          style={{ width: "260px" }}
          placeholder="请输入要搜索的微信昵称、成员"
          suffix={<RsIcon type="icon-sousuo" />}
          onChange={changeInputValue}
          // onChange={changeInputValue}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={"customerExternalUserid"}
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
      <Drawer
        className="leaveJobInherit-drawer"
        title="详情"
        width={912}
        visible={drawerVisible}
        maskClosable={false}
        closable={false}
        placement="right"
        onClose={() => { setDrawerVisible(false) }}>
        <RsIcon 
          type="icon-guanbi" 
          style={{ cursor: "pointer", position: "absolute", top: 12, right: 20, fontSize: "16px" }} 
          onClick={()=>{setDrawerVisible(false)}}  
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab={`已分配客户(${_.get(leaveUserInfo, "unassignedCustomer")})`} key="1">
            <DatePicker
              style={{ width: "260px", margin:"8px 0" }} 
              onChange={setDateCusArr}
            />
            <Table
              columns={columnsCus}
              dataSource={dataSourceCus}
              loading={loadingCus}
              rowKey="externalUserid"
              onChange={handleChangeTableCus}
              size="small"
              pagination={{
                className: 'pagination',
                showTotal: (total) => `共${total}条记录`,
                showQuickJumper: true,
                showSizeChanger: true,
                current: pageInfoCus?.pageNo,
                pageSize: pageInfoCus?.pageSize,
                defaultCurrent: pageInfoCus.pageCount,
                total: pageInfoCus.total
              }}
            />
          </TabPane>
          <TabPane tab={`已分配群聊(${_.get(leaveUserInfo, "unassignedGroup")})`} key="2">
            <DatePicker
              style={{ width: "260px", margin:"8px 0" }} 
              onChange={setDateChatArr}
            />
            <Table
              columns={columnsChat}
              dataSource={dataSourceChat}
              loading={loadingChat}
              rowKey="id"
              onChange={handleChangeTableChat}
              size="small"
              pagination={{
                className: 'pagination',
                showTotal: (total) => `共${total}条记录`,
                showQuickJumper: true,
                showSizeChanger: true,
                current: pageInfoChat?.pageNo,
                pageSize: pageInfoChat?.pageSize,
                defaultCurrent: pageInfoChat.pageCount,
                total: pageInfoChat.total
              }}
            />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  )
}
