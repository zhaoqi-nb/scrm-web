import React, { Component } from 'react'
import { connect } from 'react-redux'
import ClueHighHeader from '../comments/clueHighHeader'
import HighseasList from './highseasList'
import { resetValues } from './store/action'
import Filter from './filter'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() { }

  componentWillUnmount() {
    this.props.resetValues()
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      isReady: false,
    }
  }

  render() {
    const { belongCluesTypeList } = this.props
    return (
      <div>
        <ClueHighHeader code="belongCluesType" dataList={belongCluesTypeList} />
        <Filter />
        <HighseasList />
      </div>
    )
  }
}

Index.propTypes = {}

export default connect((state) => ({
  belongCluesTypeList: state.followupClue.belongCluesTypeList,
}), {
  resetValues
})(Index)
