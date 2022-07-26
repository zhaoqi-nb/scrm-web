'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
    // 已分配离职成员
    queryResignedMemberList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryResignedMemberList',
            data,
        })
    }

    // 已分配客户
    queryAssignedCustomerList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryAssignedCustomerList',
            data,
        })
    }

    // 已分配群聊
    queryAssignedGroupChatList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryAssignedGroupChatList',
            data,
        })
    }
}

export default new Api();
