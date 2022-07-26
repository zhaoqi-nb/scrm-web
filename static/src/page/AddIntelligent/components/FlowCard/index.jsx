/* eslint-disable*/
import React from 'react'
import './index.less'
import { Tooltip } from 'antd';
import RsIcon from '@RsIcon'
import { processSettings } from '../index'
import { Drawer } from '@Tool/components'
import moment from 'moment'

export default function FlowCard({ renderKey, handelAdd, data, insertIndex, handelEdit, handelFirst, handelDelete, code = '' }) {
    const resultData = data?.smartMarketingJson || {}
    const ENUM = {
        1: { title: '进入流程设置', background: 'linear-gradient(270deg, #0EB0FF 0%, #0678FF 100%)', icon: null },
        2: { title: '客户属性判断', background: 'rgba(6, 120, 255, 0.06)', icon: <RsIcon type='icon-kehuxinxiguanli' />, iconColor: '#0678FF' },
        3: { title: '客户事件判断', background: 'rgba(6, 120, 255, 0.06)', icon: <RsIcon type='icon-kehuguanli1' />, iconColor: '#0678FF' },
        4: { title: '修改客户属性', background: '#FFFBF0', icon: <RsIcon type='icon-kehudingdan' />, iconColor: '#FFBA00' },
        5: { title: '修改客户标签', background: '#FFFBF0', icon: <RsIcon type='icon-biaoqian1' />, iconColor: '#FFBA00' },
        6: { title: '企微群发任务', background: '#FFFBF0', icon: <RsIcon type='icon-Frame' />, iconColor: '#FFBA00' },
        7: { title: '企微群群发任务', background: '#FFFBF0', icon: <RsIcon type='icon-kehuzonglan' />, iconColor: '#FFBA00' },
        8: { title: '企业朋友圈任务', background: '#FFFBF0', icon: <RsIcon type='icon-pengyouquan' />, iconColor: '#FFBA00' },
        9: { title: '指定日期或时间', background: '#F4FCF3', icon: <RsIcon type='icon-riliriqi' />, iconColor: '#46C93A' },
        10: { title: '等待', background: '#F4FCF3', icon: <RsIcon type='icon-dengdaiyunhang-2' />, iconColor: '#46C93A' },
    }

    const DOTYPE = {
        1: '单次型',
        2: '周期型'
    }
    const ACTIONTYPE = {
        1: '基于客户',
        2: '基于事件'
    }
    const TYPE = {
        1: '分',
        2: '小时',
        3: '天',
    }

    const handelSet = async () => {
        const result = await Drawer.show({ title: '进入流程设置', ...data }, processSettings)
        handelFirst(result)
    }
    const renderFirst = () => {
        return <div className="flowBottom">
            <div>{DOTYPE?.[data?.doType] || ''}{ACTIONTYPE?.[data?.actionType] ? '/' + ACTIONTYPE?.[data?.actionType] : ''}</div>
            <div>{data?.doStartTime ? moment(data?.doStartTime).format('YYYY/MM/DD') : ''} {data?.doSendTimeInfo ? data?.doSendTimeInfo + '开始' : ''}</div>
            <div className='firstBottom'><a onClick={handelSet}>设置进入条件</a></div>
        </div>
    }

    const renderSecond = () => {
        return <div className='secondBox'>
            <div>已筛选<span>{resultData?.screens?.length || 0}</span>项</div>
            <div>预计筛选客户<span>{data?.count}</span>人</div>
        </div>
    }

    const renderThird = () => {
        return <div className='secondBox'>
            <div>已筛选<span>{resultData?.screens?.length || 0}</span>项</div>
            <div>预计筛选客户<span>{data?.count}</span>人</div>
        </div>
    }

    const renderForth = () => {
        return <div className='forthBox'>
            修改属性:{resultData?.screens?.map((item) => item?.showFiledName)?.join('、')}
        </div>
    }

    const renderFifth = () => {
        return <div className='fifthBox'>
            <div>新增标签: {resultData?.addLabelList?.map(item => item?.labelName)?.join('、') || '无'}</div>
            <div>删除标签: {resultData?.removeLabelList?.map(item => item?.labelName)?.join('、') || '无'}</div>
        </div>
    }

    const renderSixth = () => {
        return <div className='fifthBox'>
            <div>{resultData?.name || ""}</div>
            <div>{resultData?.medias?.length > 1 ? '文本消息/附件' : '文本消息'}</div>
        </div>
    }

    const renderSeventh = () => {
        return <div className='fifthBox'>
            <div>{resultData?.name || ""}</div>
            <div>{resultData?.medias?.length > 1 ? '文本消息/附件' : '文本消息'}</div>
        </div>
    }

    const renderEighth = () => {
        return <div className='fifthBox'>
            <div>{resultData?.friendCircleName || '-'}</div>
            <div>{resultData?.textContent ? '文本消息' : ''}{resultData?.fileList?.length ? '/附件' : ''}</div>
        </div>
    }
    const renderNinth = () => {
        return <div className='fifthBox'>
            <div>指定日期: {resultData?.doDate} {resultData?.doTime}</div>
        </div>
    }

    const renderTenth = () => {
        return <div className='fifthBox'>等待{resultData?.doWait}{TYPE?.[resultData?.doWaitType] || ''}</div>
    }
    const renderCard = () => {
        switch (renderKey) {
            case 1: // 流程设置
                return renderFirst()
            case 2: //客户属性判断
                return renderSecond()
            case 3: //客户事件判断
                return renderThird()
            case 4: //修改客户属性
                return renderForth()
            case 5: //修改客户标签
                return renderFifth()
            case 6: //企微群发任务
                return renderSixth()
            case 7: //企微群群发任务
                return renderSeventh()
            case 8: //企业朋友圈任务
                return renderEighth()
            case 9: //等待卡片渲染
                return renderNinth()
            case 10: //等待卡片渲染
                return renderTenth()
            default:
                break;
        }
    }
    const handelBox = () => {
        handelAdd({ renderKey, insertIndex })
    }

    const renderX = () => {
        if (code === 'readOnly' || renderKey == 1) {
            return null;
        }
        return <div className='xBox' onClick={(e) => handelDelete(e, insertIndex)}><RsIcon type='icon-shanchu' /></div>
    }

    const renderBottom = () => {
        if (renderKey == 1 && !(data?.actionType)) {
            return null;
        }
        if (code == 'readOnly') {
            return <div className='addBox1'></div>
        }
        return <Tooltip title={'点击+按钮添加操作'}><div className='addBox' onClick={handelBox}>+</div></Tooltip>
    }

    const result = ENUM?.[renderKey]
    return (
        <>
            <div className={`flowcard ${renderKey == 1 ? 'special' : ''} `} onClick={() => handelEdit(data, renderKey, insertIndex)}>
                <div className="flowTop" style={{ background: result?.background || '' }}>
                    {renderKey != 1 ? <font className='iconBox' style={{ background: result?.iconColor }}>{result?.icon || ''}</font> : null}
                    <span className='titleBox'>{data?.smartMarketingJson?.operatingTitle || result?.title}</span></div>
                {renderCard()}
                {renderX()}
            </div>
            {renderBottom()}
            {/* {(renderKey == 1 && !(data?.actionType)) ? null : <Tooltip title={'点击+按钮添加操作'}><div className='addBox' onClick={handelBox}>+</div></Tooltip>} */}
            {/* <Tooltip title={'点击+按钮添加操作'}><div className='addBox' onClick={handelBox}>+</div></Tooltip> */}

            {/* <div className='addXian'></div> */}
        </>
    )
}
