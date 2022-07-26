import React, { useState, useEffect } from 'react'
import { Button, Input, message, Modal, Tag } from 'antd'
import RsIcon from '@RsIcon'

import { useHistory } from 'react-router-dom'
import moment from 'moment'
import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'
import StaffSelect from '../comments/publicView/staffSelect'
import TablePhoneView from '../comments/publicView/TablePhoneView'

import Api from './store/api'

function TableIndex() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [messageValue, setMessageValue] = useState('')
  const [userId, setUserId] = useState([])
  const [visible, setVisible] = useState(false)
  const [optionDataRow, setOptionDataRow] = useState({})

  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    Api.queryList({
      pageNo,
      pageSize,
      message: messageValue,
      memberIds: userId.map((item) => item.id),
      bizType: 1,
    })
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          setDataList(list)
          setPagination({ ...pagination, total, pageNo, pageSize })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const pageChange = (page, pageSize) => {
    getData(page, pageSize)
  }

  useEffect(() => {
    getData()
  }, [userId])

  const handleSearchEvent = () => {
    getData()
  }
  const handleChangeName = (value) => {
    setMessageValue(value)
  }
  const selectChange = (list) => {
    setUserId(list)
  }

  /** 页面渲染处理* */
  const history = useHistory() // 路由处理

  const goFriedsWelcomeAdd = (id) => {
    const stateObj = {
      id,
    }
    if (stateObj.id) {
      history.push({ pathname: '/friendsWelcomeAdd', state: stateObj })
    } else {
      history.push({ pathname: '/friendsWelcomeAdd' })
    }
  }
  const renderEmptyBtn = () => (
    <Button
      type="primary"
      onClick={() => {
        goFriedsWelcomeAdd()
      }}
    >
      新建欢迎语
    </Button>
  )

  const deleteData = (id) => {
    Api.deleteData({ id })
      .then((res) => {
        if (res.retCode == 200) {
          message.success('操作成功')
          getData()
        } else {
          message.error(res.retMsg)
        }
      })
      .finally(() => {
        setVisible(false)
      })
  }
  const handleOk = () => {
    if (optionDataRow.id) deleteData(optionDataRow.id)
  }
  const optionButtonList = [
    {
      label: '编辑',
      clickFN: (data) => {
        goFriedsWelcomeAdd(data.id)
      },
    },
    {
      label: '删除',
      clickFN: (data) => {
        setOptionDataRow(data)
        setVisible(true)
      },
    },
  ]

  const columns = [
    {
      title: '消息内容',
      dataIndex: 'message',
      key: 'message',
      render: (text, rowData) => {
        const files = rowData.attachmentContents ? JSON.parse(rowData.attachmentContents) : []
        return (
          <div className="flex-box flex-column ">
            <div className="text-ellipsis2 full-w" style={{ maxWidth: '200px' }}>
              {text}
            </div>
            <TablePhoneView messageValue={text} files={files} />
          </div>
        )
      },
    },
    {
      title: '使用员工',
      dataIndex: 'members',
      key: 'members',
      render: (items) => (
        <div className="flex-box">
          {items.slice(0, 5).map((item) => (
            <div className="flex-box f14 middle-a mr14">
              <Tag icon={<RsIcon type="icon-bianzu" className="f16" />}>{item.name}</Tag>
            </div>
          ))}
          {items.length > 5 ? `等共${items.length}人` : null}
        </div>
      ),
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      width: 100,
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
  ]
  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">好友欢迎语</div>
          {renderEmptyBtn()}
        </div>
        <div className="flex-box middle-a full-w">
          <div>
            <Input
              suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
              className="input-search"
              style={{ width: '240px' }}
              placeholder="请输入要搜索的欢迎语"
              onPressEnter={() => handleSearchEvent()}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </div>

          <div className="flex-box middle-a ml16">
            <div className="mr8">使用员工:</div>
            <StaffSelect
              onStaffChange={(e) => {
                selectChange(e)
              }}
              list={userId}
            />
          </div>
        </div>
      </div>
      <PulicTable
        columns={columns}
        loading={loading}
        pagination={pagination}
        dataSource={dataList}
        pageChange={pageChange}
        emptyText="还没有好友欢迎语哦，快去新建吧！"
        renderEmptyBtn={renderEmptyBtn}
      />

      <Modal
        title="删除提示框"
        onCancel={() => {
          setVisible(false)
        }}
        visible={visible}
        onOk={handleOk}
        okText="删除"
        okButtonProps={{ danger: true }}
      >
        <p>删除后对应的使用人员再加好友，将无法发送欢迎语消息，确认删除么？</p>
      </Modal>
    </div>
  )
}

export default TableIndex
