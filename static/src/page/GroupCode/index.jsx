/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { Input, Select, Button, Table, Modal, message } from 'antd'
import './index.less'
import { SearchOutlined } from '@ant-design/icons'
import Api from './service'
import { initStaffData, initTableData } from './helper'
import { TRCheckboxModal } from '@Tool/components'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as action from './store/action-type';
import { DetailDrawer } from './components'
import { exportFile } from '@/utils/Util'

export default function GroupCode() {
    const [titleValue, setTitleValue] = useState('')
    const [staffData, setStaffData] = useState([]);
    const [staffValue, setStaffValue] = useState([]);
    const [staffOption, setStaffOption] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [tableInfo, setTableInfo] = useState({});
    const history = useHistory();
    const dispatch = useDispatch()


    const handelTitle = (e) => {
        setTitleValue(e?.target?.value || '')
        fetchTableData({ groupCodeName: e?.target?.value || '' })
    }

    const fetchData = async () => {
        let res = await Api.getCreatorData();
        if (res?.retCode === 200) {
            const data = initStaffData(res?.data || []);
            setStaffData(data?.departList || [])
            setStaffOption(data?.resultData || [])
        }
    }

    const fetchTableData = async (data) => {
        let res = await Api.getCodeTable({
            groupCodeName: titleValue,
            memberIds: staffValue,
            ...data
        });
        if (res?.retCode === 200) {
            const result = initTableData(res?.data?.list || []);
            setColumns([...result?.columns || [], columnsMore()]);
            setDataSource(result?.dataSource || [])
            setTableInfo(res?.data)
        }
    }

    // const getBase64Image = (img) => {
    //     let canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     let ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0, img.width, img.height);
    //     let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    //     let dataURL = canvas.toDataURL("image/" + ext);
    //     return dataURL;
    // }
    // const handelDownLoad = (allVal) => {
    //     let zip = new JSZip();//实例化一个压缩文件对象
    //     let imgFolder = zip.folder('图片'); //新建一个图片文件夹用来存放图片，参数为文件名

    //     let src = allVal?.qrCodeUrl || ''
    //     let tempImage = new Image();
    //     tempImage.src = src;
    //     tempImage.crossOrigin = "*";
    //     tempImage.onload = () => {
    //         imgFolder.file('1.jpg', getBase64Image(tempImage).substring(22), { base64: true })
    //     }
    //     setTimeout(() => {
    //         zip.generateAsync({ type: 'blob' }).then(function (content) {
    //             FileSaver.saveAs(content, 'images.zip')
    //         })

    //     }, 3000)
    // }
    const handelEdit = (data) => {
        dispatch({
            type: action?.SETEDIT,
            value: { edit: data, type: data?.groupCodeType || '' }
        })
        history.push('/TemplateChoose')
    }
    const handelDownLoad = (allVal) => {
        exportFile(allVal?.qrCodeUrl || '')
    }
    const handelDelete = async (data) => {
        Modal.confirm({
            content: "确定要删除吗",
            title: '删除提示',
            onOk: async () => {
                const res = await Api.deleteCodeTable(data?.id);
                if (res?.retCode === 200) {
                    fetchTableData({ pageSize: 5 })
                    message.success('删除成功')
                } else {
                    message.error('删除失败')
                }
            },
            okText: '删除',
            cancelText: '取消'
        })

    }
    const handelDetail = (allVal) => {
        DetailDrawer.show({ data: allVal })
    }
    const columnsMore = () => {
        return {
            title: '操作',
            key: 'operate',
            fixed: 'right',
            dataIndex: 'operate',
            render: (val, allVal) => {
                return <div className='operateBox'>
                    <a onClick={() => handelDownLoad(allVal)}>下载</a>
                    <a onClick={() => handelDetail(allVal)}>数据统计</a>
                    <a onClick={() => handelEdit(allVal)}>编辑</a>
                    <a onClick={() => handelDelete(allVal)}>删除</a>
                </div>
            }
        }
    }
    const handelStaff = (data) => {
        setStaffValue(data)

    }
    const titleRender = (item) => {
        return <div className='itemBox'>
            {item?.avatar && <img src={item?.avatar || ''} />
            }<span>{item?.title || ''}</span>
        </div>
    }
    const handelSelect = async () => {
        const result = await TRCheckboxModal.show({
            treeData: staffData,
            value: staffValue,
            title: '选择员工',
            titleRender,
            itemRender: titleRender
        })
        if (result.index === 1) {
            setStaffValue(result?.checkedKeys || [])
            fetchTableData({ memberIds: result?.checkedKeys || [] })
        }
    }
    useEffect(() => {
        fetchData()
        fetchTableData({ pageSize: 5 })
    }, []);

    const handelAdd = () => {
        history.push('/KindCode')
    }

    return (
        <div className="groupCode">
            <div className="title1">
                客户群活码
        </div>
            <div className="banner">
                <div className='bannerLeft'>
                    <Input
                        placeholder="请输入要搜索的活码"
                        value={titleValue}
                        onChange={handelTitle}
                        suffix={<SearchOutlined />}
                    />
                    <Select
                        placeholder="请选择创建人"
                        options={staffOption}
                        open={false}
                        onClick={handelSelect}
                        value={staffValue}
                        mode='tags'
                        maxTagCount={2}
                        showArrow
                        onChange={handelStaff}
                    />
                </div>
                <div className='bannerRight'>
                    <Button type='primary' onClick={handelAdd}>新建客户群活码</Button>
                </div>
            </div>
            <div className="main">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{
                        x: 1500,
                    }}
                    pagination={{
                        position: ['bottomCenter'],
                        size: 'small',
                        className: 'pagination',
                        showTotal: (total) => `共${total}条记录`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: tableInfo?.pageNo,
                        pageSize: tableInfo?.pageSize,
                        defaultCurrent: tableInfo.pageCount,
                        total: tableInfo.total,
                        position: ['bottomCenter'],
                        size: 'small',
                    }}
                    onChange={(options) => fetchTableData({ pageNo: options?.current, pageSize: options?.pageSize })}

                />
            </div>
        </div>
    )
}
