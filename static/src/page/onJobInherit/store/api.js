import Server from '../../../plugin/Server';

class Api extends Server {
    // 获取树
    getOwner(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary',
            data,
        })
    }

    // 转移的客户列表
    queryExternalUserList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryExternalUserList',
            data,
        })
    }

    // 转移接口
    transferCustomer(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/transferCustomer',
            data,
        })
    }

    // 在职 指定客户转移
    batchTransferCustomer(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/batchTransferCustomer',
            data,
        })
    }
}

export default new Api();
