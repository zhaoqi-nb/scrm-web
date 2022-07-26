/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import './style.less';
import LeftCard from './leftcard.jsx';
import RightCard from './rightcard.jsx';
import Api from '../../server'

function IndustryShare({ DetailInfo = {} }) {
  const [visible, setVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [chartsData, setChartsData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);





  // const showDrawer = () => {
  //     setVisible(true);
  // };
  const fetchData = async () => {
    setLeftLoading(true)
    const res = await Api.getDetail(DetailInfo.id);
    if (res?.retCode === 200) {
      setDetailData(res?.data)
      setLeftLoading(false)
    }
  }

  const fetchRightData = async (data = {}) => {
    setRightLoading(true)
    const res = await Api.getChartsData({ ...data, groupId: DetailInfo.id, });
    if (res?.retCode === 200) {
      setChartsData(res?.data || [])
      setRightLoading(false)
    }
  }

  const fetchTableData = async (data = {}) => {
    setRightLoading(true)
    let res = await Api.getTableData({ groupId: DetailInfo.id, ...data });
    if (res?.retCode === 200) {
      setTableData(res?.data || [])
      setRightLoading(false)
    }
  }

  useEffect(() => {
    if (DetailInfo?.id) {
      fetchData()
      fetchTableData({ pageSize: 5 })
      fetchRightData({
        type: 3,
      })
    }
    setVisible(DetailInfo.isVisible)
  }, [JSON.stringify(DetailInfo)])

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Drawer
      title="群聊详情"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={1000}
      className='draerIndustry'
    >
      <div className="industry">
        <div className="main">
          <LeftCard
            detailData={detailData}
            fetchData={fetchData}
            loading={leftLoading}
          />
          <RightCard
            chartsData={chartsData}
            fetchData={fetchRightData}
            tableData={tableData}
            fetchTableData={fetchTableData}
            loading={rightLoading}
          />
        </div>
      </div>
    </Drawer>
  );
}

export default IndustryShare;
