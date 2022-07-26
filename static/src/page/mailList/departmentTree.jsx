import React, { useState, useEffect } from 'react'
import { Tree, Form, Input, TreeSelect, Popover, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import { cloneDeep } from 'lodash'
import { setValues } from './store/action'
import Api from './store/api'

import './index.less'

const { DirectoryTree } = Tree

function DepartmentTree(props) {
  const [form] = Form.useForm()
  const { selectTreeData, dataBurning } = props
  const [treeData, setTreeData] = useState([])
  const [addVisible, setAddVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editDepartName, setDepartName] = useState('')
  const [isSubDepart, setIsSubDepart] = useState(false)
  const [editDepartId, setEditDepartId] = useState(null)
  const [fetchDepartListLoading, setFetchDepartListLoading] = useState(false)
  const [moduleTitle, setModuleTitle] = useState('添加部门') // add添加部门，edit编辑部门
  const [parentId, setParentId] = useState(null)
  const propsSetValues = props.setValues

  const handleAddOrEditSubDepartmet = (e, id, title) => {
    e.stopPropagation() // 阻止事件冒泡
    setModuleTitle(title)
    setParentId(id)
    setAddVisible(true)
  }

  const handleDeleteDepartmet = (e, id) => {
    e.stopPropagation() // 阻止事件冒泡
    setDeleteVisible(true)
    setDeleteId(id)
  }

  const popoverContent = (id, pId, departName, isSub) => (
    <div className="popover-content" key={id}>
      <div onClick={(e) => handleAddOrEditSubDepartmet(e, id, '添加子部门')}>添加子部门</div>
      <div
        onClick={(e) => {
          setIsSubDepart(isSub)
          setEditDepartId(id)
          setDepartName(departName)
          handleAddOrEditSubDepartmet(e, pId, '编辑部门')
        }}
      >
        编辑部门
      </div>
      <div onClick={(e) => handleDeleteDepartmet(e, id)}>删除</div>
    </div>
  )

  const formaterTreeData = (data, isSelect) => {
    if (!data || !data.length) return []
    return cloneDeep(data).map((v) => {
      const { subDepartList, departName, id } = v
      const pId = v.parentId
      v.key = id
      v.value = id
      // v.selectable = pId != 1

      v.title = pId == 1 ? departName : isSelect ?
        (
          departName
        ) :
        (
          <div className="ant-tree-title-div">
            {departName}
            <div className="icon-caozuo">
              <Popover
                placement="bottomRight"
                content={() => popoverContent(id, pId, departName, Boolean(subDepartList))}
              >
                <RsIcon type="icon-gengduocaozuo" />
              </Popover>
            </div>
          </div>
        )
      if (subDepartList) v.children = formaterTreeData(subDepartList, isSelect)
      return v
    })
  }

  const queryDepartListByCompanyId = () => {
    setFetchDepartListLoading(true)
    Api.queryDepartListByCompanyId()
      .then((res) => {
        if (res.retCode == 200) {
          const selectData = formaterTreeData(res.data, true)
          setTreeData(formaterTreeData(res.data)) // 左侧树形结构
          // setSelectTreeData(selectData) // 弹窗所需选择树结构
          propsSetValues({
            selectTreeData: selectData,
          })
        }
      })
      .finally(() => {
        setFetchDepartListLoading(false)
      })
  }

  useEffect(() => {
    if (!addVisible) {
      queryDepartListByCompanyId()
    }
  }, [addVisible])

  const handleCancelModal = () => {
    setAddVisible(false)
    setDepartName('')
    setIsSubDepart(false)
    setEditDepartId(null)
    setParentId()
    setModuleTitle('添加部门')
  }

  const handleSaveDepartMent = () => {
    let apiKey = 'addDepartInfo'
    if (editDepartId) apiKey = 'updateDepartInfo'
    return form.validateFields().then((values) => {
      new Promise((resolve, reject) => {
        Api[apiKey]({
          ...values,
          parentId,
          id: editDepartId,
        })
          .then(() => {
            resolve()
            handleCancelModal()
          })
          .catch(() => reject())
      })
    })
  }

  const handleChangeDepartment = (value) => {
    setParentId(value)
  }

  const renderAddModal = () => (
    <Modal
      title={moduleTitle}
      okText="保存"
      visible={addVisible}
      onOk={handleSaveDepartMent}
      onCancel={handleCancelModal}
    >
      <Form preserve={false} form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          initialValue={editDepartName}
          name="departName"
          label="部门名称"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item initialValue={parentId == 1 ? undefined : parentId} name="parentId" label="所属部门">
          <TreeSelect
            disabled={moduleTitle == '添加子部门' || isSubDepart}
            onChange={handleChangeDepartment}
            showArrow
            placeholder="请选择部门"
            treeData={selectTreeData}
          />
        </Form.Item>
      </Form>
    </Modal>
  )

  const handleSelectDepartment = (value) => {
    propsSetValues({
      departId: value[0],
    })
  }

  const deleteDepartment = () => {
    Api.deleteDepartInfo(deleteId).then((res) => {
      if (res.retCode == 200) {
        setDeleteId(null)
        setDeleteVisible(false)
        queryDepartListByCompanyId()
        if (props.departId == deleteId) {
          propsSetValues({
            departId: '',
          })
        }
      }
    })
  }

  const renderDeleteModal = () => (
    <Modal
      title="部门删除"
      okButtonProps={{ danger: true }}
      cancelButtonProps={{ type: 'text' }}
      onOk={deleteDepartment}
      visible={deleteVisible}
      onCancel={() => {
        setDeleteId(null)
        setDeleteVisible(false)
      }}
    >
      部门删除将不能恢复，确认删除吗？
    </Modal>
  )

  return (
    <div className="departmentTree">
      <div className="tree-header">
        <span>部门</span>
        {dataBurning && <PlusOutlined onClick={() => setAddVisible(true)} style={{ cursor: 'pointer' }} />}
      </div>
      <Spin spinning={fetchDepartListLoading}>
        <DirectoryTree onSelect={handleSelectDepartment} icon={null} treeData={treeData} />
      </Spin>
      {addVisible && renderAddModal()}
      {deleteVisible && renderDeleteModal()}
    </div>
  )
}

export default connect(
  (state) => ({
    companyId: state.mailList.companyId,
    departId: state.mailList.departId,
    selectTreeData: state.mailList.selectTreeData,
    companyName: state.mailList.companyName,
    dataBurning: state.mailList.dataBurning,
  }),
  { setValues }
)(DepartmentTree)
