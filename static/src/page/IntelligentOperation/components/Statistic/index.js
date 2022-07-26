import React from 'react';

import './index.less'

function Index(props) {
  const { list = [] } = props;
  return (<div className="myStatistic">
    {list.map((item) => (
      <div key={item.title} className="statisticItem">
        <div className="title">{item.title}</div>
        <div className="value">{item.value || 0}</div>
      </div>
    ))}
  </div>);
}

export default Index;
