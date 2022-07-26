// 弹窗复选
/* eslint-disable*/
import React from 'react';
import { Modal, Checkbox, Tree, Input } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import TRNotification from '../../utils/TRNotifaction';
import './index.less';

/**
 * title: 顶部名称
 * value: 选中值
 * treeData: 树形结构
 */

class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    const { treeData = [] } = props;

    this.state = {
      visible: true,
      checkAll: false,
      indeterminate: false,
      autoExpandParent: true,
      checkedKeys: [],
      checkedNodes: [],
      expandedKeys: [],
      searchValue: '',
    };
    this.treeDataMap = this._tree2map(treeData, [], null, 1);
    this.treeData = treeData;
    this.leafNodes = this.treeDataMap.filter((x) => x.isLast);

    this._onSearch = this._onSearch.bind(this); // 搜索
    this._onChangeAll = this._onChangeAll.bind(this); // 全选
    this._onClearAll = this._onClearAll.bind(this); // 清空
    this._onCheckTree = this._onCheckTree.bind(this); // 树选择
    this._onExpandTree = this._onExpandTree.bind(this); // 树展开
    this._onCancel = this._onCancel.bind(this); // 取消
    this._onOk = this._onOk.bind(this); // 提交
  }

  componentDidMount() {
    this._onCheckTree(this.props.value);
  }

  _tree2map = (tree = [], list = [], parentKey = null, lv = 1) => {
    // 降维,key要唯一
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const { key, title } = node;
      node.lv = lv;
      node.parentKey = parentKey;
      let obj = {
        key,
        title,
        parentKey,
        lv,
      }
      if (!(node.children)) {
        list.push({ ...node, ...obj, isLast: true });
      } else {
        list.push({ ...node, obj })
        this._tree2map(node.children, list, node.key, lv + 1);
      }
    }
    return list;
  };

  _isChinese = (s) => {
    // 中文全匹配
    let ret = true;
    for (let i = 0; i < s.length; i++) ret = ret && s.charCodeAt(i) >= 10000;
    return ret;
  };

  _onSearch = (e) => {
    let expandedKeys = [];
    const { value } = e.target;
    if (value && this._isChinese(value)) {
      expandedKeys = this.treeDataMap
        .map((x) => (x.title.indexOf(value) > -1 ? x.parentKey : null))
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  handelBlur = () => {
    document.querySelector('.search_act')?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  _onChangeAll = (e) => {
    const checkAll = e.target.checked;
    const checkedNodes = checkAll ? [...this.leafNodes].filter(v => !v.disabled) : [];
    const checkedKeys = checkedNodes.map((x) => x.key);
    this.setState({
      checkAll,
      checkedKeys,
      checkedNodes,
      indeterminate: false,
    });
  };

  _onClearAll = () => {
    this.setState({
      checkAll: false,
      indeterminate: false,
      checkedKeys: [],
      checkedNodes: [],
      expandedKeys: [],
    });
  };

  _onCheckTree = (val) => {
    const checkedNodes = this.leafNodes.filter((x) => val.includes(x.key));
    const checkedKeys = checkedNodes.map((x) => x.key);
    const checkAll = !!checkedKeys.length && checkedKeys.length === this.leafNodes.length;
    const indeterminate = !!checkedKeys.length && checkedKeys.length < this.leafNodes.length;

    this.setState({
      checkedKeys,
      checkedNodes,
      checkAll,
      indeterminate,
    });
  };

  _onExpandTree = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  _onRemove = (idx) => {
    let { checkedKeys, checkedNodes, indeterminate, checkAll } = this.state;
    checkedNodes.splice(idx, 1);
    checkedKeys = checkedNodes.map((x) => x.key);
    if (!checkedKeys.length) {
      indeterminate = false;
      checkAll = false;
    }
    this.setState({
      checkAll,
      checkedKeys,
      checkedNodes,
      indeterminate,
    });
  };

  _onCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.onPress({ index: 0 });
  };

  _onOk = () => {
    const { checkedKeys, checkedNodes } = this.state;
    this.setState({
      visible: false,
    });
    this.props.onPress({
      index: 1,
      checkedKeys,
      checkedNodes,
    });
  };

  orderSort(obj1, obj2) {
    const a = obj1.title;
    const b = obj2.title;
    if (b > a) {
      return -1;
    } if (b < a) {
      return 1;
    }
    return 0;
  }

  titleRender(node) {
    const { titleRender } = this.props;
    if (typeof titleRender === 'function') {
      return titleRender(node)
    }
    return node?.title || null
  }
  renderItem(item) {
    const { itemRender } = this.props;
    if (typeof itemRender === 'function') {
      return itemRender(item)
    }
    return item.title
  }

  render() {
    const { title = '结算单元', disabled = false } = this.props;
    const {
      visible,
      checkAll,
      indeterminate,
      autoExpandParent,
      checkedKeys = [],
      checkedNodes = [],
      expandedKeys = [],
      searchValue = '',
    } = this.state;

    const loop = (data = []) =>
      data.map((item) => {
        const { lv, parentKey, key } = item;
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const _title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="search_act">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return { ...item, key, title: _title, lv, parentKey, children: loop(item.children) };
        }

        return { ...item, key, title: _title, lv, parentKey };
      });


    return (
      <Modal
        width={760}
        className="modal"
        visible={visible}
        centered
        maskClosable
        title={
          <div kye="title" className="modal_title">
            {title}
          </div>
        }
        cancelText="取消"
        onCancel={this._onCancel}
        okText="提交"
        onOk={this._onOk}
      >
        <div className="modal_body">
          <div className="treebox">
            <div className="box_header">
              <Input
                placeholder="搜索"
                suffix={<SearchOutlined />}
                allowClear
                onChange={this._onSearch}
                disabled={disabled}
                onBlur={this.handelBlur}
                onPressEnter={this.handelBlur}
              />
            </div>
            <div className="box_content">
              <Checkbox
                checked={checkAll}
                indeterminate={indeterminate}
                onChange={this._onChangeAll}
                disabled={disabled}
              >
                全选
              </Checkbox>
              <Tree
                treeData={loop(this.treeData)}
                blockNode
                checkable
                titleRender={this.titleRender.bind(this)}
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={this._onExpandTree}
                onCheck={this._onCheckTree}
                disabled={disabled}
              />
            </div>
          </div>

          <div className="choosebox">
            <div className="box_header">
              <div>{`已选${checkedNodes.length}项`}</div>
              {!disabled && (
                <div className="clear" onClick={this._onClearAll}>
                  清空
                </div>
              )}
            </div>
            <div className="box_content">
              <ul className="chooseList">
                {checkedNodes.sort(this.orderSort).map((item, idx) => (
                  <li key={item.key}>
                    <div className="chooseName">{this.renderItem(item)}</div>
                    {!disabled && (
                      <CloseOutlined
                        className="close"
                        onClick={this._onRemove.bind(this, idx)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
/* eslint-disable*/

class TRCheckboxModal {
  __key__ = '';

  show = (props) => new Promise((resolve) => {
    if (this.__key__ !== '') return;
    this.__key__ = String(Date.now());
    TRNotification.add({
      key: this.__key__,
      content: (
        <ModalComponent
          {...props}
          onPress={(result) => {
            TRNotification.remove(this.__key__);
            this.__key__ = '';
            resolve(result);
          }}
        />
      ),
      duration: null,
    });
  });

  dismiss = () => {
    if (this.__key__.length > 0) {
      TRNotification.remove(this.__key__);
      this.__key__ = '';
    }
  };
}

export default new TRCheckboxModal();
