/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import './index.less'
import { Input, Button, Collapse, message, Modal } from 'antd'
import RsIcon from '@RsIcon'
import { useHistory } from 'react-router-dom'
import RsModal from '@Tool/components/RsModal'
import { Drawer } from '@Tool/components'
import { MENU } from './helper'
import { useSelector, useDispatch } from 'react-redux'
import { Jurisdiction, FlowCard, DateTime, FriendCircle, UpdateTag, CustomerMassSend, CustomerGroupMassSend, ClientAttribute, ClientEvent, UpdateClientAttr } from './components'
import Api from './service'
import * as action from '../IntelligentOperation/store/action-type';


export default function AddIntelligent() {
  const { Panel } = Collapse;
  const [collapseVisible, setCollapseVisible] = useState(false);
  const [cardData, setCardData] = useState([{ renderKey: 1, data: {} }]);
  const [insert, setInsert] = useState(0);
  const [diction, setDiction] = useState({ permissionsFlag: 1, permissionsMemberId: [], permissionsType: 1 }); //权限
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const history = useHistory()
  const reducer = useSelector((state) => state.IntelligentOperation);
  const dispatch = useDispatch()

  useEffect(() => {
    if (reducer?.edit?.id) {
      fetchData()
    }
  }, [JSON.stringify(reducer)]);


  const fetchData = async () => {
    const res = await Api.getDetail(reducer?.edit?.id);
    let list = res?.data?.smartMarketingNodeList || [];
    setInputValue(res?.data?.operatingTitle || '')
    list[0] = { ...list[0], attributeType: list[0]?.smartMarketingJson?.attributeType || 0, customerGroupId: list[0]?.smartMarketingJson?.customerGroupId || 0 }
    setDiction(res?.data || {})
    setCardData(list)
  }
  const handelPanel = async (val) => {
    let arr = [...cardData];
    const code = val?.code ? val?.code : 'add';
    const _spliceIndex = code == 'add' ? 0 : 1
    const _index = code == 'add' ? insert + 1 : val.insertIndex;
    const generalObj = {
      nodeType: val.parentKey,
      actionType: val.key - 1,
      nodeName: val.title
    }
    if (val.key == '2') {
      const result = await Drawer.show({ title: '客户属性判断', code, editData: val.smartMarketingJson }, ClientAttribute)
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result, renderKey: 2, })
        const res = await Api.getPerson({ smartMarketingNodeList: arr })
        if (res?.retCode == 200) {
          arr[_spliceIndex + 1] = { ...arr[_spliceIndex + 1], count: res?.data?.count || 0 }
        }
      }
    } else if (val.key == '3') {
      const result = await Drawer.show({ title: '客户事件判断', code, editData: val.smartMarketingJson }, ClientEvent)
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result, renderKey: 3, })
        const res = await Api.getPerson({ smartMarketingNodeList: arr })
        if (res?.retCode == 200) {
          arr[_spliceIndex + 1] = { ...arr[_spliceIndex + 1], count: res?.data?.count || 0 }
        }
      }
    } else if (val.key == '4') {
      const result = await Drawer.show({ title: '修改客户属性', code, editData: val.smartMarketingJson }, UpdateClientAttr)
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result, renderKey: 4 });
      }
    } else if (val.key == '5') {
      const result = await Drawer.show({ title: '修改客户标签', code, editData: val.smartMarketingJson }, UpdateTag);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 5 })
      }
    } else if (val.key == '6') {
      const result = await Drawer.show({ title: '企微群发任务', drawerData: val.smartMarketingJson }, CustomerMassSend);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 6, })
      }
    } else if (val.key == '7') {
      const result = await Drawer.show({ title: '企微群群发任务', drawerData: val.smartMarketingJson }, CustomerGroupMassSend);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 7, })
      }
    } else if (val.key == '8') {
      const result = await Drawer.show({ title: '企微朋友圈任务', radioType: val?.smartMarketingJson?.fileList?.[0]?.fileType || 1, code, editData: val.smartMarketingJson }, FriendCircle);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 8, })
      }
    } else if (val.key == '9') {
      const result = await Drawer.show({ title: '指定日期或时间', code, editData: val.smartMarketingJson, }, DateTime);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 9, })
      }
    } else if (val.key == '10') {
      const result = await Drawer.show({ title: '等待', renderKey: 'wait', code, editData: val.smartMarketingJson, }, DateTime);
      if (result.index === 1) {
        arr.splice(_index, _spliceIndex, { ...generalObj, ...val, smartMarketingJson: result || {}, renderKey: 10, })
      }
    }
    setCardData(arr)
    setIsEdit(true);
    setCollapseVisible(false)
  }


  const renderPanel = () => MENU?.map((item) => <Panel key={item?.key || ''} header={item?.title || ''}>
    {item?.children?.map((val) => <div
      className="panelTitle"
      style={{ background: item?.background || '' }}
      onClick={() => handelPanel(val)}
    >{val?.icon || ''}{val?.title || ''}</div>)}
  </Panel>)
  const onChange = () => {

  }

  const handelAdd = ({ renderKey, insertIndex }) => {
    setCollapseVisible(true)
    setInsert(insertIndex)
  }

  const handelJurisdiction = async () => {
    const result = await RsModal.show({ title: '权限设置', width: 527, diction }, Jurisdiction);
    if (result.index === 1) {
      setDiction(result)
    }
  }
  const handelReset = () => {
    dispatch({
      type: action?.SETEDIT,
      value: { edit: {} }
    })
  }
  const handelBack = () => {
    if (!isEdit) {
      history.push('/IntelligentOperation');
      handelReset()
      return;
    }
    Modal.confirm({
      content: "您的流程还未保存，是否保存草稿后推出",
      title: '提示',
      onOk: async () => {
        handelSave(true);
        handelReset()
      },
      onCancel: () => {
        history.push('/IntelligentOperation')
        handelReset()
      },
      okText: '保存草稿',
      cancelText: '不保存'
    })
  }

  const handelEdit = (data, key, insertIndex) => {
    setInsert(insertIndex)
    handelPanel({ ...data, key, code: 'edit', insertIndex })

  }

  const handelFirst = (data) => {
    let arr = [...cardData];
    if (data.index === 1) {
      arr[0] = { ...arr[0], ...data.obj, renderKey: 1, nodeType: 1, nodeName: 'default', smartMarketingJson: { ...data.obj, eventList: [data?.obj?.screens || []], attributeLists: [data?.obj?.screens || []] } };
      setCardData(arr)
    }
  }
  const handelDelete = (e, data) => {
    e.stopPropagation()
    Modal.confirm({
      content: "您确认要删除此节点",
      title: '删除提示',
      onOk: async () => {
        const arr = cardData.filter((item, index) => data != index);
        setCardData(arr)
      },
      onCancel: () => {
      },
      okText: '删除',
      cancelText: '取消'
    })

  }

  const handelSave = async (isCancel = false) => {
    const obj = {
      ...diction,
      operatingTitle: inputValue,
      ...cardData[0],
      operatingStatus: 1,
      smartMarketingNodeList: cardData
    }
    const res = await Api.saveMarketing(obj);
    if (res?.retCode === 200) {
      message.success('保存草稿成功')
      setEditId(res?.data?.id || 0)
      setIsEdit(false)
      handelReset()
      if (isCancel) { history.push('/IntelligentOperation') }
    }
  }

  const handelIssue = async () => {
    const obj = {
      id: editId,
      ...diction,
      operatingTitle: inputValue,
      ...cardData[0],
      operatingStatus: 2,
      smartMarketingNodeList: cardData
    }
    setIsEdit(false)
    const res = await Api.saveMarketing(obj);
    if (res?.retCode === 200) {
      message.success('发布成功')
      history.push('/IntelligentOperation')
      handelReset()
    }
  }
  return (
    <div className="AddIntelligent">
      <div className="top">
        <div className="backBox" onClick={handelBack}><RsIcon type="icon-jiantouzuo" />返回列表</div>
        <div className="inputBox"><Input placeholder="请输入营销计划标题" showCount maxLength={20} value={inputValue} onChange={(e) => setInputValue(e.target.value)} /></div>
        <div className="jurisdiction"><Button icon={<RsIcon type="icon-quanxianguanli" />} onClick={handelJurisdiction}>权限</Button></div>
        <div className="topLast">
          <Button onClick={() => handelSave()}>保存草稿</Button>
          <Button type="primary" onClick={handelIssue}>发布计划</Button>
        </div>
      </div>
      <div className="bottom">

        {collapseVisible ? <div className="bottomLeft"><Collapse defaultActiveKey={['1', '2', '3']} onChange={onChange} ghost>{renderPanel()}</Collapse> </div> : null}

        <div className="bottomRight">
          {cardData?.map((item, index) =>
            <FlowCard
              handelFirst={handelFirst}
              handelDelete={handelDelete}
              insertIndex={index}
              renderKey={item?.renderKey}
              handelAdd={handelAdd}
              handelEdit={handelEdit}
              data={item}
            />)}
        </div>
      </div>
    </div>
  )
}
