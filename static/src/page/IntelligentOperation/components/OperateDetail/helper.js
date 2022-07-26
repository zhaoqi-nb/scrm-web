/* eslint-disable*/
import { Divider } from 'antd'

const GENERAL = [
    { name: '进入人次', color: '#0454B3', key: 'joinCount' },
    { name: '触发人次', color: '#00C5C4', key: 'triggerCount' },
    { name: '送达人次', color: '#FFAE00', key: 'deliveryCount' },
]

const generalObj = {
    yAxis: {
        type: 'value'
    },
}

export const initBarCharts = (data) => {
    const result = GENERAL?.map((item, index) => ({
        itemStyle: {
            color: item.color
        },
        value: data[index]
    }))
    const option = {
        ...generalObj,
        xAxis: {
            type: 'category',
            data: GENERAL?.map((item) => item?.name || ''),
            axisTick: { show: false }
        },
        series: [{ type: 'bar', data: result, barWidth: '28px' }]
    }
    return option
}


export const initLineCharts = (data) => {
    const result = GENERAL?.map((item) => ({
        ...item,
        type: 'line',
        data: data?.map((val) => val[item.key])
    }));
    const option = {
        ...generalObj,
        xAxis: {
            type: 'category',
            data: data?.map((item) => item?.cycleNumber || ''),
            axisTick: { show: false }
        },
        legend: { data: GENERAL, icon: 'roundRect', itemWidth: 15, itemHeight: 10 },
        series: result
    }
    return option;
}

const permissionsFlagObj = {
    1: '全部成员可见',
    2: '指定成员可见',
    3: '仅自己可见'
}

const permissionsTypeObj = {
    1: '可查看',
    2: '可编辑'
}

export const getJurisdiction = (permissionsFlag, permissionsType) => (<span>{permissionsFlagObj[permissionsFlag]}<Divider type='vertical' />{permissionsTypeObj[permissionsType]}</span>)