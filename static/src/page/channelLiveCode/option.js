import echarts from 'vue-echarts/components/ECharts'

const colorObj = {
    x1: '#266CEE',
    x1Rgba: 'rgba(38,108,238,0.2)',
    x2: '#F62458',
    x2Rgba: 'rgba(246,36,88, 0.15)',
    x3: '#09E1BC',
    x3Rgba: 'rgba(14,169,255,0.15)',
    areaStyleColor: '#fff'
}
const LOption = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'item',
        showDelay: 0, // 显示延时，添加显示延时可以避免频繁切换
        hideDelay: 50, // 隐藏延时
        transitionDuration: 0, // 动画变换时长
        backgroundColor: 'rgba(102,102,102,0)', // 背景颜色（此时为默认色）
        borderRadius: 8, // 边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        position(p) {
            // 位置回调
            // onsole.log && console.log(p,'位置');
            return [p[0] - 10, p[1] - 58]
        },
        formatter(params, ticket, callback) {
            // console.log(params,ticket,'123')
            return `<div style="background-color:${params.color};border-radius:18px 18px 18px 0;padding: 4px 8px">${params.value}万</div>`;
        },
    },
    legend: {
        itemWidth: 5,
        itemHeight: 5,
        borderRadius: 999,
        left: 'right',
        top: 30,
        data: ['月结总额度', '待还额度', '月结逾期']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        // type: 'category',
        // boundaryGap: false,
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: '月结总额度',
        type: 'line',
        stack: '',
        symbol: 'circle',
        smooth: 0.6,
        // symbolSize: 10,
        itemStyle: {
            color: colorObj.x1
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorObj.x1Rgba
            }, {
                offset: 1,
                color: 'rgba(50,116,239,0.05)'
            }])
        },
        data: [190, 290, 160, 500, 590, 640, 700]
    },
    {
        name: '待还额度',
        type: 'line',
        smooth: 0.6,
        stack: '', // 数据是叠加还是交叉
        symbol: 'circle',
        // symbolSize: 10,
        itemStyle: {
            color: colorObj.x2
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorObj.x2Rgba
            }, {
                offset: 1,
                color: 'rgba(255,120,46,0.05)'
            }])
        },
        data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
        name: '月结逾期',
        type: 'line',
        smooth: 0.6,
        stack: '', // 数据是叠加还是交叉
        symbol: 'circle',
        // symbolSize: 10,
        itemStyle: {
            color: colorObj.x3
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorObj.x3Rgba
            }, {
                offset: 1,
                color: colorObj.areaStyleColor
            }])
        },
        data: [0, 102, 299, 104, 620, 430, 510]
    },

    ]
};
const color1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: '#69A0F9'
}, {
    offset: 0.68,
    color: '#266CEE'
}])
const color2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: '#09E1BC'
}, {
    offset: 0.68,
    color: '#0EA9FF'
}])
const color3 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: '#FF782E'
}, {
    offset: 0.68,
    color: '#F62458'
}])

const color4 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: '#A5A6B8'
}, {
    offset: 0.68,
    color: '#E1E6F0'
}])

const color5 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: '#29C0A7'
}, {
    offset: 0.68,
    color: '#75E3D1'
}])

const ROption = {

    title: {
        top: '45%',
        left: 'center',
        text: '0',
        subtext: '商品总数',
        textStyle: {
            color: '#2C3443',
            fontSize: 22,
        },
        subtextStyle: {
            color: '#2C3443',
            fontSize: 12,
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
    },
    legend: {
        // orient: 'vertical',
        // top: 'middle',
        id: 'type',
        itemWidth: 6,
        itemHeight: 6,
        borderRadius: 99999,
        bottom: 10,
        left: 'center',
        data: ['上架', '下架', '待审核', '驳回', '上架中无货商品'],
        formatter(name) {
            return name
        }

    },
    series: [{
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['50%', '50%'],
        color: [color1, color2, color3, color4, color5],
        avoidLabelOverlap: true,
        label: {
            formatter(params) {
                return params.value;
            },
        },
        data: [{
            value: 0,
            name: '上架'
        },
        {
            value: 0,
            name: '下架'
        },
        {
            value: 0,
            name: '待审核',
        },
        {
            value: 0,
            name: '驳回',
        },
        {
            value: 0,
            name: '上架中无货商品',
        },
        ],
        emphasis: {
            itemStyle: {
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowColor: 'rgba(102, 102, 102, 0.5)'
            },
            formatter(params) {
                // console.log(par)
            }
        }
    }]
};
export default {
    LOption,
    ROption
}
