import React, { Component } from 'react'
import { connect } from 'react-redux'
import ClueHighHeader from '../comments/clueHighHeader'
import HighseasList from './highseasList'
import Filter from './filter';
import { setValues } from './store/action'
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
    this.setState(this.getInitialState())
  }

  initData = () => {
    this.queryLakeChoose()
  }

  queryLakeChoose = () => {
    Api.queryLakeChoose().then((res) => {
      if (res.retCode == 200) {
        this.props.setValues({
          clueList: res.data.map((v) => ({
            ...v,
            name: v.publicLakeName,
          })),
        })
      }
    })
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  render() {
    const { clueList } = this.props
    return (
      <div>
        <ClueHighHeader dataList={clueList} code="headerClueId" />
        <Filter />
        <HighseasList />
      </div>
    )
  }
}

Index.propTypes = {}

export default connect(
  (state) => ({
    clueList: state.clueHighseas.clueList,
  }),
  { setValues }
)(Index)
