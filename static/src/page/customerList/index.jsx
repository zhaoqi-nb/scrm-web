/* eslint-disable*/

import React, { useRef, useState } from 'react'
import { Button, Modal, Input } from 'antd'
// import RsIcon from '@RsIcon'

import RsIcon from '@RsIcon'
import CustomerList from './components/customerList'

import CreateModal from './components/createModal'
import UploadPanel from '../batchAddFriends/comments/uploadPanel'
import Api from './store/api'
import './index.module.less'

function Index() {
  const [excelFileVisible, setExcelFileVisible] = useState(false)
  const [fileInfo, setFileInfo] = useState({});
  const [excelLoading, setExcelLoading] = useState(false)

  const modalRef = useRef()
  const listRef = useRef()
  const showModal = () => {
    modalRef.current.optionModal(true)
  }
  const showModalData = (modalData) => {
    modalRef.current.optionModal(true, modalData)
  }
  const callBakcFN = () => {
    listRef.current.readLoadPage()
  }

  const onUploadChange = (upLoadFileInfo) => {
    setFileInfo({ ...fileInfo, upLoadFileInfo })
  }

  const onOkAddExcel = () => {
    setExcelLoading(true)
    Api.getExcelFil({
      file: _.get(fileInfo, 'upLoadFileInfo.url'),
      fullFileName: _.get(fileInfo, 'upLoadFileInfo.fileName'),
    }).then((res) => {
      if (res.retCode == 200) {
        listRef.current.readLoadPage()
        setExcelLoading(false)
        setFileInfo({})
        setExcelFileVisible(false)
      }
    })
  }

  const handelExport = () => {
    setExcelFileVisible(true)
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">客户管理</div>
        <Modal
          maskClosable={false}
          className="batchGet-update"
          title="导入客户"
          width={600}
          visible={excelFileVisible}
          onCancel={() => setExcelFileVisible(false)}
          footer={[
            <Button className="cancel-btn" onClick={() => setExcelFileVisible(false)}>取消</Button>,
            <Button className="true-btn" loading={excelLoading} disabled={!_.get(fileInfo, 'upLoadFileInfo.url')} onClick={onOkAddExcel}>确定</Button>
          ]}
        >
          <div className="batchGet-update-downExcelExp">
            <Button style={{ padding: '6px 0' }} type="link" target="_blank" href="https://databurning-scrm-prod-1308952381.cos.ap-beijing.myqcloud.com/default/%E7%87%83%E6%95%B0%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls"><RsIcon type="icon-daochu" style={{ fontSize: '16px', marginRight: '8px' }} />下载模版</Button>
          </div>
          <p className="batchGet-update-name">
            <p style={{ width: '85px' }}>上传表格</p>
            <UploadPanel fileData={{ type: 0 }} uploadData={fileInfo.upLoadFileInfo || {}} fileType="file" onChange={onUploadChange} />
          </p>
        </Modal>
        <div>
          <Button style={{ marginRight: '10px' }} onClick={showModal}>
            新建
          </Button>
          <Button type="primary" onClick={handelExport}>
            导入
          </Button>
        </div>

      </div>

      {/* 客户列表区域 */}
      <CustomerList ref={listRef} onCreate={showModal} onEditChage={showModalData} />

      {/* 创建客户 */}
      <CreateModal ref={modalRef} onOkCallBack={callBakcFN} />
    </div>
  )
}

export default Index
