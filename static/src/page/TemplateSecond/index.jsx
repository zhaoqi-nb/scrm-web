/* eslint-disable*/

import React, { useEffect, useState } from 'react'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { AddCodeModal, AddGroupModal } from './components'
import Api from './service'
import { Tag, Button, message } from 'antd'
import { initColumns, initStaffData } from './helper'
import { BaseTable } from 'ali-react-table';
import { TRCheckboxModal } from '@Tool/components'
import { useHistory } from 'react-router-dom'

export default function TemplateSecond() {
  const { type, codeData, edit } = useSelector((state) => state.groupCode);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [staffValue, setStaffValue] = useState([]);
  const [staffNodes, setStaffNodes] = useState([]);
  const history = useHistory()


  const handelAdd = async () => {
    const result = await AddCodeModal.show({ type, id: codeData?.id })
    if (result?.index === 1) {
      fetchData(codeData?.id)
    }
  }

  const columnsMore = () => {
    return {
      code: 'operate',
      title: <span style={{ fontSize: '12px' }}>操作</span>,
      render: (val, allVal) => {
        return (<div className='baseTable'>
          {initOperate(allVal?.flag, allVal)}
        </div>)
      }
    }
  }

  const handelEdit = async (data) => {
    if (type == 2) {
      const result = await AddCodeModal.show({ editData: data, id: codeData?.id });
      if (result.index === 1) {
        fetchData()
      }
    } else {
      const result = await AddGroupModal.show({ editData: data, id: codeData?.id });
      if (result.index === 1) {
        fetchData()
      }
    }
  }

  const handelDelete = async (data) => {
    const res = await Api.deleteFn({
      id: data?.id || '',
      activityCodeId: codeData?.id || ''
    })
    if (res?.retCode === 200) {
      fetchData()
    }
  }

  const handelStop = async (data) => {
    const res = await Api.stopFn({
      id: data?.id || '',
      activityCodeId: codeData?.id || ''
    })
    if (res?.retCode === 200) {
      fetchData()
    }
  }
  const initOperate = (type, allVal) => {
    if (type == 0) {
      return (
        <>
          <a onClick={() => handelEdit(allVal)}>编辑</a>
          <a onClick={() => handelDelete(allVal)}>删除</a>
        </>
      )
    } else if (type == 1) {
      return <>
        <a onClick={() => handelStop(allVal)}>停用</a>
        <a style={{ color: 'black' }}>-</a>
      </>
    } else {
      return <>
        <a style={{ color: 'black' }}>-</a>
        <a style={{ color: 'black' }}>-</a>
      </>
    }
  }

  const fetchCreator = async () => {
    let res = await Api.getCreatorData();
    if (res?.retCode === 200) {
      const data = initStaffData(res?.data || []);
      setStaffData(data?.departList || [])
    }
  }

  const fetchData = async () => {
    let res = await Api.getDetailTable(codeData?.id);
    if (res?.retCode === 200) {
      const dataSource = res?.data?.qwCodeGroupList
      const data = initColumns(dataSource, type)
      setColumns([...data?.columns, columnsMore()])
      setDataSource(data?.dataSource || [])
      const staffValue = res?.data?.memberVoList?.map((item) => item?.id || '')
      setStaffValue(staffValue)
      setStaffNodes(res?.data?.memberVoList)
    }
  }

  const handelAddPerson = async () => {
    const result = await TRCheckboxModal.show({
      treeData: staffData,
      value: staffValue || [],
      title: '选择员工'
    })
    if (result.index === 1) {
      setStaffNodes(result?.checkedNodes || [])
      setStaffValue(result?.checkedKeys || [])
    }
  }

  useEffect(() => {
    fetchData()
    fetchCreator()
  }, []);

  const handelFinish = async () => {
    if (dataSource?.length == 0) {
      message.error('表格存在空项');
      return;
    }
    if (staffValue?.length > 5) {
      message.error('备用员工最多选择5个');
      return;
    }
    let res = await Api.addCode({
      id: codeData?.id,
      memberIds: staffValue?.join(',')
    });
    if (res?.retCode === 200) {
      history.push('/GroupCode')
    }
  }

  const handelGroupAdd = async () => {
    let result = await AddGroupModal.show({ type, id: codeData?.id })
    if (result?.index === 1) {
      fetchData(codeData?.id)
    }
  }
  const handelCancel = () => {
    history.push('/TemplateChoose')
  }
  return (
    <div className='TemplateSecond'>
      <div className="title">
        {edit?.id ? '编辑' : '新建'}{type == 2 ? '永久码' : '7天码'}
      </div>
      <div className="banner">客户群管理</div>
      <div className="bottom">
        <div className="bottomFirst">
          {
            type == 2 ? <div onClick={handelAdd} className='add-form-btn'>+添加企业微信活码</div> : <div onClick={handelGroupAdd} className='add-form-btn'>+添加群二维码</div>
          }

          <div>用户扫码后，会按下面配置客户群顺序入群，最多添加200个客户群</div>
        </div>
        <div className="bottomTable">
          <BaseTable
            style={{
              height: '280px',
              overflow: 'auto',
              '--font-size': '12px',
              '--header-bgcolor': '#F5F7FA',
              '--cell-border': 'none',
              '--cell-border-horizontal': '1px solid #EDF1F6',
              '--header-cell-border': 'none',
              '--header-cell-border-horizontal': '1px solid #EDF1F6'
            }}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
        <div className="bottomLast">
          <div>备用员工</div>
          <div className='add' onClick={handelAddPerson} className='add-form-btn'>+添加员工</div>
          <div>群码过期或群人数已满时，客户可通过添加备用员工后入群，如不设置则默认添加群列表中的第一个群主</div>
        </div>
        {staffNodes?.length ? <div className="bottomBox">
          {staffNodes?.map((item) => <Tag>{item?.name || ''}</Tag>)}
        </div> : null}
      </div>
      <div className="lastOne">
        <Button onClick={handelCancel}>返回</Button>
        <Button type='primary' onClick={handelFinish}>保存群活码</Button>
      </div>
    </div>
  )
}
