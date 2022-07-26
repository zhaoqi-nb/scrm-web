'use strict';

import Server from '@plugin/Server';

class Api extends Server {
    getStaffData() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }

    getDeleteStatus() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/deleteCustomerRemindSetting/getFollowRemindOpenStatus'
        })
    }

    updateDeleteStatus(status) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/deleteCustomerRemindSetting/updateFollowRemindOpenStatus/${status}`
        })
    }

    getTableData(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/customerEvent/searchCustomerDeleteOrFollowEventList',
            data
        })
    }

    getJurisdiction() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/deleteCustomerRemindSetting/check/showRemindButton'
        })
    }

    getDetailRemind() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/deleteCustomerRemindSetting/getDeleteRemindInfo'
        })
    }

    sureRemind(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/deleteCustomerRemindSetting/initDeleteRemind',
            data
        })
    }
}

export default new Api();
