/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { Input, Button, Table, Modal, message } from 'antd'
import { SearchOutlined, } from '@ant-design/icons'
import { TYPE } from '../templateLibrary/helper'
import Api from '../../service'
import './index.less'
import { useHistory } from "react-router-dom";
import { initTableData } from './helper'
import { useDispatch } from 'react-redux'
import * as action from '../../store/action-type';
import empty from '../../../image/empty.png'

export default
    function index({ globalData }) {
    const [searchValue, setSearchValue] = useState('')
    const [columns, setColumns] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [tableInfo, setTableInfo] = useState({})
    const history = useHistory();
    const dispatch = useDispatch()
    useEffect(() => {
        fetchData({ pageSize: 5 })
    }, [JSON.stringify(globalData)])

    const fetchData = async (data = {}) => {
        let obj = {
            materialType: globalData?.tabsKey || '',
            categoryId: globalData?.categoryId || '',
            dataType: globalData?.dataType || '',
            title: searchValue,
            ...data,
            pageSize: 5,
        }
        let res = await Api.getTableData(obj, globalData?.tabsKey || '');
        if (res?.retCode === 200) {
            let data = initTableData(res?.data, globalData)
            setColumns([...data?.columns, columnsMore()]);
            setDataSource(data?.dataSource)
            setTableInfo(res?.data)
        }
    }

    const handelEdit = (data) => {
        const url = data?.bgImg || data?.coverUrl || data?.fileUrl || ''
        let obj = {
            editData: {
                ...data, url,
                linkTitle: data?.linkName || '',
                linkDesc: data?.summary || '',
                imgData: { url }
            },
            globalData,
            type: globalData?.tabsKey
        }
        dispatch({
            type: action.SETVALUES,
            value: obj
        })
        history.push('/addMaterial')
    }

    const handelDelete = async (data) => {
        Modal.confirm({
            content: "确定要删除吗",
            title: '删除提示',
            onOk: async () => {
                let res = await Api.deletTableData({ id: data?.id || '' }, globalData?.tabsKey || '');
                if (res?.retCode === 200) {
                    fetchData({ pageSize: 5 })
                    message.success('删除成功')
                } else {
                    message.error('删除失败')
                }
            },
            okText: '删除',
            cancelText: '取消'
        })


    }

    const columnsMore = () => {
        return {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            render: (val, allVal) => {
                return <div className='operateBox'>
                    <a onClick={() => handelEdit(allVal)}>编辑</a>
                    <a onClick={() => handelDelete(allVal)}>删除</a></div>
            }
        }
    }

    const handelEnter = () => {
        fetchData({ pageSize: 5 })
    }

    const handelAdd = () => {
        let obj = {
            globalData,
            type: globalData?.tabsKey
        }
        dispatch({
            type: action.SETVALUES,
            value: obj
        })
        history.push('/addMaterial');
    }

    return (
        <div className="tableContainer">
            <div className="title1">
                {TYPE?.[globalData?.tabsKey] || ''}
            </div>
            <div className="searchBox">
                <Input
                    placeholder="请输入要搜索的素材标题"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    suffix={<SearchOutlined />}
                    onPressEnter={handelEnter}
                    onBlur={handelEnter}
                />
                <Button type="primary" onClick={handelAdd}>新建素材</Button>
            </div>
            <div className="main">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        className: 'pagination',
                        showTotal: (total) => `共${total}条记录`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: tableInfo?.pageNo,
                        pageSize: tableInfo?.pageSize,
                        defaultCurrent: tableInfo.pageCount,
                        total: tableInfo.total
                    }}
                    locale={{
                        emptyText: () => <div className='emptyBox'>
                            <div ><img src={empty} /></div>
                            <div className='text'>暂无数据权限，快去创建吧</div>
                            <Button type="primary" onClick={handelAdd}>添加素材</Button>
                        </div>
                    }}
                    onChange={(options) => fetchData({ pageNo: options?.current, pageSize: options?.pageSize })}
                />
            </div>
        </div>
    )
}
