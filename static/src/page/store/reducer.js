import * as model from './action-type';

const defaultState = {
  collapsed: false,
  clueList: [],
  headerClueId: '',
  // 来源渠道 1-微信公众号、2-今日头条、3-朋友推荐、4-搜索引擎、5-其他
  cluesChannelsTypeInfo: {
    1: '微信公众号',
    2: '今日头条',
    3: '朋友推荐',
    4: '搜索引擎',
    5: '其他',
  },
  // 跟进状态 1-未处理、2-跟进中、3-已转化
  followStatusList: {
    1: '未处理',
    2: '跟进中',
    3: '已转化',
  },
  // 线索来源 1-官网、2-微信公众号、3-400、4-个人关系
  cluesSourceTypeList: {
    1: '官网',
    2: '微信公众号',
    3: '公司电话',
    4: '个人关系',
    5: '邮件',
    6: '其他',
  },
  // 跟进人线索来源：1-转移、2-分配、3-提取、4：自己创建
  followGetTypeList: {
    1: '转移',
    2: '分配',
    3: '提取',
    4: '自己创建'
  },
  industryList: ['金融', '消费', '医药', '其他'],
  regionList: [{ code: '', name: '全部' }, { code: '1', name: '国内' }, { code: '2', name: '海外' }],
};

// model manage
export const commonLayout = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, ...action.values };
    case model.SETCOLLAPSED:
      return { ...state, ...{ collapsed: action.data } };
    case model.CLEARDATA:
      return { ...state, ...defaultState };
    default:
      return state;
  }
}
