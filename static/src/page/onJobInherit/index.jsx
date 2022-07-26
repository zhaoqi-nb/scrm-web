/* eslint-disable*/
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux';
import { Button, Modal, Input, Table, message, Select, Tooltip, Dropdown } from 'antd'
import RsIcon from '@RsIcon'
import TRCheckboxModal from './components/TRCheckboxModal'
import _ from 'lodash'
import Api from './store/api'
import './index.less'

const { Option } = Select
const columns = [
  {
    "title": "微信昵称",
    "dataIndex": "customerName",
    "algin": "center",
    "render": (text, record) => {
      let textLabel = record.customerType == 2 ? record.customerCorpName : "微信"
      if (textLabel == null || textLabel == "null") textLabel = ""
      return <p style={{ display: "flex", alignItems: "left", padding: "0", margin: "0" }}>{text || record.memberName}
        {textLabel ? <Tooltip placement="leftTop" title={`@${textLabel}`} ><span style={{ color: record.customerType == 1 ? "#46C93A" : "#FFBA00", marginLeft: "10px" }} className={'spanBox'}>{`@${textLabel}`}</span> </Tooltip> : null}
      </p>
    }
  }, {
    "title": "客户备注",
    "dataIndex": "followRemark",
    "algin": "center",
    "width": 200,
    "render": (text) => {
      return <Tooltip placement="topLeft" title={text} >
        <p style={{ display: 'inline-block', width: '190px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0', textAlign: 'left', margin: 0 }}>{text}</p>
      </Tooltip>
    }
  }, {
    "title": "标签",
    "dataIndex": "userTagNames",
    "algin": "center",
    "width": 280,
    "render": (text) => {
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
    "dataIndex": "userCreateTime_YYYY_MM_DD",
    "algin": "center",
    // "render": (text, record) => moment(text).format("YYYY-MM-DD HH:mm:ss")
  }
]

function OnJobInherit({ brand_id, shop_id, setValues }) {

  const [transferType, setTransferType] = useState(null)
  const [treeData, setTreeData] = useState([])
  const [transferVisible, setTransferVisible] = useState(false)
  const [heir, setHeir] = useState({}) //继承人
  const [customers, setCustomers] = useState({}) //离职成员
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //转移的客户
  //搜索参数
  const [keyword, setKeyword] = useState(null)

  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)

  const [transferVisible_, setTransferVisible_] = useState(false)
  const [messageVisible, setMessageVisible] = useState(false)
  //是否显示搜索下拉框
  const [dropDownVisible, setDropDownVisible] = useState(false)

  const [messageValue, setMessageValue] = useState(null)
  //指定客户搜索
  const [keyword_, setKeyword_] = useState("")
  const [dataSource_, setDataSource_] = useState([])
  const [ulData, setUlData] = useState([])

  //禁止重复选择
  const [prohibitPerson, setProhibitPerson] = useState(null)


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
    queryExternalUserList()
  }, [pageInfo.pageNo, pageInfo.pageSize])

  useEffect(() => {
    queryExternalUserList_()
  }, [keyword_])

  const history = useHistory()

  const setPageInit = () => {
    history.push({
      pathname: "/onJobInherit"
    })
  }

  const loopTree = (list, keyFlag) => {
    list = list.map(item => {
      if (keyFlag && keyFlag == item.id) {
        item.disabled = true
      }
      if (item.children) {
        item.disabled = true
        item.children = loopTree(item.children, keyFlag)
      }
      return item
    })
    return list
  }

  const goOnJobList = () => {
    history.push({
      pathname: "/onJobList"
    })
  }

  //转移客户表格
  const queryExternalUserList = useCallback((resultCustomers, page) => {
    resultCustomers = resultCustomers || customers
    if (!_.get(resultCustomers, "checkedKeys[0]")) return
    setLoading(true)
    Api.queryExternalUserList({
      pageNo: _.get(page, "pageNo") || pageInfo.pageNo,
      pageSize: _.get(page, "pageSize") || pageInfo.pageSize,
      keyword,//可选参数， 可以查询的客户备注名称 不是客户名称 
      memberId: _.get(resultCustomers, "checkedKeys[0]")//可选的参数，查询谁下面的客户
    }).then((res) => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.totalCount')
        })
        // setTableInfo(res?.data || {})
        setLoading(false)
      }
    })
  }, [pageInfo.pageNo, pageInfo.pageSize])

  //指定客户
  const queryExternalUserList_ = useCallback(() => {
    // if(!keyword_) return
    Api.queryExternalUserList({
      pageNo: 1,
      pageSize: 20,
      keyword: keyword_,//可选参数， 可以查询的客户备注名称 不是客户名称 
      memberId: null//可选的参数，查询谁下面的客户
      // _.get(resultCustomers, "checkedKeys[0]")
    }).then((res) => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setUlData(list)
      }
    })
  }, [keyword_])

  //选择成员
  const showTree = async (type) => {
    let treeDataNew = _.cloneDeep(treeData)
    if (prohibitPerson) treeDataNew = loopTree(treeDataNew, prohibitPerson)
    if (type == "heir") {
      // 继承人
      const resultHeir = await TRCheckboxModal.show({ prohibitPerson: prohibitPerson, treeData: treeDataNew, value: heir.checkedKeys || [], title: '选择继承成员', titleRender: itemRender, itemRender, ifRadio: true });
      if (_.get(resultHeir, "index") == 0) {
        setHeir({})
        if (!_.get(customers, "checkedNodes[0].name")) setProhibitPerson(null)
        return
      }
      setHeir(resultHeir)
      setProhibitPerson(_.get(resultHeir, "checkedKeys[0]"))
    } else if (type == "customers") {
      const resultCustomers = await TRCheckboxModal.show({ prohibitPerson: prohibitPerson, treeData: treeDataNew, value: customers.checkedKeys || [], title: '选择成员', titleRender: itemRender, itemRender, ifRadio: true });
      if (_.get(resultCustomers, "index") == 0) {
        setCustomers({})
        if (!_.get(heir, "checkedNodes[0].name")) setProhibitPerson(null)
        return
      }
      setCustomers(resultCustomers)
      setProhibitPerson(_.get(resultCustomers, "checkedKeys[0]"))
      queryExternalUserList(resultCustomers)
      setTransferVisible(true)
    }

  }

  const itemRender = (item) => {
    return <div className='itemBox'>{item?.avatar && <img src={item?.avatar || ''} />}<span>{item?.title || ''}</span></div>
  }

  //确认转移客户
  const onOkTransfer = () => {
    setTransferVisible(false)
    if (!_.get(heir, "checkedNodes[0].name")) {
      showTree("heir")
    }
  }
  //客户转移
  const onOkTransfer_ = () => {
    setTransferVisible_(false)
    // if (!_.get(heir, "checkedNodes[0].name")) {
    //   showTree("heir")
    // }
  }
  //重选成员
  const alginLast = () => {
    setTransferVisible(false)
    showTree("customers")
  }
  //多选客户
  const onSelectChange = (obj, flag, arr) => {
    arr = arr.filter(item => item).map(item => item.customerExternalUserid)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeys])
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeys)
      arr = _.filter(selectedRowKeysFlag, item => item != obj.customerExternalUserid)
    }
    if (arr.length > 100) {
      message.error("每次最多分配100个客户！")
      return
    }

    setSelectedRowKeys(arr)
  }
  //全选客户
  const onSelectChangeAll = (flag, obj, arr) => {
    //所有选中客户 selectedRowKeys
    arr = arr.filter(item => item).map(item => item.customerExternalUserid)
    if (flag) {
      //添加
      arr = _.uniq([...arr, ...selectedRowKeys])
    } else {
      //减少
      let selectedRowKeysFlag = _.cloneDeep(selectedRowKeys)
      arr = _.filter(selectedRowKeysFlag, item => _.indexOf(arr, item) == -1)
    }
    if (arr.length > 100) {
      message.error("每次最多分配100个客户！")
      return
    }
    setSelectedRowKeys(arr)
  }

  //调用转移接口
  const trueTransfer = () => {
    setMessageValue(`您好，您的服务已升级，后续将由我的同事 ${_.get(heir, "checkedNodes[0].name")} @北京燃数科技有限公司 接替我的工作，继续为您服务。`)
    setMessageVisible(true)
  }
  const handleOk = () => {
    transferCustomer()
  }
  //转移接口
  const transferCustomer = () => {
    setTransferLoading(true)
    if (transferType == 1) {
      Api.transferCustomer({
        handOverUserid: _.get(customers, "checkedNodes[0].userId"), //原跟进成员的userid
        takeOverUserid: _.get(heir, "checkedNodes[0].userId"),//接替成员的userid
        externalUserid: [...selectedRowKeys],// 客户的external_userid列表，每次最多分配100个客户
        transferMsg: messageValue//转移成功后发给客户的消息，最多200个字符，不填则使用默认文案
      }).then((res) => {
        if (res.retCode == 200) {
          history.push({
            pathname: "/onJobInherit"
          })
        }
      })
    } else if (transferType == 2) {
      //指定客户转移
      let list = _.cloneDeep(dataSource_)
      let externalUserid = _.uniq(_.map(list, item => item.memberName)).map(externalUserid, item => {
        let arr = []
        _.forEach(list, itemChild => (itemChild.name == item) && arr.push(itemx.customerExternalUserid))
        return {
          handOverUserid: item,
          externalUserid: arr
        }
      })
      Api.batchTransferCustomer({
        takeOverUserid: _.get(heir, "checkedNodes[0].userId"),//接替成员的userid
        transferMultiCustomerList: externalUserid,
        transferMsg: messageValue
      }).then(res => {
        if (res.retCode == 200) {
          history.push({
            pathname: "/onJobInherit"
          })
        }
      })


    }


  }

  const handleChangeTable = (page) => {
    if (page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.defaultCurrent,
    })
  }

  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange,
    onSelectAll: onSelectChangeAll,
  }

  const onVisibleChange = useCallback((visible) => {
    setDropDownVisible(visible);
  }, [])

  const addDataSource_ = (operUserIdFlag, obj) => {
    let list = _.cloneDeep(dataSource_)
    let flag = _.filter(list, (item) => item.customerId == operUserIdFlag).length
    if (flag) {
      //已经存在 取消
      list = _.filter(list, (item) => item.customerId != operUserIdFlag)
    } else {
      //不存在 添加
      list = _.uniqBy([...list, obj])
    }
    if (list.length > 100) {
      message.error("每次最多分配100个客户！")
      return
    }
    setDataSource_(list)
  }

  const overlay = (
    <ul className={`onJobInherit-modalSelect`}>

      {
        ulData.length ? ulData.map(item => {
          let flag = _.filter(dataSource_, (item_) => item_.customerId == item.customerId).length
          return <li style={{ color: flag ? "#0678FF" : "", background: flag ? "#F0F7FF" : "" }}
            onClick={() => addDataSource_(item.customerId, item)}>
            <p>{item.customerName}<span>{item.customerType == 1 ? "@微信" : '@' + item.customerCorpName}</span></p>
            <span>{item.memberName}添加</span>
          </li>
        }) : <p style={{ padding: "10px 20px" }}>暂无数据</p>
      }
    </ul>
  )

  const columns_ = [
    {
      "title": "微信昵称",
      "dataIndex": "customerName",
      "algin": "center",
      "render": (text, record) => {
        let textLabel = record.customerType == 2 ? record.customerCorpName : "微信"
        if (textLabel == null || textLabel == "null") textLabel = ""
        return <p style={{ display: "flex", alignItems: "left", padding: "0", margin: "0" }}>{text || record.memberName}
          {textLabel ? <Tooltip placement="leftTop" title={`@${textLabel}`} ><span style={{ color: record.customerType == 1 ? "#46C93A" : "#FFBA00", marginLeft: "10px" }} className={'spanBox'}>{`@${textLabel}`}</span> </Tooltip> : null}
        </p>
      },
      "width": 180,
      "fixed": "left"
    }, {
      "title": "客户备注",
      "dataIndex": "followRemark",
      "algin": "center",
      "width": 220,
      "render": (text) => {
        return <Tooltip placement="topLeft" title={text} arrowPointAtCenter>
          <p style={{ display: 'inline-block', width: '210px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0', textAlign: 'left', margin: 0 }}>{text}</p>
        </Tooltip>
      }
    }, {
      "title": "标签",
      "dataIndex": "userTagNames",
      "algin": "center",
      "width": 280,
      "render": (text) => {
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
      "title": "添加人",
      "dataIndex": "memberName",
      "algin": "center",
      "width": 120
      // "render": (text, record) => moment(text).format("YYYY-MM-DD HH:mm:ss")
    }, {
      "title": "添加时间",
      "dataIndex": "userCreateTime_YYYY_MM_DD",
      "algin": "center",
      "width": 180
      // "render": (text, record) => moment(text).format("YYYY-MM-DD HH:mm:ss")
    }, {
      "title": "操作",
      "dataIndex": "",
      "algin": "left",
      "width": 80,
      "render": (text, record) => <Button type="link" onClick={() => addDataSource_(record.customerId, record)}>取消</Button>
    }
  ]

  //是否可以转移
  const ifTranfer = () => {
    let flag = true
    if (transferType == 1) {
      flag = !(_.get(heir, "checkedNodes[0].name") && _.get(customers, "checkedNodes[0].name") && _.size(selectedRowKeys))
    } else if (transferType == 2) {
      flag = !(_.size(dataSource_ && _.get(heir, "checkedNodes[0].name")))
    }
    return flag
  }
  return (
    <div className="onJobInherit">
      <div className="onJobInherit-content">
        <p className="onJobInherit-pagetitle">
          <span>在职继承</span>
          <Button onClick={goOnJobList}>已分配客户</Button>
        </p>
        <p className="onJobInherit-explain">
          <RsIcon type="icon-tishixinxitubiao" style={{ fontSize: "16px", color: "#0678FF", padding: "0 6px" }} />
          当成员或客户有变更时，企业可以将在职成员的客户分配给其他成员继续提供服务
        </p>

        <p className="onJobInherit-title">需要转移的客户</p>
        {
          !_.size(selectedRowKeys) && !_.size(dataSource_) ?
            <div className="onJobInherit-dl">
              <dl onClick={() => {
                setDataSource_([])
                setTransferType(1)
                showTree("customers")
              }} style={{ border: transferType == 1 ? "1px solid #0678FF" : "" }}>
                <dt>按成员选择</dt>
                <dd>选择有工作变更的成员的客户</dd>
              </dl>
              <dl onClick={() => {
                setSelectedRowKeys([])
                setTransferType(2)
                setTransferVisible_(true)
              }} style={{ border: transferType == 2 ? "1px solid #0678FF" : "" }}>
                <dt>选择指定客户</dt>
                <dd>直接选择需要变更的客户</dd>
              </dl>
            </div>
            : <div className="onJobInherit-transfer">
              {
                _.size(selectedRowKeys) ? <Fragment>
                  <span>已选择<span style={{ margin: "0 5px" }}>{_.get(customers, "checkedNodes[0].name")}</span>{selectedRowKeys.length}位客户</span>
                  <span style={{ cursor: "pointer" }} onClick={() => {
                    //选择继承人
                    queryExternalUserList()
                    setTransferVisible(true)
                  }}><RsIcon type="icon-bianji1" style={{ color: "#0678FF" }} /><Button type="link" style={{ padding: 0, margin: 0 }}>编辑</Button></span>
                </Fragment> : null
              }
              {
                _.size(dataSource_) ? <Fragment>
                  <span>已选择<span style={{ margin: "0 5px" }}>{_.get(customers, "checkedNodes[0].name")}</span>{dataSource_.length}位客户</span>
                  <span style={{ cursor: "pointer" }} onClick={() => {
                    //选择继承人
                    setTransferVisible_(true)
                  }}><RsIcon type="icon-bianji1" style={{ color: "#0678FF" }} /><Button type="link" style={{ padding: 0, margin: 0 }}>编辑</Button></span>
                </Fragment> : null
              }

            </div>
        }


        <p className="onJobInherit-title transfer">将客户转移给</p>
        {
          !_.get(heir, "checkedNodes[0].name") ? <span className="onJobInherit-addUser" onClick={() => showTree("heir")}>
            <RsIcon type="icon-tianjia1" style={{ fontWeight: 500, padding: "2px" }} />
          选择成员
        </span> : <div className="onJobInherit-transfer">
              <span>
                <img src={_.get(heir, "checkedNodes[0].avatar")} style={{ width: "20px", height: "auto", borderRadius: "50%", marginRight: "8px" }} />{_.get(heir, "checkedNodes[0].name")}
              </span>
              <span style={{ cursor: "pointer" }} onClick={() => {
                //打开客户列表
                showTree("heir")
              }}><RsIcon type="icon-bianji1" style={{ color: "#0678FF" }} /><Button type="link" style={{ padding: 0, margin: 0 }}>编辑</Button></span>
            </div>
        }
      </div>

      {/* transferVisible 转移客户列表弹出层*/}
      <Modal visible={transferVisible} title="选择要转移的客户" onCancel={() => setTransferVisible(false)} width={800} footer={[
        <Button className="cancel-btn" onClick={() => setTransferVisible(false)}>取消</Button>,
        <Button className="true-btn" onClick={onOkTransfer}>确定</Button>
      ]}>
        <p className="onJobInherit-explain">
          请选择 @ {_.get(customers, "checkedNodes[0].name")} 需要转移的客户  <Button type="link" onClick={alginLast}>{`重选成员 →`}</Button>
        </p>
        <p style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>共位可选客户</span>
          <Input
            value={keyword}
            style={{ width: "260px" }}
            placeholder="请输入要搜索的客户昵称"
            suffix={<RsIcon type="icon-sousuo" />}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPageInfo({
                pageNo: 1,
                pageSize: 10,
                pageCount: 1,
                total: 0
              })
            }}
          />
        </p>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowSelection={rowSelection}
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
      </Modal>
      <Modal title={`将转移${_.size(selectedRowKeys)}位客户给${_.get(heir, "checkedNodes[0].name")}`} visible={messageVisible} onCancel={() => setMessageVisible(false)} footer={[
        <Button className="cancel-btn" onClick={() => setMessageVisible(false)}>取消</Button>,
        <Button className="true-btn" onClick={() => {
          setMessageVisible(false)
          setIsModalVisible(true)
        }}>确定</Button>
      ]}>
        <p style={{ color: "#262626" }}>客户将会收到以下提示</p>
        <div style={{ height: "218px", background: "#F5F7FA", padding: "24px", display: "flex" }}>
          <p><img src={_.get(heir, "checkedNodes[0].avatar")} style={{ width: "30px", height: "auto", marginRight: "8px", borderRadius: "8px" }} /></p>
          <div className="onJobInherit-messageDiv">
            <Input.TextArea
              bordered={false}
              value={messageValue}
              rows={6}
              showCount
              maxLength={100}
              onChange={(e) => {
                setMessageValue(e.target.value)
              }} />
            {/* <p style={{textAlign:"right",margin:"8px 10px 0 0", color:"#595959"}}><span style={{color:"#262626"}}>{messageValue.length}</span>/100</p> */}
          </div>
        </div>

      </Modal>
      <Modal title="提示" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={[
        <Button className="cancel-btn" onCancel={() => setIsModalVisible(false)}>取消</Button>,
        <Button className="true-btn" onClick={handleOk} loading={transferLoading}>确定</Button>
      ]}>
        <p>确定将客户转移？</p>
        <p>转移后，此操作将无法恢复。</p>
      </Modal>
      <Modal title="选择客户" visible={transferVisible_} onCancel={() => setTransferVisible_(false)} width={900} footer={[
        <Button className="cancel-btn" onClick={() => setTransferVisible_(false)}>取消</Button>,
        <Button className="true-btn" onClick={onOkTransfer_}>确定</Button>
      ]} >

        <Dropdown
          visible={dropDownVisible}
          overlayStyle={{ paddingTop: "16px" }}
          trigger={['click']}
          overlay={overlay}
          onVisibleChange={onVisibleChange}
        >
          <Input
            value={keyword_}
            style={{ width: "100%", marginBottom: "16px" }}
            placeholder="请输入要搜索的客户昵称"
            suffix={<RsIcon type="icon-sousuo" />}
            onChange={(e) => setKeyword_(e.target.value)}
          />

        </Dropdown>

        <Table
          columns={columns_}
          dataSource={dataSource_}
          style={{ minHeight: "400px" }}
          rowKey={"customerId"}
          size="small"
          onChange={handleChangeTable}
          pagination={{
            className: 'pagination',
            pageSize: 6,
            showTotal: (total) => `共${total}条记录`
          }}
        />
      </Modal>
      <div className="onJobInherit-bottom">
        <Button className="cancel-btn" onClick={setPageInit}>返回</Button>
        <Button className="true-btn"
          disabled={ifTranfer()}
          onClick={trueTransfer}>确认转移</Button>
      </div>
    </div>
  )
}

export default connect((state) => ({
  brand_id: state.onJobInherit.brand_id,
  shop_id: state.onJobInherit.shop_id,
}), {
})(OnJobInherit);
