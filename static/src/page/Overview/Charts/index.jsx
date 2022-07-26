/* eslint-disable*/
import * as echarts from 'echarts';
import React, { useRef, useEffect, useState } from 'react';
import china from './china.json';

echarts.registerMap('china', china);

export default function Chart({
    config = {},
    height = 400,
    header,
    footer,
    onLegendChange = null,
}) {
    const chartRef = useRef(null);
    const chartIns = useRef(null);

    // const [chartIns, setChartIns] = useState(null);

    function _onHandleResize() {
        setTimeout(() => {
            chartIns?.current?.resize();
        }, 500);
    }
    useEffect(() => {
        const chartInss = echarts.init(chartRef.current);
        if (typeof onLegendChange === 'function') {
            chartInss.on('legendselectchanged', (obj) => {
                obj.selected && onLegendChange?.(obj);
            });
        }
        // setChartIns(chartInss);
        chartIns.current = chartInss
        window.addEventListener('resize', _onHandleResize);
        return () => {
            window.removeEventListener('resize', _onHandleResize);
            chartIns.current?.off('legendselectchanged');
            chartIns.current?.dispose();
            chartIns.current = null;
        };
    }, []);

    useEffect(() => {
        if (chartIns.current && config) {
            chartIns.current?.setOption(config, true);
            chartIns.current?.resize();
        }
    }, [config]);

    return (
        <div style={{ position: 'relative', width: '100%', height }}>
            {header}
            <div style={{ width: '100%', height }} ref={chartRef} />
            {footer}
        </div>
    );
}
