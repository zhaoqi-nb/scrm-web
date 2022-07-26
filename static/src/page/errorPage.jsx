import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'

const title = {
  color: '#434e59',
  fontSize: '72px',
  fontWeight: 600,
  lineHeight: '72px',
  marginBottom: '24px',
}

const detail = {
  color: 'rgba(0,0,0,.45)',
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '16px',
}

class ErrorPage extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.setState(this.getInitialState())
  }

  getInitialState() {
    return {
      allData: {
        500: {
          title: '500',
          img: require('./image/500.svg'),
          ifBack: true,
          detail: '抱歉，服务器出错了',
        },
        530: {
          title: '500',
          img: require('./image/500.svg'),
          ifBack: false,
          detail: '抱歉，请刷新页面或重试',
        },
        531: {
          title: '500',
          img: require('./image/500.svg'),
          ifBack: false,
          detail: '抱歉，请刷新页面或重试',
        },
        532: {
          title: '500',
          img: require('./image/500.svg'),
          ifBack: false,
          detail: '抱歉，该用户访问受限',
        },
        403: {
          title: '403',
          img: require('./image/403.svg'),
          ifBack: true,
          detail: '抱歉，你无权访问该页面',
        },
      },
    }
  }

  render() {
    const { params } = this.props.match
    const { allData } = this.state
    let currPage = null
    try {
      currPage = !allData[params.code] ? allData['403'] : allData[params.code]
    } catch (error) {
      console.log(error)
    }
    if (!currPage) return null
    return (
      <div>
        <div style={{ margin: '200px auto 0 auto', width: '60%' }}>
          <Row>
            <Col span={15} style={{ textAlign: 'center' }}>
              <img src={currPage.img} />
            </Col>
            <Col span={6}>
              <p style={title}>{currPage.title}</p>
              <p style={detail}>{currPage.detail}</p>
              {currPage.ifBack ? (
                <Button type="primary" href="/" block>
                  返回主页
                </Button>
              ) : null}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

ErrorPage.propTypes = {}

export default ErrorPage
