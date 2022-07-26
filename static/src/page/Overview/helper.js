/* eslint-disable*/
import React from 'react'
import { BarsOutlined, GlobalOutlined, BarChartOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import './index.less'
const initalStyle = 'background:blue;width:10px;display:inline-block;height:10px;border-radius:50%;margin-right:10px'
const initalDivStyle = 'display:flex;align-items:center;margin-bottom:5px'

const initalSeries = {
    type: 'bar',
    data: []
}
export const BANNER = [
    { icon: 'icon-kehuguanli', title: '客户群数', code: 'groupCount', add: 'newGroupCount', },
    { icon: 'icon-shujutongji-xiangkehufaqihaoyoushenqing', title: '已入群客户数', code: 'groupCustomerSum', add: 'newGroupCustomerSum', minus: 'lostGroupCustomerSum', background: 'rgba(6,120,255,0.1)', color: 'blue' },
    { icon: 'icon-yijicaidan-gerenzhongxin', title: '成员数', code: 'memberSum', background: 'rgba(255, 186, 0, 0.1)', color: '#FFBA00' }
]
export const TYPE = [
    { type: 'map', icon: <GlobalOutlined /> },
    { type: 'zhu', icon: <BarChartOutlined /> },
    { type: 'table', icon: <BarsOutlined /> },
]
export const initChartsOption = (data) => {
    const LEGEND = [{ name: '客户群' }, { name: '入群客户' }, { name: '成员' }]
    let SERIES = [
        { ...initalSeries, name: '客户群', color: '#0454B3', key: 'groupCount', data: [] },
        { ...initalSeries, name: '入群客户', color: '#00C5C4', key: 'customerSize', data: [] },
        { ...initalSeries, name: '成员', color: '#FFAE00', key: 'memberSize', data: [] }
    ]
    let xAxis = [];
    data?.map((item) => {
        const key = Object.keys(item)?.[0];
        const obj = item?.[key] || {};
        xAxis.push(key)
        SERIES?.map((val, index) => {
            // obj[val.key] 
            SERIES[index].data.push({ name: key, value: obj[val.key] })
        })
    })
    return {
        legend: {
            type: 'plain',
            show: true,
            data: LEGEND,
            top: 20,
            left: 'center'
        },
        dataZoom: [{ type: 'slider' }, { type: 'inside' }],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            formatter(e, t, n) {
                let str = `<div style='color:white'>${e?.[0]?.axisValue || '-'}</div>`;
                e?.map((item) => {
                    str += `<div style='color:white'> ${item?.marker || ''} ${item?.seriesName || ''}:${item?.value || 0}</div>`
                })
                return str
            }
        },
        grid: {
            width: '96%',
            height: '75%',
            left: '35',
            top: '55',
            bottom: '15',
            right: '35'
        },
        xAxis: {
            type: 'category',
            data: xAxis,
            axisLine: {
                lineStyle: {
                    color: '#E1E8F0'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#595959'
            }
        },
        yAxis: {
            name: '总量',
            type: 'value',
            axisLine: {
                show: false
            },
            splitLine: {
                color: '#EFF3F7'
            },

        },
        series: SERIES
    }
}

export const initMapOption = (data) => {
    let obj = {}
    const _data = data?.map((item, index) => {

        const key = Object.keys(item)?.[0]
        obj[key] = item[key];
        return {
            name: key,
            value: item[key]?.customerSize || 0,
            data: item[key]?.customerSize || 0,
            ...item[key]
        }
    })
    return {
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        grid: {
            // right: '2%',
            // top: '0',
            // height: '20%',
            bottom: '50%',
            // width: '18%',
        },
        tooltip: {
            triggerOn: 'mousemove',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            formatter(e, t, n) {
                const name = e?.name || ''
                return `<div style='color:white;box-sizing:border-box;padding:10px'>
                    <div style='margin-bottom:10px'>${name}</div>
                    <div style='${initalDivStyle}'><span style='${initalStyle};background:#6AAEFF'></span><span  style='display:inline-block;width:80px'>客户数:</span>${obj[name]?.customerSize || 0}</div>
                    <div style='${initalDivStyle}'><span style='${initalStyle};background:#00C5C4'></span><span  style='display:inline-block;width:80px'>客户群数:</span>${obj[name]?.groupCount || 0}</div>
                    <div style='${initalDivStyle}'><span style='${initalStyle};background:#6AAEFF'></span><span style='display:inline-block;width:80px'>成员数:</span>${obj[name]?.memberSize || 0}</div>
                </div>`
            }
        },

        visualMap: {
            // min: 0,
            // max: 1000,
            // left: 26,
            // bottom: 45,/
            showLabel: !0,
            text: ["高", "低"],
            pieces: [{
                gte: 1,
                lt: 10000,
                label: "客户数1-10000",
                color: "#9BC9FF"
            }, {
                gt: 10000,
                lte: 50000,
                label: "客户数10000-50000",
                color: "#51A0FF"
            }, {
                gt: 50000,
                lte: 100000,
                label: "客户数50000-100000",
                color: "#0678FF"
            }, {
                gt: 100000,
                label: "客户数大于100000",
                color: "#0453B2"
            }],
        },
        geo: {
            map: 'china',
            roam: !1,
            nameMap: {
                '北京': '北京市',
                '天津': '天津市',
                '上海': '上海市',
                '云南': '云南省',
                '内蒙古': '内蒙古自治区',
                '吉林': '吉林省',
                '四川': '四川省',
                '宁夏': '宁夏回族自治区',
                '安徽': '安徽省',
                '山东': '山东省',
                '山西': '山西省',
                '广东': '广东省',
                '广西': '广西壮族自治区',
                '新疆': '新疆维吾尔自治区',
                '江苏': '江苏省',
                '江西': '江西省',
                '河北': '河北省',
                '河南': '河南省',
                '浙江': '浙江省',
                '海南': '海南省',
                '湖北': '湖北省',
                '湖南': '湖南省',
                '甘肃': '甘肃省',
                '福建': '福建省',
                '西藏': '西藏自治区',
                '贵州': '贵州省',
                '辽宁': '辽宁省',
                '台湾': '台湾省',
                '重庆': '重庆市',
                '陕西': '陕西省',
                '青海': '青海省',
                '黑龙江': '黑龙江省'
            },
            scaleLimit: {
                min: 1,
                max: 2
            },
            zoom: 1.15,
            center: [105.83531246, 34.0267395887],
            top: 60,
            label: {
                show: false,
                normal: {
                    show: !0,
                    fontSize: '0',
                    color: 'rgba(0,0,0,0.7)'
                }
            },
            select: {
                itemStyle: {
                    areaColor: "#50A0FF",
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#E1E8F0',
                    // shadowBlur: 50,
                    // shadowColor: '#E1E8F0',
                    borderColor: 'black'
                },
                emphasis: {
                    areaColor: '#50A0FF',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    borderWidth: 0
                }
            }
        },
        series: [{
            name: '2015-2017年水果总产量均值（万吨）',
            type: 'map',
            geoIndex: 0,
            data: _data,
        }]

    };
}


const COLUMNS = {
    leader3NameList: '后台小组长',
    leader2NameList: '后台大组长',
    leader1NameList: '联络组长',
    regionName: '所属地区',
    groupCount: '客户群数',
    memberSize: '已入群客户数',
    customerSize: '成员数'
}
export const initColumns = (data = []) => {
    const columns = Object.keys(COLUMNS)?.map((item) => {
        let obj = {
            key: item,
            dataIndex: item,
            title: COLUMNS?.[item] || ''
        }
        if (item === 'leader3NameList' || item === 'leader2NameList' || item === 'leader1NameList') {
            obj.render = (val) => <Tooltip title={val?.join(',')} placement='topLeft'><div className='textDix'>{val?.join(',')}</div></Tooltip>
        }
        return obj
    })

    return columns
}