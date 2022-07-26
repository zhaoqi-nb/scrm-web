/* eslint-disable*/

import React, { useState, useEffect } from 'react'
import { Radio, Select, Input, Table } from 'antd'
import Api from '../../service'
import { initSelectData, initColumns } from './helper'
import './index.less'
import { SearchOutlined } from '@ant-design/icons'

export default function Material({ type, handelRowSelection }) {
    const [tabs, setTabs] = useState('2');
    const [selectOption, setSelectOption] = useState([]);
    const [selectValue, setSelectValue] = useState('0');
    const [searchValue, setSearchValue] = useState('');
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectAllData, setSelectAllData] = useState([]);

    const onSelectChange = (newSelectedRowKeys, data) => {
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectAllData(data)
        handelRowSelection(data, tabs)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        type: 'radio'
    };


    const TYPEENUM = [
        { value: '2', label: '图片' },
        { value: '3', label: '视频' },
        { value: '5', label: '链接' },
    ]
    const REQUEST = {
        6: 'text',
        2: 'poster',
        0: 'file',
        3: 'video',
        5: 'link',
    }

    useEffect(() => {
        fetchData()
        fetchTableData()
    }, []);

    const fetchData = async (data = {}) => {
        const res = await Api.getGroupData({
            dataType: type,
            materialType: tabs,
            ...data
        })
        if (res?.retCode === 200) {
            const result = initSelectData(res?.data || []);
            setSelectOption(result);
        }
    }

    const fetchTableData = async (data = {}, types = tabs) => {
        const res = await Api.getMaterialData({
            categoryId: selectValue,
            dataType: type,
            title: searchValue,
            ...data
        }, REQUEST[types]);
        if (res?.retCode === 200) {
            const result = initColumns(res?.data?.list || [], types);
            setDataSource(result?.dataSource);
            setColumns(result?.columns);
        }
    }
    const handelChange = (e) => {
        setTabs(e?.target?.value || '')
        fetchData({
            materialType: e?.target?.value || ''
        })
        fetchTableData({
            categoryId: selectValue,
        }, e?.target?.value)
    }
    const handelSelect = (e) => {
        setSelectValue(e)
        fetchTableData({
            categoryId: e
        })
    }
    const handelInput = (e) => {
        setSearchValue(e.target.value)
    }

    const handelBlur = () => {
        fetchTableData()
    }
    return (
        <div className="materialContainer">
            <div className="banner">
                <Radio.Group
                    options={TYPEENUM}
                    onChange={handelChange}
                    value={tabs}
                    optionType="button"
                    buttonStyle="solid"
                />
                <Select
                    options={selectOption}
                    value={selectValue}
                    onChange={handelSelect}
                    placeholder={'老客分组'}
                />
                <Input
                    placeholder='请输入要搜索的素材标题'
                    value={searchValue}
                    onChange={handelInput}
                    suffix={<SearchOutlined />}
                    onBlur={handelBlur}
                    onPressEnter={handelBlur}
                />
            </div>
            <div className="bottom">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
        </div>
    )
}
