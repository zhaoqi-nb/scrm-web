import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Image } from 'antd'
import { setValues, resetValues } from './store/action'
import MailTable from './mailTable'
import Filter from './filter'
import DepartmentTree from './departmentTree'
import { getMenuTree } from '../../utils/Util'
import Api from './store/api'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {
    this.initData()
  }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  initData = () => {
    const {
      userInfo: { companyId, memberId, companyName, dataBurning },
    } = getMenuTree(MENUDATA)
    this.props.setValues({
      companyId,
      memberId,
      companyName,
      dataBurning
    })
    this.setState({
      isReady: true,
    })
  }

  handleGetInvitation = () => {
    Api.getInvitation().then((res) => {
      if (res.retCode == 200) {
        this.setState({
          invitationUrl: res.data,
          invitationVisible: true,
        })
      }
    })
  }

  handleCancelInvitationModal = () => {
    this.setState({
      invitationVisible: false,
      invitationUrl: null,
    })
  }

  renderInvitationModal = () => {
    const { invitationUrl, invitationVisible } = this.state
    return (
      <Modal onCancel={this.handleCancelInvitationModal} visible={invitationVisible} footer={null}>
        <Image preview={false} src={invitationUrl} />
      </Modal>
    )
  }

  handleSyncAddressBook = () => {
    Api.syncAddressBook()
  }

  render() {
    const { isReady, invitationVisible } = this.state
    if (!isReady) return null
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: '0 0 263px', borderRight: '1px solid #E1E8F0', overflow: 'scroll' }}>
          <DepartmentTree />
        </div>
        <div style={{ flex: 1, paddingLeft: '24px', width: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="page-title">员工通讯录</div>
            <div>
              <Button onClick={this.handleGetInvitation} type="primary">
                微信邀请
              </Button>
              <Button onClick={this.handleSyncAddressBook} style={{ marginLeft: '8px' }}>
                同步成员
              </Button>
            </div>
          </div>
          <Filter />
          <MailTable />
        </div>
        {invitationVisible && this.renderInvitationModal()}
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(() => ({}), { setValues, resetValues })(Index)
