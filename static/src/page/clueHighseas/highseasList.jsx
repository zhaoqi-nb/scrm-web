import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Form, Input, TreeSelect, Button } from 'antd'
import moment from 'moment'
import RsIcon from '@RsIcon'
import Modal from '@Modal'
import { cloneDeep } from 'lodash'
import { setValues } from './store/action'
import { setValues as setFollowupClueValues } from '../followupClue/store/action'
import ClueInfo from '../followupClue/clueInfo'
import CompanyInfo from '../followupClue/companyInfo'
import Api from './store/api'
import ConfigTable from '../comments/publicView/table'
import ReactEvents from '../../utils/events'

const { Option } = Select

const formaterTreeData = (data) => {
  if (!data || !data.length) return []
  return cloneDeep(data).map((v) => {
    const { subDepartList, departName, id, permissionsFlag } = v
    v.key = id
    v.value = id
    v.title = departName
    v.disabled = !permissionsFlag
    if (subDepartList) v.children = formaterTreeData(subDepartList)
    return v
  })
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  getInitialState() {
    const { cluesChannelsTypeInfo, cluesSourceTypeList } = this.props
    return {
      isReady: false,
      dataSource: [],
      columns: [
        {
          title: '线索ID',
          dataIndex: 'id',
          width: 220,
          fixed: 'left',
        },
        {
          title: '公司名称',
          dataIndex: 'companyName',
          width: 220,
          fixed: 'left',
          render: (text, record) => {
            const { newCluesFlag, cluesStatus, id } = record
            return (
              <div>
                <div className="clue-sign">
                  {newCluesFlag == 1 && <span className="clue-sign-new">新</span>}
                  {cluesStatus == 3 && <span className="clue-sign-fang">放</span>}
                </div>
                <Button
                  style={{ padding: 0, height: 'auto' }}
                  type="link"
                  onClick={() => this.handleGetClueInfo(id, '公司详情')}
                >
                  {text}
                </Button>
              </div>
            )
          },
        },
        {
          title: '联系人',
          dataIndex: 'name',
          width: 220,
          fixed: 'left',
          render: (text, record) => {
            const { id } = record
            return (
              <div>
                {/* <div className="clue-sign">
                  {newCluesFlag == 1 && <span className="clue-sign-new">新</span>}
                  {cluesStatus == 3 && <span className="clue-sign-fang">放</span>}
                </div> */}
                <Button
                  style={{ padding: 0, height: 'auto' }}
                  type="link"
                  onClick={() => this.handleGetClueInfo(id, '线索详情')}
                >
                  {text}
                </Button>
              </div>
            )
          },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
          sorter: true
        },
        {
          title: '线索来源',
          dataIndex: 'cluesSourceType',
          width: 150,
          render: (text, record) => text == 4 ? record.introducer : cluesSourceTypeList[text],
        },
        {
          title: '区域',
          dataIndex: 'countries',
          width: 150,
          render: (text) => text ? text == 1 ? '中国大陆' : '海外' : '-'
        },
        {
          title: '详细地址',
          dataIndex: 'contactAddressInfo',
          width: 220,
        },
        {
          title: '所属行业',
          dataIndex: 'industry',
          width: 220,
        },
        {
          title: '所属公海',
          dataIndex: 'publicLakeName',
          width: 220,
        },
        {
          title: '创建人',
          dataIndex: 'createName',
          width: 220,
        },
        {
          title: '所属部门',
          dataIndex: 'aaa',
          width: 100,
          render: () => '-',
        },
        {
          title: '最后维护人',
          dataIndex: 'updateName',
          width: 220,
        },
        {
          title: '最后维护时间',
          dataIndex: 'updateTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
          sorter: true,
          defaultSortOrder: 'descend'
        },
        {
          title: '跟进状态',
          dataIndex: 'newCluesNotFollowUp',
          width: 220,
        },
        {
          title: '来源渠道',
          dataIndex: 'cluesChannelsType',
          width: 220,
          render: (text) => cluesChannelsTypeInfo[text],
        },
        {
          title: '标签',
          dataIndex: 'newCluesNotFollowUp',
          width: 220,
        },
        {
          title: '回收时间',
          dataIndex: 'recoverTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
          sorter: true
        },
      ],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 项`,
      },
      dataVisible: false,
      roleDataAuthInfo: {},
      isDepartLoading: true,
      sortField: 'updateTime',
      sortType: 'descend'
    }
  }

  componentDidMount() {
    ReactEvents.addListener('fetchList', () => {
      this.queryCluesLakeList()
    })
    this.queryAllDepartAndAllMemberAddRoleBoundary()
    this.queryCluesLakeList()
  }

  componentWillUnmount() {
    ReactEvents.removeListener('fetchList', this.queryCluesLakeList)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { headerClueId, companyName, name, updateId, cluesSourceType, cluesChannelsType, contactAddressInfo, countries, industry } = this.props
    if (headerClueId != nextProps.headerClueId ||
      companyName != nextProps.companyName ||
      name != nextProps.name ||
      cluesSourceType != nextProps.cluesSourceType ||
      updateId != nextProps.updateId ||
      cluesChannelsType != nextProps.cluesChannelsType ||
      contactAddressInfo != nextProps.contactAddressInfo ||
      countries != nextProps.countries ||
      industry != nextProps.industry
    ) {
      this.setState((state) => ({
        pagination: {
          ...state.pagination,
          current: 1
        }
      }), () => this.queryCluesLakeList(nextProps))
    }
  }

  queryAllDepartAndAllMemberAddRoleBoundary = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      this.props.setValues({
        departAndAllMember: formaterTreeData(res.data),
      })
    })
  }

  formaterSortField = (key) => {
    switch (key) {
      case 'updateTime':
        return 'i.update_time';
      case 'recoverTime':
        return 'i.recover_time';
      case 'createTime':
        return 'i.create_time';
      default:
        return '';
    }
  }

  queryCluesLakeList = ({ headerClueId, companyName, name, updateId, cluesSourceType, cluesChannelsType, contactAddressInfo, industry, countries } = this.props) => {
    const { pagination, sortType, sortField } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.queryCluesLakeList({
      pageNo: current,
      pageSize,
      publicLakeId: headerClueId,
      companyName,
      name,
      updateId,
      cluesSourceType,
      cluesChannelsType,
      sortType: sortType == 'descend' ? 'DESC' : 'ASC',
      sortField: this.formaterSortField(sortField),
      contactAddressInfo,
      industry,
      countries
    })
      .then((res) => {
        const { list, total } = res.data
        this.setState({
          pagination: {
            ...pagination,
            total,
          },
          dataSource: list,
        })
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        })
      })
  }

  renderSelectInfo = () => {
    const { selectedRows } = this.state
    if (!selectedRows || !selectedRows.length) return null
    return (
      <div className="select-row-div">
        <span>
          已选中&nbsp;
          {selectedRows.length}
          &nbsp;项
        </span>
        <span onClick={() => this.handleChangeVisible('更换公海池')} className="select-col-div">
          <RsIcon type="icon-genghuan" />
          更换公海池
        </span>
        <span onClick={() => this.handleChangeVisible('提取')} className="select-col-div">
          <RsIcon type="icon-tiqu" />
          提取
        </span>
        <span onClick={() => this.handleChangeVisible('分配')} className="select-col-div">
          <RsIcon type="icon-fenpei" />
          分配
        </span>
        <span onClick={() => this.handleChangeVisible('删除')} className="select-col-div">
          <RsIcon type="icon-shanchu" />
          删除
        </span>
        {/* <span className="select-col-div"> 一期不做
          <RsIcon type="icon-biaoqian" />
          添加标签
        </span> */}
      </div>
    )
  }

  handleChangeVisible = (modalType) => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
      modalType,
    }))
  }

  // 提取线索
  handleExtractClues = () => {
    const { selectedRowKeys } = this.state
    return new Promise((resolve, reject) => {
      Api.extractClues({
        ids: selectedRowKeys,
      })
        .then(() => {
          resolve()
          this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          })
          this.queryCluesLakeList()
        })
        .catch(() => reject())
    })
  }

  renderExtractModal = () => {
    const { modalVisible } = this.state
    return (
      <Modal visible={modalVisible} onOk={this.handleExtractClues} title="线索提取" onCancel={this.handleChangeVisible}>
        确认要提取线索吗？提取成功之后，请在我跟进中的线索中进行管理
      </Modal>
    )
  }

  handleReplaceCluesLake = () =>
    this.formRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.replaceCluesLake(values)
            .then(() => {
              resolve()
              this.queryCluesLakeList()
            })
            .catch(() => reject())
        })
    )

  renderReplaceModal = () => {
    const { modalVisible, selectedRowKeys } = this.state
    const { clueList } = this.props
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleReplaceCluesLake}
        title="线索更换公海"
        onCancel={this.handleChangeVisible}
      >
        是否将线索转移到其他公海？转移成功之后，该操作将无法恢复。
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item rules={[{ required: true, message: '请选择公海池' }]} name="publicLakeId" label="选择公海池">
            <Select showSearch optionFilterProp="title">
              {clueList.map((v) => (
                <Option key={v.id} value={v.id} title={v.publicLakeName}>
                  {v.publicLakeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item initialValue={selectedRowKeys} hidden name="ids" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  // 删除线索
  handleBatchDeleteClues = () => {
    const { selectedRowKeys } = this.state
    return new Promise((resolve, reject) => {
      Api.batchDeleteClues(selectedRowKeys.join(','))
        .then(() => {
          resolve()
          this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          })
          this.queryCluesLakeList()
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => {
    const { modalVisible } = this.state
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleBatchDeleteClues}
        title="线索删除"
        type="delete"
        onCancel={this.handleChangeVisible}
      >
        是否删除销售线索？删除成功之后，该操作将无法恢复。
      </Modal>
    )
  }

  // 分配线索
  handleAssignCluesLake = () =>
    this.formRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.assignClues(values)
            .then(() => {
              resolve()
              this.queryCluesLakeList()
            })
            .catch(() => reject())
        })
    )

  handleTreeSelect = (value, node) => {
    this.setState({
      memberInfoListByDepart: node.memberInfoList,
    })
    this.formRef.current.setFieldsValue({
      memberId: '',
    })
  }

  // 分配线索
  renderAssignModal = () => {
    const { modalVisible, selectedRowKeys, memberInfoListByDepart = [] } = this.state
    const { departAndAllMember } = this.props
    return (
      <Modal
        visible={modalVisible}
        onOk={this.handleAssignCluesLake}
        title="线索分配"
        onCancel={this.handleChangeVisible}
      >
        是否将线索转移给其他负责人？转移成功之后，该操作将无法恢复。
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.formRef}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            rules={[{ required: true, message: '请选择负责人所属部门' }]}
            name="departId"
            label="负责人所属部门"
          >
            <TreeSelect
              onSelect={this.handleTreeSelect}
              showArrow
              placeholder="请选择部门"
              treeData={departAndAllMember}
              showSearch
              treeNodeFilterProp="title"
            />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请选择新负责人' }]} name="memberId" label="新负责人">
            <Select showSearch optionFilterProp="title">
              {memberInfoListByDepart.map((v) => (
                <Option key={v.id} value={v.id} title={v.name}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item initialValue={selectedRowKeys} hidden name="ids" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.queryCluesLakeList)
  }

  // 获取线索详情
  handleGetClueInfo = (id, type) => {
    Api.doingCluesQueryInfoByCluesId(id).then((res) => {
      this.props.setFollowupClueValues({
        clueInfo: res.data,
      })
      this.handleChangeVisible(type)
    })
  }

  render() {
    const { columns, pagination, dataSource, isLoading, selectedRowKeys, modalVisible, modalType } = this.state
    const rowSelection = {
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedKeys,
          selectedRows,
        })
      },
      getCheckboxProps: (record) => ({
        disabled: record.status == -1,
      }),
      selectedRowKeys,
    }
    return (
      <>
        {this.renderSelectInfo()}
        <ConfigTable
          configType={1}
          scroll={{ x: 'max-content' }}
          loading={isLoading}
          columns={columns}
          pageChange={this.handleChangeTable}
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={pagination}
          rowKey={(record) => record.id}
        />
        {modalVisible && modalType == '提取' && this.renderExtractModal()}
        {modalVisible && modalType == '更换公海池' && this.renderReplaceModal()}
        {modalVisible && modalType == '删除' && this.renderDeleteModal()}
        {modalVisible && modalType == '分配' && this.renderAssignModal()}
        {modalVisible && modalType == '线索详情' && (
          <ClueInfo fromType="clueHighseas" onRefresh={this.queryCluesLakeList} onCancelDrawer={this.handleChangeVisible} />
        )}
        {modalVisible && modalType == '公司详情' && (
          <CompanyInfo fromType="clueHighseas" onRefresh={this.queryCluesLakeList} onCancelDrawer={this.handleChangeVisible} />
        )}
      </>
    )
  }
}

export default connect(
  (state) => ({
    headerClueId: state.commonLayout.headerClueId,
    clueList: state.clueHighseas.clueList,
    departAndAllMember: state.clueHighseas.departAndAllMember,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    cluesSourceTypeList: state.commonLayout.cluesSourceTypeList,
    companyName: state.clueHighseas.companyName,
    name: state.clueHighseas.name,
    updateId: state.clueHighseas.updateId,
    cluesSourceType: state.clueHighseas.cluesSourceType,
    cluesChannelsType: state.clueHighseas.cluesChannelsType,
    contactAddressInfo: state.clueHighseas.contactAddressInfo,
    countries: state.clueHighseas.countries,
    industry: state.clueHighseas.industry,
  }),
  { setValues, setFollowupClueValues }
)(Index)
