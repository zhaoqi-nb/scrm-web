import React, { useState, useEffect } from 'react'
import { Button, Input, message, Modal, Space, Drawer, Tooltip, Image } from 'antd'
import RsIcon from '@RsIcon'

import { useHistory } from 'react-router-dom'
import moment from 'moment'
import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'

// import TablePhoneView from '../comments/publicView/TablePhoneView'

import Api from './store/api'

function TableIndex() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [messageValue, setMessageValue] = useState('')
  const [visible, setVisible] = useState(false)
  const [optionDataRow, setOptionDataRow] = useState({})
  const [drawerVisible, setDrawerVisible] = useState(false)

  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    Api.queryList({
      pageNo,
      pageSize,
      message: messageValue,
      //   memberIds: userId.map((item) => item.id),
      bizType: 2,
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
  }, [])

  const handleSearchEvent = () => {
    getData()
  }
  const handleChangeName = (value) => {
    setMessageValue(value)
  }
  //   const selectChange = (list) => {
  //     setUserId(list)
  //     getData()
  //   }

  /** 页面渲染处理* */
  const history = useHistory() // 路由处理

  const goFriedsWelcomeAdd = (id) => {
    const stateObj = {
      id,
    }
    if (stateObj.id) {
      history.push({ pathname: '/groupWelcomeOption', state: stateObj })
    } else {
      history.push({ pathname: '/groupWelcomeOption' })
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
      label: '详情',
      clickFN: (data) => {
        setOptionDataRow(data)
        setDrawerVisible(true)
      },
    },
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
      render: (text) => (
        // const files = rowData.attachmentContents ? JSON.parse(rowData.attachmentContents) : []
        <div className="flex-box flex-column ">
          <div className="text-ellipsis2 full-w" style={{ maxWidth: '200px' }}>
            {text.split('#nickname#').join('【客户昵称】')}
          </div>
          {/* <TablePhoneView files={files} /> */}
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
  const onClose = () => {
    setDrawerVisible(false)
  }
  const renderFilePanel = (fileList) => {
    const typeIcons = {
      link: ['icon-lianjie', '链接'],
      video: ['icon-shipin', '视频'],
      file: ['icon-wenjian', '文件'],
    }
    return (
      <div className="flex-box flex-column">
        {fileList.map((fileObj) => (
          <div className="flex-box mt16">
            <div className="padr10 text-sub1" style={{ width: '68px' }}>
              欢迎语2
            </div>
            <div className="full-w flex-box flex-column">
              {fileObj.fileType == 'img' ? (
                <div className="flex-box flex-column">
                  <div className="padb12">类型-图片</div>
                  <Image src={fileObj.url} width={120} />
                </div>
              ) : (
                <div className="flex-box flex-column">
                  <div className="padb12">类型-{typeIcons[fileObj.fileType][1]}</div>
                  <div className="padt9 padb9 padl12 padr12 bg-panel box-sh f14 full-w">
                    <RsIcon type={typeIcons[fileObj.fileType][0]} className="mr3 f18" />
                    {fileObj.link || fileObj.fileName}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
  const renderRowInfo = () => {
    if (optionDataRow.message) {
      const messageForMatText = optionDataRow.message.split('#nickname#').join('【客户昵称】')
      let showFileList = optionDataRow.attachmentContents ? JSON.parse(optionDataRow.attachmentContents) : []
      showFileList = showFileList.filter((item) => item.url || item.link)
      return (
        <div className="flex-box  full-w  flex-column">
          <div
            className="full-w padt8 padb8 mb20 text-bold flex-box middle-a flex-between"
            style={{ borderBottom: '1px dashed #E1E8F0' }}
          >
            基本设置
          </div>
          <div className="flex-box middle-a">
            <div className="padr10 text-sub1">欢迎语1</div>
            <div className="flex1 text-ellipsis2">
              <Tooltip placement="top" title={messageForMatText}>
                {messageForMatText}
              </Tooltip>
            </div>
          </div>
          {renderFilePanel(showFileList)}
          <div className="flex-box middle-a mt16">
            <div className="padr10 text-sub1" style={{ width: '68px' }}>
              消息提醒
            </div>
            <div className="flex1 text-sub1">{optionDataRow.messageNotification ? '已开启' : '未开启'}</div>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">群欢迎语</div>
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

          {/* <div className="flex-box middle-a ml24">
            <div className="mr8">使用员工:</div>
            <StaffSelect onChange={selectChange} list={[]} />
          </div> */}
        </div>
      </div>
      <PulicTable
        columns={columns}
        loading={loading}
        pagination={pagination}
        dataSource={dataList}
        pageChange={pageChange}
        emptyText="还没有群欢迎语哦，快去新建吧！"
        renderEmptyBtn={renderEmptyBtn}
      />
      <Modal
        title="删除提示框"
        onCancel={() => {
          setVisible(false)
        }}
        destroyOnClose
        visible={visible}
        onOk={handleOk}
        okText="删除"
        okButtonProps={{ danger: true }}
      >
        <p>删除后对应的使用人员再加好友，将无法发送欢迎语消息，确认删除么？</p>
      </Modal>

      <Drawer
        title="入群欢迎语素材详情"
        placement="right"
        width={413}
        closable={false}
        onClose={onClose}
        visible={drawerVisible}
        extra={
          <Space>
            <RsIcon onClick={onClose} type="icon-guanbi " className="f18" />
          </Space>
        }
      >
        {drawerVisible ? renderRowInfo() : null}
      </Drawer>
    </div>
  )
}

export default TableIndex
