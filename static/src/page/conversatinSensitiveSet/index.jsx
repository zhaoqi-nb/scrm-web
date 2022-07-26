import React, { useState, useEffect } from 'react'
import { Button, Input, message, Modal, Tooltip } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory } from 'react-router-dom'

import PulicTable from '../comments/publicView/table'
import TableDropDown from '../comments/publicView/tableDropDown'
import Api from './store/api'

function TableIndex() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [keyWord, setkeyWord] = useState('')
  const { confirm } = Modal
  const getData = (pageNo = 1, pageSize = 10) => {
    setLoading(true)
    const data = {
      pageNo,
      pageSize,
    }
    if (keyWord) {
      data.keyWord = keyWord
    }
    Api.getSensitiveInfoList(data)
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
    setkeyWord(value)
  }

  /** 页面渲染处理* */
  const history = useHistory() // 路由处理

  const goConversatinSensitiveOptionSet = (id) => {
    const stateObj = {
      id,
    }
    if (stateObj.id) {
      history.push({ pathname: '/conversatinSensitiveOptionSet', state: stateObj })
    } else {
      history.push({ pathname: '/conversatinSensitiveOptionSet' })
    }
  }
  const renderEmptyBtn = () => (
    <Button
      type="primary"
      onClick={() => {
        goConversatinSensitiveOptionSet()
      }}
    >
      添加敏感词
    </Button>
  )

  const delCustom = (data) => {
    confirm({
      title: '删除提示',
      icon: '',
      content: '确认删除此敏感词组？敏感词组中包含的敏感词将被全部删除！',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      wrapClassName: 'delcustomer-confirm',
      onOk() {
        return Api.deleteSensitiveInfo(data).then((res) => {
          if (res.retCode == 200) {
            message.success('操作成功', 1, () => {
              getData()
            })
          }
        })
      },
      onCancel() {
        return false
      },
    })
  }
  const optionButtonList = [
    // {
    //   label: '数据统计',
    //   clickFN: (data) => {
    //     console.log(data, '----rowData---')
    //   },
    // },
    {
      label: '编辑',
      clickFN: (data) => {
        goConversatinSensitiveOptionSet(data.id)
      },
    },
    {
      label: '删除',
      clickFN: (data) => {
        delCustom(data)
      },
    },
  ]

  const columns = [
    {
      title: '敏感词组',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (textList) => (
        <div className="text-ellipsis pointer" title={textList} style={{ width: '100px' }}>
          {textList}
        </div>
      ),
    },
    {
      title: '包含敏感词',
      dataIndex: 'sensitiveMatchWordRefs',
      key: 'sensitiveMatchWordRefs',
      width: 300,
      render: (list) => {
        const textList = (list || []).join('、')
        return (
          <Tooltip placement="topLeft" title={textList} arrowPointAtCenter>
            <div className="text-ellipsis pointer" style={{ width: '200px' }}>
              {textList}
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: '检测范围',
      dataIndex: 'sensitiveAuditScopeRefs',
      key: 'sensitiveAuditScopeRefs',
      render: (list) => {
        let textList = (list || []).map((item) => item.memberName)
        textList = textList.join('、 @')
        return (
          <Tooltip placement="topLeft" title={textList} arrowPointAtCenter>
            <div className="text-ellipsis pointer" style={{ width: '200px' }}>
              {`@${textList}`}
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: '通知接收人',
      dataIndex: 'sensitiveAuditScopeRefs',
      key: 'sensitiveAuditScopeRefs',
      render: (list) => {
        let textList = (list || []).map((item) => item.memberName)
        textList = textList.join('、 @')
        return (
          <Tooltip placement="topLeft" title={textList} arrowPointAtCenter>
            <div className="text-ellipsis pointer" style={{ width: '280px' }}>
              {`@${textList}`}
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: '存档状态',
      dataIndex: 'messageNoticeFlag',
      key: 'messageNoticeFlag',
      render: (text) => {
        if (text == 1) {
          return (
            <div className="flex-box middle-a">
              <div className="bg-success mr10 radius4" style={{ width: '8px', height: '8px' }} /> 开启
            </div>
          )
        }
        return (
          <div className="flex-box middle-a">
            <div className="bg-tip2 mr10 radius4" style={{ width: '8px', height: '8px' }} /> 关闭
          </div>
        )
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',

      render: (text, rowData, index) => (
        <TableDropDown rowData={rowData} rowKey={index} showNum={3} items={optionButtonList} />
      ),
    },
  ]

  return (
    <div>
      <div className="mt8 mb16">
        <div className="flex-box middle-a full-w flex-between ">
          <div className="titleText">敏感词设置</div>
          {renderEmptyBtn()}
        </div>
        <div className="flex-box middle-a full-w">
          <div>
            <Input
              suffix={<RsIcon onClick={() => handleSearchEvent()} type="icon-sousuo" />}
              className="input-search"
              style={{ width: '240px' }}
              placeholder="请输入要敏感词、或者敏感词组"
              onPressEnter={() => handleSearchEvent()}
              onChange={(e) => handleChangeName(e.target.value)}
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
        // scroll={{ x: 1300 }}
        emptyText="您还没有添加敏感，快去新建吧！"
        renderEmptyBtn={renderEmptyBtn}
      />
    </div>
  )
}

export default TableIndex
