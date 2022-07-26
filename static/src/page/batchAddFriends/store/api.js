'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
    // excel 导入
    excelFile(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/excelFile',
            data,
        })
    }

    // 客户列表
    queryCustomerLog(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/queryCustomerLog',
            data,
        })
    }

    // 任务列表
    queryInfo(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/queryInfo',
            data,
        })
    }

    // 提醒
    noticeMember(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/noticeMember',
            data,
        })
    }

    // 删除客户添加记录
    deleteApi(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-service/manualAddCustomer/delete?id=${id}`,
        })
    }

    // 统计概览
    overviewList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/index',
            data,
        })
    }

    // 概览列表
    memberList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/manualAddCustomer/memberList',
            data,
        })
    }
}

export default new Api();
