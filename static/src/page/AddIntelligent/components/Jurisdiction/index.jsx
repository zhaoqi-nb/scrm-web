/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { Button, Radio, Select, Tag, message } from 'antd'
import './index.less'
import { TRCheckboxModal } from '@Tool/components'
import Api from '../../service'
import { RADIO, options, initStaffData } from './helper'
export default function Jurisdiction({ onPress, data }) {

  const [radioValue, setRadioValue] = useState(1);
  const [selectValue, setSelectValue] = useState(1);
  const [treeData, setTreeData] = useState([]);
  const [staffValue, setStaffValue] = useState([]);
  const [staffOption, setStaffOption] = useState([]);


  const onChange = (e) => {
    setRadioValue(e.target.value)
  }
  const handelSelect = (e) => {
    setSelectValue(e)
  }
  useEffect(() => {
    fetchData();
  }, [])

  const handelSure = () => {
    if (radioValue === 2 && !staffValue.length) {
      message.error('添加员工不能为空')
      return;
    }
    const obj = { index: 1, permissionsFlag: radioValue, permissionsType: selectValue, permissionsMemberIdList: staffValue };
    onPress(obj)
  }

  const fetchData = async () => {

    const { diction = {} } = data;

    const res = await Api.getStaffData();
    if (res?.retCode === 200) {
      const data = initStaffData(res?.data?.list || []);
      setRadioValue(diction?.permissionsFlag || 0)
      setStaffValue(diction?.permissionsMemberIdList || [])
      setSelectValue(diction?.permissionsType || 0)
      setStaffOption(data?.enumObj || {})
      setTreeData(data.departList)
    }
  }
  const handelAdd = async () => {
    const result = await TRCheckboxModal.show({
      treeData: treeData,
      value: staffValue,
      title: '选择员工',
    })
    if (result.index === 1) {
      setStaffValue(result?.checkedKeys || [])
    }
  }
  const handelClose = (item) => {
    const data = staffValue?.filter((val) => val != item);
    setStaffValue(data);
  }

  const handelCancel = () => {
    onPress({ index: 0 })
  }
  return (
    <div className='Jurisdiction'>
      <div className="top">
        <div>流程可见范围</div>
        <div>
          <Radio.Group onChange={onChange} value={radioValue}>
            {RADIO?.map((item) => <Radio value={item?.key || ''}>{item?.title || ''}</Radio>)}
          </Radio.Group>
        </div>
      </div>
      {radioValue === 2 ? <div className="center">
        <div>成员选择</div>
        <div className='btnBox'><Button onClick={handelAdd}>+添加成员</Button>
          {staffValue?.length ? <div className='selectBox'>
            {staffValue?.map((item) => <Tag closable onClose={() => handelClose(item)}>{staffOption[item]?.name || ''}</Tag>)}
          </div> : null}
        </div>

      </div>
        : null}

      <div className='bottom'>
        <div></div>
        <div>
          {radioValue === 3 ? null : <Select options={options} value={selectValue} onChange={handelSelect} />}
        </div>
      </div>
      <div className="foot">
        <Button type='primary' onClick={handelSure}>确定</Button>
        <Button onClick={handelCancel}>取消</Button>
      </div>
    </div>
  )
}
