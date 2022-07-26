/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Tag, Button, message } from 'antd'
import './index.less'
import CustomTagNew from '../comments/publicView/customTagNew'
import { Ipone } from './components'
import Api from './service'
import { useHistory } from 'react-router-dom'
import * as action from '../GroupCode/store/action-type';

export default function TemplateChoose() {
  const { type, edit } = useSelector((state) => state.groupCode);
  const [name, setName] = useState('');
  const [guidance, setGuidance] = useState('');
  const [checkIndex, setCheckIndex] = useState(0);
  const [tagList, setTagList] = useState([]);
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    if (edit?.id) {
      setName(edit?.groupCodeName || '')
      setTagList(edit?.groupLabelList || [])
      setGuidance(edit?.introduction || '')
    }
  }, []);
  const TEMPLATE = [
    { imgSrc: 'https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/1%402x.png', title: '模板1' },
    { imgSrc: 'https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/2%402x.png', title: '模板2' },
  ]
  const renderItem = () => {
    return TEMPLATE?.map((item, index) => (
      <div
        className={`itemBox ${checkIndex === index ? 'checkItem' : ''}`}
        onClick={() => setCheckIndex(index)}
      >
        <div className="sanjiao"></div>
        <div className="dui">√</div>
        <div className='imgBox1'><img src={item?.imgSrc} /></div>
        <div>{item?.title || ''}</div>
      </div>
    ))
  }
  const handelChange = (data) => {
    setTagList(data?.tagList || [])
  }



  const handelFinish = async () => {
    let obj = {
      groupCodeName: name,
      groupCodeType: type,
      introduction: guidance,
      stencil: TEMPLATE?.[checkIndex]?.imgSrc || '',
      labelIds: tagList?.map((item) => item?.id || '')
    }
    if (edit?.id) {
      obj.id = edit?.id
    }
    if (!(name?.length) || !(guidance?.length)) {
      message.error('必填项不能为空');
      return;
    }
    let res = await Api.addCode(obj);
    if (res?.retCode === 200) {
      dispatch({
        type: action.SETCODEDATA,
        value: { codeData: res?.data }
      })
      dispatch({
        type: action.SETEDIT,
        value: { edit: { ...edit, groupLabelList: tagList, ...res?.data || {} }, type }
      })
      history.push('/TemplateSecond')
    }
  }
  const handelCancel = () => {
    dispatch({
      type: action.SETEDIT,
      value: { edit: {} }
    })
    history.push('/GroupCode')
  }
  return (
    <div className="templateContainer">
      <div className="title1">{edit?.id ? '编辑' : "新建"}{type == 2 ? '永久码' : '7天码'}</div>
      <div className="banner">基础信息</div>
      <div className="main">
        <div className="left">
          <div className="item">
            <div className="itemLeft"><span>*</span>群活码名称</div>
            <div className="itemRight">
              <Input
                placeholder='请输入群活码名称'
                maxLength={30}
                showCount
                value={name}
                onChange={(e) => setName(e?.target?.value || '')}
              /></div>
          </div>
          <div className="item">
            <div className="itemLeft">群标签</div>
            <div className="itemRight itemSpecial">
              <div className='top'><CustomTagNew
                value={{ tagList }}
                onChange={handelChange}
              /> <font>根据使用场景，给群打上相应的标签</font></div>
              {tagList?.length ? <div className="bottom">
                {tagList?.map((item) => <Tag>{item?.name || ''}</Tag>)}
              </div> : null}

            </div>
          </div>
          <div className="item">
            <div className="itemLeft"><span>*</span>引导语</div>
            <div className="itemRight">
              <Input
                placeholder='请输入引导语，将在页面顶部展示'
                maxLength={30}
                showCount
                value={guidance}
                onChange={(e) => setGuidance(e?.target?.value || '')}
              /></div>
          </div>
          <div className="item">
            <div className="itemLeft">活动模版</div>
            <div className="itemRight">
              {renderItem()}
            </div>
          </div>
        </div>
        <div className="right">
          <Ipone type={checkIndex} guidance={guidance} />
        </div>
      </div>
      <div className="templateBottom">
        <Button onClick={handelCancel}>返回</Button>
        <Button type='primary' onClick={handelFinish}>下一步，编辑企业微信群活码</Button>
      </div>
    </div>
  )
}
