import React from 'react'
import moment from 'moment'
import './style.less'
import addPerson from '../../../image/addperson.png'
import editPerson from '../../../image/editPerson.png'

export const BANNER_ENUM = [
  { key: 'size', value: '总人数' },
  { key: 'memberSize', value: '内部成员' },
  { key: 'customerSize', value: '客户总数' },
]

export const TITLE_ENUM = [
  { key: 'joinCount', value: '今日新增', icon: <div className="iconBox" style={{ background: '#F5F7FA' }}><img src={addPerson} /></div> },
  { key: 'quitCount', value: '今日流失', icon: <div className="iconBox"><img src={editPerson} /></div> },
]

export const MEMBER_ENUM = [
  { value: '3', label: '客户总数' },
  { value: '1', label: '入群客户' },
  { value: '2', label: '退群客户' },
]

export const DEFAULT_SETTING = {

}

export const TITLEENUM = {
  memberName: '群成员名称',
  type: '成员类型',
  joinScene: '入群方式',
  joinTime: '入群时间',
}

export const TYPEEUNUM = {
  1: '内部成员',
  2: '客户'
}

export const JOINENUM = {
  1: '由群成员邀请入群',
  2: '通过链接入群',
  3: '通过扫描群二维码入群'
}
export const initTableData = (data) => {
  // const list = data?.list || [];
  const columns = Object.keys(TITLEENUM)?.map((item) => {
    const obj = {
      key: item,
      dataIndex: item,
      title: TITLEENUM?.[item] || ''
    }
    if (obj.key === 'memberName') {
      obj.render = (val, allVal) => <div className="imgBox">
        <img src={allVal?.avatar || ''} />
        {val}
        {[1, 2].indexOf(allVal?.customerType) > -1 && <div className="customer-type">@{allVal?.customerType == 1 ? '微信' : allVal?.corpName}</div>}
      </div>
    } else if (obj.key === 'joinScene') {
      obj.render = (val) => JOINENUM[val]
    } else if (obj.key === 'joinTime') {
      obj.render = (val) => moment(val).format('YYYY/MM/DD HH:mm')
    } else if (obj.key === 'type') {
      obj.render = (val) => TYPEEUNUM[val]
    }
    return obj;
  })
  const list = data?.list?.map((item) => ({ ...item, key: item?.memberId || '' }))
  return {
    columns,
    dataSource: list,
    tableInfo: data
  }
}

export const initChartsData = (data = []) => {
  const _data = data?.map((item) => ({
    ...item,
    xAxis: item?.recordDay || '',
    value: item?.memChangeCnt || 0
  }))
  const xAxisData = _data?.map((item) => item?.xAxis)
  return {
    grid: {
      width: '90%',
      height: '85%',
      left: '35',
      top: '15',
      bottom: '15',
      right: '35'
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#E1E8F0'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#595959',
        formatter: (val) => moment(Number(val)).format('MM/DD')
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        color: '#EFF3F7'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (val) => {
        const str = `<div>${val?.[0]?.marker || ''} ${val?.[0]?.value || 0}</div>
                <div style='color:#84888C;margin-left:18px'>${moment(Number(val?.[0]?.axisValue)).format('YYYY/MM/DD')}</div>`
        return str;
      }
    },
    series: { type: 'line', data: _data || [], color: '#6AAEFF' }
  }
}
