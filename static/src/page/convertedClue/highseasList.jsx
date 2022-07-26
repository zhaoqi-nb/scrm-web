import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import Api from './store/api'
import { setValues } from './store/action'
import ConfigTable from '../comments/publicView/table'

const formaterData = (datas) => {
  const memberInfoListByDepart = []
  const departList = [
    {
      key: '',
      value: '',
      title: '全部',
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
          title: '姓名',
          dataIndex: 'customerName',
          width: 220,
          fixed: 'left',
        },
        {
          title: '公司名称',
          dataIndex: 'customerCompanyName',
          width: 150,
        },
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
    this.queryAllDepartAndAllMemberAddRoleBoundary()
    this.backstageSearchConvertCluesList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { pagination } = this.state
    const {
      convertedClue,
      cluesNameOrPhoneOrLandline,
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
      convertTimeEndTime,
      convertTimeStartTime,
    } = this.props
    if (
      convertedClue != nextProps.convertedClue ||
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
      convertTimeEndTime != nextProps.convertTimeEndTime ||
      convertTimeStartTime != nextProps.convertTimeStartTime
    ) {
      this.setState({
        pagination: {
          ...pagination,
          current: 1
        }
      }, () => {
        this.backstageSearchConvertCluesList(nextProps)
      })
    }
  }

  componentWillUnmount() { }

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

  backstageSearchConvertCluesList = (
    {
      convertedClue,
      cluesNameOrPhoneOrLandline,
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
      convertTimeStartTime,
      convertTimeEndTime,
    } = this.props
  ) => {
    const { pagination } = this.state
    const { current, pageSize } = pagination
    this.setState({
      isLoading: true,
    })
    Api.backstageSearchConvertCluesList({
      pageNo: current,
      pageSize,
      belongCluesType: convertedClue || 1,
      cluesNameOrPhoneOrLandline,
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
      convertTimeStartTime,
      convertTimeEndTime,
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

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.backstageSearchConvertCluesList)
  }

  render() {
    const { columns, pagination, dataSource, isLoading } = this.state
    return (
      <ConfigTable
        configType={2}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pageChange={this.handleChangeTable}
        pagination={pagination}
        rowKey={(record) => record.cluesId}
      />
    )
  }
}

export default connect(
  (state) => ({
    convertedClue: state.commonLayout.convertedClue,
    clueList: state.commonLayout.clueList,
    followStatusList: state.commonLayout.followStatusList,
    cluesChannelsTypeInfo: state.commonLayout.cluesChannelsTypeInfo,
    followGetTypeList: state.commonLayout.followGetTypeList,
    cluesNameOrPhoneOrLandline: state.convertedClue.cluesNameOrPhoneOrLandline,
    memberInfoListByDepart: state.convertedClue.memberInfoListByDepart,
    belongDepartId: state.convertedClue.belongDepartId,
    cluesChannelsType: state.convertedClue.cluesChannelsType,
    cluesSourceType: state.convertedClue.cluesSourceType,
    createCluesEndTime: state.convertedClue.createCluesEndTime,
    createCluesStartTime: state.convertedClue.createCluesStartTime,
    createId: state.convertedClue.createId,
    followStatus: state.convertedClue.followStatus,
    mainFollowMemberId: state.convertedClue.mainFollowMemberId,
    lastFollowCluesStartTime: state.convertedClue.lastFollowCluesStartTime,
    lastFollowCluesEndTime: state.convertedClue.lastFollowCluesEndTime,
    convertTimeEndTime: state.convertedClue.convertTimeEndTime,
    convertTimeStartTime: state.convertedClue.convertTimeStartTime,
  }),
  { setValues }
)(Index)
