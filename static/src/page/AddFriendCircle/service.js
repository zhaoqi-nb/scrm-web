'use strict';

import Server from '@plugin/Server';

class Api extends Server {
    getStaffData() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }

    getGroupData(data) {
        return this.Http({
            url: '/api/scrm-web/scrm-material/category/categorylist',
            data
        })
    }

    getMaterialData(data, type) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-material/${type}/page`,
            data
        })
    }

    getVisibleData(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/friendCircleInfo/getFriendCircleEstimateNum',
            data
        })
    }

    addFriendCircle(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/friendCircleInfo/addFriendCircleData',
            data
        })
    }
}

export default new Api();
