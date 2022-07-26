'user strict';

import React from 'react';
import { Spin } from 'antd';
import Loadable from 'react-loadable';
import RightContnetLayout from '../layout/rightContnet/index';
import { getMenuTree } from '../../utils/Util'

function Loading() {
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateY(-50%) translateX(-50%)' }}>
      <Spin size="large" tip="数据加载中..." />
    </div>
  );
}

export default () => {
  const setList = () => {
    const { menuList } = getMenuTree(MENUDATA) || {}
    if (!menuList || !menuList.length) return [];
    const arr = [];
    menuList.push('officialAccountForm') // 公众号对接表单填写
    for (let i = 0, len = menuList.length; i < len; i += 1) {
      const key = menuList[i];
      arr.push({
        path: [`/${key}`],
        component: Loadable({
          loader: () => import(/* webpackChunkName: "custom-[index]" */ `../${key}/index`),
          loading: Loading,
          render(loaded, props) {
            const Component = loaded.default;
            return <RightContnetLayout {...props}><Component {...props} /></RightContnetLayout>;
          },
        }),
      });
    }
    return arr;
  };
  const list = [].concat(setList());
  // ReactEvents.addListener('reloadRoter', () => {
  //   list = setList()
  // })
  return list
};
