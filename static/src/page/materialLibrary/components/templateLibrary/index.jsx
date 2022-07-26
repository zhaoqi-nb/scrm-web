/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import './index.less'
import { TYPEENUM, } from './helper'
import Api from '../../service'
import { GroupModal, Table } from '../index'
import { useSelector } from 'react-redux'
import RsIcon from '@RsIcon'


export default function TemplateLibrary({ checkKey }) {
  const { type } = useSelector((state) => state.materialLibrary);
  const [tabsKey, seTabsKey] = useState(String(type)?.length ? type : TYPEENUM?.[0]?.key || '')
  const [groupData, setGroupData] = useState([])
  const [selectGroup, setSelectGroup] = useState('0')

  useEffect(() => {
    fetchData()
  }, [checkKey, tabsKey])


  const fetchData = async (types = tabsKey) => {
    const res = await Api.getGroupList({ dataType: checkKey, materialType: types });
    if (res?.retCode === 200) {
      setSelectGroup('0')
      setGroupData(res?.data || [])
    } else {
      message.error(res?.retMsg || '')
    }
  }

  const renderTabs = () => TYPEENUM.map((item) =>
    <div
      className={`${tabsKey == item?.key ? 'checked' : ''}`}
      onClick={() => seTabsKey(item.key)}
    >{item?.name}
    </div>
  )
  const handelGroup = (data) => {
    setSelectGroup(data?.id || '')
  }

  const renderGroup = () => {
    return groupData?.map((item) =>
      <div
        key={item?.id || ''}
        onClick={() => handelGroup(item)}
        className={`${selectGroup === item?.id ? 'selectCheck' : 'groupSelect'}`}
      >
        <div>{item?.name || ''}</div>
        {item?.id != 0 ? <div className='editGroup'>
          <RsIcon onClick={() => handelAddOrEditGroup(item)} type="icon-bianji1" />
          <RsIcon onClick={() => handelDelete(item)} type="icon-shanchu" />
        </div> : null}
      </div>

    )
  }

  const handelDelete = async (data) => {
    Modal.confirm({
      content: "删除分组后分组中的素材都会被删除，确定要删除吗",
      title: '删除提示',
      onOk: async () => {
        let res = await Api.deleteGroupList({ id: data?.id || '' });
        if (res?.retCode === 200) {
          fetchData()
          message.success('删除成功')
        } else {
          message.error('删除失败')
        }
      },
      okText: '删除',
      cancelText: '取消'
    })
  }

  const handelAddOrEditGroup = async (data) => {
    const status = data?.id ? 'update' : 'add';
    const TITLE = {
      'update': '编辑',
      'add': '添加'
    }
    let result = await GroupModal.show({ code: status, data, checkKey });
    if (result.index === 1) {
      let requestObj = {
        dataType: checkKey,
        materialType: tabsKey,
        name: result?.value || '',
        deptList: result?.treeValue || [],
        scope: result?.radioValue || null
      }
      if (status === 'update') { requestObj.id = data?.id || '' }
      let res = await Api.addGroupList(requestObj);
      if (res?.retCode === 200) {
        fetchData()
        message.success(`${TITLE[status]}成功`)
      } else {
        message.error(`${TITLE[status]}失败`)
      }
    }
  }
  return (
    <div className="templateLibrary">
      <div className="banner">{renderTabs()}</div>
      <div className="main">
        <div className="left">
          <div className="leftTop">
            <div>全部分组({groupData?.length || 0})</div>
            <div onClick={handelAddOrEditGroup}>+</div>
          </div>
          <div className="leftBottom">
            {renderGroup()}
          </div>
        </div>
        <div className="right">
          <Table
            globalData={{
              tabsKey,
              categoryId: selectGroup,
              dataType: checkKey
            }}
          />
        </div>
      </div>
    </div>
  )
}
