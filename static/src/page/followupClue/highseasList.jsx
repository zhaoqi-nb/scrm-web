import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Form, Input, Button } from 'antd'
import moment from 'moment'
import RsIcon from '@RsIcon'
import { cloneDeep } from 'lodash'
import Modal from '@Modal'
import { setValues } from './store/action'
import Api from './store/api'
import ConfigTable from '../comments/publicView/table'
import ClueInfo from './clueInfo'
import CompanyInfo from './companyInfo'
import ReactEvents from '../../utils/events'

const { Option } = Select

const formaterData = (datas) => {
  const memberInfoListByDepart = []
  const departList = [
    {
      key: '',
      value: '',
      title: '全部'
    },
  ]
  if (!datas || !datas.length) return { memberInfoListByDepart, departList }
  const formaterMemberInfoList = (data) =>
    cloneDeep(data).map((v) => {
      const { subDepartList, departName, id, permissionsFlag, memberInfoList } = v
      v.key = id
      v.value = id
      v.title = departName
      v.disabled = !permissionsFlag
      if (permissionsFlag) {
        memberInfoList.forEach((item) => {
          const param = {}
          param.departId = id
          param.departName = departName
          param.userId = item.id
          param.userName = item.name
          memberInfoListByDepart.push(param)
        })
      }
      if (subDepartList) v.children = formaterMemberInfoList(subDepartList)
      return v
    })
  departList[0].children = formaterMemberInfoList(datas)
  return {
    memberInfoListByDepart,
    departList,
  }
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  getInitialState() {
    const { followStatusList, cluesChannelsTypeInfo, followGetTypeList } = this.props
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
          dataIndex: 'customerCompanyName',
          width: 220,
          fixed: 'left',
          render: (text, record) => {
            const { newCluesFlag, followGetType, cluesId } = record
            return (
              <div>
                <div className="clue-sign">
                  {newCluesFlag == 1 && <span className="clue-sign-new">新</span>}
                  {followGetType == 1 && <span className="clue-sign-zhuan">转</span>}
                  {followGetType == 2 && <span className="clue-sign-fen">分</span>}
                  {followGetType == 3 && <span className="clue-sign-ti">提</span>}
                </div>
                <Button
                  style={{ padding: 0, height: 'auto' }}
                  type="link"
                  onClick={() => this.handleGetClueInfo(cluesId, '公司详情')}
                >
                  {text}
                </Button>
              </div>
            )
          },
        },
        {
          title: '联系人',
          dataIndex: 'customerName',
          width: 220,
          fixed: 'left',
          render: (text, record) => {
            const { cluesId } = record
            return (
              <div>
                {/* <div className="clue-sign">
                  {newCluesFlag == 1 && <span className="clue-sign-new">新</span>}
                  {followGetType == 1 && <span className="clue-sign-zhuan">转</span>}
                  {followGetType == 2 && <span className="clue-sign-fen">分</span>}
                  {followGetType == 3 && <span className="clue-sign-ti">提</span>}
                </div> */}
                <Button
                  style={{ padding: 0, height: 'auto' }}
                  type="link"
                  onClick={() => this.handleGetClueInfo(cluesId, '线索详情')}
                >
                  {text}
                </Button>
              </div>
            )
          },
        },
        // {
        //   title: '公司名称',
        //   dataIndex: 'customerCompanyName',
        //   width: 150,
        // },
        {
          title: '下次跟进时间',
          dataIndex: 'customerCompanyName',
          width: 150,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 220,
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '线索来源',
          dataIndex: 'followGetType',
          width: 150,
          render: (text) => followGetTypeList[text],
        },
        {
          title: '所属部门',
          dataIndex: 'mainFollowDepartName',
          width: 220,
          render: (text) => text || '-',
        },
        {
          title: '创建人',
          dataIndex: 'createName',
          width: 220,
        },
        {
          title: '负责人',
          dataIndex: 'mainFollowName',
          width: 220,
        },
        {
          title: '最后维护人',
          dataIndex: 'lastUpdateName',
          width: 220,
        },
        {
          title: '最后维护时间',
          dataIndex: 'lastFollowTime',
          width: 220,

          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '跟进状态',
          dataIndex: 'followStatus',
          width: 220,
          render: (text) => followStatusList[text],
        },
        {
          title: '来源渠道',
          dataIndex: 'cluesChannelsType',
          width: 220,
          render: (text) => cluesChannelsTypeInfo[text],
        },
        {
          title: '地域',
          dataIndex: 'diyu',
          width: 220,
        },
        {
          title: '国家',
          dataIndex: 'guojia',
          width: 220,
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
    }
  }

  componentDidMount() {
    ReactEvents.addListener('fetchList', () => {
      this.backstageSearchDoingCluesList()
    })
    this.queryAllDepartAndAllMemberAddRoleBoundary()
    this.backstageSearchDoingCluesList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { pagination } = this.state
    const {
      belongCluesType,
      cluesDistributeType,
      cluesNameOrPhoneOrLandline,
      willExpiredFlag,
      belongDepartId,
      cluesChannelsType,
      cluesSourceType,
      createCluesEndTime,
      createCluesStartTime,
      createId,
      followStatus,
      mainFollowMemberId,
      lastFollowCluesStartTime,
      lastFollowCluesEndTime,
      countries,
      industry
    } = this.props
    if (
      belongCluesType != nextProps.belongCluesType ||
      cluesDistributeType != nextProps.cluesDistributeType ||
      willExpiredFlag != nextProps.willExpiredFlag ||
      cluesNameOrPhoneOrLandline != nextProps.cluesNameOrPhoneOrLandline ||
      belongDepartId != nextProps.belongDepartId ||
      cluesChannelsType != nextProps.cluesChannelsType ||
      cluesSourceType != nextProps.cluesSourceType ||
      createCluesEndTime != nextProps.createCluesEndTime ||
      createCluesStartTime != nextProps.createCluesStartTime ||
      createId != nextProps.createId ||
      followStatus != nextProps.followStatus ||
      mainFollowMemberId != nextProps.mainFollowMemberId ||
      lastFollowCluesStartTime != nextProps.lastFollowCluesStartTime ||
      lastFollowCluesEndTime != nextProps.lastFollowCluesEndTime ||
      countries != nextProps.countries ||
      industry != nextProps.industry
    ) {
      this.setState({
        pagination: {
          ...pagination,
          current: 1
        }
      }, () => {
        this.backstageSearchDoingCluesList(nextProps)
      })
    }
  }

  componentWillUnmount() {
    ReactEvents.removeListener('fetchList', this.backstageSearchDoingCluesList)
  }

  // 获取带权限的部门和部门下的成员
  queryAllDepartAndAllMemberAddRoleBoundary = () => {
    Api.queryAllDepartAndAllMemberAddRoleBoundary().then((res) => {
      const { memberInfoListByDepart, departList } = formaterData(res.data)
      this.props.setValues({
        memberInfoListByDepart,
        departList,
      })
    })
  }

  // 获取线索详情
  handleGetClueInfo = (id, type) => {
    Api.doingCluesQueryInfoByCluesId(id).then((res) => {
      this.props.setValues({
        clueInfo: res.data,
      })
      this.handleChangeVisible(type)
    })
  }

  backstageSearchDoingCluesList = (
    {
      belongCluesType,
      cluesDistributeType,
      cluesNameOrPhoneOrLandline,
      willExpiredFlag,
      belongDepartId,
      cluesChannelsType,
      cluesSourceType,
      createCluesEndTime,
      createCluesStartTime,
      createId,
      followStatus,
      mainFollowMemberId,
      lastFollowCluesStartTime,
      lastFollowCluesEndTime,
      countries,
      industry,
    } = this.props
  ) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.backstageSearchDoingCluesList({
      pageNo: current,
      pageSize,
      belongCluesType: belongCluesType || 1,
      cluesDistributeType,
      cluesNameOrPhoneOrLandline,
      willExpiredFlag,
      belongDepartId,
      cluesChannelsType,
      cluesSourceType,
      createCluesEndTime,
      createCluesStartTime,
      createId,
      followStatus,
      mainFollowMemberId,
      lastFollowCluesStartTime,
      lastFollowCluesEndTime,
      countries,
      industry,
    })
      .then((res) => {
        if (res.retCode == 200) {
          const { list, total } = res.data
          this.setState({
            pagination: {
              ...pagination,
              total,
            },
            dataSource: list,
          })
        }
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
        <span onClick={() => this.handleChangeVisible('转移')} className="select-col-div">
          <RsIcon type="icon-zhuanyi" />
          转移
        </span>
        <span onClick={() => this.handleChangeVisible('放弃')} className="select-col-div">
          <RsIcon type="icon-fangqi" />
          放弃
        </span>
        <span onClick={() => this.handleChangeVisible('删除')} className="select-col-div">
          <RsIcon type="icon-shanchu" />
          删除
        </span>
      </div>
    )
  }

  handleChangeVisible = (modalType) => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
      modalType,
      selectedRowKeys: modalType ? state.selectedRowKeys : [],
      selectedRows: modalType ? state.selectedRows : [],
    }))
  }

  // 删除线索
  handleBatchDeleteClues = () => {
    const { selectedRowKeys } = this.state
    return new Promise((resolve, reject) => {
      Api.batchDeleteClues(selectedRowKeys.join(','))
        .then(() => {
          resolve()
          this.backstageSearchDoingCluesList()
        })
        .catch(() => reject())
    })
  }

  renderDeleteModal = () => (
    <Modal
      visible
      onOk={this.handleBatchDeleteClues}
      title="线索删除"
      type="delete"
      onCancel={this.handleChangeVisible}
    >
      是否删除销售线索？删除成功之后，该操作将无法恢复。
    </Modal>
  )

  handleAbandonClues = () =>
    this.formRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          Api.batchAbandonClues(values)
            .then(() => {
              resolve()
              this.backstageSearchDoingCluesList()
            })
            .catch(() => reject())
        })
    )

  renderAbandonModal = () => {
    const { selectedRowKeys } = this.state
    return (
      <Modal visible onOk={this.handleAbandonClues} title="放弃线索到公海" onCancel={this.handleChangeVisible}>
        <Form preserve={false} ref={this.formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item rules={[{ max: 500, message: '放弃原因最多500字' }]} name="remark" label="放弃原因">
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 8 }}
              placeholder="请输入放弃原因，长度不要超过500字"
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item initialValue={selectedRowKeys.join(',')} hidden name="cluesIds" label="">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleTransferCluesLake = () =>
    this.formRef.current.validateFields().then(
      (values) =>
        new Promise((resolve, reject) => {
          const { memberId } = values
          Api.batchTransferClues({
            ...values,
            memberId: memberId.split('-')[0],
            departId: memberId.split('-')[1],
          })
            .then(() => {
              resolve()
              this.backstageSearchDoingCluesList()
            })
            .catch(() => reject())
        })
    )

  // 分配转移
  renderTransferModal = () => {
    const { selectedRowKeys } = this.state
    const { memberInfoListByDepart } = this.props
    return (
      <Modal visible onOk={this.handleTransferCluesLake} title="线索转移" onCancel={this.handleChangeVisible}>
        是否将线索转移给其他负责人？转移成功之后，该操作将无法恢复。
        <Form
          style={{ marginTop: 24 }}
          preserve={false}
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item rules={[{ required: true, message: '请选择新负责人' }]} name="memberId" label="新负责人">
            <Select>
              {memberInfoListByDepart.map((v) => {
                const { userId, departId, departName, userName } = v
                return (
                  <Option key={`${userId}-${departId}`} value={`${userId}-${departId}`}>
                    {userName}({departName})
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item initialValue={selectedRowKeys.join(',')} hidden name="cluesIds" label="">
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
    }), this.backstageSearchDoingCluesList)
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
          configType={2}
          scroll={{ x: 'max-content' }}
          loading={isLoading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={pagination}
          pageChange={this.handleChangeTable}
          rowKey={(record) => record.cluesId}
        />
        {modalVisible && modalType == '放弃' && this.renderAbandonModal()}
        {modalVisible && modalType == '删除' && this.renderDeleteModal()}
        {modalVisible && modalType == '转移' && this.renderTransferModal()}
        {modalVisible && modalType == '线索详情' && (
          <ClueInfo fromType="followupClue" onRefresh={this.backstageSearchDoingCluesList} onCancelDrawer={this.handleChangeVisible} />
        )}
        {modalVisible && modalType == '公司详情' && (
          <CompanyInfo fromType="followupClue" onRefresh={this.backstageSearchDoingCluesList} onCancelDrawer={this.handleChangeVisible} />
        )}
        {/* <ClueInfo onCancelDrawer={this.handleChangeVisible} /> */}
      </>
    )
  }
}

export default connect(
  (state) => ({
    belongCluesType: state.commonLayout.belongCluesType,
    clueList: state.commonLayout.clueList,
    followStatusList: state.commonLayout.followStatusList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    followGetTypeList: state.commonLayout.followGetTypeList,
    cluesDistributeType: state.followupClue.cluesDistributeType,
    willExpiredFlag: state.followupClue.willExpiredFlag,
    cluesNameOrPhoneOrLandline: state.followupClue.cluesNameOrPhoneOrLandline,
    memberInfoListByDepart: state.followupClue.memberInfoListByDepart,
    belongDepartId: state.followupClue.belongDepartId,
    cluesChannelsType: state.followupClue.cluesChannelsType,
    cluesSourceType: state.followupClue.cluesSourceType,
    createCluesEndTime: state.followupClue.createCluesEndTime,
    createCluesStartTime: state.followupClue.createCluesStartTime,
    createId: state.followupClue.createId,
    followStatus: state.followupClue.followStatus,
    mainFollowMemberId: state.followupClue.mainFollowMemberId,
    lastFollowCluesStartTime: state.followupClue.lastFollowCluesStartTime,
    lastFollowCluesEndTime: state.followupClue.lastFollowCluesEndTime,
    countries: state.followupClue.countries,
    industry: state.followupClue.industry,
  }),
  { setValues }
)(Index)
