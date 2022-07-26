import React, { useState, useEffect } from 'react'

// 公共组件

import ChartsDiv from '@Public/Charts'
import { ConfigProvider, Image } from 'antd'

/** *
 * data是一个二维数组 [[xAxis.data],[series.data]]
 *
 * ** */
export default function LineChart({ data, subtext, emptyText, title, ...props }) {
  const [config, setConfig] = useState({})
  const [customize, setCustomize] = useState(true)
  const lineConfig = {
    title: {
      subtext: '',
      left: 'center',
      // top: 'center',
      subtextStyle: {
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'bolder',
        color: '#262626',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (val) => `<div>${val?.[0]?.name || ''}</div><div>${subtext}:${val?.[0]?.value || 0}</div>`,
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '1%',
      containLabel: true,
      ...props.grid,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
      nameTextStyle: {
        verticalAlign: 'bottom', //  'top'  'middle' 'bottom'
        // 上 右 下 左
        padding: [0, 20, 0, 0],
      },

      ...props.yAxis,
    },
    series: [
      {
        data: [],
        type: 'line',
      },
    ],
  }
  if (subtext) {
    lineConfig.title.subtext = subtext
  }
  useEffect(() => {
    if (props.config) {
      setCustomize(false)
      setConfig(props.config)
    } else if (data.length > 0 && data[0].length > 0 && data[1].length > 0) {
      // lineConfig 是一个全局的千万别push 如果要push 请在push之前置空
      lineConfig.xAxis.data = [...data[0]]
      lineConfig.series[0].data = [...data[1]]
      setCustomize(false)
      setConfig({ ...lineConfig })
    } else {
      setCustomize(true)
    }
  }, [])

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Image width={90} height={89} preview={false} src={require('../image/empty.png')} />
      <p style={{ paddingTop: 10 }}>{emptyText || '暂无数据'}</p>
    </div>
  )
  return (
    <ConfigProvider renderEmpty={customize && customizeRenderEmpty}>
      <ChartsDiv config={config} className="border1" />
    </ConfigProvider>
  )
}
