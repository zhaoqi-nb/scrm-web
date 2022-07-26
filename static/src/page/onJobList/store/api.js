'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
    queryAssignedCustomerList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/transfer/queryAssignedCustomerList',
            data,
        })
    }
}

export default new Api();
