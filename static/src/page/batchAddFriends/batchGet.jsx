/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Table, Modal, Input, Button, Radio, Drawer, message } from 'antd'
import StaffSelect from '../comments/publicView/staffSelect'
import UploadPanel from './comments/uploadPanel'
import BatchGetDetail from './batchGetDetail'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'

const { TabPane } = Tabs
export default function BatchGet(props) {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)

  //搜索手机号参数
  const [keywordTel, setKeywordTel] = useState(null)

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })
  const [sysUserId, setSysUserId] = useState([])

  const [messageModal, setMessageModal] = useState(false)
  const [messageModalTask, setMessageModalTask] = useState(false)
  const [rowDataInfos, setRowDataInfos] = useState({})

  //文件上传modal
  const [fileInfo, setFileInfo] = useState({})
  const [excelLoading, setExcelLoading] = useState(false)
  const [fileResultInfo, setFileResultInfo] = useState({})

  //导入客户
  const [excelFileVisible, setExcelFileVisible] = useState(false)
  const [sucessFileVisible, setSucessFileVisible] = useState(false)

  //抽屉
  const [drawerVisible, setDrawerVisible] = useState(false)
  const optionsWith = [
    { label: '全部', value: '0' },
    { label: '待添加', value: '1' },
    { label: '待通过', value: '2' },
    { label: '已添加', value: '3' },
  ];
  //任务搜索
  const [keywordTask, setKeywordTask] = useState("")
  const [dataSourceTask, setDataSourceTask] = useState([])
  const [loadingTask, setLoadingTask] = useState(false)
  const [pageInfoTask, setPageInfoTask] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })

  //任务详情
  const [detailVisit, setDetailVisit] = useState(false)

  useEffect(() => {
    queryCustomerLog()
  }, [pageInfo.pageSize, pageInfo.pageNo, keywordTel, sysUserId, props.radioValue])

  useEffect(() => {
    queryInfo()
  }, [pageInfoTask.pageSize, pageInfoTask.pageNo, keywordTask])

  const queryCustomerLog = useCallback((page) => {
    setLoading(true)
    Api.queryCustomerLog({
      status: props.radioValue === '0' ? null : props.radioValue === '1' ? '0' : props.radioValue === '2' ? '1' : props.radioValue === '3' ? '2' : null,
      memberId: sysUserId.map(item => item.userId).join(",") || null,
      mobile: keywordTel,
      pageNo: _.get(page, "pageNo") || pageInfo.pageNo,
      pageSize: _.get(page, "pageSize") || pageInfo.pageSize,
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list');
        setDataSource(list)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.total')
        })
        setLoading(false)
      }
    })
  }, [pageInfo.pageSize, pageInfo.pageNo, keywordTel, sysUserId, props.radioValue])

  //导入记录list接口
  const queryInfo = useCallback(() => {
    Api.queryInfo({
      pageNo: pageInfoTask.pageNo,
      pageSize: pageInfoTask.pageSize,
      name: keywordTask,//任务名称
    }).then(res => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list')
        setDataSourceTask(list)
        setPageInfoTask({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.total')
        })
        setLoadingTask(false)
      }
    })
  }, [pageInfoTask.pageSize, pageInfoTask.pageNo, keywordTask])

  const selectChange = (list) => {
    setSysUserId(list)
  }

  //提醒
  const noticeMember = () => {
    Api.noticeMember({
      infoId: rowDataInfos.infoId || rowDataInfos.id,
      memberId: rowDataInfos.memberId || null,
    }).then(res => {
      if (res.retCode == 200) {
        message.success("已提醒")
        setMessageModal(false)
        setMessageModalTask(false)
        setRowDataInfos({})

      }
    })
  }
  //取消api
  const deleteApi = () => {
    Api.deleteApi(rowDataInfos.id).then(res => {
      if (res.retCode == 200) {
        message.success("已取消")
        queryCustomerLog({
          pageNo: 1,
          pageSize: 10,
          pageCount: 1,
          total: 0
        })
        setMessageModal(false)
        setMessageModalTask(false)
        setRowDataInfos({})
      }
      // rowDataInfos.id
    })
  }

  //提示取消接口
  const onOkOpenMessage = () => {
    if (rowDataInfos.openType == 1) noticeMember()
    else if (rowDataInfos.openType == 2) deleteApi()

  }


  //分页
  const handleChangeTable = (page) => {
    if (page.pageSize != pageInfo.pageSize) page.current = 1
    setPageInfo({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.total,
    })
  }

  //导入分页
  const handleChangeTableTask = (page) => {
    if (page.pageSize != pageInfoTask.pageSize) page.current = 1
    setPageInfoTask({
      pageCount: 1,
      pageNo: page.current,
      pageSize: page.pageSize,
      total: page.total,
    })
  }

  //上传文件接口
  const onOkAddExcel = () => {
    setExcelLoading(true)
    Api.excelFile({
      file: _.get(fileInfo, "upLoadFileInfo.url"),
      name: fileInfo.name,
      fullFileName: _.get(fileInfo, "upLoadFileInfo.fileName"),
    }).then(res => {
      if (res.retCode == 200) {
        setFileResultInfo(res.data)
        setExcelLoading(false)
        setFileInfo({})
        setSucessFileVisible(true)
        setExcelFileVisible(false)
      }
    })

  }

  //文件上传
  const onUploadChange = (upLoadFileInfo) => {
    // upLoadFile 后台接口返回的数据
    setFileInfo({ ...fileInfo, upLoadFileInfo })

  }

  const columns = [
    {
      title: "手机号",
      dataIndex: "mobile",
      algin: "center",
      width: 140,
      fixed: "left",
      render: (text) => {
        return text ? String(text).split("").map((item, index) => {
          if (index > 2 && index < 7) item = "*"
          return item
        }).join("") : null
      }
    }, {
      title: "客户姓名",
      dataIndex: "name",
      algin: "center",
      width: 120,
      fixed: "left"
    }, {
      title: "客户备注",
      dataIndex: "remark",
      algin: "center"
    }, {
      title: "分配员工",
      dataIndex: "memberName",
      algin: "center"
    }, {
      title: "导入时间",
      dataIndex: "createTime",
      algin: "center",
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : null
    }, {
      title: "添加状态",
      dataIndex: "status",
      algin: "center",
      render: (text) => {
        return <p style={{ padding: 0, margin: 0 }}><span style={{ display: "inline-block", width: "8px", height: "8px", marginRight: "8px", borderRadius: "50%", background: text == '0' ? "#0678FF" : text == '1' ? "#FFBA00" : text == '2' ? "#46C93A" : text == '-1' ? "#red" : "" }}></span> {text == '0' ? "待添加" : text == '1' ? "待通过" : text == '2' ? "已添加" : text == '-1' ? "已删除" : ""} </p>
      }
    }, {
      title: "添加时间",
      dataIndex: "addTime",
      algin: "center",
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : null
    }, {
      title: "创建人/部门",
      dataIndex: "creator",
      algin: "center"
    }, {
      title: "操作",
      dataIndex: "",
      algin: "center",
      render: (text, record) => {
        return <p style={{ padding: 0, margin: 0 }}>
          <Button type="link" onClick={() => {
            setRowDataInfos({ ...record, openType: 1 })
            setMessageModal(true)
          }}>提醒</Button>
          <Button type="link" onClick={() => {
            setRowDataInfos({ ...record, openType: 2 })
            setMessageModal(true)
          }}>取消</Button>
        </p>
      },
      fixed: "right"
    },
  ]

  const columnsTask = [
    {
      title: "任务名称",
      dataIndex: "name",
      algin: "center",
      width: 140,
      fixed: "left"
    }, {
      title: "文件名",
      dataIndex: "fileName",
      algin: "center",
    }, {
      title: "导入客户数",
      dataIndex: "importCount",
      algin: "center"
    }, {
      title: "已添加客户数",
      dataIndex: "addCount",
      algin: "center"
    }, {
      title: "添加完成率",
      dataIndex: "addRatio",
      algin: "center"
    }, {
      title: "创建时间",
      dataIndex: "createTime",
      algin: "center",
      render: (text, record) => moment(text).format("YYYY-MM-DD")
    }, {
      title: "创建人/部门",
      dataIndex: "creator",
      algin: "center"
    }, {
      title: "操作",
      dataIndex: "",
      algin: "center",
      fixed: "right",
      render: (text, record) => {
        return <p style={{ margin: 0 }}>
          <Button type="link" onClick={() => {
            setRowDataInfos({ ...record, openType: 1 })
            setMessageModalTask(true)
          }}
          >提醒</Button>
          <Button type="link" onClick={(e) => {
            setRowDataInfos(record)
            setDetailVisit(true)
          }}>详情</Button>
        </p>
      }
    }
  ]

  // (e)=>setKeywordTel(e.target.value)
  return (
    <div className="batchGet">
      <Modal className="modalImportent" maskClosable={false} title={rowDataInfos.openType == 1 ? "提醒提示" : "取消提示"} visible={messageModal} onCancel={() => setMessageModal(false)} footer={[
        <Button className="cancel-btn" onClick={() => setMessageModal(false)} >取消</Button>,
        <Button className="true-btn" onClick={onOkOpenMessage}>确定</Button>
      ]}>
        {rowDataInfos.openType == 1 &&
          <p>将通过消息提醒员工跟进客户，如果客户长时间未通过好友申请，可再次添加，是否确认发送？</p>
        }
        {rowDataInfos.openType == 2 &&
          <p>取消任务后，若员工已收到的任务分配提醒无法撤回，是否确认取消？</p>
        }
      </Modal>
      <Modal className="modalImportent" maskClosable={false} title={rowDataInfos.openType == 1 ? "提醒提示" : "取消提示"} visible={messageModalTask} onCancel={() => setMessageModalTask(false)} footer={[
        <Button className="cancel-btn" onClick={() => setMessageModalTask(false)} >取消</Button>,
        <Button className="true-btn" onClick={onOkOpenMessage}>确定</Button>
      ]}>
        {rowDataInfos.openType == 1 &&
          <p>将通过消息提醒员工跟进客户，如果客户长时间未通过好友申请，可再次添加，是否确认发送？</p>
        }
        {rowDataInfos.openType == 2 &&
          <p>取消任务后，若员工已收到的任务分配提醒无法撤回，是否确认取消？</p>
        }
      </Modal>
      <div className="batchGet-header">
        <p className="batchGet-title">潜在客户</p>
        <p className="batchGet-button">
          <Button type="primary" onClick={() => setExcelFileVisible(true)}>导入客户</Button>
          <Button onClick={() => setDrawerVisible(true)}>导入记录</Button>
        </p>
      </div>
      <div className="batchGet-filter">
        <Radio.Group
          options={optionsWith}
          onChange={(e) => {
            props.setRadioValue(e.target.value)
          }}
          value={props.radioValue}
          optionType="button"
        />
        <Input
          style={{ width: "200px", margin: "0 26px 0 16px" }}
          placeholder="请输入要搜索的手机号"
          suffix={<RsIcon type="icon-sousuo" />}
          value={keywordTel}
          onChange={(e) => setKeywordTel(e.target.value)}
        />
        <StaffSelect onStaffChange={selectChange} list={sysUserId} />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 'max-content' }}
        onChange={handleChangeTable}
        pagination={{
          position: ['bottomCenter'],
          size: 'small',
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

      <Modal maskClosable={false} className="batchGet-update" title="导入客户" width={600} visible={excelFileVisible} onCancel={() => setExcelFileVisible(false)} footer={[
        <Button className="cancel-btn" onClick={() => setExcelFileVisible(false)} >取消</Button>,
        <Button className="true-btn" loading={excelLoading} disabled={!fileInfo.name || !_.get(fileInfo, "upLoadFileInfo.url")} onClick={onOkAddExcel}>确定</Button>
      ]}>
        <div className="batchGet-update-downExcelExp">
          <Button style={{ padding: '6px 0' }} type="link" target="_blank" href="https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/%E7%87%83%E6%95%B0%E6%89%B9%E9%87%8F%E8%8E%B7%E5%AE%A2%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls"><RsIcon type="icon-daochu" style={{ fontSize: '16px', marginRight: '8px' }} />下载模版</Button>
          <p>可批量复制手机号至模版哪，若谁让内容有重复手机号或空行将会自动过滤</p>
        </div>
        <p className="batchGet-update-name">
          <p style={{ width: "100px" }}>任务名称</p>
          <Input
            value={fileInfo.keyword}
            placeholder="请输入任务名称"
            maxLength={20}
            showCount={true}
            onChange={(e) => setFileInfo({ ...fileInfo, name: e.target.value })}
          />
        </p>
        <p className="batchGet-update-name">
          <p style={{ width: "85px" }}>上传表格</p>
          <UploadPanel fileData={{ type: 0 }} uploadData={fileInfo.upLoadFileInfo || {}} fileType={"file"} onChange={onUploadChange} />
        </p>
        <div className="batchGet-update-explain">
          <dl>
            <dt></dt>
            <dd >
              <p>1. 表格内手机号将按照指定的员工进行分配，请确保添加员工在当前登录账号的管辖范围内，否则会导致上传表格失败;</p>
              <p>2. 分配完成后员工会在企业微信「消息提醒」收到添加好友的任务，需要员工手动添加;</p>
            </dd>
          </dl>
        </div>
      </Modal>

      <Modal className="batchGet-update-success" width={400} maskClosable={false} title="导入客户" visible={sucessFileVisible} onCancel={() => setSucessFileVisible(false)} footer={[
        <Button className="cancel-btn" onClick={() => setSucessFileVisible(false)} >取消</Button>,
        <Button className="true-btn" onClick={() => setSucessFileVisible(false)} >确定</Button>
      ]}>
        <p className="batchGet-update-success-img">
          <RsIcon type="icon-chenggong" style={{ fontSize: '20px' }} />
          导入完成
                </p>
        <div className="batchGet-update-success-info">
          <div className="batchGet-update-success-info-top">
            <p>
              成功：<span style={{ marginRight: "36px" }}>{fileResultInfo.successCount}条</span> 失败：<span className="filed">{fileResultInfo.errorCount}条</span>
            </p>
            <div>
              失败原因：
                            <p>1. 指定添加员工含非管辖范围内员工</p>
              <p>2. 数据重复</p>
            </div>
          </div>
          <div className="batchGet-update-success-info-bottom">
            <p>请检查后重新导入！</p>
            <Button disabled={fileResultInfo.errorCount > 0 ? false : true} type="link" target="_blank" href={fileResultInfo.errorUrl}>导出失败数据</Button>
          </div>
        </div>
      </Modal>

      <Drawer
        className="batchGet-drawer"
        title="导入记录"
        width={1012}
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
        <Input
          value={keywordTask}
          style={{ width: "260px", marginBottom: "16px" }}
          placeholder="请输入要搜索的客户昵称"
          suffix={<RsIcon type="icon-sousuo" />}
          onChange={(e) => {
            setKeywordTask(e.target.value)
            setPageInfo({
              pageNo: 1,
              pageSize: 10,
              pageCount: 1,
              total: 0
            })
          }}
        />
        <Table
          columns={columnsTask}
          dataSource={dataSourceTask}
          loading={loadingTask}
          scroll={{ x: 'max-content' }}
          onChange={handleChangeTableTask}
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            showTotal: (total) => `共${total}条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfoTask?.pageNo,
            pageSize: pageInfoTask?.pageSize,
            defaultCurrent: pageInfoTask.pageCount,
            total: pageInfoTask.total
          }}
        />
      </Drawer>

      {detailVisit && <BatchGetDetail detailVisit={detailVisit} setDetailVisit={setDetailVisit} rowDataInfosParent={rowDataInfos} />}



    </div>
  )
}
