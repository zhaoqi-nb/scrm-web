/* eslint-disable*/
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom'
import { Table, DatePicker, Input, Button, Drawer, Tabs, Modal, message, Tooltip } from 'antd'
import TRCheckboxModal from './components/TRCheckboxModal'
import ChatInfo from './chatInfo'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'
const { TabPane } = Tabs;

export default function OnJobList({ location }) {
  const [paramobj, setParamObj] = useState({})
  const [inheritType, setInheritType] = useState(null)
  const [treeData, setTreeData] = useState([]) //成员树
  const [heir, setHeir] = useState({}) //继承人信息
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  //日期参数
  const [dateArr, setDateArr] = useState(null)
  //搜索参数
  const [keyword, setKeyword] = useState(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //转移的客户

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  //抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  //离职成员详情
  const [leaveUserInfo, setLeaveUserInfo] = useState({})
  //待分配客户日期
  const [dateCusArr, setDateCusArr] = useState(null)
  const [dataSourceCus, setDataSourceCus] = useState([])
  const [loadingCus, setLoadingCus] = useState(false)
  const [pageInfoCus, setPageInfoCus] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  const [selectedRowKeysCus, setSelectedRowKeysCus] = useState([]) //转移的客户
  //待分配群聊日期
  const [dateChatArr, setDateChatArr] = useState(null)
  const [dataSourceChat, setDataSourceChat] = useState([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [pageInfoChat, setPageInfoChat] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  const [selectedRowKeysChat, setSelectedRowKeysChat] = useState([]) //转移的客户

  const [modalVisibleFirst, setModalVisibleFirst] = useState(false)

  const [selectedObjFirst, setSelectedObjFirst] = useState([])
  const [selectedObjSecond, setSelectedObjSecond] = useState([])
  const [selectedObjThird, setSelectedObjThird] = useState([])

  const [loadingBtn, setLoadingBtn] = useState(false)

  const [chatInfos, setChatInfos] = useState(null)
  const [ifShowChat, setIfShowChat] = useState(false)

  useEffect(() => {
    Api.getOwner().then((res) => {
      if (res.retCode == 200) {
        let resultData = []
        let list = _.get(res, 'data').map((item) => {
          let children = item?.memberInfoList?.map((val) => ({
            ...val,
            key: val?.id || '',
            title: val?.name || '',
            value: val?.id,
            label: val?.name || ''
          }))
          resultData = [...resultData, ...children]
          return {
            ...item,
            key: item?.id || '',
            title: item?.departName || '',
            value: item?.id,
            children
          }
        });
        list = loopTree(list)
        setTreeData(list)
      }
    })
  }, [])

  useEffect(() => {
    queryResignedMemberList()
  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  useEffect(() => {
    queryAssignedCustomerList()
  }, [dateCusArr, pageInfoCus.pageNo, pageInfoCus.pageSize])

  useEffect(() => {
    queryGroupListByPage()
  }, [dateChatArr, pageInfoChat.pageNo, pageInfoChat.pageSize])

  const history = useHistory()
  //请求列表接口
  const queryResignedMemberList = useCallback((page) => {
    let pageflag = page ? page : pageInfo
    let startDate = null,
      endDate = null;
    if (!_.isNil(dateArr)) {
      startDate = moment(dateArr).format("YYYY-MM-DD")
      endDate = moment(dateArr).format("YYYY-MM-DD")
    }

    setLoading(true)
    Api.queryResignedMemberList({
      keyword,
      startDate,
      endDate,
      pageNo: pageflag?.pageNo,
      pageSize: pageflag?.pageSize
    }).then((res) => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setLoading(false)
        setSelectedRowKeys([])
        setSelectedObjFirst([])
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
      }
    })
  }, [keyword, dateArr, pageInfo.pageNo, pageInfo.pageSize])

  const loopTree = (list) => {
    list = list.map(item => {
      if (item.children) {
        item.disabled = true
        item.children = loopTree(item.children)
      }
      return item
    })
    return list
  }


  //待分配客户list
  const queryAssignedCustomerList = useCallback((obj, page) => {
    if (!_.get(leaveUserInfo, "handoverMemberId") && !_.get(obj, "handoverMemberId")) return
    let pageflag = page ? page : pageInfoCus
    setLoadingCus(true)
    Api.queryAssignedCustomerList({
      "pageNo": pageflag.pageNo,
      "pageSize": pageflag.pageSize,
      "keyword": null,//可选参数， 可以查询的客户备注名称 不是客户名称 
      "memberId": _.get(leaveUserInfo, "handoverMemberId") || _.get(obj, "handoverMemberId"), //可选的参数，查询谁下面的客户
      // "memberId": _.get(leaveUserInfo, "handoverMemberId"), //可选的参数，查询谁下面的客户
      "startDate": !_.isNil(dateCusArr) ? moment(dateCusArr).format("YYYY-MM-DD") : null,
      "endDate": !_.isNil(dateCusArr) ? moment(dateCusArr).format("YYYY-MM-DD") : null,
      "transferStatus": 0,
      "transferType": 2
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSourceCus(list)
        setPageInfoCus({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
      }
    }).finally(() => {
      setLoadingCus(false)
    })
  }, [dateCusArr, pageInfoCus.pageNo, pageInfoCus.pageSize])

  //待分配群聊
  const queryGroupListByPage = useCallback((obj, page) => {
    if (!_.get(leaveUserInfo, "handoverMemberId") && !_.get(obj, "handoverMemberId")) return
    let pageflag = page ? page : pageInfoChat
    Api.queryGroupListByPage({
      "pageNo": pageflag.pageNo,
      "pageSize": pageflag.pageSize,
      "ownerMemberIds": [_.get(leaveUserInfo, "handoverMemberId") || _.get(obj, "handoverMemberId")], //可选的参数，查询谁下面的客户
      "startDate": !_.isNil(dateChatArr) ? moment(dateChatArr).format("YYYY-MM-DD") : null,
      "endDate": !_.isNil(dateChatArr) ? moment(dateChatArr).format("YYYY-MM-DD") : null,
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSourceChat(list)
        setPageInfoChat({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
        setLoadingChat(false)
      }
    })
  }, [dateChatArr, pageInfoChat.pageNo, pageInfoChat.pageSize])


  const changeInputValue = (e) => {
    setKeyword(e.target.value)
  }

  //多选客户
  const onSelectChange = (obj, flag, list) => {
    // const [selectedObjFirst, setSelectedObjFirst] = useState([])
    let objArr = []
    let arr = list.filter(item => item).map(item => item.handoverMemberId)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeys])
      objArr = _.uniqBy([...objArr, ...selectedObjFirst], 'handoverMemberId')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeys)
      arr = _.filter(selectedRowKeysFlag, item => item != obj.handoverMemberId)
      let selectedObjFirstFlag = _.cloneDeep(selectedObjFirst)
      objArr = _.filter(selectedObjFirstFlag, item => item != obj)
    }
    // if (arr.length > 100) {
    //   message.error("最多一次转移100个客户")
    //   return
    // }
    setSelectedRowKeys(arr)
    setSelectedObjFirst(objArr)
  }
  //全选客户
  const onSelectChangeAll = (flag, obj, list) => {
    //所有选中客户 selectedRowKeys
    let objArr = []
    let arr = list.filter(item => item).map(item => item.handoverMemberId)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeys])
      objArr = _.uniqBy([...objArr, ...selectedObjFirst], 'handoverMemberId')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeys)
      arr = _.filter(selectedRowKeysFlag, item => _.indexOf(arr, item) == -1)

      let selectedObjFirstFlag = _.cloneDeep(selectedObjFirst)
      objArr = _.filter(selectedObjFirstFlag, item => _.includes(objArr, item) == false)
    }
    // if (arr.length > 100) {
    //   message.error("最多一次转移100个客户")
    //   return
    // }
    setSelectedRowKeys(arr)
    setSelectedObjFirst(objArr)
  }

  //多选客户
  const onSelectChangeCus = (obj, flag, list) => {
    // const [selectedObjSecond, setSelectedObjSecond] = useState([])
    let objArr = []
    let arr = list.filter(item => item).map(item => item.externalUserid)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeysCus])
      objArr = _.uniqBy([...objArr, ...selectedObjSecond], 'externalUserid')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeysCus)
      arr = _.filter(selectedRowKeysFlag, item => item != obj.externalUserid)
      let selectedObjSecondFlag = _.cloneDeep(selectedObjSecond)
      objArr = _.filter(selectedObjSecondFlag, item => item != obj)
    }
    if (arr.length > 100) {
      message.error("最多一次转移100个客户")
      return
    }
    setSelectedRowKeysCus(arr)
    setSelectedObjSecond(objArr)
  }
  //全选客户
  const onSelectChangeAllCus = (flag, obj, list) => {
    //所有选中客户 selectedRowKeys
    let objArr = []
    let arr = list.filter(item => item).map(item => item.externalUserid)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeysCus])
      objArr = _.uniqBy([...objArr, ...selectedObjSecond], 'externalUserid')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeysCus)
      arr = _.filter(selectedRowKeysFlag, item => _.indexOf(arr, item) == -1)

      let selectedObjSecondFlag = _.cloneDeep(selectedObjSecond)
      objArr = _.filter(selectedObjSecondFlag, item => _.includes(objArr, item) == false)
    }
    if (arr.length > 100) {
      message.error("最多一次转移100个客户")
      return
    }
    setSelectedRowKeysCus(arr)
    setSelectedObjSecond(objArr)
  }

  //多选客户
  const onSelectChangeChat = (obj, flag, list) => {
    let objArr = []
    let arr = list.filter(item => item).map(item => item.chatId)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeysChat])
      objArr = _.uniqBy([...objArr, ...selectedObjThird], 'chatId')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeysChat)
      arr = _.filter(selectedRowKeysFlag, item => item != obj.chatId)
      let selectedObjThirdFlag = _.cloneDeep(selectedObjThird)
      objArr = _.filter(selectedObjThirdFlag, item => item != obj)
    }
    if (arr.length > 300) {
      message.error("最多一次转移300个群聊")
      return
    }
    setSelectedRowKeysChat(arr)
    setSelectedObjThird(objArr)
  }
  //全选客户
  const onSelectChangeAllChat = (flag, obj, list) => {

    let objArr = []
    let arr = list.filter(item => item).map(item => item.chatId)
    objArr = list.filter(item => item)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeysChat])
      objArr = _.uniqBy([...objArr, ...selectedObjThird], 'chatId')
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeysChat)
      arr = _.filter(selectedRowKeysFlag, item => _.indexOf(arr, item) == -1)

      let selectedObjThirdFlag = _.cloneDeep(selectedObjThird)
      objArr = _.filter(selectedObjThirdFlag, item => _.includes(objArr, item) == false)
    }
    if (arr.length > 300) {
      message.error("最多一次转移300个群聊")
      return
    }
    setSelectedRowKeysChat(arr)
    setSelectedObjThird(objArr)
  }

  //多选
  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange,
    onSelectAll: onSelectChangeAll,
  }

  const rowSelectionCus = {
    selectedRowKeys: selectedRowKeysCus,
    onSelect: onSelectChangeCus,
    onSelectAll: onSelectChangeAllCus,
  }

  const rowSelectionChat = {
    selectedRowKeys: selectedRowKeysChat,
    onSelect: onSelectChangeChat,
    onSelectAll: onSelectChangeAllChat,
  }

  const goLeaveJobList = () => {
    history.push({
      pathname: "/leaveJobList"
    })
  }

  const handleChangeTable = (page) => {
    if (page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.totalCount,
    })
  }
  const handleChangeTableCus = (page) => {
    if (page.pageSize != pageInfoCus.pageSize) page.current = 1
    setPageInfoCus({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.totalCount,
    })
  }
  const handleChangeTableChat = (page) => {
    if (page.pageSize != pageInfoChat.pageSize) page.current = 1
    setPageInfoChat({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.totalCount,
    })
  }

  const columns = [
    {
      "title": "离职成员",
      "dataIndex": "handoverMemberName",
      "algin": "center",
      "render": (text, record) => {
        return text
      }
    }, {
      "title": "所属部门",
      "dataIndex": "handoverDepartmentName",
      "algin": "center"
    }, {
      "title": "待分配客户",
      "dataIndex": "unassignedCustomer",
      "algin": "center"
    }, {
      "title": "待分配群聊",
      "dataIndex": "unassignedGroup",
      "algin": "center"
    }, {
      "title": "离职时间",
      "dataIndex": "dimissionTimeStr",
      "algin": "center"
    }, {
      "title": "操作",
      "dataIndex": "wx_name",
      "algin": "center",
      "render": (text, record) => {
        return <Button type="link" onClick={() => {
          setHeir({})
          setLeaveUserInfo(record)
          queryAssignedCustomerList(record)
          queryGroupListByPage(record)
          setDrawerVisible(true)
        }}>详情</Button>
      }
    }
  ]

  const columnsCus = [
    {
      "title": "微信昵称",
      "dataIndex": "name",
      "algin": "center",
      "render": (text, record) => {
        let textLabel = record.type == 2 ? record.corpName : "微信"
        return <p style={{ display: "flex", alignItems: "center", padding: "0", margin: "0" }}>{text || record.memberName} <span style={{ color: record.type == 2 ? "#FFBA00" : "#46C93A", marginLeft: "10px" }}>{`@${textLabel}`}</span></p>
      }
    }, {
      "title": "客户备注",
      "dataIndex": "remark",
      "algin": "center"
    }, {
      "title": "标签",
      "dataIndex": "userTagNames",
      "algin": "center",
      "width": 280,
      "render": (text, record) => {
        if (text && typeof (text) != "String") {
          return <Tooltip placement="topLeft" title={text.join(",")} arrowPointAtCenter>
            <p style={{ display: 'inline-block', width: '270px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0', textAlign: 'left', margin: 0 }}>
              {text.map(item => <span style={{ background: "#F5F7FA", border: "1px solid #E1E8F0", borderRadius: "4px", padding: "1px 5px", margin: "0 3px" }}>{item}</span>)}
            </p>
          </Tooltip>
        }
        return null
      }
    }, {
      "title": "添加时间",
      "dataIndex": "transferTime",
      "algin": "center",
      "render": (text, record) => moment(text * 1000).format("YYYY-MM-DD HH:mm:ss")
    }
  ]

  const columnsChat = [
    {
      "title": "群聊",
      "dataIndex": "name",
      "algin": "center",
      render: (text) => {
        return text ? text : '未命名群聊'
      }
    }, {
      "title": "群人数",
      "dataIndex": "size",
      "algin": "center"
    }, {
      "title": "创建时间",
      "dataIndex": "createTime",
      "algin": "center",
      "render": (text, record) => moment(text).format("YYYY-MM-DD HH:mm:ss")
    }, {
      "title": "操作",
      "dataIndex": "",
      "algin": "center",
      "render": (text, record) => <Button type="link" onClick={() => showChatInfo(record)}>详情</Button>
    }
  ]
  //批量分配人
  const distributionFirst = () => {
    //累加客户，群selectedRowKeys
    let unassignedCustomerSum = _.map(selectedObjFirst, item => item.unassignedCustomer).reduce((a, b) => a + b),
      unassignedGroupSum = _.map(selectedObjFirst, item => item.unassignedGroup).reduce((a, b) => a + b);

    if (unassignedCustomerSum > 100) {
      message.error("最多一次转移100个客户")
      return
    }
    if (unassignedGroupSum > 300) {
      message.error("同一个离辞职成员的群，每天最多分配300个新群主")
      return
    }
    showTree("heir")
    setInheritType("first")
  }
  //批量分配成员
  const distributionSecond = () => {
    if (selectedRowKeysCus.length > 100) {
      message.error("最多一次转移100个客户")
      return
    }
    showTree("heir")
    setInheritType("second")
  }
  //批量分配群聊
  const distributionThird = () => {
    if (selectedRowKeysChat.length > 300) {
      message.error("最多一次转移300个群聊")
      return
    }
    showTree("heir")
    setInheritType("third")
  }


  //选择成员
  const showTree = async (type, typeFlag) => {
    let treeDataNew = _.cloneDeep(treeData)
    if (type == "heir") {
      // 继承人
      const resultHeir = await TRCheckboxModal.show({ treeData: treeDataNew, value: heir.checkedKeys || [], title: '选择继承成员', titleRender: itemRender, itemRender, ifRadio: true });
      setHeir(resultHeir)
      if (_.get(resultHeir, "index") == 0) return
      setModalVisibleFirst(true)
    } else if (type == "customers") {

    }
  }

  //转移1。
  const onOkTransferFirst = () => {
    if (!inheritType) return
    setLoadingBtn(true)
    if (inheritType == "first") {
      //成员继承
      Api.resignedTransferCustomerByMember({
        resignedMemberList: selectedRowKeys,
        takeOverMemberId: _.get(heir, "checkedNodes[0].id")
      }).then(res => {
        if (res.retCode == 200) {
          message.success("离职成员继承完成")
          setSelectedRowKeys([])
          queryResignedMemberList({
            pageNo: 1,
            pageSize: 10,
            pageCount: 1,
            total: 0
          })
        }
      })
    } else if (inheritType == "second") {
      //客户继承
      Api.resignedTransferCustomer({
        handOverUserid: _.get(leaveUserInfo, "handoverUserId"), //原跟进成员的userid

        takeOverUserid: _.get(heir, "checkedNodes[0].userId"),
        externalUserid: selectedRowKeysCus
      }).then(res => {
        if (res.retCode == 200) {
          message.success("分配客户完成")
          setSelectedRowKeysCus([])
          queryAssignedCustomerList(null, {
            pageNo: 1,
            pageSize: 10,
            pageCount: 1,
            total: 0
          })
        }
      })

    } else if (inheritType == "third") {
      //群聊继承  
      Api.resignedTransferGroupChat({
        newOwner: _.get(heir, "checkedNodes[0].userId"),
        chatIds: selectedRowKeysChat
      }).then(res => {
        if (res.retCode == 200) {
          message.success("分配客户完成")
          setSelectedRowKeysChat([])
          setPageInfoChat({
            pageNo: 1,
            pageSize: 10,
            pageCount: 1,
            total: 0
          })
        }
      })

    }
    setInheritType(null)
    setLoadingBtn(false)
    setModalVisibleFirst(false)
  }

  const itemRender = (item) => {
    return <div className='itemBox'>{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
  }

  const showChatInfo = (item) => {
    //打开群聊详情
    setChatInfos(item)
    setIfShowChat(true)
  }

  // (e)=>setKeyword(e.target.value)
  return (
    <div className="leaveJobList">
      <p className="leaveJobList-pagetitle">
        <span>离职继承</span>
        <Button onClick={goLeaveJobList}>已分配离职成员</Button>
      </p>
      {
        selectedRowKeys.length ? <div className="leaveJobList-selectBtn">
          <p>已选中<span style={{ color: "#000000" }}>{selectedRowKeys.length}</span>/{pageInfo.total}位成员</p>
          <Button onClick={distributionFirst}>批量分配</Button>
        </div>
          :
          <div className="leaveJobList-search">
            <DatePicker
              style={{ width: "260px", marginRight: "16px" }}
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

      }

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        onChange={handleChangeTable}
        size="small"
        rowKey="handoverMemberId"
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
      <Modal title="提示" visible={modalVisibleFirst} onCancel={() => setModalVisibleFirst(false)} footer={[
        <Button className="cancel-btn" onClick={() => setModalVisibleFirst(false)}>取消</Button>,
        <Button className="true-btn" loading={loadingBtn} onClick={onOkTransferFirst}>确定</Button>
      ]}>
        确认将选中的离职成员全部客户和客户群分配给@{_.get(heir, "checkedNodes[0].name")}?
      </Modal>
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
          onClick={() => { setDrawerVisible(false) }}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab={`待分配客户(${_.get(leaveUserInfo, "unassignedCustomer")})`} key="1">
            {
              selectedRowKeysCus.length
                ? <div className="leaveJobList-selectBtn" style={{ marginTop: "16px" }}>
                  <p>已选中<span style={{ color: "#000000" }}>{selectedRowKeysCus.length}</span>/{pageInfoCus.total}位成员</p>
                  <Button onClick={distributionSecond}>批量分配</Button>
                </div>
                : <DatePicker
                  style={{ width: "260px", margin: "16px 0" }}
                  onChange={setDateCusArr}
                  placeholder="请选择分配时间"
                />
            }

            <Table
              columns={columnsCus}
              dataSource={dataSourceCus}
              loading={loadingCus}
              rowSelection={rowSelectionCus}
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
          <TabPane tab={`待分配群聊(${_.get(leaveUserInfo, "unassignedGroup")})`} key="2">
            {
              selectedRowKeysChat.length
                ? <div className="leaveJobList-selectBtn" style={{ marginTop: "16px" }}>
                  <p>已选中<span style={{ color: "#000000" }}>{selectedRowKeysChat.length}</span>/{pageInfoChat.total}位成员</p>
                  <Button onClick={distributionThird}>批量分配</Button>
                </div>
                : <DatePicker
                  style={{ width: "260px", margin: "16px 0" }}
                  onChange={setDateChatArr}
                  placeholder="请选择分配时间"
                />
            }

            <Table
              columns={columnsChat}
              dataSource={dataSourceChat}
              loading={loadingChat}
              rowSelection={rowSelectionChat}
              rowKey="chatId"
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
      {ifShowChat && <ChatInfo chatInfos={chatInfos} ifShowChat={ifShowChat} setIfShowChat={setIfShowChat} />}
    </div>
  )
}
