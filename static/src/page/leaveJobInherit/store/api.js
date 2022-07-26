'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
    // 获取树
    getOwner(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary',
            data,
        })
    }

    queryAssignedCustomerList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryAssignedCustomerList',
            data,
        })
    }

    // 离职成员
    queryResignedMemberList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryResignedMemberList',
            data,
        })
    }

    // 待分配客户
    queryExternalUserList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryExternalUserList',
            data,
        })
    }

    // 待分配客户列表
    queryCustomerList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryCustomerList',
            data,
        })
    }

    // 待分配群聊
    queryResignedGroupChatList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryResignedGroupChatList',
            data,
        })
    }

    // 待分配群聊新
    queryGroupListByPage(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupListByPage',
            data,
        })
    }

    // 离职客户继承
    resignedTransferCustomer(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/resignedTransferCustomer',
            data,
        })
    }

    // 离职群继承
    resignedTransferGroupChat(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/resignedTransferGroupChat',
            data,
        })
    }

    // 继承离职成员全部客户和群
    resignedTransferCustomerByMember(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/resignedTransferCustomerByMember',
            data,
        })
    }

    // 群详情
    getByKey(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupInfo/getByKey/${id}`
        })
    }

    // 群成员
    queryGroupMemberListByPage(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupMemberListByPage',
            data,
        })
    }
}

export default new Api();
