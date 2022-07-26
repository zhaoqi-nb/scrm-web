/* eslint-disable*/
import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import { Image } from 'antd'
export const initStaffData = (datas) => {
    let departList = []
    if (!datas || !datas.length) return departList;
    const resultData = [];
    const formaterMemberInfoList = (data) =>
        _.cloneDeep(data).map((v) => {
            const { memberInfoList, name, departName, id, qywxDepartName } = v
            v.key = id
            v.value = id
            v.title = departName || name || qywxDepartName
            v.label = departName || name || qywxDepartName
            if (name) {
                resultData.push(v);
            }
            // v.disabled = !permissionsFlag
            if (memberInfoList) v.children = formaterMemberInfoList(memberInfoList)
            // else v.children = []
            return v
        })
    departList = formaterMemberInfoList(datas)
    return { departList, resultData }
}

const TABLE_ENUM = {
    activityUrl: '群活码',
    groupCodeName: '群活码名称',
    groupCodeType: '群活码类型',
    customerCount: '入群客户数',
    createTime: '创建时间',
    createName: '创建人',
    failureTime: '失效时间'
}

const initText = (val) => {
    let text = ''
    if (val == 0) {
        text = '永久有效'
    } else {
        const isRed = moment(val).diff(moment(), 'day') >= 1;
        text = <span style={{ color: isRed ? 'black' : 'red' }} >{moment(Number(val)).format('YYYY-MM-DD HH:mm')}</span>
    }
    return text
}

export const initTableData = (data) => {
    const columns = Object.keys(TABLE_ENUM)?.map((item) => {
        let obj = {
            key: item,
            dataIndex: item,
            title: TABLE_ENUM?.[item] || '',
            width: 150,
        }
        if (item === 'groupCodeType') {
            obj.render = (val) => val == 1 ? '7天码' : '永久活码'
        } else if (item === 'createTime') {
            obj.width = 250
            obj.render = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')
        } else if (item === 'failureTime') {
            obj.render = (val) => {
                return initText(val)
            }
        } else if (item === 'createName') {
            obj.render = (val, allVal) => `${val}/${allVal?.departName || ''}`
        } else if (item === 'customerCount') {
            obj.render = (val) => val ? val : 0
        } else if (item === 'activityUrl') {
            obj.render = (val, allVal) => <Image src={allVal?.qrCodeUrl || ''} style={{ width: '50px', height: '50px' }} />
        }
        return obj
    })

    const dataSource = data?.map((item) => ({ ...item, key: item?.id || '' }))
    return {
        columns,
        dataSource
    }
}

export const initChartsData = (data = [], key) => {
    const _data = data?.map((item) => ({
        ...item,
        xAxis: item?.theDay || '',
        value: item?.[key] || 0
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
                // formatter: (val) => moment(Number(val)).format('MM/DD')
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
                <div style='color:#84888C;margin-left:18px'>${(val?.[0]?.axisValue)}</div>`
                return str;
            }
        },
        series: { type: 'line', data: _data || [], color: '#6AAEFF' }
    }
}
