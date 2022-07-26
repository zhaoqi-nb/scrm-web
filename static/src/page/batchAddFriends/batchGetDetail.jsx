/* eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, Table, Modal, Input, Button, Radio, Drawer, message } from 'antd'
import StaffSelect from '../comments/publicView/staffSelect'
import RsIcon from '@RsIcon'
import Api from './store/api'
import moment from 'moment'
import _ from 'lodash'
import './index.less'

const { TabPane } = Tabs
export default function BatchGet({ detailVisit, setDetailVisit, rowDataInfosParent }) {
  const [dataSource, setDataSource] = useState([
    {
      name: '所沂',
      thl: 13141060116,
      type: 2,
    },
  ])
  const [loading, setLoading] = useState(false)

  //搜索手机号参数
  const [keywordTel, setKeywordTel] = useState(null)

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0,
  })
  const [sysUserId, setSysUserId] = useState([])

  const [messageModal, setMessageModal] = useState(null)
  const [rowDataInfos, setRowDataInfos] = useState({})

  //单选
  const [radioValue, setRadioValue] = useState('0')

  const optionsWith = [
    { label: '全部', value: '0' },
    { label: '待添加', value: '1' },
    { label: '待通过', value: '2' },
    { label: '已添加', value: '3' },
  ]

  useEffect(() => {
    queryCustomerLog()
  }, [pageInfo.pageSize, pageInfo.pageNo, keywordTel, sysUserId, radioValue])

  const queryCustomerLog = useCallback(() => {
    setLoading(true)
    Api.queryCustomerLog({
      status:
        radioValue === '0'
          ? null
          : radioValue === '1'
          ? '0'
          : radioValue === '2'
          ? '1'
          : radioValue === '3'
          ? '2'
          : '0',
      memberId: sysUserId.map((item) => item.userId).join(',') || null,
      mobile: keywordTel,
      pageNo: pageInfo.pageNo,
      pageSize: pageInfo.pageSize,
      infoId: _.get(rowDataInfosParent, 'id'),
    }).then((res) => {
      if (res.retCode == 200) {
        const list = _.get(res, 'data.list')
        setDataSource(list)
        setPageInfo({
          pageNo: _.get(res, 'data.pageNo'),
          pageSize: _.get(res, 'data.pageSize'),
          pageCount: _.get(res, 'data.pageCount'),
          total: _.get(res, 'data.total'),
        })
        setLoading(false)
      }
    })
  }, [pageInfo.pageSize, pageInfo.pageNo, keywordTel, sysUserId, radioValue])

  const selectChange = (list) => {
    setSysUserId(list)
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

  //提示接口
  const onOkOpenMessage = () => {
    Api.noticeMember({
      infoId: rowDataInfos.id,
      memberId: rowDataInfos.createId,
    }).then((res) => {
      if (res.retCode == 200) {
        message.success('已提醒')
        setRowDataInfos({})
        setMessageModal(false)
      }
    })
  }

  const columns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
      algin: 'center',
      width: 140,
      fixed: 'left',
      render: (text) => {
        return text
          ? String(text)
              .split('')
              .map((item, index) => {
                if (index > 2 && index < 7) item = '*'
                return item
              })
              .join('')
          : null
      },
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      algin: 'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: '客户备注',
      dataIndex: 'remark',
      algin: 'center',
    },
    {
      title: '分配员工',
      dataIndex: 'memberName',
      algin: 'center',
    },
    {
      title: '导入时间',
      dataIndex: 'createTime',
      algin: 'center',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : null),
    },
    {
      title: '添加状态',
      dataIndex: 'status',
      algin: 'center',
      render: (text) => {
        return (
          <p style={{ padding: 0, margin: 0 }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                marginRight: '8px',
                borderRadius: '50%',
                background:
                  status == 0
                    ? '#0678FF'
                    : status == 1
                    ? '#FFBA00'
                    : status == 2
                    ? '#46C93A'
                    : status == -1
                    ? '#red'
                    : '',
              }}
            ></span>{' '}
            {status == 0 ? '待添加' : status == 1 ? '待通过' : status == 2 ? '已添加' : status == -1 ? '已删除' : ''}{' '}
          </p>
        )
      },
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      algin: 'center',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : null),
    },
    {
      title: '创建人/部门',
      dataIndex: 'creator',
      algin: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      algin: 'center',
      render: (text, record) => {
        return (
          <p style={{ padding: 0, margin: 0 }}>
            <Button
              type="link"
              onClick={() => {
                setRowDataInfos({ ...record, openType: 1 })
                setMessageModal(true)
              }}
            >
              添加提醒
            </Button>
          </p>
        )
      },
      fixed: 'right',
    },
  ]

  return (
    <div className="batchGet">
      <Drawer
        className="batchGet-drawer"
        title="详情"
        width={1012}
        visible={detailVisit}
        maskClosable={false}
        closable={false}
        placement="right"
        onClose={() => {
          setDetailVisit(false)
        }}
      >
        <RsIcon
          type="icon-guanbi"
          style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 20, fontSize: '16px' }}
          onClick={() => {
            setDetailVisit(false)
          }}
        />
        <div className="batchGet-filter">
          <Radio.Group
            options={optionsWith}
            onChange={(e) => {
              setRadioValue(e.target.value)
            }}
            value={radioValue}
            optionType="button"
            buttonStyle="solid"
          />
          <Input
            style={{ width: '200px', margin: '0 26px 0 16px' }}
            placeholder="请输入要搜索的手机号"
            suffix={<RsIcon type="icon-sousuo" />}
            value={keywordTel}
            onChange={() => setKeywordTel(e.target.value)}
          />
          <StaffSelect onStaffChange={selectChange} list={sysUserId} />
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          bordered="none"
          size="small"
          scroll={{ x: 'max-content' }}
          onChange={handleChangeTable}
          pagination={{
            className: 'pagination',
            showTotal: (total) => `共${total}条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfo?.pageNo,
            pageSize: pageInfo?.pageSize,
            defaultCurrent: pageInfo.pageCount,
            total: pageInfo.total,
          }}
        />
        <Modal
          maskClosable={false}
          title={rowDataInfos.openType == 1 ? '提醒提示' : '取消提示'}
          visible={messageModal}
          onCancel={() => setMessageModal(false)}
          footer={[
            <Button className="cancel-btn" onClick={() => setMessageModal(false)}>
              取消
            </Button>,
            <Button className="true-btn" onClick={onOkOpenMessage}>
              确定
            </Button>,
          ]}
        >
          {rowDataInfos.openType == 1 && (
            <p>将通过消息提醒员工跟进客户，如果客户长时间未通过好友申请，可再次添加，是否确认发送？</p>
          )}
          {rowDataInfos.openType == 2 && <p>取消任务后，若员工已收到的任务分配提醒无法撤回，是否确认取消？</p>}
        </Modal>
      </Drawer>
    </div>
  )
}
