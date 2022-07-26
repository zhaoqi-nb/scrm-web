import React from 'react';

import './index.less'

function Index(props) {
  const { icon, bigImg } = props;
  return (<div className="myTextComp">
    {icon && <img
      className="icon"
      src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660818730&t=97e32b338118b0f9a76952c11c7cef18"
    />}
    {props.text}
    {bigImg && <div>
      {
        bigImg.map((item) => (
          <img key={item.fileUrl} src={item.fileUrl} className="bigImg" />
        ))
      }
    </div>}
  </div>);
}

export default Index;
