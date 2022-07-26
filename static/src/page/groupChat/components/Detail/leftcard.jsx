/* eslint-disable*/
import React, { useState } from 'react';
import {
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';
import './style.less';
import { Empty, RemarkModal } from '../index'
import { BANNER_ENUM, TITLE_ENUM } from './helper'
import Api from '../../server'
import { Spin, Drawer, Space } from 'antd'
import CustomTagNew from '../../../comments/publicView/customTagNew'
import RsIcon from '@RsIcon'
import StallInfo from '../../../conversatinStaff/comment/index'



function Left({ detailData, fetchData, loading }) {

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [optionDataRow, setOptionDataRow] = useState({});

  const renderBanner = () => BANNER_ENUM?.map(((item) => <div>
    <p>{detailData?.[item.key] || 0}</p>
    <p style={{ color: '#84888C' }}>{item?.value || ''}</p>
  </div>))

  const renderTop = () => TITLE_ENUM?.map((item) => <div className="todayBox">
    <div className="titles">
      {item?.icon}
      <span>{item?.value || ''}</span>
    </div>
    <div className="num">{detailData?.[item?.key] || 0}</div>
  </div>)

  const renderTags = () => {
    if (!(detailData?.labelVos?.length)) {
      return <Empty description={'暂无群标签'} />
    }
    return detailData?.labelVos?.map((item) => <div key={item?.id || ''} className='tagBox'>{item?.name || ''}</div>)
  }

  const handelTag = (data) => {
    const tagData = data?.tagList?.map((item) => item?.id || '')
    Api.hidTag({ groupIds: [detailData?.id || ''], labelIds: tagData }).then((res) => {
      if (res?.retCode === 200) {
        fetchData && fetchData()
      }
    })
  }
  const handelItem = (data) => {
    setOptionDataRow({ ...data, userId: data?.memberId, name: data?.memberName || '', openState: 1 })
    setDrawerVisible(true)
  }
  const renderDialogue = () => {
    if (!(detailData?.sessionMemberVoList?.length)) {
      return <Empty description={'群聊中暂无已开通会话存档的成员'} />
    }
    return detailData?.sessionMemberVoList?.map((item) => {
      return <div className="card" onClick={() => handelItem(item)}>
        <div>{item?.memberName || ''}</div>
        <div className="check">查看</div>
      </div>
    })
  }

  const renderMain = (key, message) => {
    if (!(detailData?.[key])) {
      return <Empty description={message} />
    }
    return detailData?.[key] || ''
  }

  const handelEditRemark = async () => {
    let res = await RemarkModal.show({ data: detailData?.remark || '' });
    if (res.index === 1) {
      let result = await Api.updateRemark({
        id: detailData?.id,
        remark: res?.value || ''
      })
      if (result?.retCode === 200) {
        fetchData && fetchData()
      }
    }
  }
  const onClose = () => {
    setDrawerVisible(false)
  }
  const renderResult = () => {
    if (loading) return <div className={'spinBox'}><Spin /></div>
    return (
      <>
        <Drawer
          title="存档详情"
          placement="right"
          width={912}
          closable={false}
          onClose={onClose}
          visible={drawerVisible}
          bodyStyle={{ padding: '0px' }}
          extra={
            <Space>
              <RsIcon onClick={onClose} type="icon-guanbi " className="f18" />
            </Space>
          }
        >
          {drawerVisible ? <StallInfo info={optionDataRow} /> : null}
        </Drawer>
        <div className="name">
          <div>
            <div>{detailData?.name || '-'}</div>
            <div className="username">
              <span className="iconUser">
                <UserOutlined />
              </span>
              <span> 群主：{detailData?.ownerName || '-'}</span>
            </div>
          </div>

          <div className="area">
            <div>所在地区</div>
            <div>{detailData?.provinceName || ''}-{detailData?.cityName || ''}-{detailData?.countyName || ''}-{detailData?.townName || ''}</div>
          </div>
        </div>
        <div className="today">
          {renderTop()}
        </div>
        <div className="allNum">
          {renderBanner()}
        </div>
        <div className="info">
          <div className="titleInfo">会话存档</div>
          <div className="mainCard">
            {renderDialogue()}
          </div>
          <div className="titleInfo">
            群标签
          <div className="edit">
              <CustomTagNew onChange={handelTag} value={{ tagList: detailData?.labelVos }}><EditOutlined /><span>编辑</span></CustomTagNew>
            </div>
          </div>
          <div className="editCard">
            {renderTags()}
          </div>
          <div className="titleInfo">群公告</div>
          <div className="notice">
            {renderMain('notice', '暂无群公告')}
          </div>
          <div className="titleInfo">
            群备注
          <div className="edit" onClick={handelEditRemark}>
              <EditOutlined />
              <span>编辑</span>
            </div>
          </div>
          <div className="notice">
            {renderMain('remark', '暂无群备注')}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="left">
      {renderResult()}
    </div>
  );
}

export default Left;
