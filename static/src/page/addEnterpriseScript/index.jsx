import React, { Component } from 'react'
import { Button, Form, Input, Select, Row, Col, message } from 'antd'
import Modal from '@Modal'
import RsIcon from '@RsIcon'
import Api from './store/api'
import { GetQueryString } from '../../utils/Util'
import PhoneView from '../comments/publicView/phoneView'
import ConfigTable from '../comments/publicView/table'
import AddGroup from '../scriptLibrary/addGroup'
import TermComponents from './termComponents'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  formRef = React.createRef(Form)

  componentDidMount() {
    const termId = GetQueryString('termId')
    const propsGroupId = GetQueryString('groupId')
    const propsGroupName = GetQueryString('groupName')
    if (termId) {
      Api.getTermInfo({
        termId
      }).then((res) => {
        const termInfo = res.data
        const { groupId, groupName, title, detailList } = termInfo
        const termList = detailList.map((v) => {
          const { type } = v
          const content = JSON.parse(v.content)
          if (type == 'img') {
            return {
              url: content.url,
              fileType: type,
              fileName: content.name,
              [type]: {
                name: content.name,
                url: content.url,
                size: content.size,
              }
            }
          } if (type == 'text') {
            return {
              textValue: content.content,
              fileType: type,
              [type]: {
                content: content.content,
              }
            }
          }
          return null
        })
        this.setState({
          phoneViewList: termList
        })
        this.formRef.current.setFieldsValue({
          groupId: {
            label: groupName,
            value: groupId
          },
          type: termInfo.type,
          title,
          termId,
          termList
        })
      })
    } else if (propsGroupId && propsGroupName) {
      this.setState({
        preSaveSelectedRows: {
          groupId: propsGroupId,
          groupName: propsGroupName
        }
      })
      this.formRef.current.setFieldsValue({
        groupId: {
          label: propsGroupName,
          value: propsGroupId
        }
      })
    }
  }

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      phoneViewList: [],
      isReady: false,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 项`,
      },
      columns: [{
        title: '分组',
        dataIndex: 'groupName',
        width: 220,
      }, {
        title: '可见部门',
        dataIndex: 'departInfoList',
        render: (text) => text && text.map((v) => v.departName).join('、')
      }]
    }
  }

  handleChangeTable = (current, pageSize) => {
    this.setState((state) => ({
      pagination: {
        ...state.pagination,
        current,
        pageSize
      }
    }), this.findGroup)
  }

  findGroup = () => {
    const { groupName } = this.state
    const { pagination } = this.state
    this.setState({
      isLoading: true,
    })
    Api.findGroup({
      groupType: 1,
      groupName
    }).then((res) => {
      const { list, total } = res.data
      this.setState({
        pagination: {
          ...pagination,
          total,
        },
        dataSource: list,
      })
    }).finally(() => {
      this.setState({
        isLoading: false
      })
    })
  }

  handleShowGroupModal = () => {
    this.setState((state) => ({
      visible: !state.visible,
    }))
  }

  handleShowAddGroupModal = () => {
    this.setState((state) => ({
      addVisible: !state.addVisible,
    }))
  }

  handleChangeName = (name) => {
    this.setState({
      name
    })
  }

  handleSearch = (groupName) => {
    const { pagination } = this.state
    this.setState({
      groupName,
      pagination: {
        ...pagination,
        pageSize: pagination.pageSize
      },
    }, this.findGroup)
  }

  handleSaveSelectGroup = () => {
    const { selectedRows } = this.state
    if (!selectedRows || !selectedRows.length) return Promise.resolve()
    this.setState({
      preSaveSelectedRows: selectedRows[0],
    })
    this.formRef.current.setFieldsValue({
      groupId: selectedRows.map((v) => ({
        label: v.groupName,
        value: v.groupId,
      }))[0]
    })
    return Promise.resolve()
  }

  renderGroupModal = () => {
    const { visible, dataSource, isLoading, columns = [], pagination, name, selectedRowKeys, preSaveSelectedRows } = this.state
    const rowSelection = {
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: selectedKeys,
          preSaveSelectedRows: undefined
        })
      },
      selectedRowKeys: preSaveSelectedRows ? [Number(preSaveSelectedRows.groupId)] : selectedRowKeys
    };
    return <Modal
      onOk={this.handleSaveSelectGroup}
      onCancel={() => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: []
        })
        this.handleShowGroupModal()
      }}
      width={800}
      title="分组选择"
      visible={visible}
    >
      <div style={{ margin: '8px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Input
          suffix={<RsIcon onClick={() => this.handleSearch(name)} type="icon-sousuo" />}
          className="input-search"
          style={{ width: '240px' }}
          placeholder="请输入分组名称"
          onPressEnter={(e) => this.handleSearch(e.target.value)}
          onChange={(e) => this.handleChangeName(e.target.value)}
        />
        <Button onClick={this.handleShowAddGroupModal} type="link"><RsIcon type="icon-tianjia1" />新建分组</Button>
      </div>
      <ConfigTable
        scroll={{ x: 'max-content', y: 400 }}
        loading={isLoading}
        columns={columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={dataSource}
        pageChange={this.handleChangeTable}
        pagination={pagination}
        rowKey={(record) => record.groupId}
      />
    </Modal>
  }

  handleSaveScript = (values) => {
    const params = {
      ...values
    }
    params.groupId = values.groupId.value
    params.termList = values.termList.map((v) => ({
      termType: v.fileType,
      ...v,
    }))
    let apiKey = 'addTermInfo'
    if (params.termId) apiKey = 'updateTermInfo'
    this.setState({
      saveLoading: true
    })
    Api[apiKey](params).then(() => {
      message.success('保存成功')
      this.handleGoBack()
    }).finally(() => {
      this.setState({
        saveLoading: false
      })
    })
  }

  handleGoBack = () => {
    this.props.history.replace('/scriptLibrary')
  }

  render() {
    const { visible, addVisible, phoneViewList, saveLoading } = this.state
    return <>
      <div className="page-title">新建企业话术</div>
      <div className="page-label">基础信息</div>
      <Form
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.termList) {
            this.setState({
              phoneViewList: allValues.termList.filter((v) => v)
            })
          }
        }}
        onFinish={this.handleSaveScript}
        style={{ marginTop: '12px', display: 'flex', flexDirection: 'column' }}
        ref={this.formRef}
        className="add-enterprise-script-form"
        // labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <div className="add-enterprise-script-form-conten">
          <div className="left-form-item">
            <Form.Item name="termId" initialValue="" hidden label="话术id">
              <Input />
            </Form.Item>
            <Form.Item name="type" initialValue={1} hidden label="话术类型">
              <Input />
            </Form.Item>
            <Form.Item
              rules={[{
                required: true,
                message: '请输入话术标题'
              }]}
              name="title"
              label="话术标题"
            >
              <Input showCount maxLength={16} placeholder="仅内部可见，方便整理和查看" />
            </Form.Item>
            <Form.Item label="分组选择">
              <Row>
                <Col span={20}>
                  <Form.Item
                    name="groupId"
                    rules={[{
                      required: true,
                      message: '请选择分组'
                    }]}
                  >
                    <Select
                      labelInValue
                      open={false}
                      onClick={() => {
                        this.handleShowGroupModal()
                        this.findGroup()
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button onClick={this.handleShowAddGroupModal} type="link"><RsIcon type="icon-tianjia1" />新建分组</Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.List
              initialValue={[{}]}
              name="termList"
            >
              {(fields, { add, remove }) => <>
                {fields.map((field, index) => <Form.Item
                  labelCol={{ span: 24 }}
                  className="term-form-item"
                  wrapperCol={{ span: 24 }}
                  style={{ justifyContent: index ? 'end' : 'start' }}
                  label={<div className="term-label">
                    <div>话术内容{index + 1}</div>
                    {fields.length > 1 && <RsIcon onClick={() => remove(field.name)} type="icon-shanchu" />}
                  </div>}
                >
                  <Form.Item
                    // rules={[
                    //   {
                    //     validator: (_, value) => {
                    //       console.log(value, 'Form.Item.list')
                    //       return Promise.resolve()
                    //     },
                    //   },
                    // ]}
                    {...field}
                    noStyle
                    name={field.name}
                  >
                    <TermComponents />
                  </Form.Item>
                </Form.Item>)}
                {<Form.Item>
                  <div className="add-label-buttton">
                    <span onClick={() => add()}><RsIcon type="icon-tianjia1" />添加话术</span>
                    <span style={{ color: '#86909C', marginLeft: '24px' }}>
                      <RsIcon type="icon-tishixinxitubiao" />提示：添加的多个内容可一键发送
                    </span>
                  </div>
                </Form.Item>}
              </>}
            </Form.List>
          </div>
          <PhoneView list={phoneViewList} />
        </div>
        <div className="form-affix-button">
          <Button type="text" onClick={this.handleGoBack} style={{ marginRight: '24px' }}>返回</Button>
          <Button loading={saveLoading} htmlType="submit" type="primary">保存</Button>
        </div>
      </Form>
      {visible && this.renderGroupModal()}
      {addVisible && <AddGroup
        visible={addVisible}
        onCancel={() => {
          this.handleShowAddGroupModal()
        }}
        groupType={1}
      />}
    </>
  }
}

Index.propTypes = {}

export default Index
