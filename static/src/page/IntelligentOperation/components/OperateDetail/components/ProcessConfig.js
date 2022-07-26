/* eslint-disable */
/**
 * 流程配置组件
 */
import React, { useEffect, useState } from 'react';
import Api from '../../../service'
import { Drawer } from '@Tool/components'
import { FlowCard, Jurisdiction, DateTime, FriendCircle, UpdateTag, CustomerMassSend, CustomerGroupMassSend, ClientAttribute, ClientEvent, UpdateClientAttr } from '../../../../AddIntelligent/components/index'
function ProcessConfig({ data }) {
  const [cardData, setCardData] = useState([]);
  const fetchData = async () => {
    const res = await Api.getDetail(data?.id || 0);
    if (res?.retCode === 200) {
      let list = res?.data?.smartMarketingNodeList || []
      list[0] = { ...list[0], attributeType: list[0]?.smartMarketingJson?.attributeType || 0, customerGroupId: list[0]?.smartMarketingJson?.customerGroupId || 0 }
      setCardData(list)
    }
  }
  useEffect(() => {
    fetchData()
  }, [JSON.stringify(data)]);

  const handelEdit = async (val) => {
    const code = 'edit';
    const generalObj = {
      renderCode: 'readOnly'
    }
    if (val.key == '2') {
      const reuslt = Drawer.show({ title: '客户属性判断', code, editData: val.smartMarketingJson, ...generalObj }, ClientAttribute)
    } else if (val.key == '3') {
      const result = await Drawer.show({ title: '客户事件判断', code, editData: val.smartMarketingJson, ...generalObj }, ClientEvent)
    } else if (val.key == '4') {
      const result = await Drawer.show({ title: '修改客户属性', code, editData: val.smartMarketingJson, ...generalObj }, UpdateClientAttr)
    } else if (val.key == '5') {
      const result = await Drawer.show({ title: '修改客户标签', code, editData: val.smartMarketingJson, ...generalObj }, UpdateTag);
    } else if (val.key == '6') {
      const result = await Drawer.show({ title: '企微群发任务', drawerData: val.smartMarketingJson, ...generalObj }, CustomerMassSend);
    } else if (val.key == '7') {
      const result = await Drawer.show({ title: '企微群群发任务', drawerData: val.smartMarketingJson, ...generalObj }, CustomerGroupMassSend);
    } else if (val.key == '8') {
      const result = await Drawer.show({ title: '企微朋友圈任务', radioType: val?.smartMarketingJson?.fileList?.[0]?.fileType || 1, code, editData: val.smartMarketingJson, ...generalObj }, FriendCircle);
    } else if (val.key == '9') {
      const result = await Drawer.show({ title: '指定日期或时间', code, editData: val.smartMarketingJson, ...generalObj, }, DateTime);
    } else if (val.key == '10') {
      const result = await Drawer.show({ title: '等待', renderKey: 'wait', code, editData: val.smartMarketingJson, ...generalObj }, DateTime);
    }
  }

  return (
    <div style={{ marginTop: 16 }} >
      {cardData?.map((item, index) =>
        <FlowCard
          code={'readOnly'}
          insertIndex={index}
          renderKey={item?.renderKey}
          handelEdit={handelEdit}
          data={{ ...item, renderCode: 'readOnly' }}
        />)}
    </div>
  )
}

export default ProcessConfig
