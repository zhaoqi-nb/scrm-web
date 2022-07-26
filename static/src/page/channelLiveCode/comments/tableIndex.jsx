/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { Button, Input, message, Modal, Tooltip, Image, Drawer, Space, Tag, Select, Popover } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { TRCheckboxModal } from '@Tool/components'
import PulicTable from '../../comments/publicView/table'
import TableDropDown from '../../comments/publicView/tableDropDown'
import PhoneView from '../../comments/publicView/phoneView'
import Api from '../store/api'
import { userTreeFormat } from '@/utils/Util'
import { initStaffData } from '../../staffDelete/helper'
import './index.less'
import { exportFile } from '@/utils/Util'
import { render } from 'react-dom'
function TableIndex() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [codeName, setcodeName] = useState('')
  const [userId, setUserId] = useState([])
  const [visible, setVisible] = useState(false)
  const [optionDataRow, setOptionDataRow] = useState({})
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [staffData, setStaffData] = useState([])
  const [staffValue, setStaffValue] = useState([])
  const [staffOption, setStaffOption] = useState([])

  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
    }
    if (codeName) {
      data.codeName = codeName
    }
    if (userId && userId.length > 0) {
      data.memberIds = userId.map((item) => item.id)
    }
    Api.queryList(data)
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
    fetchData()
  }, [])
  useEffect(() => {
    getData()
  }, [userId])

  const handleSearchEvent = () => {
    getData()
  }
  const handleChangeName = (value) => {
    setcodeName(value)
  }

  /** 页面渲染处理* */
  const history = useHistory() // 路由处理

  const goChannelLiveCodeOption = (id) => {
    const stateObj = {
      id,
    }
    if (stateObj.id) {
      history.push({ pathname: '/channelLiveCodeOption', state: stateObj })
    } else {
      history.push({ pathname: '/channelLiveCodeOption' })
    }
  }
  const renderEmptyBtn = () => (
    <Button
      type="primary"
      onClick={() => {
        goChannelLiveCodeOption()
      }}
    >
      新建活码
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
  const showDetaiInfo = (id) => {
    Api.getData({ id }).then((res) => {
      if (res.retCode == 200) {
        setOptionDataRow(res.data)
        setDrawerVisible(true)
      }
    })
  }
  const title1 = (
    <div className="flex-box middle-a">
      扫码添加次数
      <Tooltip
        placement="top"
        title="统计添加渠道活码码的人次，若客户重复添加将会重复计数"
        overlayInnerStyle={{ color: '#333', fontSize: '12px' }}
        color="#fff"
      >
        <RsIcon type="icon-bangzhu1" />
      </Tooltip>
    </div>
  )
  const optionButtonList = [
    {
      label: '数据统计',
      clickFN: (data) => {
        history.push({
          pathname: '/channelLiveCode',
          state: { codeName: data.codeName, id: data.id, members: data.members, tabKey: 2 },
        })
      },
    },
    {
      label: '详情',
      clickFN: (data) => {
        showDetaiInfo(data.id)
      },
    },
    {
      label: '下载',
      clickFN: (data) => {
        exportFile(data.qrCodeUrl)
      },
    },
    {
      label: '修改',
      clickFN: (data) => {
        setOptionDataRow(data)
        goChannelLiveCodeOption(data.id)
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
      title: '活码',
      dataIndex: 'qrCodeUrl',
      key: 'qrCodeUrl',
      width: 80,
      render: (text) => <Image src={text} width={48} />,
    },
    {
      title: '活码名称',
      dataIndex: 'codeName',
      key: 'codeName',
    },
    {
      title: title1,
      dataIndex: 'scanNum',
      key: 'scanNum',
      width: 120,
    },
    {
      title: '使用成员',
      dataIndex: 'members',
      key: 'members',
      render: (items) => (
        <div className="flex-col flex-column">
          <div className="flex-box f14 middle-a mr14">
            {items.slice(0, 2).map((item) => (
              <Tag icon={<RsIcon type="icon-bianzu" className="f16" />}>{item.name}</Tag>
            ))}
          </div>
          {items.length > 2 ? `等共${items.length}人` : null}
        </div>
      ),
    },
    {
      title: '创建人/所属部门',
      dataIndex: 'createName',
      key: 'createName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '标签',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels = []) => (
        <Tooltip title={labels?.map((item) => item?.labelName || '').join(',')} placement={'topLeft'}>
          <div className="flex-col flex-column">
            <div>
              {labels?.slice(0, 2).map((item) => (
                <Tag className="mb6">{item.labelName}</Tag>
              ))}
            </div>
            <div>{labels.length > 2 ? `等共${labels.length}个标签` : null}</div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 200,
      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
  ]

  const onClose = () => {
    setDrawerVisible(false)
  }
  const renderMemberContent = (list) => {
    return (
      <div className="pad12 over-y" style={{ maxWidth: '300px', maxHeight: '200px' }}>
        {list.map((item) => (
          <Tag className="m6" icon={<RsIcon type="icon-bianzu" className="f16" />}>
            {item.name}
          </Tag>
        ))}
      </div>
    )
  }
  const renderLabelContent = (list) => {
    return (
      <div className="pad12 over-y" style={{ maxWidth: '300px', maxHeight: '200px' }}>
        {list.map((item) => (
          <Tag className="m6">{item.labelName}</Tag>
        ))}
      </div>
    )
  }
  const renderRowInfo = () => {
    const codeNameInfo = optionDataRow.codeName
    const welcomeMessageInfo = optionDataRow.welcomeMessageInfo || {}
    const welcomeTypeObj = {
      1: '渠道欢迎语',
      2: '好友欢迎语',
      3: '不发送欢迎语',
    }
    const labelstyle = { width: '80px' }
    const welcomeTypeText = welcomeTypeObj[optionDataRow.welcomeType]
    const viewList = welcomeMessageInfo.attachmentContents ? JSON.parse(welcomeMessageInfo.attachmentContents) : []
    return (
      <div className="flex-box full-h">
        <div className="flex1 flex-box flex-column">
          <div className="padb8 text-bold mb12 borderb-1">基础信息</div>
          <div className="flex-box flex-column">
            <div className="flex-box">
              <div className="flex2 flex-box">
                <div className="text-sub1 padr8" style={labelstyle}>
                  活码名称
                </div>
                {optionDataRow.codeName}
              </div>
              <div className="flex2 flex-box">
                <div className="text-sub1 padr8" style={labelstyle}>
                  客户备注
                </div>
                {optionDataRow.nickRemarkContent}
              </div>
            </div>
            <div className="flex-box mt12">
              <div className="flex2 flex-box">
                <div className="text-sub1 padr8" style={labelstyle}>
                  添加员工
                </div>
                <div className="flex-box f14 middle-a mr14 ">
                  {optionDataRow.members.slice(0, 2).map((item) => (
                    <Tag icon={<RsIcon type="icon-bianzu" className="f16" />}>{item.name}</Tag>
                  ))}
                  {optionDataRow.members.length >= 2 && (
                    <Popover
                      arrowPointAtCenter
                      placement="bottom"
                      content={() => {
                        return renderMemberContent(optionDataRow.members)
                      }}
                      // title="Title"
                      trigger="hover"
                    >
                      <div className="text-link pointer padr8">...</div>
                    </Popover>
                  )}
                </div>
              </div>
              <div className="flex2 flex-box">
                <div className="text-sub1 padr8">备用员工</div>-
              </div>
            </div>
            <div className="flex-box mt12">
              <div className="flex2 flex-box">
                <div className="text-sub1 padr8" style={labelstyle}>
                  自动通过好友
                </div>
                {optionDataRow.friendCheck == 1 ? '已开启' : '未开启'}
              </div>
              <div className="flex2 flex-box">
                <span className="text-sub1 padr8 text-nowrap">标签</span>
                <div className="flex-box over-y">
                  {optionDataRow.labels.slice(0, 2).map((item) => (
                    <Tag>{item.labelName}</Tag>
                  ))}
                  {optionDataRow.labels.length >= 2 && (
                    <Popover
                      arrowPointAtCenter
                      placement="bottom"
                      content={() => {
                        return renderLabelContent(optionDataRow.labels)
                      }}
                      // title="Title"
                      trigger="hover"
                    >
                      <div className="text-link pointer">...</div>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="padb8 text-bold mb12 mt20" style={{ borderBottom: '1px solid #E1E8F0' }}>
            欢迎语设置
          </div>
          <div className="flex-box flex-column">
            <div className="flex2 flex-box">
              <span className="text-sub1 padr8">设置欢迎语</span>
              {welcomeTypeText || '-'}
            </div>
            {optionDataRow.welcomeType == 1 ? (
              <div>
                <div className="flex2 flex-box mt12">
                  <span className="text-sub1 padr8">消息内容</span>
                  {welcomeMessageInfo.message || '-'}
                </div>
                <PhoneView list={viewList} />
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ width: '313px' }} className="full-h bg-info flex-column flex-box middle-a pad24 mt-24">
          <Image src={optionDataRow.qrCodeUrl} width={140} />
          <div className="panel">{codeNameInfo}</div>
          <Button
            type="primary"
            style={{ width: '140px' }}
            className="mt8"
            size="small"
            onClick={() => {
              exportFile(optionDataRow.qrCodeUrl)
            }}
          >
            下载活码
          </Button>
          <Button
            style={{ width: '140px' }}
            size="small"
            className="mt8"
            onClick={() => {
              goChannelLiveCodeOption(optionDataRow.id)
            }}
          >
            修改
          </Button>
        </div>
      </div>
    )
  }
  const titleRender = (item) => {
    return (
      <div className="itemBox">
        {item?.avatar && <img src={item?.avatar || ''} />}
        <span>{item?.title || ''}</span>
      </div>
    )
  }

  const fetchData = async () => {
    const res = await Api.getStaffData()
    if (res?.retCode === 200) {
      const result = userTreeFormat(res?.data)
      const data = initStaffData(res?.data)?.resultData
      setStaffData(result)
      setStaffOption(data)
    }
  }
  const handelSelect = async () => {
    const result = await TRCheckboxModal.show({
      treeData: staffData,
      value: staffValue,
      title: '选择员工',
      titleRender,
      itemRender: titleRender,
    })
    if (result.index === 1) {
      setStaffValue(result?.checkedKeys || [])
      setUserId(result?.checkedNodes)
    }
  }
  const handelChange = (data) => {
    let _userId = [...userId]
    _userId = _userId.filter((item) => data.includes(item.id))
    setUserId(_userId)
    setStaffValue(data)
  }
  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">渠道活码</div>
          {renderEmptyBtn()}
        </div>
        <div className="flex-box middle-a full-w">
          <div>
            <Input
              suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
              className="input-search"
              style={{ width: '176px' }}
              placeholder="请输入活码名称"
              onPressEnter={() => handleSearchEvent()}
              onChange={(e) => handleChangeName(e.target.value)}
            />
          </div>

          <div className="flex-box middle-a ml16">
            <div className="mr8">使用员工:</div>
            <Select
              onClick={handelSelect}
              open={false}
              options={staffOption}
              style={{ width: '176px' }}
              value={staffValue}
              placeholder="请选择员工"
              mode="tags"
              maxTagCount={1}
              showArrow
              onChange={handelChange}
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
        scroll={{ x: 1300 }}
        emptyText="还没有渠道活码哦，快去新建吧！"
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
        <p>删除后已投放活码也将失效，确认删除吗？</p>
      </Modal>
      <Drawer
        title="渠道活码详情"
        placement="right"
        width={912}
        closable={false}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: '0px', paddingRight: '0px' }}
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
